import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import assert from 'assert'
import { ConfigVariable, config } from '../../utils/config'
import { u8aToHex } from '@polkadot/util'
import { KeyringPair } from '@polkadot/keyring/types'
import { EntityManager } from 'typeorm'
import {
  EncryptionArtifacts,
  LoggedInAccountInfo,
  anonymousAuth,
  createAccountAndSignIn,
  decryptSeed,
  keyring,
  prepareEncryptionArtifacts,
} from './common'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { components } from '../generated/api-types'
import { SESSION_COOKIE_NAME } from '../../utils/auth'
import { Account, EncryptionArtifacts as EncryptionArtifactsEntity } from '../../model'

type ChangeAccountArgs = {
  accountId: string
  sessionId?: string
  gatewayName: string
  joystreamAccountId: string
  signingKey: KeyringPair
  expectedStatus: number
  timestamp?: number
  action?: string
  endpoint?: string
  newArtifacts?: EncryptionArtifacts | undefined
}

async function changeAccount({
  accountId,
  sessionId,
  gatewayName,
  joystreamAccountId,
  signingKey,
  expectedStatus,
  action = 'changeAccount',
  timestamp = Date.now(),
  newArtifacts = undefined,
}: ChangeAccountArgs): Promise<string> {
  const payload: components['schemas']['ChangeAccountRequestData']['payload'] = {
    joystreamAccountId,
    gatewayAccountId: accountId,
    gatewayName,
    timestamp,
    action: action as 'changeAccount',
    newArtifacts,
  }
  const signature = u8aToHex(signingKey.sign(JSON.stringify(payload)))
  await request(app)
    .post('/api/v1/change-account')
    .set('Cookie', sessionId ? `${SESSION_COOKIE_NAME}=${sessionId}` : '')
    .set('Content-Type', 'application/json')
    .send({
      payload,
      signature,
    })
    .expect(expectedStatus)

  return signature
}

