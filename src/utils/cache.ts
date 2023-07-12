import NodeCache from 'node-cache'

export type CachedSessionData = {
  lastActivity: Date
}

export const SESSION_CACHE_CHECKPERIOD = 30
// How many seconds before the session expires in the database should the related cache entry expire
// (in order to trigger database expiry period update)
// Should be greater than checkperiod!
export const SESSION_CACHE_EXPIRY_TTL_MARGIN = 45
// A reasonable minimum TTL, in seconds, of the cached session entry
export const SESSION_CACHE_MINIMUM_TTL = 15

export const sessionCache = new NodeCache({
  checkperiod: SESSION_CACHE_CHECKPERIOD,
  useClones: false,
})
