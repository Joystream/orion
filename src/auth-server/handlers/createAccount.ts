import express from 'express'
import { BadRequestError, ConflictError } from '../errors'
import { components } from '../generated/api-types'
import { globalEm } from '../../utils/globalEm'
import { Account, EncryptionArtifacts, NextEntityId } from '../../model'
import { AuthContext } from '../../utils/auth'
import { idStringFromNumber } from '../../utils/misc'
import { connectAccount, verifyActionExecutionRequest } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['CreateAccountRequestData']
type ResLocals = { authContext: AuthContext }

export const createAccount: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const {
      payload: { email },
    } = req.body
    const { authContext } = res.locals
    const em = await globalEm

    if (authContext?.account) {
      throw new BadRequestError('Already logged in to an account.')
    }

    await verifyActionExecutionRequest(em, req.body)

    await em.transaction(async (em) => {
      // Get and lock next account id
      // FIXME: For some reason this doesn't work as expected without the parseInt!
      // (returns `nextId` as a string instead of a number)
      const nextAccountId = parseInt(
        (
          await em
            .getRepository(NextEntityId)
            .findOne({ where: { entityName: 'Account' }, lock: { mode: 'pessimistic_write' } })
        )?.nextId.toString() || '1'
      )

      const existingAcc = await em.getRepository(Account).findOneBy({ email })

      if (existingAcc) {
        throw new ConflictError('Account with the provided e-mail address already exists.')
      }

      const account = new Account({
        id: idStringFromNumber(nextAccountId),
        email,
        isEmailConfirmed: false,
        registeredAt: new Date(),
        isBlocked: false,
        userId: authContext.user.id,
      })

      await em.save([
        account,
        new NextEntityId({ entityName: 'Account', nextId: nextAccountId + 1 }),
      ])

      if (req.body.payload.encryptionArtifacts) {
        const { cipherIv, encryptedSeed, id: lookupKey } = req.body.payload.encryptionArtifacts
        const exisitingEncryptionArtifacts = await em
          .getRepository(EncryptionArtifacts)
          .findOneBy({ id: lookupKey })
        if (exisitingEncryptionArtifacts) {
          throw new ConflictError('Encryption artifacts with the provided id already exist.')
        }
        const encryptionArtifacts = new EncryptionArtifacts({
          id: lookupKey,
          accountId: account.id,
          cipherIv,
          encryptedSeed,
        })
        await em.save(encryptionArtifacts)
      }

      await connectAccount(em, account, req.body)
    })
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
