import { Args, ArgsType, Ctx, Field, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { differenceInCalendarDays } from 'date-fns'
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
class MostViewedVideosArgs {
  @Field(() => Int, { nullable: true })
  period?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ArgsType()
class MostViewedChannelArgs {
  @Field(() => Int, { nullable: true })
  period?: number

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
class MostViewedCategoriesArgs {
  @Field(() => Int, { nullable: true })
  period?: number

  @Field(() => Int, { nullable: true })
  limit?: number
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

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get most viewed list of videos' })
  async mostViewedVideos(
    @Args() { period, limit }: MostViewedVideosArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    return mapMostViewedArray(buildMostViewedVideosArray(ctx, period), limit)
  }

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get most viewed list of channels' })
  async mostViewedChannels(
    @Args() { period, limit }: MostViewedChannelArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    return mapMostViewedArray(buildMostViewedChannelsArray(ctx, period), limit)
  }

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get most viewed list of categories' })
  async mostViewedCategories(
    @Args() { period, limit }: MostViewedCategoriesArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    return mapMostViewedArray(buildMostViewedCategoriesArray(ctx, period), limit)
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

const mapMostViewedArray = (views: Record<string, number>, limit?: number) =>
  views
    ? Object.keys(views)
        .map((id) => ({ id, views: views[id] }))
        .sort((a, b) => (a.views > b.views ? -1 : 1))
        .slice(0, limit)
    : []

const filterAllViewsByPeriod = (ctx: OrionContext, period?: number): Partial<UnsequencedVideoEvent>[] => {
  const views = [...ctx.viewsAggregate.getAllViewsEvents()].reverse()
  const filteredViews = []
  if (!period) return views

  for (const view of views) {
    const { timestamp } = view
    if (timestamp && differenceInCalendarDays(new Date(), timestamp) > period) break
    filteredViews.push(view)
  }

  return filteredViews
}

const buildMostViewedVideosArray = (ctx: OrionContext, period?: number) =>
  filterAllViewsByPeriod(ctx, period).reduce(
    (entity: Record<string, number>, { videoId = '' }) => ({ ...entity, [videoId]: (entity[videoId] || 0) + 1 }),
    {}
  )

const buildMostViewedChannelsArray = (ctx: OrionContext, period?: number) =>
  filterAllViewsByPeriod(ctx, period).reduce(
    (entity: Record<string, number>, { channelId = '' }) => ({ ...entity, [channelId]: (entity[channelId] || 0) + 1 }),
    {}
  )

const buildMostViewedCategoriesArray = (ctx: OrionContext, period?: number) =>
  filterAllViewsByPeriod(ctx, period).reduce((entity: Record<string, number>, { categoryId }) => {
    return categoryId ? { ...entity, [categoryId]: (entity[categoryId] || 0) + 1 } : entity
  }, {})

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
