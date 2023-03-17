import { Request } from 'express'
import { EntityManager, FindOptionsWhere, MoreThan } from 'typeorm'
import { Account, Session } from '../model'
import {
  CachedSessionData,
  sessionCache,
  SESSION_CACHE_MINIMUM_TTL,
  SESSION_CACHE_EXPIRY_TTL_MARGIN,
} from './cache'
import { config, ConfigVariable } from './config'
import { getUserAgentData, resolveIP } from './http'
import { createLogger } from '@subsquid/logger'
import { globalEm } from './globalEm'

const authLogger = createLogger('authentication')

export async function findActiveSession(
  req: Request,
  em: EntityManager,
  where: FindOptionsWhere<Session>
): Promise<Session | undefined> {
  const ip = resolveIP(req)
  const { browser, device, os } = getUserAgentData(req)
  const activeSession = await em.getRepository(Session).findOne({
    where: {
      ...where,
      ip,
      os,
      device,
      browser,
      expiry: MoreThan(new Date()),
    },
    relations: { user: true, account: true },
  })
  if (activeSession) {
    const userAcc = await em.getRepository(Account).findOneBy({ userId: activeSession.user.id })
    if (userAcc?.id !== activeSession.account?.id) {
      authLogger.warn(
        `Session ${activeSession.id} cannot be accessed with account ${activeSession.account?.id}, ` +
          `as user is now associated with account ${userAcc?.id}`
      )
      sessionCache.del(activeSession.id)
      return undefined
    }
    return activeSession
  }
}

async function tryToProlongSession(id: string, lastActivity: Date): Promise<void> {
  authLogger.debug(
    `Trying to prolong session ${id}. Last activity: ${lastActivity.toISOString()}...`
  )
  const em = await globalEm
  await em.transaction(async (em) => {
    const session = await em
      .getRepository(Session)
      .findOne({ where: { id }, lock: { mode: 'pessimistic_write' } })
    if (!session) {
      authLogger.error(`Session by id ${id} not found!`)
      return
    }
    if (session.expiry.getTime() <= Date.now()) {
      authLogger.warn(`Cannot prolong session ${id}. Session expired.`)
      return
    }
    const { startedAt, expiry } = session
    const maxSessionDurationHours = await config.get(ConfigVariable.SessionMaxDurationHours, em)
    const prolongPeriodMinutes = await config.get(
      ConfigVariable.SessionExpiryAfterInactivityMinutes,
      em
    )
    const maxSessionDurationMs = maxSessionDurationHours * 3_600_000
    const prolongPeriodMs = prolongPeriodMinutes * 60_000
    const newExpiryMs = Math.min(
      startedAt.getTime() + maxSessionDurationMs,
      lastActivity.getTime() + prolongPeriodMs
    )
    if (newExpiryMs <= expiry.getTime()) {
      authLogger.debug(`Session ${id}: prolonging not needed or impossible, skipping...`)
    } else {
      session.expiry = new Date(newExpiryMs)
      await em.save(session)
      authLogger.debug(`Session ${id} prolonged to ${session.expiry.toISOString()}...`)
    }
    tryToCacheSession(session, lastActivity)
  })
}

function tryToCacheSession({ id, expiry }: Session, lastActivity: Date) {
  const remainingLifetimeInSeconds = Math.floor((expiry.getTime() - Date.now()) / 1000)
  const ttl = remainingLifetimeInSeconds - SESSION_CACHE_EXPIRY_TTL_MARGIN
  if (ttl > SESSION_CACHE_MINIMUM_TTL) {
    authLogger.debug(`Caching session ${id} with ttl=${ttl}...`)
    sessionCache.set<CachedSessionData>(id, { lastActivity }, ttl)
  }
}

sessionCache.on('expired', (sessionId: string, cachedData: CachedSessionData) => {
  tryToProlongSession(sessionId, cachedData.lastActivity).catch((e) => {
    authLogger.error(String(e))
    process.exit(-1)
  })
})

export type AuthContext = Session

export async function authenticate(req: Request): Promise<AuthContext | false> {
  const em = await globalEm
  const [, sessionId] = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9+/=]+)$/) || []
  if (!sessionId) {
    authLogger.debug(
      `Recieved a request w/ no sessionId provided. Authorization header: ${req.headers.authorization}`
    )
    return false
  }
  authLogger.trace(`Authenticating... SessionId: ${sessionId}`)

  const session = await findActiveSession(req, em, { id: sessionId })
  if (session) {
    const cachedSessionData = sessionCache.get<CachedSessionData>(sessionId)
    if (cachedSessionData) {
      cachedSessionData.lastActivity = new Date()
      authLogger.trace(
        `Updated last activity of session ${sessionId} to ${cachedSessionData.lastActivity.toISOString()}`
      )
    } else {
      await tryToProlongSession(session.id, new Date())
    }
    return session
  }
  authLogger.warn(`Cannot authenticate user. Session not found or expired: ${sessionId}`)

  return false
}
