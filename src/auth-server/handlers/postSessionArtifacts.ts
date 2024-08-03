import express from 'express'
import { Session, SessionEncryptionArtifacts } from '../../model'
import { uniqueId } from '../../utils/crypto'
import { globalEm } from '../../utils/globalEm'
import { ConflictError, UnauthorizedError } from '../errors'
import { components } from '../generated/api-types'

type ReqParams = Record<string, string>
type ReqBody = components['schemas']['SessionEncryptionArtifacts']
type ResBody =
  | components['schemas']['GenericOkResponseData']
  | components['schemas']['GenericErrorResponseData']
type ResLocals = { authContext: Session }

export const postSessionArtifacts: (
  req: express.Request<ReqParams, ResBody, ReqBody>,
  res: express.Response<ResBody, ResLocals>,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const { authContext: session } = res.locals
    const em = await globalEm
    if (!session?.id) {
      throw new UnauthorizedError('Cannot save session artifacts for empty session')
    }
    const existingArtifacts = await em
      .getRepository(SessionEncryptionArtifacts)
      .findOneBy({ sessionId: session.id })
    if (!session?.account) {
      throw new UnauthorizedError('Cannot save session artifacts for anonymous session')
    }
    if (existingArtifacts) {
      throw new ConflictError('Session artifacts already saved')
    }
    const { cipherKey, cipherIv } = req.body
    const sessionEncryptionArtifacts = new SessionEncryptionArtifacts({
      id: uniqueId(),
      cipherIv,
      cipherKey,
      sessionId: session.id,
    })
    await em.save(sessionEncryptionArtifacts)
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
}
