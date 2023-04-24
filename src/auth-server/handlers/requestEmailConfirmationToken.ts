import express from 'express'
import { NotFoundError, TooManyRequestsError, BadRequestError } from '../errors'
import { components } from '../generated/api-types'
import { globalEm } from '../../utils/globalEm'
import { Account, Token, TokenType } from '../../model'
import { MoreThan } from 'typeorm'
import { ConfigVariable, config } from '../../utils/config'
import { sendWelcomeEmail } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['RequestTokenRequestData']

export const requestEmailConfirmationToken: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { email } = req.body

    const em = await globalEm

    await em.transaction(async (em) => {
      const emailConfirmationTokenExpiryTimeHours = await config.get(
        ConfigVariable.EmailConfirmationTokenExpiryTimeHours,
        em
      )
      const emailConfirmationTokenRateLimit = await config.get(
        ConfigVariable.EmailConfirmationTokenRateLimit,
        em
      )

      const account = await em.getRepository(Account).findOne({
        where: { email },
        lock: { mode: 'pessimistic_write' },
      })

      if (!account) {
        throw new NotFoundError('Account not found')
      }

      if (account.isEmailConfirmed) {
        throw new BadRequestError('Email already confirmed')
      }

      const tokensInTimeframeCount = await em.getRepository(Token).count({
        where: {
          issuedForId: account.id,
          type: TokenType.EMAIL_CONFIRMATION,
          issuedAt: MoreThan(
            new Date(Date.now() - emailConfirmationTokenExpiryTimeHours * 3600 * 1000)
          ),
        },
      })

      if (tokensInTimeframeCount >= emailConfirmationTokenRateLimit) {
        throw new TooManyRequestsError()
      }

      // Deactivate all currently active email confirmation tokens for this account
      await em.getRepository(Token).update(
        {
          issuedForId: account.id,
          type: TokenType.EMAIL_CONFIRMATION,
          expiry: MoreThan(new Date()),
        },
        { expiry: new Date() }
      )

      await sendWelcomeEmail(account, em)
    })

    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