describe('changeAccount', () => {
  let accountInfo: LoggedInAccountInfo
  let gatewayName: string
  let em: EntityManager
  let initialPair: KeyringPair
  let alice: KeyringPair
  let bob: KeyringPair

  before(async () => {
    await cryptoWaitReady()
    accountInfo = await createAccountAndSignIn()
    em = await globalEm
    gatewayName = await config.get(ConfigVariable.AppName, em)
    initialPair = keyring.addFromUri(`//${accountInfo.seed}`)
    alice = keyring.addFromUri('//Alice')
    bob = keyring.addFromUri('//Bob')
  })

  async function assertBlockchainAccountNotChanged(): Promise<void> {
    const { seed, email, password, joystreamAccountId, accountId } = accountInfo
    const account = await em.getRepository(Account).findOneBy({
      id: accountId,
    })
    const encryptionArtifacts = await em.getRepository(EncryptionArtifactsEntity).findOneBy({
      accountId,
    })
    assert(
      account?.joystreamAccount === joystreamAccountId,
      'Blockchain account unexpectedly changed'
    )
    assert(encryptionArtifacts, 'Encryption artifacts unexpectedly deleted')
    assert(
      (await decryptSeed(email, password, encryptionArtifacts)) === seed,
      'Encryption artifacts unexpectedly changed'
    )
  }

  it('should fail with invalid signature', async () => {
    await changeAccount({
      accountId: accountInfo.accountId,
      sessionId: accountInfo.sessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: bob,
      expectedStatus: 400,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail with invalid app name', async () => {
    await changeAccount({
      accountId: accountInfo.accountId,
      sessionId: accountInfo.sessionId,
      gatewayName: 'invalid',
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 400,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail if not logged in', async () => {
    await changeAccount({
      accountId: accountInfo.accountId,
      sessionId: undefined,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 401,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail if anonymounsly authenticated', async () => {
    const anonSessionId = await anonymousAuth()
    await changeAccount({
      accountId: accountInfo.accountId,
      sessionId: anonSessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 401,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail with invalid gateway account id', async () => {
    await changeAccount({
      accountId: 'invalid',
      sessionId: accountInfo.sessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 400,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail if proof expired', async () => {
    const proofExpiryTime = await config.get(
      ConfigVariable.AccountOwnershipProofExpiryTimeSeconds,
      em
    )
    await changeAccount({
      accountId: accountInfo.accountId,
      sessionId: accountInfo.sessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 400,
      timestamp: Date.now() - proofExpiryTime * 1000 - 1,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail if proof timestamp is in the future', async () => {
    await changeAccount({
      accountId: accountInfo.accountId,
      sessionId: accountInfo.sessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 400,
      timestamp: Date.now() + 1000,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should fail if action is not valid', async () => {
    await changeAccount({
      action: 'invalid',
      accountId: accountInfo.accountId,
      sessionId: accountInfo.sessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 400,
    })
    await assertBlockchainAccountNotChanged()
  })

  it('should work with valid signature, old account and new artifacts', async () => {
    const { email, accountId, sessionId, seed, joystreamAccountId } = accountInfo
    const newPassword = 'NewPassword123!'
    const newArtifacts = await prepareEncryptionArtifacts(seed, email, newPassword)
    await changeAccount({
      accountId,
      sessionId,
      gatewayName,
      joystreamAccountId,
      signingKey: initialPair,
      expectedStatus: 200,
      newArtifacts,
    })
    const account = await em.getRepository(Account).findOneBy({ id: accountId })
    const encryptionArtifacts = await em
      .getRepository(EncryptionArtifactsEntity)
      .findOneBy({ accountId })
    assert(
      account?.joystreamAccount === joystreamAccountId,
      'Blockchain account unexpectedly changed'
    )
    assert(encryptionArtifacts, 'New encryption artifacts not saved')
    assert(
      (await decryptSeed(email, newPassword, encryptionArtifacts)) === seed,
      'Encryption artifacts not correctly updated'
    )
  })

  it('should work with valid signature, new account and new artifacts', async () => {
    const { email, password, accountId, sessionId } = accountInfo
    const newSeed = 'Alice'
    const newArtifacts = await prepareEncryptionArtifacts(newSeed, email, password)
    await changeAccount({
      accountId,
      sessionId,
      gatewayName,
      joystreamAccountId: alice.address,
      signingKey: alice,
      expectedStatus: 200,
      newArtifacts,
    })
    const account = await em.getRepository(Account).findOneBy({ id: accountId })
    const encryptionArtifacts = await em
      .getRepository(EncryptionArtifactsEntity)
      .findOneBy({ accountId })
    assert(account?.joystreamAccount === alice.address, 'Blockchain account not changed')
    assert(encryptionArtifacts, 'Encryption artifacts not saved')
    assert(
      (await decryptSeed(email, password, encryptionArtifacts)) === newSeed,
      'Encryption artifacts not correctly updated'
    )
  })

  it('should work with valid signature and no artifacts', async () => {
    const { accountId, sessionId } = accountInfo
    await changeAccount({
      accountId,
      sessionId,
      gatewayName,
      joystreamAccountId: bob.address,
      signingKey: bob,
      expectedStatus: 200,
    })
    const account = await em.getRepository(Account).findOneBy({ id: accountId })
    const encryptionArtifacts = await em
      .getRepository(EncryptionArtifactsEntity)
      .findOneBy({ accountId })
    assert(account?.joystreamAccount === bob.address, 'Blockchain account not changed')
    assert(!encryptionArtifacts, 'Encryption artifacts not deleted')
  })

  it('should fail if joystream account is already connected to a different gateway account', async () => {
    const { accountId, sessionId } = await createAccountAndSignIn()
    await changeAccount({
      accountId,
      sessionId,
      gatewayName,
      joystreamAccountId: bob.address,
      signingKey: bob,
      expectedStatus: 409,
    })
  })
})
