import { MiddlewareFn, UnauthorizedError } from 'type-graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { Request } from 'express'

export function isOperatorRequest(req: Request): boolean | null {
  if (!process.env.OPERATOR_SECRET) {
    return null
  }
  if (req.headers['x-operator-secret'] === process.env.OPERATOR_SECRET) {
    return true
  }

  return false
}

export const OperatorOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  const isOperator = isOperatorRequest(context.req)
  if (isOperator === null) {
    throw new Error('API method disabled, operator secret not set.')
  }
  if (!isOperator) {
    throw new UnauthorizedError()
  }
  return next()
}
