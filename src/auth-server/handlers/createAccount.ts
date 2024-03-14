import express from 'express'
import { Account, EncryptionArtifacts, Membership, NextEntityId } from '../../model'
import { AuthContext } from '../../utils/auth'
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
type ResLocals = { authContext: AuthContext }

export const createAccount: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const {
      payload: { email, memberId, joystreamAccountId },
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

      const existingByEmail = await em.getRepository(Account).findOneBy({ email })
      if (existingByEmail) {
        throw new ConflictError('Account with the provided e-mail address already exists.')
      }

      const existingByMemberId = await em
        .getRepository(Account)
        .findOneBy({ membershipId: memberId })
      if (existingByMemberId) {
        throw new ConflictError('Account with the provided member id already exists.')
      }

      const existingByJoystreamAccountId = await em
        .getRepository(Account)
        .findOneBy({ joystreamAccount: joystreamAccountId })
      if (existingByJoystreamAccountId) {
        throw new ConflictError(
          'Account with the provided joystream account address already exists.'
        )
      }

      const membership = await em.getRepository(Membership).findOneBy({ id: memberId })
      if (!membership) {
        throw new NotFoundError(`Membership not found by id: ${memberId}`)
      }

      if (membership.controllerAccount !== joystreamAccountId) {
        throw new BadRequestError(
          `Provided joystream account address doesn't match the controller account of the provided membership.`
        )
      }

      const notificationPreferences = defaultNotificationPreferences()
      const account = new Account({
        id: idStringFromNumber(nextAccountId),
        email,
        isEmailConfirmed: false,
        registeredAt: new Date(),
        isBlocked: false,
        userId: authContext?.user.id,
        joystreamAccount: joystreamAccountId,
        membershipId: memberId.toString(),
        notificationPreferences,
        referrerChannelId: null,
      })

      await em.save([
        account,
        new NextEntityId({ entityName: 'Account', nextId: nextAccountId + 1 }),
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
