import { MiddlewareFn, UnauthorizedError } from 'type-graphql'
import { Context } from '@subsquid/openreader/lib/context'

export const OperatorOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!process.env.OPERATOR_SECRET) {
    throw new Error('API method disabled, operator secret not set.')
  }
  if (context.req.headers['x-operator-secret'] !== process.env.OPERATOR_SECRET) {
    throw new UnauthorizedError()
  }
  return next()
}
