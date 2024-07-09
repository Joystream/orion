import rateLimit, { Options as RateLimitOptions, RateLimitRequestHandler } from 'express-rate-limit'
import { paths } from './generated/api-types'
import { Express } from 'express'

const defaultRateLimitOptions: Partial<RateLimitOptions> = {
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after a while',
  statusCode: 429,
}

export type SimpleRateLimit = {
  windowMinutes: number
  limit: number
}

type RateLimitsPerRoute = {
  [P in keyof paths]?: {
    [M in keyof paths[P]]?: SimpleRateLimit
  }
}

// Global limit is 300 auth API requests per 15 minutes per IP,
// it applies to all routes that don't have a specific limit set
export const globalRateLimit: SimpleRateLimit = {
  windowMinutes: 15,
  limit: 300,
}

// Route-specific rate limits
export const rateLimitsPerRoute: RateLimitsPerRoute = {
  '/register-user-interaction': {
    post: {
      windowMinutes: 5,
      limit: 30,
    },
  },
  '/anonymous-auth': {
    post: {
      windowMinutes: 5,
      limit: 10,
    },
  },
  '/login': {
    post: {
      windowMinutes: 5,
      limit: 10,
    },
  },
  '/artifacts': {
    get: {
      windowMinutes: 5,
      limit: 10,
    },
  },
  '/account': {
    post: {
      windowMinutes: 30,
      limit: 10,
    },
  },
  '/session-artifacts': {
    get: {
      windowMinutes: 5,
      limit: 100,
    },
    post: {
      windowMinutes: 5,
      limit: 10,
    },
  },
  '/request-email-confirmation-token': {
    post: {
      windowMinutes: 5,
      limit: 10,
    },
  },
  '/confirm-email': {
    post: {
      windowMinutes: 5,
      limit: 10,
    },
  },
}

const limiters: RateLimitRequestHandler[] = []

export function resetAllLimits(key: string) {
  limiters.forEach((limiter) => {
    limiter.resetKey(key)
  })
}

export function applyRateLimits(
  app: Express,
  globalLimit: SimpleRateLimit,
  limitsPerRoute: RateLimitsPerRoute
) {
  const globalLimiter = rateLimit({
    ...defaultRateLimitOptions,
    windowMs: globalLimit.windowMinutes * 60 * 1000,
    max: globalLimit.limit,
  })
  limiters.push(globalLimiter)
  app.use('/', globalLimiter)
  for (const [path, pathConfig] of Object.entries(limitsPerRoute)) {
    for (const [method, config] of Object.entries(pathConfig)) {
      const limiter = rateLimit({
        ...defaultRateLimitOptions,
        windowMs: config.windowMinutes * 60 * 1000,
        max: config.limit,
      })
      limiters.push(limiter)
      app[method as 'post' | 'get'](`/api/v1${path}`, limiter)
    }
  }
}
