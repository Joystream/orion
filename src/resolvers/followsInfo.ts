import { Args, ArgsType, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { followsAggregate } from '../aggregates'
import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'
import { ChannelEventType, saveChannelEvent, UnsequencedChannelEvent } from '../models/ChannelEvent'

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
  async channelFollows(@Args() { channelId }: ChannelFollowsArgs): Promise<ChannelFollowsInfo | null> {
    return getFollowsInfo(channelId)
  }

  @Query(() => [ChannelFollowsInfo], { description: 'Get follows counts for a list of channels', nullable: 'items' })
  async batchedChannelFollows(
    @Args() { channelIdList }: BatchedChannelFollowsArgs
  ): Promise<(ChannelFollowsInfo | null)[]> {
    return channelIdList.map((channelId) => getFollowsInfo(channelId))
  }

  @Mutation(() => ChannelFollowsInfo, { description: 'Add a single follow to the target channel' })
  async followChannel(@Args() { channelId }: FollowChannelArgs): Promise<ChannelFollowsInfo> {
    const event: UnsequencedChannelEvent = {
      channelId,
      type: ChannelEventType.FollowChannel,
      timestamp: new Date(),
    }

    await saveChannelEvent(event)
    followsAggregate.applyEvent(event)

    return getFollowsInfo(channelId)!
  }

  @Mutation(() => ChannelFollowsInfo, { description: 'Remove a single follow from the target channel' })
  async unfollowChannel(@Args() { channelId }: UnfollowChannelArgs): Promise<ChannelFollowsInfo> {
    const event: UnsequencedChannelEvent = {
      channelId,
      type: ChannelEventType.UnfollowChannel,
      timestamp: new Date(),
    }

    await saveChannelEvent(event)
    followsAggregate.applyEvent(event)

    return getFollowsInfo(channelId)!
  }
}

const getFollowsInfo = (channelId: string): ChannelFollowsInfo | null => {
  const follows = followsAggregate.channelFollows(channelId)
  if (follows != null) {
    return {
      id: channelId,
      follows,
    }
  }
  return null
}
