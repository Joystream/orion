import express from 'express'
import { BadRequestError, UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'
import { recommendationServiceManager } from '../../utils/RecommendationServiceManager'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ItemRateInteractionRequestData']
type ResLocals = { authContext: AuthContext }

export const rateVideo: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { authContext: session } = res.locals
    const { itemId, rating, recommId } = req.body

    if (!session || !session.userId || session.expiry.getTime() < Date.now()) {
      throw new UnauthorizedError('Session unavailable or expired')
    }

    if (!itemId || !rating) {
      throw new BadRequestError('Request missing parameters')
    }

    recommendationServiceManager.scheduleItemRating(
      `${itemId}-video`,
      session.userId,
      rating,
      recommId
    )

    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
