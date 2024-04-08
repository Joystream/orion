import { parseAnyTree, parseSqlArguments } from '@subsquid/openreader/lib/opencrud/tree'
import { CountQuery, ListQuery } from '@subsquid/openreader/lib/sql/query'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { GraphQLResolveInfo } from 'graphql'
import { isObject } from 'lodash'
import 'reflect-metadata'
import { Arg, Args, Ctx, Info, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { EntityManager, In, MoreThan } from 'typeorm'
import { parseVideoTitle } from '../../../mappings/content/utils'
import { videoRelevanceManager } from '../../../mappings/utils'
import {
  Account,
  ChannelRecipient,
  Exclusion,
  OperatorPermission,
  Report,
  Video,
  VideoExcluded,
  VideoViewEvent,
} from '../../../model'
import { ConfigVariable, config } from '../../../utils/config'
import { uniqueId } from '../../../utils/crypto'
import { has } from '../../../utils/misc'
import { addNotification } from '../../../utils/notification'
import { extendClause, overrideClause, withHiddenEntities } from '../../../utils/sql'
import { Context } from '../../check'
import { RecommendedVideosQuery, Video as VideoReturnType, VideosConnection } from '../baseTypes'
import { OperatorOnly, UserOnly } from '../middleware'
import { model } from '../model'
import {
  AddVideoViewResult,
  DumbPublicFeedArgs,
  ExcludeVideoInfo,
  HomepageVideoQueryArgs,
  MostViewedVideosConnectionArgs,
  NextVideoQueryArgs,
  PublicFeedOperationType,
  ReportVideoArgs,
  SetOrUnsetPublicFeedArgs,
  SetOrUnsetPublicFeedResult,
  SimiliarVideosQueryArgs,
  VideoReportInfo,
} from './types'
import { buildRecommendationsVideoQuery, convertVideoWhereIntoReQlQuery } from './utils'
import { recommendationServiceManager } from '../../../utils/RecommendationServiceManager'
import { createConnectionQueryFromParams } from '../../../utils/subsquid'

@Resolver()
export class VideosResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => RecommendedVideosQuery)
  async homepageVideos(
    @Args()
    args: HomepageVideoQueryArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<RecommendedVideosQuery> {
    const { recommId: argsRecommId, ...queryArgs } = args
    const listQuery = buildRecommendationsVideoQuery(queryArgs, info, ctx)
    const reQLQuery = args.where ? convertVideoWhereIntoReQlQuery(args.where) : undefined

    let recommendationsResponse
    const getUserRecommendationsPromise = recommendationServiceManager.recommendItemsToUser(
      ctx.userId ?? undefined,
      {
        limit: queryArgs.limit,
        filterQuery: reQLQuery,
      }
    )
    if (argsRecommId) {
      try {
        recommendationsResponse = await recommendationServiceManager.recommendNextItems(
          argsRecommId,
          {
            limit: queryArgs.limit,
            filterQuery: reQLQuery,
          }
        )
      } catch (e) {
        // if recommId have expired, req will throw an error
        recommendationsResponse = await getUserRecommendationsPromise
      }
    } else {
      recommendationsResponse = await getUserRecommendationsPromise
    }

    if (recommendationsResponse && recommendationsResponse.recomms.length) {
      const { recomms } = recommendationsResponse
      const ids = recomms.map((recomm) => recomm.id)
      ;(listQuery as { sql: string }).sql = extendClause(
        listQuery.sql,
        'WHERE',
        `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`,
        'AND'
      )
    }

    const result = await ctx.openreader.executeQuery(listQuery)

    return {
      video: result as Video[],
      recommId: recommendationsResponse?.recommId ?? '',
      numberNextRecommsCalls: recommendationsResponse?.numberNextRecommsCalls ?? 0,
    }
  }

  @Query(() => RecommendedVideosQuery)
  async similarVideos(
    @Args()
    args: SimiliarVideosQueryArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<RecommendedVideosQuery> {
    const { videoId, recommId: argsRecommId, ...queryArgs } = args
    const listQuery = buildRecommendationsVideoQuery(queryArgs, info, ctx)
    const reQLQuery = args.where ? convertVideoWhereIntoReQlQuery(args.where) : undefined

    let recommendationsResponse
    const getItemRecommendationsPromise = recommendationServiceManager.recommendItemsToItem(
      `${videoId}-video`,
      ctx.userId ?? undefined,
      {
        limit: queryArgs.limit,
        filterQuery: reQLQuery,
      }
    )
    if (argsRecommId) {
      try {
        recommendationsResponse = await recommendationServiceManager.recommendNextItems(
          argsRecommId,
          {
            limit: queryArgs.limit,
            filterQuery: reQLQuery,
          }
        )
      } catch (e) {
        recommendationsResponse = await getItemRecommendationsPromise
      }
    } else {
      recommendationsResponse = await getItemRecommendationsPromise
    }

    if (recommendationsResponse && recommendationsResponse.recomms.length) {
      const { recomms } = recommendationsResponse
      const ids = recomms.map((recomm) => recomm.id)
      ;(listQuery as { sql: string }).sql = extendClause(
        listQuery.sql,
        'WHERE',
        `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`,
        'AND'
      )
    }

    const result = await ctx.openreader.executeQuery(listQuery)

    return {
      video: result as Video[],
      recommId: recommendationsResponse?.recommId ?? '',
      numberNextRecommsCalls: recommendationsResponse?.numberNextRecommsCalls ?? 0,
    }
  }

  @Query(() => RecommendedVideosQuery)
  async nextVideo(
    @Args()
    args: NextVideoQueryArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<RecommendedVideosQuery> {
    const { videoId, recommId: argsRecommId, ...queryArgs } = args
    const listQuery = buildRecommendationsVideoQuery(queryArgs, info, ctx)
    const reQLQuery = args.where ? convertVideoWhereIntoReQlQuery(args.where) : undefined

    let recommendationsResponse
    const getItemRecommendationsPromise = recommendationServiceManager.recommendNextVideo(
      `${videoId}-video`,
      ctx.userId ?? undefined,
      {
        filterQuery: reQLQuery,
      }
    )

    if (argsRecommId) {
      try {
        recommendationsResponse = await recommendationServiceManager.recommendNextItems(
          argsRecommId,
          {
            filterQuery: reQLQuery,
          }
        )
      } catch (e) {
        recommendationsResponse = await getItemRecommendationsPromise
      }
    } else {
      recommendationsResponse = await getItemRecommendationsPromise
    }

    if (recommendationsResponse && recommendationsResponse.recomms.length) {
      const { recomms } = recommendationsResponse
      const ids = recomms.map((recomm) => recomm.id)
      ;(listQuery as { sql: string }).sql = extendClause(
        listQuery.sql,
        'WHERE',
        `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`,
        'AND'
      )
    }

    const result = await ctx.openreader.executeQuery(listQuery)

    return {
      video: result as Video[],
      recommId: recommendationsResponse?.recommId ?? '',
      numberNextRecommsCalls: recommendationsResponse?.numberNextRecommsCalls ?? 0,
    }
  }

  @Query(() => VideosConnection)
  async mostViewedVideosConnection(
    @Args()
    args: MostViewedVideosConnectionArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<VideosConnection> {
    const typeName = 'Video'
    const { connectionQuery, req } = createConnectionQueryFromParams({
      ctx,
      info,
      args: {
        ...args,
        first: args.limit,
      },
      edgeType: 'VideoEdge',
      outputType: 'VideosConnection',
      typeName,
    })

    const idsQuery = new CountQuery(model, ctx.openreader.dialect, typeName, req.where)
    let idsQuerySql = idsQuery.sql
    idsQuerySql = extendClause(
      idsQuerySql,
      'FROM',
      `LEFT JOIN "admin"."video_view_event" ` +
        `ON "video_view_event"."video_id" = "video"."id"` +
        (args.periodDays
          ? ` AND "video_view_event"."timestamp" > '${new Date(
              Date.now() - args.periodDays * 24 * 60 * 60 * 1000
            ).toISOString()}'`
          : ''),
      ''
    )

    idsQuerySql = overrideClause(idsQuerySql, 'GROUP BY', '"video"."id"')
    idsQuerySql = overrideClause(idsQuerySql, 'ORDER BY', 'COUNT("video_view_event"."id") DESC')
    idsQuerySql = overrideClause(idsQuerySql, 'SELECT', '"video"."id"')
    idsQuerySql = overrideClause(idsQuerySql, 'LIMIT', `${args.limit}`)

    const em = await this.em()
    const results: unknown[] = await em.query(idsQuerySql, idsQuery.params)
    let ids: string[] = results.flatMap((r) =>
      isObject(r) && has(r, 'id') && typeof r.id === 'string' ? [r.id] : []
    )
    if (ids.length === 0) {
      ids = ['-1']
    }

    let connectionQuerySql: string

    connectionQuerySql = extendClause(
      connectionQuery.sql,
      'WHERE',
      `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`,
      'AND'
    )

    const hasPeriodDaysArgAndIsOrderedByViews =
      args.periodDays &&
      (args.orderBy.find((orderByArg) => orderByArg === 'viewsNum_DESC') ||
        args.orderBy.find((orderByArg) => orderByArg === 'viewsNum_ASC'))

    if (hasPeriodDaysArgAndIsOrderedByViews) {
      const arrayPosition = `array_position(
        array[${ids.map((id) => `'${id}'`).join(', ')}],
        video.id  
      )`
      connectionQuerySql = connectionQuerySql.replace(
        '"video"."views_num" DESC',
        `${arrayPosition} ASC`
      )
      connectionQuerySql = connectionQuerySql.replace(
        '"video"."views_num" ASC',
        `${arrayPosition} DESC`
      )
    }

    // Override the raw `sql` string in `connectionQuery` with the modified query
    ;(connectionQuery as { sql: string }).sql = connectionQuerySql

    const result = await ctx.openreader.executeQuery(connectionQuery)

    if (req.totalCount && result.totalCount == null) {
      const countQuery = new CountQuery(model, ctx.openreader.dialect, typeName, req.where)
      const countQuerySql = extendClause(
        countQuery.sql,
        'WHERE',
        `"video"."id" IN (${ids.map((id) => `'${id}'`).join(', ')})`,
        'AND'
      )
      // Override the raw `sql` string in `countQuery` with the modified query
      ;(countQuery as { sql: string }).sql = countQuerySql
      result.totalCount = await ctx.openreader.executeQuery(countQuery)
    }

    return result as VideosConnection
  }

  @Query(() => [VideoReturnType])
  async dumbPublicFeedVideos(
    @Args() args: DumbPublicFeedArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<VideoReturnType[]> {
    const tree = getResolveTree(info)

    const sqlArgs = parseSqlArguments(model, 'Video', {
      limit: args.limit,
      where: args.where,
    })

    const videoFields = parseAnyTree(model, 'Video', info.schema, tree)

    const listQuery = new ListQuery(model, ctx.openreader.dialect, 'Video', videoFields, sqlArgs)

    let listQuerySql = listQuery.sql

    listQuerySql = extendClause(
      listQuerySql,
      'WHERE',
      `"video"."include_in_home_feed" = true AND "video"."id" NOT IN (${args.skipVideoIds
        .map((id) => `'${id}'`)
        .join(', ')})`,
      'AND'
    )

    listQuerySql = extendClause(listQuerySql, 'ORDER BY', 'RANDOM()', '')
    ;(listQuery as { sql: string }).sql = listQuerySql

    const result = await ctx.openreader.executeQuery(listQuery)

    return result as VideoReturnType[]
  }

  @Mutation(() => SetOrUnsetPublicFeedResult)
  @UseMiddleware(OperatorOnly(OperatorPermission.SET_PUBLIC_FEED_VIDEOS))
  async setOrUnsetPublicFeedVideos(
    @Args() { videoIds, operation }: SetOrUnsetPublicFeedArgs
  ): Promise<SetOrUnsetPublicFeedResult> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const result = await em
        .createQueryBuilder()
        .update<Video>(Video)
        .set({ includeInHomeFeed: operation === PublicFeedOperationType.SET })
        .where({ id: In(videoIds) })
        .execute()

      return {
        numberOfEntitiesAffected: result.affected || 0,
      }
    })
  }

  @UseMiddleware(UserOnly)
  @Mutation(() => AddVideoViewResult)
  async addVideoView(
    @Arg('videoId', () => String, { nullable: false }) videoId: string,
    @Ctx() ctx: Context
  ): Promise<AddVideoViewResult> {
    const em = await this.em()
    const { user } = ctx
    return withHiddenEntities(em, async () => {
      // Check if the video actually exists & lock it for update
      const video = await em.findOne(Video, {
        where: { id: videoId },
        lock: { mode: 'pessimistic_write' },
        join: {
          alias: 'v',
          innerJoinAndSelect: {
            c: 'v.channel',
          },
        },
      })
      if (!video) {
        throw new Error(`Video by id ${videoId} does not exist`)
      }
      // See if there is already a recent view of this video by this user
      const timeLimitInSeconds = await config.get(ConfigVariable.VideoViewPerUserTimeLimit, em)
      const recentView = await em.findOne(VideoViewEvent, {
        where: {
          userId: user.id,
          videoId,
          timestamp: MoreThan(new Date(Date.now() - timeLimitInSeconds * 1000)),
        },
      })
      // If so - just return the result
      if (recentView) {
        return {
          videoId,
          viewsNum: video.viewsNum,
          viewId: recentView.id,
          added: false,
        }
      }
      // Otherwise create a new VideoViewEvent and increase the videoViews counter
      // in both the video and its channel
      video.viewsNum += 1
      video.channel.videoViewsNum += 1
      const newView = new VideoViewEvent({
        id: `${videoId}-${video.viewsNum}`,
        userId: user.id,
        timestamp: new Date(),
        videoId,
      })

      const tick = await config.get(ConfigVariable.VideoRelevanceViewsTick, em)
      if (video.viewsNum % tick === 0) {
        videoRelevanceManager.scheduleRecalcForChannel(video.channelId)
      }
      await em.save([video, video.channel, newView])
      return {
        videoId,
        viewsNum: video.viewsNum,
        viewId: newView.id,
        added: true,
      }
    })
  }

  @UseMiddleware(UserOnly)
  @Mutation(() => VideoReportInfo)
  async reportVideo(
    @Args() { videoId, rationale }: ReportVideoArgs,
    @Ctx() ctx: Context
  ): Promise<VideoReportInfo> {
    const em = await this.em()
    const { user } = ctx
    return withHiddenEntities(em, async () => {
      // Try to retrieve the video+channel first
      const video = await em.findOne(Video, {
        where: { id: videoId },
        relations: { channel: true },
      })
      if (!video) {
        throw new Error(`Video by id ${videoId} not found!`)
      }
      // Check if the user has already reported this video
      const existingReport = await em.findOne(Report, {
        where: { userId: user.id, videoId },
      })
      // If report already exists - return its data with { created: false }
      if (existingReport) {
        return {
          id: existingReport.id,
          videoId,
          created: false,
          createdAt: existingReport.timestamp,
          rationale: existingReport.rationale,
        }
      }
      // If report doesn't exist, create a new one
      const newReport = new Report({
        id: uniqueId(8),
        videoId,
        channelId: video.channel.id,
        userId: user.id,
        rationale,
        timestamp: new Date(),
      })
      await em.save(newReport)

      return {
        id: newReport.id,
        videoId,
        created: true,
        createdAt: newReport.timestamp,
        rationale,
      }
    })
  }

  @Mutation(() => ExcludeVideoInfo)
  @UseMiddleware(OperatorOnly())
  async excludeVideo(@Args() { videoId, rationale }: ReportVideoArgs): Promise<ExcludeVideoInfo> {
    return excludeVideoService(await this.em(), videoId, rationale)
  }
}

export const excludeVideoService = async (
  em: EntityManager,
  videoId: string,
  rationale: string
) => {
  return withHiddenEntities(em, async () => {
    const video = await em.findOne(Video, {
      where: { id: videoId },
      relations: { channel: true },
    })

    if (!video) {
      throw new Error(`Video by id ${videoId} not found!`)
    }

    const existingExclusion = await em.findOne(Exclusion, {
      where: { channelId: video.channel.id, videoId },
    })
    // If exclusion already exists - return its data with { created: false }
    if (existingExclusion) {
      return {
        id: existingExclusion.id,
        channelId: video.channel.id,
        videoId,
        created: false,
        createdAt: existingExclusion.timestamp,
        rationale: existingExclusion.rationale,
      }
    }
    // If exclusion doesn't exist, create a new one
    const newExclusion = new Exclusion({
      id: uniqueId(8),
      channelId: video.channel.id,
      videoId,
      rationale,
      timestamp: new Date(),
    })
    video.isExcluded = true
    await em.save([newExclusion, video])

    // in case account exist deposit notification
    const channelOwnerMemberId = video.channel.ownerMemberId
    if (channelOwnerMemberId) {
      const account = await em.findOne(Account, { where: { membershipId: channelOwnerMemberId } })
      await addNotification(
        em,
        account,
        new ChannelRecipient({ channel: video.channel.id }),
        new VideoExcluded({ videoTitle: parseVideoTitle(video) })
      )
    }

    return {
      id: newExclusion.id,
      videoId,
      created: true,
      createdAt: newExclusion.timestamp,
      rationale,
    }
  })
}
