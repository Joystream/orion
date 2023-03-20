import express from 'express'
import { BadRequestError } from '../errors'
import { components } from '../generated/api-types'
import { globalEm } from '../../utils/globalEm'
import { Account, NextEntityId, Token, TokenType } from '../../model'
import { config, ConfigVariable } from '../../utils/config'
import { genSalt, hash } from 'bcryptjs'
import { AuthContext } from '../../utils/auth'
import { idStringFromNumber } from '../../utils/misc'
import { sendMail } from '../../utils/mail'
import { registerEmailData } from '../emails'
import { uniqueId } from '../../utils/crypto'
import { EntityManager } from 'typeorm'
import { formatDate } from '../../utils/date'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['RegisterRequestData']
type ResLocals = { authContext: AuthContext }

async function issueEmailConfirmationToken(account: Account, em: EntityManager): Promise<Token> {
  const issuedAt = new Date()
  const lifetimeMs =
    (await config.get(ConfigVariable.EmailConfirmationTokenExpiryTimeHours, em)) * 3_600_000
  const expiry = new Date(issuedAt.getTime() + lifetimeMs)
  const token = new Token({
    id: uniqueId(),
    type: TokenType.EMAIL_CONFIRMATION,
    expiry,
    issuedAt,
    issuedForId: account.id,
  })
  return em.save(token)
}

export const register: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { authContext } = res.locals
    const em = await globalEm

    if (authContext?.account) {
      throw new BadRequestError('Already logged in to an account.')
    }

    await em.transaction(async (em) => {
      // Get and lock next account id
      const nextAccountId =
        (
          await em
            .getRepository(NextEntityId)
            .findOne({ where: { entityName: 'Account' }, lock: { mode: 'pessimistic_write' } })
        )?.nextId || 1

      const existingAcc = await em.getRepository(Account).findOneBy({ email })

      if (existingAcc) {
        throw new BadRequestError('Account with the provided e-mail address already exists.')
      }

      const bcryptSaltRounds = await config.get(ConfigVariable.BCryptSaltRounds, em)

      const salt = await genSalt(bcryptSaltRounds)
      const account = new Account({
        id: idStringFromNumber(nextAccountId),
        email,
        isEmailConfirmed: false,
        paswordHash: await hash(password, salt),
        registeredAt: new Date(),
        isBlocked: false,
        userId: authContext.user.id,
      })

      await em.save(account)
      await em.save(new NextEntityId({ entityName: 'Account', nextId: nextAccountId + 1 }))

      const emailConfirmationToken = await issueEmailConfirmationToken(account, em)
      const appName = await config.get(ConfigVariable.AppName, em)
      const confirmEmailRoute = await config.get(ConfigVariable.EmailConfirmationRoute, em)
      const emailConfirmationLink = confirmEmailRoute.replace('{token}', emailConfirmationToken.id)
      await sendMail({
        from: await config.get(ConfigVariable.SendgridFromEmail, em),
        to: email,
        ...registerEmailData({
          link: emailConfirmationLink,
          linkExpiryDate: formatDate(emailConfirmationToken.expiry),
          appName,
        }),
      })
      res.status(200).json({ success: true })
    })
  } catch (e) {
    next(e)
  }
}
