import express from 'express'
import { components } from '../generated/api-types'
import { UnauthorizedError, BadRequestError } from '../errors'
import { AuthContext } from '../../utils/auth'
import { globalEm } from '../../utils/globalEm'
import { ConnectedAccountProof, ConnectedAccount } from '../../model'
import { uniqueId } from '../../utils/crypto'
import { verifyConnectOrDisconnectAccountPayload } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ConnectOrDisconnectAccountRequestData']
type ResLocals = { authContext: AuthContext }

export const connectAccount: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const {
      body: { payload, signature },
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

    if (existingConnectedAccount) {
      throw new BadRequestError('Provided account is already connected to a gateway account.')
    }

    await verifyConnectOrDisconnectAccountPayload(em, payload, account, signature)

    if (payload.action !== 'connect') {
      throw new BadRequestError('Invalid action.')
    }

    const proof = new ConnectedAccountProof({
      id: uniqueId(),
      signature,
      timestamp: new Date(payload.timestamp),
      gatewayAppName: payload.gatewayName,
    })

    const connectedAccount = new ConnectedAccount({
      id: payload.joystreamAccountId,
      accountId: account.id,
      connectedAt: new Date(),
      proofId: proof.id,
    })

    await em.save([proof, connectedAccount])

    res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
}
