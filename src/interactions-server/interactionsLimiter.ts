import { InMemoryRateLimiter } from 'rolling-rate-limiter'

export const singleClickLimiter = new InMemoryRateLimiter({
  interval: 1000 * 60 * 10, // 10 minutes
  maxInInterval: 20,
})

export const singlePurchaseLimiter = new InMemoryRateLimiter({
  interval: 1000 * 60 * 10, // 10 minutes
  maxInInterval: 5,
})
