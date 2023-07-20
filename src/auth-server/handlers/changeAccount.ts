import express from 'express'
import { components } from '../generated/api-types'
import { UnauthorizedError, BadRequestError, ConflictError } from '../errors'
import { AuthContext } from '../../utils/auth'
import { globalEm } from '../../utils/globalEm'
import { Account, EncryptionArtifacts } from '../../model'
import { verifyActionExecutionRequest } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ChangeAccountRequestData']
type ResLocals = { authContext: AuthContext }

export const changeAccount: (
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

    await verifyActionExecutionRequest(em, req.body)

    if (payload.gatewayAccountId !== account.id) {
      throw new BadRequestError('Invalid gateway account id provided in payload.')
    }

    await em.transaction(async (em) => {
      const existingGatewayAccount = await em.findOne(Account, {
        where: { joystreamAccount: payload.joystreamAccountId },
      })

      if (existingGatewayAccount && existingGatewayAccount.id !== account.id) {
        throw new ConflictError(
          'Provided account is already assigned to some other gateway account.'
        )
      }

      // Update the assigned blockchain account
      await em.update(Account, { id: account.id }, { joystreamAccount: payload.joystreamAccountId })

      // Remove the old encryption artifacts
      await em.delete(EncryptionArtifacts, { accountId: account.id })

      // Optionally save new encryption artifacts
      if (payload.newArtifacts) {
        // We don't check if artifacts already exist by this id, becasue that opens up
        // a brute-force attack vector. Instead, in this case the existing artifacts will
        // be overwritten.
        await em.save(EncryptionArtifacts, {
          accountId: account.id,
          ...payload.newArtifacts,
        })
      }
    })

    res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
}
