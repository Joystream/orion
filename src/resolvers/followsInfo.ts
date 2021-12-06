import { Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'
import { UnsequencedChannelEvent, ChannelEventType, saveChannelEvent } from '../models/ChannelEvent'
import { OrionContext } from '../types'

@ArgsType()
class ChannelFollowsArgs {
  @Field(() => ID)
  channelId: string
}

@ArgsType()
class BatchedChannelFollowsArgs {
  @Field(() => [ID])
  channelIdList: string[]
}

@ArgsType()
class FollowChannelArgs extends ChannelFollowsArgs {}

@ArgsType()
class UnfollowChannelArgs extends ChannelFollowsArgs {}

@Resolver()
export class ChannelFollowsInfosResolver {
  @Query(() => ChannelFollowsInfo, { nullable: true, description: 'Get follows count for a single channel' })
  async channelFollows(
    @Args() { channelId }: ChannelFollowsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelFollowsInfo | null> {
    return getFollowsInfo(channelId, ctx)
  }

  @Query(() => [ChannelFollowsInfo], { description: 'Get follows counts for a list of channels', nullable: 'items' })
  async batchedChannelFollows(
    @Args() { channelIdList }: BatchedChannelFollowsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<(ChannelFollowsInfo | null)[]> {
    return channelIdList.map((channelId) => getFollowsInfo(channelId, ctx))
  }

  @Mutation(() => ChannelFollowsInfo, { description: 'Add a single follow to the target channel' })
  async followChannel(@Args() { channelId }: FollowChannelArgs, @Ctx() ctx: OrionContext): Promise<ChannelFollowsInfo> {
    const event: UnsequencedChannelEvent = {
      channelId,
      type: ChannelEventType.FollowChannel,
      timestamp: new Date(),
      actorId: ctx.remoteHost,
    }

    await saveChannelEvent(event)
    ctx.followsAggregate.applyEvent(event)

    return getFollowsInfo(channelId, ctx)!
  }

  @Mutation(() => ChannelFollowsInfo, { description: 'Remove a single follow from the target channel' })
  async unfollowChannel(
    @Args() { channelId }: UnfollowChannelArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelFollowsInfo> {
    const event: UnsequencedChannelEvent = {
      channelId,
      type: ChannelEventType.UnfollowChannel,
      timestamp: new Date(),
      actorId: ctx.remoteHost,
    }

    await saveChannelEvent(event)
    ctx.followsAggregate.applyEvent(event)

    return getFollowsInfo(channelId, ctx)!
  }
}

export const limitFollows = (follows: ChannelFollowsInfo[], limit?: number) => {
  return follows.sort((a, b) => (a.follows > b.follows ? -1 : 1)).slice(0, limit)
}

const getFollowsInfo = (channelId: string, ctx: OrionContext): ChannelFollowsInfo | null => {
  const follows = ctx.followsAggregate.channelFollows(channelId)
  if (follows != null) {
    return {
      id: channelId,
      follows,
    }
  }
  return null
}
