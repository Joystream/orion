import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { ConnectedAccount } from '../../model'
import assert from 'assert'
import { ConfigVariable, config } from '../../utils/config'
import { u8aToHex } from '@polkadot/util'
import { KeyringPair } from '@polkadot/keyring/types'
import { EntityManager } from 'typeorm'
import { LoggedInAccountInfo, anonymousAuth, createAccountAndSignIn, keyring } from './common'
import { cryptoWaitReady, randomAsU8a } from '@polkadot/util-crypto'
import { components } from '../generated/api-types'
import { SESSION_COOKIE_NAME } from '../../utils/auth'

type ConnectAccountArgs = {
  accountId: string
  sessionId?: string
  gatewayName: string
  joystreamAccountId: string
  signingKey: KeyringPair
  expectedStatus: number
  timestamp?: number
  action?: string
  endpoint?: string
}

async function connectAccount({
  accountId,
  sessionId,
  gatewayName,
  joystreamAccountId,
  signingKey,
  expectedStatus,
  action = 'connect',
  timestamp = Date.now(),
}: ConnectAccountArgs): Promise<string> {
  const payload: components['schemas']['ConnectAccountRequestData']['payload'] = {
    joystreamAccountId,
    gatewayAccountId: accountId,
    gatewayName,
    timestamp,
    action: action as 'connect',
  }
  const signature = u8aToHex(signingKey.sign(JSON.stringify(payload)))
  await request(app)
    .post('/api/v1/connect-account')
    .set('Cookie', sessionId ? `${SESSION_COOKIE_NAME}=${sessionId}` : '')
    .set('Content-Type', 'application/json')
    .send({
      payload,
      signature,
    })
    .expect(expectedStatus)

  return signature
}

type DisconnectAccountArgs = {
  sessionId?: string
  joystreamAccountId: string
  expectedStatus: number
}

async function disconnectAccount({
  sessionId,
  joystreamAccountId,
  expectedStatus,
}: DisconnectAccountArgs): Promise<void> {
  const data: components['schemas']['DisconnectAccountRequestData'] = {
    joystreamAccountId,
  }
  await request(app)
    .post('/api/v1/disconnect-account')
    .set('Cookie', sessionId ? `${SESSION_COOKIE_NAME}=${sessionId}` : '')
    .set('Content-Type', 'application/json')
    .send(data)
    .expect(expectedStatus)
}

describe('connectAndDisconnectAccount', () => {
  let accountInfo: LoggedInAccountInfo
  let gatewayName: string
  let em: EntityManager
  let alice: KeyringPair, bob: KeyringPair

  before(async () => {
    await cryptoWaitReady()
    accountInfo = await createAccountAndSignIn()
    em = await globalEm
    gatewayName = await config.get(ConfigVariable.AppName, em)
    alice = keyring.addFromUri('//Alice')
    bob = keyring.addFromUri('//Bob')
  })

  async function assertAccountNotConnected(accountId: string): Promise<void> {
    const connectedAccount = await em.getRepository(ConnectedAccount).findOneBy({
      id: accountId,
    })
    assert(!connectedAccount, 'Connected account found')
  }

  describe('connectAccount', () => {
    it('should fail with invalid signature', async () => {
      await connectAccount({
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: bob,
        expectedStatus: 400,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail with invalid app name', async () => {
      await connectAccount({
        ...accountInfo,
        gatewayName: 'invalid',
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail if not logged in', async () => {
      await connectAccount({
        ...accountInfo,
        sessionId: undefined,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 401,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail if anonymounsly authenticated', async () => {
      const anonSessionId = await anonymousAuth()
      await connectAccount({
        ...accountInfo,
        sessionId: anonSessionId,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 401,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail with invalid gateway account id', async () => {
      await connectAccount({
        ...accountInfo,
        accountId: 'invalid',
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail if proof expired', async () => {
      const proofExpiryTime = await config.get(
        ConfigVariable.AccountOwnershipProofExpiryTimeSeconds,
        em
      )
      await connectAccount({
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
        timestamp: Date.now() - proofExpiryTime * 1000 - 1,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail if proof timestamp is in the future', async () => {
      await connectAccount({
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
        timestamp: Date.now() + 1000,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail if action is not valid', async () => {
      await connectAccount({
        action: 'invalid',
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should work with valid signature', async () => {
      const signature = await connectAccount({
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 200,
      })
      const connectedAccount = await em.getRepository(ConnectedAccount).findOne({
        where: {
          id: alice.address,
          accountId: accountInfo.accountId,
        },
        relations: {
          proof: true,
        },
      })
      assert(connectedAccount, 'Connected account not found')
      assert(connectedAccount.proof.signature === signature, 'Invalid signature')
    })

    it('should fail if account is already connected', async () => {
      await connectAccount({
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
    })

    it('should fail if max connected accounts limit reached', async () => {
      const max = await config.get(ConfigVariable.MaxConnectedAccountsPerUser, em)
      let currentCount: number
      do {
        currentCount = await em.countBy(ConnectedAccount, { accountId: accountInfo.accountId })
        const acc = keyring.addFromSeed(randomAsU8a(32))
        await connectAccount({
          ...accountInfo,
          gatewayName,
          joystreamAccountId: acc.address,
          signingKey: acc,
          expectedStatus: currentCount < max ? 200 : 400,
        })
      } while (currentCount < max)
    })
  })

  describe('disconnectAccount', () => {
    it('should fail if not logged in', async () => {
      await disconnectAccount({
        sessionId: undefined,
        joystreamAccountId: alice.address,
        expectedStatus: 401,
      })
    })

    it('should fail if anonymounsly authenticated', async () => {
      const anonSessionId = await anonymousAuth()
      await disconnectAccount({
        sessionId: anonSessionId,
        joystreamAccountId: alice.address,
        expectedStatus: 401,
      })
    })

    it('should work with valid account', async () => {
      await disconnectAccount({
        ...accountInfo,
        joystreamAccountId: alice.address,
        expectedStatus: 200,
      })
      await assertAccountNotConnected(alice.address)
    })

    it('should fail if account is not connected', async () => {
      await disconnectAccount({
        ...accountInfo,
        joystreamAccountId: alice.address,
        expectedStatus: 404,
      })
    })
  })
})
