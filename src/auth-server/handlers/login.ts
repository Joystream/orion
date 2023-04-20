import express from 'express'
import { Account } from '../../model'
import { globalEm } from '../../utils/globalEm'
import { UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'
import { compare } from 'bcryptjs'
import { getOrCreateSession } from '../../utils/auth'

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
    const { email, password } = req.body
    const em = await globalEm
    const session = await em.transaction(async (em) => {
      const account = await em.getRepository(Account).findOneBy({
        email,
      })
      if (!account || account.email !== email || !(await compare(password, account.paswordHash))) {
        throw new UnauthorizedError('Invalid credentials')
      }

      return getOrCreateSession(em, req, account.userId, account.id)
    })

    res.status(200).json({
      success: true,
      sessionId: session.id,
    })
  } catch (e) {
    next(e)
  }
}
