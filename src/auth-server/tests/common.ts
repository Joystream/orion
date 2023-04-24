import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { Token, TokenType, Account } from '../../model'
import assert from 'assert'
import { components } from '../generated/api-types'
import { Keyring } from '@polkadot/keyring'
import { KeyringPair } from '@polkadot/keyring/types'
import { ConfigVariable, config } from '../../utils/config'
import { u8aToHex } from '@polkadot/util'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { uniqueId } from '../../utils/crypto'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export type AccountInfo = {
  sessionId: string
  accountId: string
}

export const DEFAULT_PASSWORD = 'TestPassword123!'

export async function signedAction<T extends components['schemas']['ActionExecutionRequestData']>(
  data: Omit<T['payload'], 'gatewayName' | 'joystreamAccountId' | 'timestamp'>,
  keypair: KeyringPair
): Promise<T> {
  const em = await globalEm
  const gatewayName = await config.get(ConfigVariable.AppName, em)
  const payload: T['payload'] = {
    gatewayName,
    joystreamAccountId: keypair.address,
    timestamp: Date.now(),
    ...data,
  }
  const signature = u8aToHex(keypair.sign(JSON.stringify(payload)))

  return {
    payload,
    signature,
  } as T
}

export async function createAccount(
  email = `test.${uniqueId()}@example.com`,
  keypair?: KeyringPair
): Promise<Account> {
  if (!keypair) {
    keypair = keyring.addFromUri(`//${email}`)
  }
  const em = await globalEm
  const {
    body: { sessionId: anonSessionId },
  } = await request(app)
    .post('/api/v1/anonymous-auth')
    .set('Content-Type', 'application/json')
    .expect(200)
  const createAccountReqData = await signedAction<
    components['schemas']['CreateAccountRequestData']
  >(
    {
      action: 'createAccount',
      email,
    },
    keypair
  )
  await request(app)
    .post('/api/v1/account')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${anonSessionId}`)
    .send(createAccountReqData)
    .expect(200)
  const account = await em.getRepository(Account).findOneBy({ email })
  assert(account, 'Account not found')
  return account
}

export async function confirmEmail(token: string, expectedStatus: number): Promise<void> {
  await request(app)
    .post('/api/v1/confirm-email')
    .set('Content-Type', 'application/json')
    .send({ token })
    .expect(expectedStatus)
}

export async function requestEmailConfirmationToken(
  email: string,
  expectedStatus: number
): Promise<void> {
  await request(app)
    .post('/api/v1/request-email-confirmation-token')
    .set('Content-Type', 'application/json')
    .send({ email })
    .expect(expectedStatus)
}

export async function createAccountAndSignIn(
  email = `test.${uniqueId()}@example.com`,
  keypair?: KeyringPair
): Promise<AccountInfo> {
  if (!keypair) {
    keypair = keyring.addFromUri(`//${email}`)
  }
  const em = await globalEm
  const account = await createAccount(email, keypair)
  const token = await em.getRepository(Token).findOneBy({
    type: TokenType.EMAIL_CONFIRMATION,
    issuedForId: account.id,
  })
  assert(token, 'Token not found')
  await confirmEmail(token.id, 200)
  const loginReqData = await signedAction<components['schemas']['LoginRequestData']>(
    {
      action: 'login',
      gatewayAccountId: keypair.address,
    },
    keypair
  )
  const {
    body: { sessionId: userSessionId },
  } = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/json')
    .send(loginReqData)
    .expect(200)

  return { sessionId: userSessionId, accountId: account.id }
}
