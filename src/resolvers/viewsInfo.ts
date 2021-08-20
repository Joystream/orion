import { Args, ArgsType, Ctx, Field, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Min, Max, IsIn } from 'class-validator'
import { EntityViewsInfo } from '../entities/EntityViewsInfo'
import { saveVideoEvent, VideoEventType, UnsequencedVideoEvent } from '../models/VideoEvent'
import { OrionContext } from '../types'

export const mapPeriods = (period: number) => (period === 7 ? 'sevenDays' : 'thirtyDays')

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
class MostViewedArgs {
  @Field(() => Int, {
    description: 'timePeriodDays must take one of the following values: 7, 30',
  })
  @IsIn([7, 30])
  timePeriodDays: number

  @Field(() => Int, { nullable: true })
  limit?: number
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

  @Field(() => ID, { nullable: true })
  categoryId?: string
}

@ArgsType()
class MostViewedAllTimeArgs {
  @Min(1)
  @Max(200)
  @Field(() => Int)
  limit: number
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

  @Query(() => [EntityViewsInfo], {
    nullable: true,
    description: 'Get list of most viewed videos in a given time period',
  })
  async mostViewedVideos(
    @Args() { timePeriodDays, limit }: MostViewedArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    ctx.viewsAggregate.filterEventsByPeriod(timePeriodDays)
    return limitViews(ctx.viewsAggregate.getTimePeriodVideoViews()[mapPeriods(timePeriodDays)], limit)
  }

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get list of most viewed videos of all time' })
  async mostViewedVideosAllTime(
    @Args() { limit }: MostViewedAllTimeArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    return limitViews(ctx.viewsAggregate.getAllVideoViews(), limit)
  }

  @Query(() => [EntityViewsInfo], {
    nullable: true,
    description: 'Get list of most viewed channels in a given time period',
  })
  async mostViewedChannels(
    @Args() { timePeriodDays, limit }: MostViewedArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    ctx.viewsAggregate.filterEventsByPeriod(timePeriodDays)
    return limitViews(ctx.viewsAggregate.getTimePeriodChannelViews()[mapPeriods(timePeriodDays)], limit)
  }

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get list of most viewed channels of all time' })
  async mostViewedChannelsAllTime(
    @Args() { limit }: MostViewedAllTimeArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    return limitViews(ctx.viewsAggregate.getAllChannelViews(), limit)
  }

  @Query(() => [EntityViewsInfo], {
    nullable: true,
    description: 'Get list of most viewed categories in a given time period',
  })
  async mostViewedCategories(
    @Args() { timePeriodDays, limit }: MostViewedArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    ctx.viewsAggregate.filterEventsByPeriod(timePeriodDays)
    return limitViews(ctx.viewsAggregate.getTimePeriodCategoryViews()[mapPeriods(timePeriodDays)], limit)
  }

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get list of most viewed categories of all time' })
  async mostViewedCategoriesAllTime(
    @Args() { limit }: MostViewedAllTimeArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    return limitViews(ctx.viewsAggregate.getAllCategoryViews(), limit)
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
    @Args() { videoId, channelId, categoryId }: AddVideoViewArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo> {
    const event: UnsequencedVideoEvent = {
      videoId,
      channelId,
      categoryId,
      type: VideoEventType.AddView,
      timestamp: new Date(),
      actorId: ctx.remoteHost,
    }

    await saveVideoEvent(event)
    ctx.viewsAggregate.applyEvent(event)

    return getVideoViewsInfo(videoId, ctx)!
  }
}

const limitViews = (views: EntityViewsInfo[], limit?: number) => {
  return views.slice(0, limit)
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
