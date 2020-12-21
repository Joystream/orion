import { Args, ArgsType, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { VideoViewsInfo } from '../entities/VideoViewsInfo'
import { videoAggregate } from '../aggregate'
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
class AddVideoViewArgs {
  @Field(() => ID)
  videoId: string

  @Field(() => ID)
  channelId: string
}

@Resolver()
export class VideoViewsInfosResolver {
  @Query(() => VideoViewsInfo, { nullable: true, description: 'Get views count for a single video' })
  async videoViews(@Args() { videoId }: VideoViewsArgs): Promise<VideoViewsInfo | null> {
    const views = videoAggregate.videoViews(videoId)
    if (views) {
      return {
        videoId,
        views,
      }
    }
    return null
  }

  @Query(() => [VideoViewsInfo], { description: 'Get views counts for a list of videos', nullable: 'items' })
  async batchedVideoViews(@Args() { videoIdList }: BatchedVideoViewsArgs): Promise<(VideoViewsInfo | null)[]> {
    return videoIdList.map((videoId) => {
      const videoViews = videoAggregate.videoViews(videoId)
      if (videoViews) {
        const videoViewsInfo: VideoViewsInfo = {
          videoId,
          views: videoViews,
        }
        return videoViewsInfo
      }
      return null
    })
  }

  @Mutation(() => VideoViewsInfo, { description: "Add a single view to the target video's count" })
  async addVideoView(@Args() { videoId, channelId }: AddVideoViewArgs): Promise<VideoViewsInfo> {
    const event: UnsequencedVideoEvent = {
      videoId,
      channelId,
      eventType: VideoEventType.AddView,
      timestamp: new Date(),
    }

    await insertVideoEventIntoBucket(event)
    videoAggregate.applyEvent(event)

    const views = videoAggregate.videoViews(videoId)
    return {
      videoId,
      views,
    }
  }
}
