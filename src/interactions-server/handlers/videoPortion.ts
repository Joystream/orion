import express from 'express'
import { BadRequestError, UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'
import { recommendationServiceManager } from '../../utils/RecommendationServiceManager'
import { PurchaseModel, VideoPortionModel } from '../interactionsEm'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['ItemPortionInteractionRequestData']
type ResLocals = { authContext: AuthContext }

export const videoPortion: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { authContext: session } = res.locals
    const { itemId, portion, recommId } = req.body

    if (!session || !session.userId || session.expiry.getTime() < Date.now()) {
      throw new UnauthorizedError('Session unavailable or expired')
    }

    if (!itemId || !portion) {
      throw new BadRequestError('Request missing parameters')
    }

    const row = new VideoPortionModel({
      itemId: `${itemId}-video`,
      timestamp: new Date(),
      userId: recommendationServiceManager.mapUserId(session.userId),
      portion,
    })
    await row.save()

    // recommendationServiceManager.scheduleViewPortion(
    //   `${itemId}-video`,
    //   session.userId,
    //   portion,
    //   recommId
    // )

    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
