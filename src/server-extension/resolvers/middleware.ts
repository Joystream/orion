import { MiddlewareFn, UnauthorizedError } from 'type-graphql'
import { Context } from '../check'

export const OperatorOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.user.isRoot) {
    throw new UnauthorizedError()
  }
  return next()
}

export const AccountOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (context.account === null) {
    throw new UnauthorizedError()
  }

  return next()
}
