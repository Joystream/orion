import express from 'express'
import { globalEm } from '../../utils/globalEm'
import { EncryptionArtifacts } from '../../model'
import { components } from '../generated/api-types'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['EncryptionArtifacts']

// TODO: Rate limiting, also for other endpoints
export const postArtifacts: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const em = await globalEm
    const { encryptedSeed, cipherIv, id } = req.body
    const encryptionArtifacts = new EncryptionArtifacts({
      id,
      cipherIv,
      encryptedSeed,
    })
    await em.save(encryptionArtifacts)
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
