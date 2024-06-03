import express from 'express'
import { BadRequestError, TooManyRequestsError, UnauthorizedError } from '../errors'
import { singleClickLimiter } from '../interactionsLimiter'
import {
  RecommendationServiceManager,
  recommendationServiceManager,
} from '../../utils/RecommendationServiceManager'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'
import { DetailViewModel } from '../interactionsEm'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ItemClickInteractionRequestData']
type ResLocals = { authContext: AuthContext }

export const channelClicked = async (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => {
  try {
    const { authContext: session } = res.locals
    const { itemId, duration } = req.body

    if (!session || !session.userId || session.expiry.getTime() < Date.now()) {
      throw new UnauthorizedError('Session unavailable or expired')
    }

    if (!itemId) {
      throw new BadRequestError('Request missing item id')
    }

    const isBlocked = await singleClickLimiter.limit(`${itemId}:${session.userId}-channel`)

    if (isBlocked) {
      throw new TooManyRequestsError('Too many requests')
    }

    const row = new DetailViewModel({
      itemId: `${itemId}-channel`,
      timestamp: new Date(),
      userId: recommendationServiceManager.mapUserId(session.userId),
      duration,
    })
    await row.save()

    // recommendationServiceManager.scheduleClickEvent(
    //   `${itemId}-channel`,
    //   session.userId,
    //   duration,
    //   recommId
    // )

    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
