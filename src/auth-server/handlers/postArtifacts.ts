import express from 'express'
import { AuthApiError } from '../errors'

export const postArtifacts: (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
  return next(new AuthApiError('Unimplemented', 501))
}
