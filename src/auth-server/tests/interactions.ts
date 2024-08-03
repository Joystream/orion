import './config'
import request from 'supertest'
import { app } from '../index'
import { createAccountAndSignIn, LoggedInAccountInfo, verifyRateLimit } from './common'
import { rateLimitsPerRoute } from '../rateLimits'
import { components } from '../generated/api-types'
import { SESSION_COOKIE_NAME } from '../../utils/auth'

async function userInteraction({
  sessionId,
  entityId,
  type,
  expectedStatus,
}: {
  sessionId?: string
  type: string
  entityId: string
  expectedStatus: number
}) {
  const payload: components['schemas']['RegisterUserInteractionRequestData'] = {
    type,
    entityId,
  }
  return request(app)
    .post('/api/v1/register-user-interaction')
    .set('Cookie', sessionId ? `${SESSION_COOKIE_NAME}=${sessionId}` : '')
    .set('Content-Type', 'application/json')
    .send(payload)
    .expect(expectedStatus)
}

describe('interactions endpoint', () => {
  let accountInfo: LoggedInAccountInfo

  before(async () => {
    accountInfo = await createAccountAndSignIn('userInteraction@test.com')
  })

  it("shouldn't be possible to register interaction without account", async () => {
    await userInteraction({
      type: 'test1',
      entityId: '1',
      expectedStatus: 401,
    })
  })

  it("shouldn't be possible to exceed rolling window limit", async () => {
    await userInteraction({
      sessionId: accountInfo.sessionId,
      type: 'test1',
      entityId: '1',
      expectedStatus: 200,
    })

    await userInteraction({
      sessionId: accountInfo.sessionId,
      type: 'test1',
      entityId: '1',
      expectedStatus: 429,
    })
  })

  it("shouldn't be possible to exceed rate limit", async () => {
    await verifyRateLimit((i) => {
      const requestsWithoutSpecificRateLimit = [
        { req: request(app).post('/api/v1/register-user-interaction'), status: 401 },
      ]

      return requestsWithoutSpecificRateLimit[i % requestsWithoutSpecificRateLimit.length]
    }, rateLimitsPerRoute['/register-user-interaction']?.post)
  })
})
