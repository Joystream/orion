import express from 'express'
import cors from 'cors'
import * as OpenApiValidator from 'express-openapi-validator'
import { HttpError } from 'express-openapi-validator/dist/framework/types'
import path from 'path'
import { AuthApiError } from './errors'
import { createLogger } from '@subsquid/logger'

export const logger = createLogger('auth-api')

const app = express()

app.use(express.json())
app.use(cors())
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, 'openapi.yml'),
    operationHandlers: path.join(__dirname, 'handlers'),
  })
)

// TODO: Logging

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }
  logger.error(String(err))
  const message =
    err instanceof HttpError || err instanceof AuthApiError ? err.message : 'Internal server error'
  const status = err instanceof HttpError || err instanceof AuthApiError ? err.status : 500
  res.status(status).json({ message })
})

const port = parseInt(process.env.AUTH_API_PORT || '4704')
app.listen(port, () => logger.info(`Listening on port ${port}`))
