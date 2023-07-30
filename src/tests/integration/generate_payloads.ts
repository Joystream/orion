import { uniqueId } from 'lodash'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import Keyring from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { createCipheriv, randomBytes, scrypt, ScryptOptions } from 'crypto'
import { components } from '../../auth-server/generated/api-types'

const email = process.argv[2] || 'testMail@example.com'
const memberId = process.argv[3] || '15'
const password = process.argv[4] || 'test'
const addressSeed = process.argv[5] || 'Alice'
const seed = uniqueId()
export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export type EncryptionArtifacts = components['schemas']['EncryptionArtifacts']

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

prepareEncryptionArtifacts(seed, email, password).then((encryptionArtifacts) => {
  const keypair = keyring.addFromUri(`//${addressSeed}`)
  const account_payload = {
    joystreamAccountId: keypair.address,
    gatewayName: 'Gleev',
    timestamp: Date.now(),
    action: 'createAccount',
    email,
    memberId,
    encryptionArtifacts,
  }

  const account_result = {
    signature: u8aToHex(keypair.sign(JSON.stringify(account_payload))),
    payload: account_payload,
  }

  const login_payload = {
    joystreamAccountId: keypair.address,
    gatewayName: 'Gleev',
    timestamp: Date.now(),
    action: 'login',
  }

  const login_result = {
    signature: u8aToHex(keypair.sign(JSON.stringify(login_payload))),
    payload: login_payload,
  }

  console.log(
    JSON.stringify({
      login: login_result,
      account: account_result,
    })
  )
})
