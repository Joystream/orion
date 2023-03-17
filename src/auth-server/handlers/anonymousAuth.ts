import express from 'express'
import { Account, Session, User } from '../../model'
import { uniqueId } from '../../utils/crypto'
import { getUserAgentData, resolveIP } from '../../utils/http'
import { globalEm } from '../../utils/globalEm'
import { components } from '../generated/api-types'
import { config, ConfigVariable } from '../../utils/config'
import { UnauthorizedError } from '../errors'
import { findActiveSession } from '../../utils/auth'

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
    const em = await globalEm
    const ip = resolveIP(req)
    const { browser, device, deviceType, os } = getUserAgentData(req)
    await em.transaction(async (em) => {
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
      const sessionExpiryAfterMinutes = await config.get(
        ConfigVariable.SessionExpiryAfterInactivityMinutes,
        em
      )
      const sessionExpiry = new Date(now.getTime() + sessionExpiryAfterMinutes * 60_000)

      // Avoid duplicating sessions, just extend an existing one if found
      const existingSession = await findActiveSession(req, em, { userId: user.id })
      if (existingSession) {
        const sessionMaxDurationHours = await config.get(ConfigVariable.SessionMaxDurationHours, em)
        existingSession.expiry = new Date(
          Math.min(
            existingSession.startedAt.getTime() + sessionMaxDurationHours * 3_600_000,
            sessionExpiry.getTime()
          )
        )
        await em.save(existingSession)
        return res.status(200).json({
          userId: user.id,
          sessionId: existingSession.id,
        })
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
    })
  } catch (e) {
    next(e)
  }
}
