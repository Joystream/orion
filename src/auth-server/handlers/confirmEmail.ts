import express from 'express'
import { BadRequestError } from '../errors'
import { components } from '../generated/api-types'
import { globalEm } from '../../utils/globalEm'
import { Token } from '../../model'
import { MoreThan } from 'typeorm'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ConfirmEmailRequestData']

export const confirmEmail: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { token: tokenId } = req.body
    const em = await globalEm

    await em.transaction(async (em) => {
      const token = await em.getRepository(Token).findOne({
        where: { id: tokenId, expiry: MoreThan(new Date()) },
        relations: { issuedFor: true },
      })

      if (!token) {
        throw new BadRequestError('Token not found. Possibly expired or already used.')
      }

      const account = token.issuedFor
      account.isEmailConfirmed = true
      await em.save(account)
      await em.remove(token)
      res.status(200).json({ success: true })
    })
  } catch (e) {
    next(e)
  }
}
