import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { EncryptionArtifacts, SessionEncryptionArtifacts } from '../../model'
import assert from 'assert'
import { EntityManager } from 'typeorm'
import {
  LoggedInAccountInfo,
  aes256CbcDecrypt,
  aes256CbcEncrypt,
  anonymousAuth,
  calculateLookupKey,
  createAccount,
  createAccountAndSignIn,
  decryptSeed,
  verifyRateLimit,
} from './common'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { components } from '../generated/api-types'
import { randomBytes } from 'crypto'
import { SESSION_COOKIE_NAME } from '../../utils/auth'
import { rateLimitsPerRoute } from '../rateLimits'

describe('artifacts', () => {
  let em: EntityManager

  before(async () => {
    await cryptoWaitReady()
    em = await globalEm
  })

  describe('encryptionArtifacts', () => {
    const email = 'encryption.artifacts.test@example.com'
    const password = 'SomeSuperSecurePassword123!'
    const seed = randomBytes(16).toString('hex')

    before(async () => {
      await createAccountAndSignIn(email, password, seed)
    })

    it('should be possible to retrieve saved encryption artifacts and decrypt the seed', async () => {
      const urlParms = new URLSearchParams({
        email,
        id: await calculateLookupKey(email, password),
      })
      const response = await request(app)
        .get(`/api/v1/artifacts?${urlParms.toString()}`)
        .expect(200)
      const decryptedSeed = await decryptSeed(email, password, response.body as EncryptionArtifacts)
      assert(decryptedSeed === seed, 'Decrypted seed does not match')
    })

    it('should not be possible to retrieve enecryption artifacts by invalid id', async () => {
      const urlParms = new URLSearchParams({
        email,
        id: await calculateLookupKey(email, 'invalid password'),
      })
      await request(app).get(`/api/v1/artifacts?${urlParms.toString()}`).expect(404)
    })

    it('should not be possible to retrieve enecryption artifacts if invalid email was provided', async () => {
      const otherAccount = await createAccount()
      const urlParms = new URLSearchParams({
        email: otherAccount.email,
        id: await calculateLookupKey(email, password),
      })
      await request(app).get(`/api/v1/artifacts?${urlParms.toString()}`).expect(404)
    })

    it('should not be possible to retrieve enecryption artifacts if no email was provided', async () => {
      await request(app)
        .get(`/api/v1/artifacts?id=${await calculateLookupKey(email, password)}`)
        .expect(400)
    })

    it('should not be possible to retrieve enecryption artifacts if no id was provided', async () => {
      const urlParms = new URLSearchParams({ email })
      await request(app).get(`/api/v1/artifacts?${urlParms.toString()}`).expect(400)
    })

    it('should not be possible to retrieve encryption artifacts if neither an email nor an id was provided', async () => {
      await request(app).get(`/api/v1/artifacts`).expect(400)
    })

    it('should not be possible to exceed rate limit when retrieving artifacts (brute-force)', async () => {
      await verifyRateLimit(async (i) => {
        // We speficially test 404 status, as this would be the typical brute-force scenario
        const id = await calculateLookupKey(email, `Attempt${i}`)
        const urlParms = new URLSearchParams({
          email,
          id,
        })
        return {
          req: request(app).get(`/api/v1/artifacts?${urlParms.toString()}`),
          status: 404,
        }
      }, rateLimitsPerRoute['/artifacts']?.get)
    })
  })

  describe('sessionEncryptionArtifacts', () => {
    let loggedInAccountInfo: LoggedInAccountInfo
    let sessionEncryptedSeed: string
    const seed = randomBytes(16).toString('hex')
    let artifacts: components['schemas']['SessionEncryptionArtifacts']

    before(async () => {
      loggedInAccountInfo = await createAccountAndSignIn(undefined, undefined, seed)
      const cipherIv = randomBytes(16)
      const cipherKey = randomBytes(32)
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
        .set('Cookie', `${SESSION_COOKIE_NAME}=${sessionId}`)
        .send(artifacts)
        .expect(401)
    })

    for (const missingField of ['cipherIv', 'cipherKey'] as const) {
      it(`should not be possible to post session encryption artifacts without ${missingField}`, async () => {
        const { [missingField]: _, ...artifactsWithoutField } = artifacts
        await request(app)
          .post('/api/v1/session-artifacts')
          .set('Content-Type', 'application/json')
          .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
          .send(artifactsWithoutField)
          .expect(400)
      })
    }

    it('should not be possible to post empty encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
        .send({})
        .expect(400)
    })

    it('should not be possible to retrieve session encryption artifacts if not posted', async () => {
      await request(app)
        .get(`/api/v1/session-artifacts`)
        .set('Content-Type', 'application/json')
        .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
        .expect(404)
    })

    it('should be possible to post valid encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
        .send(artifacts)
        .expect(200)
      const savedArtifacts = await em.getRepository(SessionEncryptionArtifacts).findOneBy({
        sessionId: loggedInAccountInfo.sessionIdRaw,
      })
      assert(savedArtifacts, 'Encryption artifacts not saved')
    })

    it('should not be possible to override existing session encryption artifacts', async () => {
      await request(app)
        .post('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
        .send(artifacts)
        .expect(409)
    })

    it('should be possible to retrieve saved session encryption artifacts and decrypt the seed', async () => {
      const response = await request(app)
        .get(`/api/v1/session-artifacts`)
        .set('Content-Type', 'application/json')
        .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
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
        .set('Cookie', `${SESSION_COOKIE_NAME}=${sessionId}`)
        .expect(401)
    })

    it('should not be possible to retrieve session encryption artifacts when not authenticated', async () => {
      await request(app)
        .get('/api/v1/session-artifacts')
        .set('Content-Type', 'application/json')
        .expect(401)
    })

    it('should not be possible to exceed rate limit when posting artifacts', async () => {
      await verifyRateLimit(() => {
        const cipherIv = randomBytes(16).toString('hex')
        const cipherKey = randomBytes(32).toString('hex')
        const req = request(app)
          .post('/api/v1/session-artifacts')
          .set('Content-Type', 'application/json')
          .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
          .send({ cipherIv, cipherKey })
        return { req, status: 409 }
      }, rateLimitsPerRoute['/session-artifacts']?.post)
    })

    it('should not be possible to exceed rate limit when retrieving artifacts', async () => {
      await verifyRateLimit(() => {
        const req = request(app)
          .get('/api/v1/session-artifacts')
          .set('Content-Type', 'application/json')
          .set('Cookie', `${SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
        return { req, status: 200 }
      }, rateLimitsPerRoute['/session-artifacts']?.get)
    })
  })
})
