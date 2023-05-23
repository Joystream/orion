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

export const getArtifacts: (
  req: express.Request<ReqParams, ResBody, ReqBody, ReqQuery>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const em = await globalEm
    const { id, email } = req.query
    const artifacts = await em
      .getRepository(EncryptionArtifacts)
      .createQueryBuilder('ea')
      .select('ea')
      .innerJoin('ea.account', 'a', 'a.email = :email', { email })
      .where('ea.id = :id', { id })
      .getOne()
    if (!artifacts) {
      throw new NotFoundError('Artifacts not found by provided id (lookupKey)')
    }
    const { cipherIv, encryptedSeed } = artifacts
    res.status(200).json({
      id,
      cipherIv,
      encryptedSeed,
    })
  } catch (e) {
    next(e)
  }
}
