import express from 'express'
import cors from 'cors'
import * as OpenApiValidator from 'express-openapi-validator'
import { HttpError } from 'express-openapi-validator/dist/framework/types'
import path from 'path'
import { AuthApiError } from './errors'
import { createLogger } from '@subsquid/logger'
import { authenticate, getCorsOrigin } from '../utils/auth'
import cookieParser from 'cookie-parser'
import { applyRateLimits, globalRateLimit, rateLimitsPerRoute } from './rateLimits'
import swaggerUi, { JsonObject } from 'swagger-ui-express'
import YAML from 'js-yaml'
import fs from 'fs'

export const logger = createLogger('auth-api')

export const app = express()

function authHandler(type: 'header' | 'cookie') {
  return async (req: express.Request) => {
    const authContext = await authenticate(req, type)
    if (req.res) {
      req.res.locals.authContext = authContext
    }
    return true
  }
}

logger.info('Starting auth server')
app.set('trust proxy', process.env.TRUST_PROXY || false)
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json())
app.use(
  cors({
    origin: getCorsOrigin(),
    credentials: true,
  })
)
applyRateLimits(app, globalRateLimit, rateLimitsPerRoute)
if (process.env.OPENAPI_PLAYGROUND === 'true' || process.env.OPENAPI_PLAYGROUND === '1') {
  const spec = YAML.load(
    fs.readFileSync(path.join(__dirname, 'openapi.yml')).toString()
  ) as JsonObject
  logger.info('Running playground at /playground')
  console.log('Spec', spec)
  app.use('/playground', swaggerUi.serve, swaggerUi.setup(spec))
}
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, 'openapi.yml'),
    operationHandlers: path.join(__dirname, 'handlers'),
    validateSecurity: {
      handlers: {
        bearerAuth: authHandler('header'),
        cookieAuth: authHandler('cookie'),
      },
    },
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
