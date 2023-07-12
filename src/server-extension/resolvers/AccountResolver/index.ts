import 'reflect-metadata'
import { Query, Resolver, UseMiddleware, Ctx, Info } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { AccountData, FollowedChannel } from './types'
import { Context } from '../../check'
import { GraphQLResolveInfo } from 'graphql'
import assert from 'assert'
import { withHiddenEntities } from '../../../utils/sql'
import { ChannelFollow } from '../../../model'

@Resolver()
export class AccountResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @UseMiddleware(AccountOnly)
  @Query(() => AccountData)
  async accountData(@Info() info: GraphQLResolveInfo, @Ctx() ctx: Context): Promise<AccountData> {
    const account = ctx.account
    const em = await this.em()
    assert(account, 'Unexpected context: account is not set')
    const { id, email, joystreamAccount, membershipId, isEmailConfirmed } = account
    let followedChannels: FollowedChannel[] = []
    if (
      info.fieldNodes[0].selectionSet?.selections.some(
        (s) => s.kind === 'Field' && s.name.value === 'followedChannels'
      )
    ) {
      followedChannels = await withHiddenEntities(em, async () => {
        const followedChannels = await em
          .getRepository(ChannelFollow)
          .findBy({ userId: account.userId })
        return followedChannels.map(({ channelId, timestamp }) => ({
          channelId,
          timestamp: timestamp.toISOString(),
        }))
      })
    }

    return {
      id,
      email,
      joystreamAccount,
      membershipId,
      isEmailConfirmed,
      followedChannels,
    }
  }
}
