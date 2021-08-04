import { Args, ArgsType, Ctx, Field, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Min, Max } from 'class-validator'
import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'
import { ChannelEventType, saveChannelEvent, UnsequencedChannelEvent } from '../models/ChannelEvent'
import { OrionContext } from '../types'
import { differenceInCalendarDays } from 'date-fns'

const MAXIMUM_PERIOD = 30

@ArgsType()
class ChannelFollowsArgs {
  @Field(() => ID)
  channelId: string
}

@ArgsType()
class MostFollowedChannelsArgs {
  @Field(() => Int)
  @Min(1)
  @Max(MAXIMUM_PERIOD)
  period: number

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

  @Query(() => [ChannelFollowsInfo], { description: 'Get most followed list of channels' })
  async mostFollowedChannels(
    @Args() { period, limit }: MostFollowedChannelsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelFollowsInfo[]> {
    return mapMostFollowedArray(buildMostFollowedChannelsArray(ctx, period), limit)
  }

  @Query(() => [ChannelFollowsInfo], { nullable: true, description: 'Get most followed list of channels of all time' })
  async mostFollowedChannelsAllTime(
    @Args() { limit }: MostFollowedChannelsAllTimeArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelFollowsInfo[]> {
    return sortAndLimitFollows(ctx.followsAggregate.getAllChannelFollows(), limit)
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

const mapMostFollowedArray = (follows: Record<string, number>, limit?: number) =>
  follows
    ? Object.keys(follows)
        .map((id) => ({ id, follows: follows[id] }))
        .sort((a, b) => (a.follows > b.follows ? -1 : 1))
        .slice(0, limit)
    : []

const sortAndLimitFollows = (follows: ChannelFollowsInfo[], limit: number) => {
  return follows.sort((a, b) => (a.follows > b.follows ? -1 : 1)).slice(0, limit)
}

const filterAllFollowsByPeriod = (ctx: OrionContext, period: number): Partial<UnsequencedChannelEvent>[] => {
  const follows = ctx.followsAggregate.getAllFollowsEvents()
  const filteredFollows = []

  for (let i = follows.length - 1; i >= 0; i--) {
    const { timestamp } = follows[i]
    if (timestamp && differenceInCalendarDays(new Date(), timestamp) > period) break
    filteredFollows.push(follows[i])
  }

  return filteredFollows
}

const buildMostFollowedChannelsArray = (ctx: OrionContext, period: number) =>
  filterAllFollowsByPeriod(ctx, period).reduce(
    (entity: Record<string, number>, { channelId = '' }) => ({ ...entity, [channelId]: (entity[channelId] || 0) + 1 }),
    {}
  )

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
