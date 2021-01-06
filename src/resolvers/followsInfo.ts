import { Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'
import { ChannelEventType, saveChannelEvent, UnsequencedChannelEvent } from '../models/ChannelEvent'
import { Context } from '../types'

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
    @Ctx() ctx: Context
  ): Promise<ChannelFollowsInfo | null> {
    return getFollowsInfo(channelId, ctx)
  }

  @Query(() => [ChannelFollowsInfo], { description: 'Get follows counts for a list of channels', nullable: 'items' })
  async batchedChannelFollows(
    @Args() { channelIdList }: BatchedChannelFollowsArgs,
    @Ctx() ctx: Context
  ): Promise<(ChannelFollowsInfo | null)[]> {
    return channelIdList.map((channelId) => getFollowsInfo(channelId, ctx))
  }

  @Mutation(() => ChannelFollowsInfo, { description: 'Add a single follow to the target channel' })
  async followChannel(@Args() { channelId }: FollowChannelArgs, @Ctx() ctx: Context): Promise<ChannelFollowsInfo> {
    const event: UnsequencedChannelEvent = {
      channelId,
      type: ChannelEventType.FollowChannel,
      timestamp: new Date(),
    }

    await saveChannelEvent(event)
    ctx.followsAggregate.applyEvent(event)

    return getFollowsInfo(channelId, ctx)!
  }

  @Mutation(() => ChannelFollowsInfo, { description: 'Remove a single follow from the target channel' })
  async unfollowChannel(@Args() { channelId }: UnfollowChannelArgs, @Ctx() ctx: Context): Promise<ChannelFollowsInfo> {
    const event: UnsequencedChannelEvent = {
      channelId,
      type: ChannelEventType.UnfollowChannel,
      timestamp: new Date(),
    }

    await saveChannelEvent(event)
    ctx.followsAggregate.applyEvent(event)

    return getFollowsInfo(channelId, ctx)!
  }
}

const getFollowsInfo = (channelId: string, ctx: Context): ChannelFollowsInfo | null => {
  const follows = ctx.followsAggregate.channelFollows(channelId)
  if (follows != null) {
    return {
      id: channelId,
      follows,
    }
  }
  return null
}
