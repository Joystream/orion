import { Args, ArgsType, Ctx, Field, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Min, Max, IsIn } from 'class-validator'
import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'
import { ChannelEventType, saveChannelEvent, UnsequencedChannelEvent } from '../models/ChannelEvent'
import { OrionContext } from '../types'
import { mapPeriods } from '../helpers'

@ArgsType()
class ChannelFollowsArgs {
  @Field(() => ID)
  channelId: string
}

@ArgsType()
class MostFollowedArgs {
  @Field(() => Int, {
    description: 'timePeriodDays must take one of the following values: 7, 30',
  })
  @IsIn([7, 30])
  timePeriodDays: 7 | 30

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ArgsType()
class MostFollowedChannelsAllTimeArgs {
  @Field(() => Int)
  @Min(1)
  @Max(200)
  limit: number
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

  @Query(() => [ChannelFollowsInfo], { description: 'Get list of most followed channels' })
  async mostFollowedChannels(
    @Args() { timePeriodDays, limit }: MostFollowedArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelFollowsInfo[]> {
    ctx.followsAggregate.filterEventsByPeriod(timePeriodDays)
    return limitFollows(ctx.followsAggregate.getTimePeriodChannelFollows()[mapPeriods(timePeriodDays)], limit)
  }

  @Query(() => [ChannelFollowsInfo], { nullable: true, description: 'Get list of most followed channels of all time' })
  async mostFollowedChannelsAllTime(
    @Args() { limit }: MostFollowedChannelsAllTimeArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelFollowsInfo[]> {
    return limitFollows(ctx.followsAggregate.getAllChannelFollows(), limit)
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

const limitFollows = (follows: ChannelFollowsInfo[], limit?: number) => {
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
