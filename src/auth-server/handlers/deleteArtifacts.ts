import express from 'express'
import { globalEm } from '../../utils/globalEm'
import { EncryptionArtifacts } from '../../model'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'
import { UnauthorizedError, NotFoundError } from '../errors'

type ReqParams = Record<string, string>
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ResLocals = { authContext: AuthContext }

export const deleteArtifacts: (
  req: express.Request<ReqParams, ResBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const em = await globalEm
    if (!res.locals.authContext.account) {
      throw new UnauthorizedError('Not logged in to an account.')
    }
    const encryptionArtifacts = await em.getRepository(EncryptionArtifacts).findOneBy({
      accountId: res.locals.authContext.account.id,
    })
    if (!encryptionArtifacts) {
      throw new NotFoundError('No encryption artifacts associated with the account found.')
    }
    await em.remove(encryptionArtifacts)
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
