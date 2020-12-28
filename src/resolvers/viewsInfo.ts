import { Args, ArgsType, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { EntityViewsInfo } from '../entities/EntityViewsInfo'
import { viewsAggregate } from '../aggregates'
import { saveVideoEvent, VideoEventType, UnsequencedVideoEvent } from '../models/VideoEvent'

@ArgsType()
class VideoViewsArgs {
  @Field(() => ID)
  videoId: string
}

@ArgsType()
class BatchedVideoViewsArgs {
  @Field(() => [ID])
  videoIdList: string[]
}

@ArgsType()
class ChannelViewsArgs {
  @Field(() => ID)
  channelId: string
}

@ArgsType()
class BatchedChannelViewsArgs {
  @Field(() => [ID])
  channelIdList: string[]
}

@ArgsType()
class AddVideoViewArgs {
  @Field(() => ID)
  videoId: string

  @Field(() => ID)
  channelId: string
}

@Resolver()
export class VideoViewsInfosResolver {
  @Query(() => EntityViewsInfo, { nullable: true, description: 'Get views count for a single video' })
  async videoViews(@Args() { videoId }: VideoViewsArgs): Promise<EntityViewsInfo | null> {
    return getVideoViewsInfo(videoId)
  }

  @Query(() => [EntityViewsInfo], { description: 'Get views counts for a list of videos', nullable: 'items' })
  async batchedVideoViews(@Args() { videoIdList }: BatchedVideoViewsArgs): Promise<(EntityViewsInfo | null)[]> {
    return videoIdList.map((videoId) => getVideoViewsInfo(videoId))
  }

  @Query(() => EntityViewsInfo, { nullable: true, description: 'Get views count for a single channel' })
  async channelViews(@Args() { channelId }: ChannelViewsArgs): Promise<EntityViewsInfo | null> {
    return getChannelViewsInfo(channelId)
  }

  @Query(() => [EntityViewsInfo], { description: 'Get views counts for a list of channels', nullable: 'items' })
  async batchedChannelsViews(@Args() { channelIdList }: BatchedChannelViewsArgs): Promise<(EntityViewsInfo | null)[]> {
    return channelIdList.map((channelId) => getChannelViewsInfo(channelId))
  }

  @Mutation(() => EntityViewsInfo, { description: "Add a single view to the target video's count" })
  async addVideoView(@Args() { videoId, channelId }: AddVideoViewArgs): Promise<EntityViewsInfo> {
    const event: UnsequencedVideoEvent = {
      videoId,
      channelId,
      type: VideoEventType.AddView,
      timestamp: new Date(),
    }

    await saveVideoEvent(event)
    viewsAggregate.applyEvent(event)

    return getVideoViewsInfo(videoId)!
  }
}

const buildViewsObject = (id: string, views: number | null): EntityViewsInfo | null => {
  if (views != null) {
    return {
      id,
      views,
    }
  }
  return null
}

const getVideoViewsInfo = (videoId: string): EntityViewsInfo | null => {
  const views = viewsAggregate.videoViews(videoId)
  return buildViewsObject(videoId, views)
}

const getChannelViewsInfo = (channelId: string): EntityViewsInfo | null => {
  const views = viewsAggregate.channelViews(channelId)
  return buildViewsObject(channelId, views)
}
