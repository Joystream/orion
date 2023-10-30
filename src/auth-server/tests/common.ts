import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { Account, Membership } from '../../model'
import assert from 'assert'
import { components } from '../generated/api-types'
import { Keyring } from '@polkadot/keyring'
import { KeyringPair } from '@polkadot/keyring/types'
import { ConfigVariable, config } from '../../utils/config'
import { u8aToHex } from '@polkadot/util'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { uniqueId } from '../../utils/crypto'
import { ScryptOptions, createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { SESSION_COOKIE_NAME } from '../../utils/auth'
import { SimpleRateLimit, resetAllLimits } from '../rateLimits'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export type AccountAccessData = {
  accountId: string
  joystreamAccountId: string
  email: string
  password: string
  seed: string
}

export type LoggedInAccountInfo = AccountAccessData & {
  sessionId: string
  sessionIdRaw: string
}

export type EncryptionArtifacts = components['schemas']['EncryptionArtifacts']

export async function scryptHash(
  data: string,
  salt: Buffer | string,
  keylen = 32,
  options: ScryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(data, salt, keylen, options, (err, derivedKey) => {
      if (err) {
        reject(err)
      } else {
        resolve(derivedKey)
      }
    })
  })
}

export function aes256CbcEncrypt(data: string, key: Buffer, iv: Buffer): string {
  const cipher = createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function aes256CbcDecrypt(
  encryptedData: string,
  key: Buffer | string,
  iv: Buffer | string
): string {
  const decipher = createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export async function calculateLookupKey(email: string, password: string): Promise<string> {
  return (await scryptHash(`lookupKey:${email}:${password}`, 'lookupKeySalt')).toString('hex')
}

export async function prepareEncryptionArtifacts(
  seed: string,
  email: string,
  password: string
): Promise<EncryptionArtifacts> {
  const id = await calculateLookupKey(email, password)
  const cipherIv = randomBytes(16)
  const cipherKey = await scryptHash(`cipherKey:${email}:${password}`, cipherIv)
  const encryptedSeed = aes256CbcEncrypt(seed, cipherKey, cipherIv)
  return {
    id,
    cipherIv: cipherIv.toString('hex'),
    encryptedSeed,
  }
}

export async function decryptSeed(
  email: string,
  password: string,
  { cipherIv, encryptedSeed }: EncryptionArtifacts
): Promise<string> {
  const cipherIvBuf = Buffer.from(cipherIv, 'hex')
  const cipherKey = await scryptHash(`cipherKey:${email}:${password}`, cipherIvBuf)
  return aes256CbcDecrypt(encryptedSeed, cipherKey, cipherIvBuf)
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

async function insertFakeMember(controllerAccount: string) {
  const em = await globalEm
  const handle = uniqueId()
  return em.getRepository(Membership).save({
    createdAt: new Date(),
    id: uniqueId(),
    controllerAccount,
    handle: uniqueId(),
    handleRaw: '0x' + Buffer.from(handle).toString('hex'),
    totalChannelsCreated: 0,
  })
}

export async function createAccount(
  email = `test.${uniqueId()}@example.com`,
  password = DEFAULT_PASSWORD,
  seed?: string
): Promise<AccountAccessData> {
  seed = seed || uniqueId()
  const keypair = keyring.addFromUri(`//${seed}`)
  const em = await globalEm

  const membership = await insertFakeMember(keypair.address)

  const anonSessionId = await anonymousAuth()
  const createAccountReqData = await signedAction<
    components['schemas']['CreateAccountRequestData']
  >(
    {
      action: 'createAccount',
      email,
      memberId: membership.id,
      encryptionArtifacts: await prepareEncryptionArtifacts(seed, email, password),
    },
    keypair
  )
  await request(app)
    .post('/api/v1/account')
    .set('Content-Type', 'application/json')
    .set('Cookie', `${SESSION_COOKIE_NAME}=${anonSessionId}`)
    .send(createAccountReqData)
    .expect(200)
  const account = await em.getRepository(Account).findOneBy({ email })
  assert(account, 'Account not found')
  return { accountId: account.id, joystreamAccountId: keypair.address, email, password, seed }
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
  password = DEFAULT_PASSWORD,
  seed?: string
): Promise<LoggedInAccountInfo> {
  const accountData = await createAccount(email, password, seed)
  const keypair = keyring.addFromUri(`//${accountData.seed}`)
  const loginReqData = await signedAction<components['schemas']['LoginRequestData']>(
    {
      action: 'login',
    },
    keypair
  )
  console.log('Login request data:', loginReqData)
  const loginResp = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/json')
    .send(loginReqData)
    .expect(200)

  const sessionId = extractSessionId(loginResp)
  const sessionIdRaw = sessionId.split('.')[0].split(':')[1]
  return {
    sessionId: extractSessionId(loginResp),
    sessionIdRaw,
    ...accountData,
  }
}

function extractSessionId(response: request.Response): string {
  const setCookieHeader = response.get('Set-Cookie')
  assert(setCookieHeader, 'Set-Cookie header not found')
  const [setCookieHeaderStr] = setCookieHeader
  const [, sessionId] = setCookieHeaderStr.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`)) || []
  assert(sessionId, 'Session id not found')
  return sessionId
}

export async function anonymousAuth(): Promise<string> {
  const response = await request(app)
    .post('/api/v1/anonymous-auth')
    .set('Content-Type', 'application/json')
    .expect(200)
  return extractSessionId(response)
}

export async function verifyRateLimit(
  requestGenerator:
    | ((i: number) => { req: request.Test; status: number })
    | ((i: number) => Promise<{ req: request.Test; status: number }>),
  rateLimit: SimpleRateLimit | undefined,
  resetAfterwards = true
) {
  assert(rateLimit, 'Rate limit not set')
  let remaining = rateLimit.limit
  let reset = rateLimit.windowMinutes * 60
  let i = 0
  while (remaining > 0) {
    const { req, status } = await requestGenerator(i++)
    const resp = await req.expect(status)
    const limitInHeader = resp.get('ratelimit-limit')
    const resetInHeader = resp.get('ratelimit-reset')
    const remainingInHeader = resp.get('ratelimit-remaining')
    assert.equal(
      limitInHeader,
      rateLimit.limit.toString(),
      'Limit header does not match the configured limit'
    )
    assert(
      parseInt(resetInHeader) <= reset,
      'Reset time in header has increased since the last request or is greater than the configured reset time'
    )
    assert(
      parseInt(remainingInHeader) < remaining,
      'Number of remaining requests in header is not decreasing'
    )
    remaining = parseInt(remainingInHeader)
    reset = parseInt(resetInHeader)
  }
  const { req } = await requestGenerator(i)
  await req.expect(429)
  if (resetAfterwards) {
    resetAllLimits('::ffff:127.0.0.1')
    resetAllLimits('127.0.0.1')
  }
}
