import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { ConnectedAccount } from '../../model'
import { Keyring } from '@polkadot/keyring'
import assert from 'assert'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { ConfigVariable, config } from '../../utils/config'
import { u8aToHex } from '@polkadot/util'
import { KeyringPair } from '@polkadot/keyring/types'
import { EntityManager } from 'typeorm'
import { AccountInfo, setupAccount } from './common'

type ConnectOrDisconnectAccountArgs = {
  accountId: string
  sessionId?: string
  gatewayName: string
  joystreamAccountId: string
  signingKey: KeyringPair
  expectedStatus: number
  timestamp?: number
  action: 'connect' | 'disconnect'
  endpoint?: string
}

async function connectOrDisconnectAccount({
  accountId,
  sessionId,
  gatewayName,
  joystreamAccountId,
  signingKey,
  expectedStatus,
  action,
  endpoint = `/api/v1/${action}-account`,
  timestamp = Date.now(),
}: ConnectOrDisconnectAccountArgs): Promise<string> {
  const payload = {
    joystreamAccountId,
    gatewayAccountId: accountId,
    gatewayName,
    timestamp,
    action,
  }
  const signature = u8aToHex(signingKey.sign(JSON.stringify(payload)))
  await request(app)
    .post(endpoint)
    .set('Authorization', sessionId ? `Bearer ${sessionId}` : '')
    .set('Content-Type', 'application/json')
    .send({
      payload,
      signature,
    })
    .expect(expectedStatus)

  return signature
}

describe('connectAndDisconnectAccount', () => {
  let accountInfo: AccountInfo
  let keyring: Keyring
  let alice: KeyringPair
  let bob: KeyringPair
  let gatewayName: string
  let em: EntityManager

  before(async () => {
    accountInfo = await setupAccount()
    keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })
    alice = keyring.addFromUri('//Alice')
    bob = keyring.addFromUri('//Bob')
    em = await globalEm
    gatewayName = await config.get(ConfigVariable.AppName, em)
  })

  async function assertConnectedAccountStatusNotChanged(
    accountId: string,
    action: 'connect' | 'disconnect'
  ): Promise<ConnectedAccount | null> {
    const connectedAccount = await em.getRepository(ConnectedAccount).findOneBy({
      id: accountId,
    })
    if (action === 'connect') {
      assert(!connectedAccount, 'Connected account found')
    } else {
      assert(connectedAccount, 'Connected account not found')
    }
    return connectedAccount
  }

  function commonTests(action: 'connect' | 'disconnect'): void {
    it('should fail with invalid signature', async () => {
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: bob,
        expectedStatus: 400,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail with invalid app name', async () => {
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        gatewayName: 'invalid',
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail if not logged in', async () => {
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        sessionId: undefined,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 401,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail if anonymounsly authenticated', async () => {
      const {
        body: { sessionId: anonSessionId },
      } = await request(app)
        .post('/api/v1/anonymous-auth')
        .set('Content-Type', 'application/json')
        .expect(200)
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        sessionId: anonSessionId,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 401,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail with invalid gateway account id', async () => {
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        accountId: 'invalid',
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail if proof expired', async () => {
      const proofExpiryTime = await config.get(
        ConfigVariable.AccountOwnershipProofExpiryTimeSeconds,
        em
      )
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
        timestamp: Date.now() - proofExpiryTime * 1000 - 1,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail if proof timestamp is in the future', async () => {
      await connectOrDisconnectAccount({
        action,
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
        timestamp: Date.now() + 1000,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })

    it('should fail if action is not valid', async () => {
      await connectOrDisconnectAccount({
        action: action === 'connect' ? 'disconnect' : 'connect',
        endpoint: `/api/v1/${action}-account`,
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
      await assertConnectedAccountStatusNotChanged(alice.address, action)
    })
  }

  describe('connectAccount', () => {
    commonTests('connect')

    it('should work with valid signature', async () => {
      const signature = await connectOrDisconnectAccount({
        action: 'connect',
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
      await connectOrDisconnectAccount({
        action: 'connect',
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 400,
      })
    })
  })

  describe('disconnectAccount', () => {
    commonTests('disconnect')

    it('should work with valid signature', async () => {
      await connectOrDisconnectAccount({
        action: 'disconnect',
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 200,
      })
      const connectedAccount = await em.getRepository(ConnectedAccount).findOneBy({
        id: alice.address,
      })
      assert(!connectedAccount, 'Account not disconnected')
    })

    it('should fail if account is not connected', async () => {
      await connectOrDisconnectAccount({
        action: 'disconnect',
        ...accountInfo,
        gatewayName,
        joystreamAccountId: alice.address,
        signingKey: alice,
        expectedStatus: 404,
      })
    })
  })
})
