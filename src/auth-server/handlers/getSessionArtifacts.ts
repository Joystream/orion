import express from 'express'
import { NotFoundError, UnauthorizedError } from '../errors'
import { globalEm } from '../../utils/globalEm'
import { SessionEncryptionArtifacts } from '../../model'
import { components } from '../generated/api-types'
import { AuthContext } from '../../utils/auth'

type ReqParams = Record<string, unknown>
type ResBody =
  | components['schemas']['SessionEncryptionArtifacts']
  | components['schemas']['GenericErrorResponseData']
type ResLocals = { authContext: AuthContext }

export const getSessionArtifacts: (
  req: express.Request<ReqParams, ResBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const em = await globalEm
    const { authContext: session } = res.locals
    if (!session?.account) {
      throw new UnauthorizedError('Cannot get session artifacts for anonymous session')
    }
    const artifacts = await em
      .getRepository(SessionEncryptionArtifacts)
      .findOneBy({ sessionId: session.id })
    if (!artifacts) {
      throw new NotFoundError('Encryption artifacts assiocated with the current session not found')
    }
    const { cipherIv, cipherKey } = artifacts
    res.status(200).json({ cipherIv, cipherKey })
  } catch (e) {
    next(e)
  }
}
