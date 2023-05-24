import 'reflect-metadata'
import { Query, Resolver, UseMiddleware, Ctx } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { AccountData } from './types'
import { Context } from '../../check'
import assert from 'assert'

@Resolver()
export class AccountResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @UseMiddleware(AccountOnly)
  @Query(() => AccountData)
  async accountData(@Ctx() ctx: Context): Promise<AccountData> {
    const account = ctx.account
    assert(account, 'Unexpected context: account is not set')
    const { id, email, joystreamAccount, membershipId, isEmailConfirmed } = account
    return {
      id,
      email,
      joystreamAccount,
      membershipId,
      isEmailConfirmed,
    }
  }
}
