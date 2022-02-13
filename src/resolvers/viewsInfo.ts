import { Args, ArgsType, Ctx, Field, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Min, Max, IsIn } from 'class-validator'
import { EntityViewsInfo } from '../entities/EntityViewsInfo'
import { mapPeriods } from '../helpers'
import { VideoEventType, saveVideoEvent, VideoEvent } from '../models/VideoEvent'
import { OrionContext } from '../types'

@ArgsType()
class MostViewedArgs {
  @Field(() => Int, {
    description: 'timePeriodDays must take one of the following values: 7, 30',
  })
  @IsIn([7, 30])
  timePeriodDays: 7 | 30

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

@ArgsType()
class MostViewedAllTimeArgs {
  @Min(1)
  @Max(200)
  @Field(() => Int)
  limit: number
}

@Resolver()
export class VideoViewsInfosResolver {
  @Query(() => [EntityViewsInfo], {
    nullable: true,
    description: 'Get list of most viewed categories in a given time period',
  })
  async mostViewedCategories(
    @Args() { timePeriodDays, limit }: MostViewedArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    ctx.viewsAggregate.filterEventsByPeriod(timePeriodDays)
    const views = ctx.viewsAggregate.getTimePeriodCategoryViews()[mapPeriods(timePeriodDays)]
    return views.slice(0, limit)
  }

  @Query(() => [EntityViewsInfo], { nullable: true, description: 'Get list of most viewed categories of all time' })
  async mostViewedCategoriesAllTime(
    @Args() { limit }: MostViewedAllTimeArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo[]> {
    const views = ctx.viewsAggregate.getAllCategoryViews()
    return views.slice(0, limit)
  }

  @Mutation(() => EntityViewsInfo, { description: "Add a single view to the target video's count" })
  async addVideoView(
    @Args() { videoId, channelId, categoryId }: AddVideoViewArgs,
    @Ctx() ctx: OrionContext
  ): Promise<EntityViewsInfo> {
    const event: VideoEvent = {
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

const buildViewsObject = (id: string, views: number | null): EntityViewsInfo | null => {
  if (views != null) {
    return {
      id,
      views,
    }
  }
  return null
}

export const getVideoViewsInfo = (videoId: string, ctx: OrionContext): EntityViewsInfo | null => {
  const views = ctx.viewsAggregate.videoViews(videoId) || 0
  return buildViewsObject(videoId, views)
}

export const getChannelViewsInfo = (channelId: string, ctx: OrionContext): EntityViewsInfo | null => {
  const views = ctx.viewsAggregate.channelViews(channelId) || 0
  return buildViewsObject(channelId, views)
}
