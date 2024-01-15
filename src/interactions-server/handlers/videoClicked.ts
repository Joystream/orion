import express from 'express'
import { BadRequestError, TooManyRequestsError, UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'
import { recommendationServiceManager } from '../../utils/RecommendationServiceManager'
import { singleClickLimiter } from '../interactionsLimiter'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ItemClickInteractionRequestData']
type ResLocals = { authContext: AuthContext }

export const videoClicked: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { authContext: session } = res.locals
    const { itemId, duration, recommId } = req.body

    if (!session || !session.userId || session.expiry.getTime() < Date.now()) {
      throw new UnauthorizedError('Session unavailable or expired')
    }

    if (!itemId) {
      throw new BadRequestError('Request missing item id')
    }

    const isBlocked = await singleClickLimiter.limit(`${itemId}:${session.userId}-video`)

    if (isBlocked) {
      throw new TooManyRequestsError('Too many requests')
    }

    await recommendationServiceManager.scheduleClickEvent(
      itemId,
      session.userId,
      duration,
      recommId
    )

    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
