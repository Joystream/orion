import express from 'express'
import { Account, User } from '../../model'
import { uniqueId } from '../../utils/crypto'
import { globalEm } from '../../utils/globalEm'
import { components } from '../generated/api-types'
import { UnauthorizedError } from '../errors'
import { getOrCreateSession, setSessionCookie } from '../../utils/auth'

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

    const { user, sessionData } = await em.transaction(async (em) => {
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

      const sessionData = await getOrCreateSession(em, req, user.id)

      return { user, sessionData }
    })

    setSessionCookie(res, sessionData.session.id, sessionData.sessionMaxDurationHours)

    res.status(200).json({
      success: true,
      userId: user.id,
    })
  } catch (e) {
    next(e)
  }
}
