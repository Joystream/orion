import { KeyringPair } from '@polkadot/keyring/types'
import assert from 'assert'
import request from 'supertest'
import { u8aToHex } from '@polkadot/util'
import { uniqueId } from 'lodash'
import { globalEm } from '../../utils/globalEm'
import { components } from '../../auth-server/generated/api-types'
import { createCipheriv, randomBytes, scrypt, ScryptOptions } from 'crypto'
import { ConfigVariable } from '../../utils/config'
import { config } from '../../utils/config'

export type EncryptionArtifacts = components['schemas']['EncryptionArtifacts']
export type AccountCreationData = {
  email: string
  password: string
  seed: string
}

export type AccountLoginData = AccountCreationData & {
  sessionId: string
  sessionIdRaw: string
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

export async function calculateLookupKey(email: string, password: string): Promise<string> {
  return (await scryptHash(`lookupKey:${email}:${password}`, 'lookupKeySalt')).toString('hex')
}

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

export async function anonymousAuth(server: request.SuperTest<request.Test>): Promise<string> {
  const response = await server
    .post('/api/v1/anonymous-auth')
    .set('Content-Type', 'application/json')
  // .expect(200)
  return extractSessionId(response)
}

export async function createAccountForMember(
  server: request.SuperTest<request.Test>,
  memberId: string,
  sender: KeyringPair
): Promise<AccountCreationData> {
  const email = generateEmailAddr(memberId)
  const seed = uniqueId()
  const password = 'test'

  const anonSessionId = await anonymousAuth(server)
  const createAccountReqData = await signedAction<
    components['schemas']['CreateAccountRequestData']
  >(
    {
      action: 'createAccount',
      email,
      memberId,
      encryptionArtifacts: await prepareEncryptionArtifacts(seed, email, password),
    },
    sender
  )
  await server
    .post('/api/v1/account')
    .set('Content-Type', 'application/json')
    .set('Cookie', `session_id=${anonSessionId}`)
    .send(createAccountReqData)
  // .expect(200)
  return { email, password, seed }
}

export function generateEmailAddr(memberId: string): string {
  return `${memberId}@example.com`
}

export async function createAccountAndSignIn(
  server: request.SuperTest<request.Test>,
  memberId: string,
  sender: KeyringPair
): Promise<AccountLoginData> {
  const accountData = await createAccountForMember(server, memberId, sender)
  const loginReqData = await signedAction<components['schemas']['LoginRequestData']>(
    {
      action: 'login',
    },
    sender
  )
  const loginResp = await server
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
  const [, sessionId] = setCookieHeaderStr.match(new RegExp(`session_id=([^;]+)`)) || []
  assert(sessionId, 'Session id not found')
  return sessionId
}

export async function operatorLogin(server: request.SuperTest<request.Test>): Promise<string> {
  const response = await server
    .post('/api/v1/anonymous-auth')
    .send({
      'userId': 'this-is-not-so-secret-change-it',
    })
    .set('Content-Type', 'application/json')
  // .expect(200)

  return extractSessionId(response)
}
