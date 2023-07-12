import express from 'express'
import { AuthContext } from '../../utils/auth'
import { globalEm } from '../../utils/globalEm'
import { components } from '../generated/api-types'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ResLocals = { authContext: AuthContext }

export const logout: (
  req: express.Request<ReqParams, ResBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { authContext: session } = res.locals
    const em = await globalEm
    session.expiry = new Date()
    await em.save(session)
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
