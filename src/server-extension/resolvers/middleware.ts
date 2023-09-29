import { MiddlewareFn } from 'type-graphql'
import { Context } from '../check'

export const OperatorOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context?.user.isRoot) {
    throw new Error('Unauthorized: Root access required')
  }
  return next()
}

export const AccountOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context?.account) {
    throw new Error('Unauthorized: Account required')
  }

  return next()
}

export const UserOnly: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context?.user) {
    throw new Error('Unauthorized: User required')
  }

  return next()
}
