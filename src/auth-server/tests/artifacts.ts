import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { Account, EncryptionArtifacts, SessionEncryptionArtifacts } from '../../model'
import assert from 'assert'
import { EntityManager } from 'typeorm'
import {
  AccountInfo,
  aes256CbcDecrypt,
  aes256CbcEncrypt,
  anonymousAuth,
  createAccount,
  createAccountAndSignIn,
  scryptHash,
} from './common'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { components } from '../generated/api-types'
import { randomBytes } from 'crypto'

describe('artifacts', () => {
  let em: EntityManager
  const password = 'secret'
  const seed = 'secretseed'

  before(async () => {
    await cryptoWaitReady()
    em = await globalEm
  })

  describe('encryptionArtifacts', () => {
    let artifacts: components['schemas']['EncryptionArtifacts']
    let account: Account

    before(async () => {
      account = await createAccount()
      const id = (
        await scryptHash(`lookupKey:${account.email}:${password}`, 'lookupKeySalt')
      ).toString('hex')
      const cipherIv = randomBytes(16)
      const cipherKey = await scryptHash(`cipherKey:${account.email}:${password}`, cipherIv)
      const encryptedSeed = aes256CbcEncrypt(seed, cipherKey, cipherIv)
      artifacts = {
        id,
        cipherIv: cipherIv.toString('hex'),
        encryptedSeed,
      }
    })

    it('should not be possible to post empty encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/artifacts')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400)
    })

    for (const field of ['id', 'cipherIv', 'encryptedSeed'] as const) {
      it(`should not be possible to post encryption artifacts without ${field}`, async () => {
        const { [field]: _, ...artifactsWithoutField } = artifacts
        await request(app)
          .post('/api/v1/artifacts')
          .set('Content-Type', 'application/json')
          .send(artifactsWithoutField)
          .expect(400)
      })
    }

    it('should be possible to post valid encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/artifacts')
        .set('Content-Type', 'application/json')
        .send(artifacts)
        .expect(200)
      const savedArtifacts = await em.getRepository(EncryptionArtifacts).findOneBy({
        id: artifacts.id,
      })
      assert(savedArtifacts, 'Encryption artifacts not saved')
    })

    it('should be possible to retrieve saved encryption artifacts and decrypt the seed', async () => {
      const response = await request(app).get(`/api/v1/artifacts?id=${artifacts.id}`).expect(200)
      const { cipherIv, encryptedSeed } =
        response.body as components['schemas']['EncryptionArtifacts']
      const cipherKey = await scryptHash(
        `cipherKey:${account.email}:${password}`,
        Buffer.from(cipherIv, 'hex')
      )
      const decryptedSeed = aes256CbcDecrypt(encryptedSeed, cipherKey, Buffer.from(cipherIv, 'hex'))
      assert(decryptedSeed === seed, 'Decrypted seed does not match')
    })

    it('should not be possible to retrieve enecryption artifacts by invalid id', async () => {
      await request(app).get(`/api/v1/artifacts?id=invalid`).expect(404)
    })

    it('should not be possible to retrieve encryption artifacts without id provided', async () => {
      await request(app).get(`/api/v1/artifacts`).expect(400)
    })
  })

  describe('sessionEncryptionArtifacts', () => {
    let loggedInAccountInfo: AccountInfo
    let sessionEncryptedSeed: string
    let cipherIv: Buffer
    let cipherKey: Buffer
    let artifacts: components['schemas']['SessionEncryptionArtifacts']

    before(async () => {
      loggedInAccountInfo = await createAccountAndSignIn()
      cipherIv = randomBytes(16)
      cipherKey = randomBytes(32)
      artifacts = { cipherIv: cipherIv.toString('hex'), cipherKey: cipherKey.toString('hex') }
      sessionEncryptedSeed = aes256CbcEncrypt(seed, cipherKey, cipherIv)
    })

    it('should not be possible to post session encryption artifacts when not authenticated', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .send(artifacts)
        .expect(401)
    })

    it('should not be possible to post session encryption artifacts when authenticated anonymously', async () => {
      const sessionId = await anonymousAuth()
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${sessionId}`)
        .send(artifacts)
        .expect(401)
    })

    for (const missingField of ['cipherIv', 'cipherKey'] as const) {
      it(`should not be possible to post session encryption artifacts without ${missingField}`, async () => {
        const { [missingField]: _, ...artifactsWithoutField } = artifacts
        await request(app)
          .post('/api/v1/session-artifacts')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${loggedInAccountInfo.sessionId}`)
          .send(artifactsWithoutField)
          .expect(400)
      })
    }

    it('should not be possible to post empty encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${loggedInAccountInfo.sessionId}`)
        .send({})
        .expect(400)
    })

    it('should not be possible to retrieve session encryption artifacts if not posted', async () => {
      await request(app)
        .get(`/api/v1/session-artifacts`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${loggedInAccountInfo.sessionId}`)
        .expect(404)
    })

    it('should be possible to post valid encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${loggedInAccountInfo.sessionId}`)
        .send(artifacts)
        .expect(200)
      const savedArtifacts = await em.getRepository(SessionEncryptionArtifacts).findOneBy({
        sessionId: loggedInAccountInfo.sessionId,
      })
      assert(savedArtifacts, 'Encryption artifacts not saved')
    })

    it('should not be possible to override existing session encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${loggedInAccountInfo.sessionId}`)
        .send(artifacts)
        .expect(400)
    })

    it('should be possible to retrieve saved session encryption artifacts and decrypt the seed', async () => {
      const response = await request(app)
        .get(`/api/v1/session-artifacts`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${loggedInAccountInfo.sessionId}`)
        .expect(200)
      const { cipherIv, cipherKey } =
        response.body as components['schemas']['SessionEncryptionArtifacts']
      const decryptedSeed = aes256CbcDecrypt(
        sessionEncryptedSeed,
        Buffer.from(cipherKey, 'hex'),
        Buffer.from(cipherIv, 'hex')
      )
      assert(decryptedSeed === seed, 'Decrypted seed does not match')
    })

    it('should not be possible to retrieve session encryption artifacts when authenticated anonymously', async () => {
      const sessionId = await anonymousAuth()
      await request(app)
        .get('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${sessionId}`)
        .expect(401)
    })

    it('should not be possible to retrieve session encryption artifacts when not authenticated', async () => {
      await request(app)
        .get('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .expect(401)
    })
  })
})
