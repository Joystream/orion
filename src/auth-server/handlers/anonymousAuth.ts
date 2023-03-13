import express from 'express'
import { Account, Session, User } from '../../model'
import { uniqueId } from '../../utils/crypto'
import { findActiveSession, getUserAgentData, resolveIP } from '../../utils/http'
import { getEm } from '../em'
import { components } from '../generated/api-types'
import { config, ConfigVariable } from '../../utils/config'
import { UnauthorizedError } from '../errors'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['AnonymousUserAuthResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['AnonymousUserAuthRequestData']

export const anonymousAuth: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { userId } = req.body
    const em = await getEm
    const ip = resolveIP(req)
    const { browser, device, deviceType, os } = getUserAgentData(req)
    const user = userId
      ? await em.getRepository(User).findOneBy({
          id: userId,
        })
      : await em.save(
          new User({
            id: uniqueId(),
            isRoot: false,
          })
        )
    if (!user) {
      throw new UnauthorizedError('User not found by provided userId')
    }
    const account = await em.getRepository(Account).findOneBy({ userId: user.id })
    if (account) {
      throw new UnauthorizedError('Cannot use anonymous auth for registered users')
    }

    const now = new Date()
    const sessionMaxDurationHours = await config.get(ConfigVariable.SessionMaxDurationHours, em)
    const sessionExpiry = new Date(now.getTime() + sessionMaxDurationHours * 60 * 60 * 1000)

    // Avoid duplicating sessions, just extend an existing one if found
    const existingSession = await findActiveSession(req, em, { userId: user.id })
    if (existingSession) {
      existingSession.expiry = sessionExpiry
      await em.save(existingSession)
      res.status(200).json({
        userId: user.id,
        sessionId: existingSession.id,
      })
      return next()
    }

    const session = new Session({
      id: uniqueId(),
      startedAt: now,
      expiry: sessionExpiry,
      browser,
      device,
      deviceType,
      os,
      ip,
      user,
    })
    await em.save(session)
    res.status(200).json({
      userId: user.id,
      sessionId: session.id,
    })
    return next()
  } catch (e) {
    next(e)
  }
}
