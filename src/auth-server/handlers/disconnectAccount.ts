import express from 'express'
import { components } from '../generated/api-types'
import { UnauthorizedError, NotFoundError } from '../errors'
import { AuthContext } from '../../utils/auth'
import { globalEm } from '../../utils/globalEm'
import { ConnectedAccount } from '../../model'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['DisconnectAccountRequestData']
type ResLocals = { authContext: AuthContext }

export const disconnectAccount: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const {
      body: { joystreamAccountId },
    } = req
    const {
      locals: { authContext },
    } = res

    if (!authContext?.account) {
      throw new UnauthorizedError()
    }

    const em = await globalEm

    const existingConnectedAccount = await em.findOne(ConnectedAccount, {
      where: { id: joystreamAccountId },
    })

    if (!existingConnectedAccount) {
      throw new NotFoundError(
        'Provided Joystream account is not connected to this gateway account.'
      )
    }

    await em.remove(existingConnectedAccount)

    res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
}
