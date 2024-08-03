import express from 'express'
import { MoreThan } from 'typeorm'
import {
  Account,
  BlockchainAccount,
  EmailConfirmationToken,
  EncryptionArtifacts,
  NextEntityId,
  Session,
} from '../../model'
import { globalEm } from '../../utils/globalEm'
import { idStringFromNumber } from '../../utils/misc'
import { defaultNotificationPreferences } from '../../utils/notification/helpers'
import { BadRequestError, ConflictError, NotFoundError } from '../errors'
import { components } from '../generated/api-types'
import { verifyActionExecutionRequest } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['CreateAccountRequestData']
type ResLocals = { authContext: Session }

export const createAccount: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const {
      payload: { email, emailConfirmationToken, joystreamAccountId },
    } = req.body
    const { authContext } = res.locals
    const em = await globalEm

    if (authContext.account) {
      throw new BadRequestError('Already logged in to an account.')
    }

    const token = await em.getRepository(EmailConfirmationToken).findOne({
      where: { id: emailConfirmationToken, email, expiry: MoreThan(new Date()) },
    })

    if (!token) {
      throw new NotFoundError('Token not found. Possibly expired or already used.')
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

      // TODO: Don't reveal whether an account with the given email exists, to prevent email enumeration attacks
      // ! Not needed, as the token is already checked for existence, and is not expired
      // const existingByEmail = await em.getRepository(Account).findOneBy({ email })
      // if (existingByEmail) {
      //   throw new ConflictError('Account with the provided e-mail address already exists.')
      // }

      // Create the given blockchain account if it doesn't exist
      await em.upsert(BlockchainAccount, { id: joystreamAccountId }, ['id'])

      const existingByJoystreamAccountId = await em
        .getRepository(Account)
        .findOneBy({ joystreamAccountId })
      if (existingByJoystreamAccountId) {
        throw new ConflictError(
          'Account with the provided joystream account address already exists.'
        )
      }

      // Create the account
      const account = new Account({
        id: idStringFromNumber(nextAccountId),
        email,
        registeredAt: new Date(),
        isBlocked: false,
        userId: authContext.user.id,
        joystreamAccountId: joystreamAccountId,
        notificationPreferences: defaultNotificationPreferences(),
      })

      // Mark the token as used
      token.expiry = new Date()

      await em.save([
        account,
        new NextEntityId({ entityName: 'Account', nextId: nextAccountId + 1 }),
        token,
      ])

      if (req.body.payload.encryptionArtifacts) {
        const { cipherIv, encryptedSeed, id: lookupKey } = req.body.payload.encryptionArtifacts
        // We don't check if artifacts already exist by this id, becasue that opens up
        // a brute-force attack vector. Instead, in this case the existing artifacts will
        // be overwritten.
        const encryptionArtifacts = new EncryptionArtifacts({
          id: lookupKey,
          accountId: account.id,
          cipherIv,
          encryptedSeed,
        })
        await em.save(encryptionArtifacts)
      }
    })
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
