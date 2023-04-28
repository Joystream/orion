import express from 'express'
import { ConnectedAccount } from '../../model'
import { globalEm } from '../../utils/globalEm'
import { UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'
import { getOrCreateSession, setSessionCookie } from '../../utils/auth'
import { verifyActionExecutionRequest } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['LoginResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['LoginRequestData']

export const login: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const {
      payload: { joystreamAccountId },
    } = req.body
    const em = await globalEm

    await verifyActionExecutionRequest(em, req.body)

    const [sessionData, account] = await em.transaction(async (em) => {
      const connectedAccount = await em.getRepository(ConnectedAccount).findOne({
        where: {
          id: joystreamAccountId,
          isLoginAllowed: true,
        },
        relations: {
          account: { user: true },
        },
      })
      if (!connectedAccount) {
        throw new UnauthorizedError('Invalid credentials')
      }

      const { account } = connectedAccount

      const sessionData = await getOrCreateSession(em, req, account.userId, account.id)

      return [sessionData, account]
    })

    if (sessionData.isNew) {
      setSessionCookie(res, sessionData.session.id, sessionData.sessionMaxDurationHours)
    }

    res.status(200).json({
      accountId: account.id,
    })
  } catch (e) {
    next(e)
  }
}
