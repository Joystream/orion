import { Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
import { EntityViewsInfo } from '../entities/EntityViewsInfo'
import { saveVideoEvent, VideoEventType, UnsequencedVideoEvent } from '../models/VideoEvent'
import { OrionContext } from '../types'

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
  async videoViews(@Args() { videoId }: VideoViewsArgs, @Ctx() ctx: OrionContext): Promise<EntityViewsInfo | null> {
    return getVideoViewsInfo(videoId, ctx)
  }

  @Query(() => [EntityViewsInfo], { description: 'Get views counts for a list of videos', nullable: 'items' })
  async batchedVideoViews(
    @Args() { videoIdList }: BatchedVideoViewsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<(EntityViewsInfo | null)[]> {
    return videoIdList.map((videoId) => getVideoViewsInfo(videoId, ctx))
  }

  @Query(() => EntityViewsInfo, { nullable: true, description: 'Get views count for a single channel' })
  async channelViews(
    @Args() { channelId }: ChannelViewsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo | null> {
    return getChannelViewsInfo(channelId, ctx)
  }

  @Query(() => [EntityViewsInfo], { description: 'Get views counts for a list of channels', nullable: 'items' })
  async batchedChannelsViews(
    @Args() { channelIdList }: BatchedChannelViewsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<(EntityViewsInfo | null)[]> {
    return channelIdList.map((channelId) => getChannelViewsInfo(channelId, ctx))
  }

  @Mutation(() => EntityViewsInfo, { description: "Add a single view to the target video's count" })
  async addVideoView(
    @Args() { videoId, channelId }: AddVideoViewArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo> {
    const event: UnsequencedVideoEvent = {
      videoId,
      channelId,
      type: VideoEventType.AddView,
      timestamp: new Date(),
      actorId: ctx.remoteHost,
    }

    await saveVideoEvent(event)
    ctx.viewsAggregate.applyEvent(event)

    return getVideoViewsInfo(videoId, ctx)!
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

const getVideoViewsInfo = (videoId: string, ctx: OrionContext): EntityViewsInfo | null => {
  const views = ctx.viewsAggregate.videoViews(videoId)
  return buildViewsObject(videoId, views)
}

const getChannelViewsInfo = (channelId: string, ctx: OrionContext): EntityViewsInfo | null => {
  const views = ctx.viewsAggregate.channelViews(channelId)
  return buildViewsObject(channelId, views)
}
