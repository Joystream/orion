import express from 'express'
import { globalEm } from '../../utils/globalEm'
import { EncryptionArtifacts } from '../../model'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'
import { ConflictError, UnauthorizedError } from '../errors'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ReqBody = components['schemas']['EncryptionArtifacts']
type ResLocals = { authContext: AuthContext }

export const postArtifacts: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const em = await globalEm
    const { encryptedSeed, cipherIv, id } = req.body
    const { authContext } = res.locals
    if (!authContext.account) {
      throw new UnauthorizedError('Not logged in to an account.')
    }
    const accountArtifacts = await em.getRepository(EncryptionArtifacts).findOneBy({
      accountId: authContext.account.id,
    })
    if (accountArtifacts) {
      throw new ConflictError('Encryption artifacts for the account already exist.')
    }
    const existingArtifacts = await em.getRepository(EncryptionArtifacts).findOneBy({ id })
    if (existingArtifacts) {
      throw new ConflictError('Encryption artifacts with the provided id already exist.')
    }
    const encryptionArtifacts = new EncryptionArtifacts({
      id,
      accountId: authContext.account.id,
      cipherIv,
      encryptedSeed,
    })
    await em.save(encryptionArtifacts)
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
