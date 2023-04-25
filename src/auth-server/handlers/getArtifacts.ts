import express from 'express'
import { NotFoundError } from '../errors'
import { globalEm } from '../../utils/globalEm'
import { EncryptionArtifacts } from '../../model'
import { components, operations } from '../generated/api-types'

type ReqParams = Record<string, unknown>
type ReqBody = unknown
type ReqQuery = operations['getArtifacts']['parameters']['query']
type ResBody =
  | components['schemas']['EncryptionArtifacts']
  | components['schemas']['GenericErrorResponseData']

// TODO: Rate limiting, also for other endpoints
export const getArtifacts: (
  req: express.Request<ReqParams, ResBody, ReqBody, ReqQuery>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const em = await globalEm
    const { id } = req.query
    const artifacts = await em.getRepository(EncryptionArtifacts).findOneBy({ id })
    if (!artifacts) {
      throw new NotFoundError('Artifacts not found by provided id (lookupKey)')
    }
    res.status(200).json(artifacts)
  } catch (e) {
    next(e)
  }
}
