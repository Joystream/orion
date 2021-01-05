import { Args, ArgsType, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { EntityViewsInfo } from '../entities/EntityViewsInfo'
import { viewsAggregate } from '../aggregates/views'
import { insertVideoEventIntoBucket, VideoEventType, UnsequencedVideoEvent } from '../models/VideoEvent'

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
    const views = viewsAggregate.videoViews(videoId)
    if (views) {
      return {
        id: videoId,
        views,
      }
    }
    return null
  }

  @Query(() => [EntityViewsInfo], { description: 'Get views counts for a list of videos', nullable: 'items' })
  async batchedVideoViews(@Args() { videoIdList }: BatchedVideoViewsArgs): Promise<(EntityViewsInfo | null)[]> {
    return videoIdList.map((videoId) => {
      const videoViews = viewsAggregate.videoViews(videoId)
      if (videoViews) {
        const videoViewsInfo: EntityViewsInfo = {
          id: videoId,
          views: videoViews,
        }
        return videoViewsInfo
      }
      return null
    })
  }

  @Query(() => EntityViewsInfo, { nullable: true, description: 'Get views count for a single channel' })
  async channelViews(@Args() { channelId }: ChannelViewsArgs): Promise<EntityViewsInfo | null> {
    const views = viewsAggregate.channelViews(channelId)
    if (views) {
      return {
        id: channelId,
        views,
      }
    }
    return null
  }

  @Query(() => [EntityViewsInfo], { description: 'Get views counts for a list of channels', nullable: 'items' })
  async batchedChannelsViews(@Args() { channelIdList }: BatchedChannelViewsArgs): Promise<(EntityViewsInfo | null)[]> {
    return channelIdList.map((channelId) => {
      const channelViews = viewsAggregate.channelViews(channelId)
      if (channelViews) {
        const channelViewsInfo: EntityViewsInfo = {
          id: channelId,
          views: channelViews,
        }
        return channelViewsInfo
      }
      return null
    })
  }

  @Mutation(() => EntityViewsInfo, { description: "Add a single view to the target video's count" })
  async addVideoView(@Args() { videoId, channelId }: AddVideoViewArgs): Promise<EntityViewsInfo> {
    const event: UnsequencedVideoEvent = {
      videoId,
      channelId,
      eventType: VideoEventType.AddView,
      timestamp: new Date(),
    }

    await insertVideoEventIntoBucket(event)
    viewsAggregate.applyEvent(event)

    const views = viewsAggregate.videoViews(videoId)
    return {
      id: videoId,
      views,
    }
  }
}
