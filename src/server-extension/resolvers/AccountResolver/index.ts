import 'reflect-metadata'
import { Query, Resolver, UseMiddleware, Ctx } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { AccountData } from './types'
import { Context } from '../../check'
import { ConnectedAccount, Membership } from '../../../model'
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
    const em = await this.em()
    const connectedAccounts = await em.findBy(ConnectedAccount, { accountId: account.id })
    const connectedAccountsData = await Promise.all(
      connectedAccounts.map(async ({ id, isLoginAllowed }) => {
        const membershipIdsRaw = await em
          .getRepository(Membership)
          .createQueryBuilder('m')
          .select('m.id', 'id')
          .where('m.controllerAccount = :id', { id })
          .getRawMany<{ id: string }>()
        return {
          address: id,
          isLoginAllowed,
          membershipIds: membershipIdsRaw.map(({ id }) => id),
        }
      })
    )
    const { email } = account
    return {
      email,
      connectedAccounts: connectedAccountsData,
    }
  }
}
