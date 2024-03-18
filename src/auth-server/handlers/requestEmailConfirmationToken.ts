import express from 'express'
import { MoreThan } from 'typeorm'
import { Account, EmailConfirmationToken, Session } from '../../model'
import { ConfigVariable, config } from '../../utils/config'
import { globalEm } from '../../utils/globalEm'
import { BadRequestError, TooManyRequestsError } from '../errors'
import { components } from '../generated/api-types'
import { sendLoginOrChangePasswordEmail, sendWelcomeEmail } from '../utils'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['RequestTokenRequestData']
type ResLocals = { authContext: Session }

export const requestEmailConfirmationToken: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { email } = req.body
    const { authContext } = res.locals

    if (authContext.account) {
      throw new BadRequestError('Already logged in to an account.')
    }

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

      const tokensInTimeframeCount = await em.getRepository(EmailConfirmationToken).count({
        where: {
          email,
          issuedAt: MoreThan(
            new Date(Date.now() - emailConfirmationTokenExpiryTimeHours * 3600 * 1000)
          ),
        },
      })

      if (tokensInTimeframeCount >= emailConfirmationTokenRateLimit) {
        throw new TooManyRequestsError()
      }

      // Deactivate all currently active email confirmation tokens for this email
      await em
        .getRepository(EmailConfirmationToken)
        .update({ email, expiry: MoreThan(new Date()) }, { expiry: new Date() })

      // Send email with verification token if Gateway account does not exist.
      // Otherwise, send email to asking user to login/change password. but
      // the API response should be the same to avoid email enumeration attack.
      account ? await sendLoginOrChangePasswordEmail(email, em) : await sendWelcomeEmail(email, em)
    })

    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
