import './config'
import request from 'supertest'
import { app } from '../index'
import { verifyRateLimit } from './common'
import { globalRateLimit } from '../rateLimits'

describe('global rate limit', () => {
  it("shouldn't be possible to exceed global rate limit", async () => {
    await verifyRateLimit((i) => {
      const requestsWithoutSpecificRateLimit = [
        { req: request(app).post('/api/v1/logout'), status: 401 },
        { req: request(app).post('/api/v1/change-account'), status: 401 },
      ]

      return requestsWithoutSpecificRateLimit[i % requestsWithoutSpecificRateLimit.length]
    }, globalRateLimit)
  })
})
