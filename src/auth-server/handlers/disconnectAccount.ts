import express from 'express'
import { components } from '../generated/api-types'
import { UnauthorizedError, NotFoundError, BadRequestError } from '../errors'
import { AuthContext } from '../../utils/auth'
import { globalEm } from '../../utils/globalEm'
import { ConnectedAccount } from '../../model'
import { verifyActionExecutionRequest } from '../utils'

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
      body: { payload },
    } = req
    const {
      locals: { authContext },
    } = res

    if (!authContext?.account) {
      throw new UnauthorizedError()
    }

    const { account } = authContext
    const em = await globalEm

    const existingConnectedAccount = await em.findOne(ConnectedAccount, {
      where: { id: payload.joystreamAccountId },
    })

    if (!existingConnectedAccount) {
      throw new NotFoundError(
        'Provided Joystream account is not connected to this gateway account.'
      )
    }

    await verifyActionExecutionRequest(em, req.body)

    if (payload.gatewayAccountId !== account.id) {
      throw new BadRequestError('Invalid gateway account id provided in payload.')
    }

    if (payload.action !== 'disconnect') {
      throw new BadRequestError('Invalid action.')
    }

    await em.remove(existingConnectedAccount)

    res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
}
