import { Request, Response } from 'express'
import { EntityManager, FindOptionsWhere, IsNull, MoreThan } from 'typeorm'
import { Account, Session } from '../model'
import {
  CachedSessionData,
  sessionCache,
  SESSION_CACHE_MINIMUM_TTL,
  SESSION_CACHE_EXPIRY_TTL_MARGIN,
} from './cache'
import { config, ConfigVariable } from './config'
import { getUserAgentData } from './http'
import { createLogger } from '@subsquid/logger'
import { globalEm } from './globalEm'
import { uniqueId } from './crypto'

const authLogger = createLogger('authentication')

export const SESSION_COOKIE_NAME = 'session_id'

export async function findActiveSession(
  req: Request,
  em: EntityManager,
  where: FindOptionsWhere<Session>
): Promise<Session | undefined> {
  const { ip } = req
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

export type AuthContext = Session | null

export async function getSessionIdFromHeader(req: Request): Promise<string | undefined> {
  authLogger.trace(`Authorization header: ${JSON.stringify(req.headers.authorization, null, 2)}`)
  const [, sessionId] = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9+/=]+)$/) || []
  return sessionId
}

export async function getSessionIdFromCookie(req: Request): Promise<string | undefined> {
  authLogger.trace(`Cookies: ${JSON.stringify(req.cookies, null, 2)}`)
  return req.cookies ? req.cookies[SESSION_COOKIE_NAME] : undefined
}

export async function authenticate(
  req: Request,
  authType: 'cookie' | 'header'
): Promise<AuthContext> {
  const em = await globalEm
  const sessionId =
    authType === 'cookie' ? await getSessionIdFromCookie(req) : await getSessionIdFromHeader(req)

  if (sessionId) {
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
  }
  authLogger.debug(`Recieved a request w/ no sessionId provided. AuthType: ${authType}.`)
  return null
}

export async function getOrCreateSession(
  em: EntityManager,
  req: Request,
  userId: string,
  accountId?: string
): Promise<{
  session: Session
  sessionMaxDurationHours: number
}> {
  const now = new Date()
  const sessionExpiryAfterMinutes = await config.get(
    ConfigVariable.SessionExpiryAfterInactivityMinutes,
    em
  )
  const sessionExpiry = new Date(now.getTime() + sessionExpiryAfterMinutes * 60_000)

  // Avoid duplicating sessions, just extend an existing one if found
  const existingSession = await findActiveSession(req, em, {
    userId,
    accountId: accountId || IsNull(),
  })
  const sessionMaxDurationHours = await config.get(ConfigVariable.SessionMaxDurationHours, em)

  if (existingSession) {
    existingSession.expiry = new Date(
      Math.min(
        existingSession.startedAt.getTime() + sessionMaxDurationHours * 3_600_000,
        sessionExpiry.getTime()
      )
    )
    return {
      session: await em.save(existingSession),
      sessionMaxDurationHours,
    }
  }

  const { ip } = req
  const { browser, device, deviceType, os } = getUserAgentData(req)
  const session = new Session({
    id: uniqueId(),
    startedAt: now,
    expiry: sessionExpiry,
    browser,
    device,
    deviceType,
    os,
    ip,
    userId,
    accountId,
  })
  return {
    session: await em.save(session),
    sessionMaxDurationHours,
  }
}

export function setSessionCookie(res: Response, sessionId: string, maxDurationHours: number): void {
  const sameSite =
    process.env.ORION_ENV === 'development' && process.env.DEV_DISABLE_SAME_SITE === 'true'
      ? 'none'
      : 'strict'
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    maxAge: maxDurationHours * 3_600_000,
    httpOnly: true,
    secure: true,
    sameSite,
    domain: process.env.GATEWAY_ROOT_DOMAIN && `.${process.env.GATEWAY_ROOT_DOMAIN}`,
  })
}

export function getCorsOrigin(): (RegExp | string)[] | boolean {
  if (process.env.ORION_ENV === 'development' && process.env.DEV_DISABLE_SAME_SITE === 'true') {
    return true
  }

  const rootDomain = process.env.GATEWAY_ROOT_DOMAIN

  if (!rootDomain) {
    throw new Error(
      'GATEWAY_ROOT_DOMAIN must be set unless in development mode with DEV_DISABLE_SAME_SITE set to true'
    )
  }

  const corsOrigin = [
    `https://${rootDomain}`,
    `http://localhost:3000`,
    `http://127.0.0.1:3000`,
    new RegExp(`https://.+\\.${rootDomain.replace('.', '\\.')}$`),
  ]

  authLogger.info('Root domain: ' + rootDomain)
  authLogger.info('CORS origin: ' + corsOrigin.toString())

  return corsOrigin
}
