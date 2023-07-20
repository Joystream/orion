import { MiddlewareFn } from 'type-graphql'
import { Context } from '../check'

export const OperatorOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.user.isRoot) {
    throw new Error('Unauthorized: Root access required')
  }
  return next()
}

export const AccountOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (context.account === null) {
    throw new Error('Unauthorized: Account required')
  }

  return next()
}
