import express from 'express'
import { Account, BlockchainAccount, EncryptionArtifacts, Session } from '../../model'
import { globalEm } from '../../utils/globalEm'
import { BadRequestError, ConflictError, UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'
import { verifyActionExecutionRequest } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ChangeAccountRequestData']
type ResLocals = { authContext: Session }

export const changeAccount: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { payload } = req.body
    const { authContext } = res.locals

    if (!authContext.account) {
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
        where: { joystreamAccountId: payload.joystreamAccountId },
      })

      if (existingGatewayAccount && existingGatewayAccount.id !== account.id) {
        throw new ConflictError(
          'Provided account is already assigned to some other gateway account.'
        )
      }

      // Create the given blockchain account if it doesn't exist
      await em.upsert(BlockchainAccount, { id: payload.joystreamAccountId }, ['id'])

      await em.update(
        Account,
        { id: account.id },
        { joystreamAccountId: payload.joystreamAccountId }
      )

      console.log('after update')

      // Remove the old encryption artifacts
      await em.delete(EncryptionArtifacts, { accountId: account.id })

      // Optionally save new encryption artifacts
      if (payload.newArtifacts) {
        // We don't check if artifacts already exist by this id, because that opens up
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
