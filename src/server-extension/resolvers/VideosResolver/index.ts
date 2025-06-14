import {
  RelayConnectionRequest,
  decodeRelayConnectionCursor,
} from '@subsquid/openreader/lib/ir/connection'
import { AnyFields } from '@subsquid/openreader/lib/ir/fields'
import { getConnectionSize } from '@subsquid/openreader/lib/limit.size'
import { parseOrderBy } from '@subsquid/openreader/lib/opencrud/orderBy'
import { parseAnyTree, parseSqlArguments } from '@subsquid/openreader/lib/opencrud/tree'
import { parseWhere } from '@subsquid/openreader/lib/opencrud/where'
import { ConnectionQuery, CountQuery, ListQuery } from '@subsquid/openreader/lib/sql/query'
import {
  getResolveTree,
  getTreeRequest,
  hasTreeRequest,
  simplifyResolveTree,
} from '@subsquid/openreader/lib/util/resolve-tree'
import { ensureArray } from '@subsquid/openreader/lib/util/util'
import { UserInputError } from 'apollo-server-core'
import { GraphQLResolveInfo } from 'graphql'
import { isObject } from 'lodash'
import 'reflect-metadata'
import { Arg, Args, Ctx, Info, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { EntityManager, In, MoreThan } from 'typeorm'
import { OperatorPermission, Report, Video, VideoViewEvent } from '../../../model'
import { ConfigVariable, config } from '../../../utils/config'
import { uniqueId } from '../../../utils/crypto'
import { has } from '../../../utils/misc'
import { extendClause, overrideClause, withHiddenEntities } from '../../../utils/sql'
import { Context } from '../../check'
import { Video as VideoReturnType, VideosConnection } from '../baseTypes'
import { OperatorOnly, UserOnly } from '../middleware'
import { model } from '../model'
import {
  AddVideoViewResult,
  DumbPublicFeedArgs,
  MostViewedVideosConnectionArgs,
  PublicFeedOperationType,
  ReportVideoArgs,
  SetOrUnsetPublicFeedArgs,
  SetOrUnsetPublicFeedResult,
  VideoReportInfo,
} from './types'
import { relevanceQueuePublisher } from '../../utils'

@Resolver()
export class VideosResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => VideosConnection)
  async mostViewedVideosConnection(
    @Args()
    args: MostViewedVideosConnectionArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<VideosConnection> {
    const typeName = 'Video'
    const outputType = 'VideosConnection'
    const edgeType = 'VideoEdge'

    if (args.limit > 1000) {
      throw new Error('The limit cannot exceed 1000')
    }

    // Validation based on '@subsquid/openreader/src/opencrud/schema.ts'
    const orderByArg = ensureArray(args.orderBy)
    if (orderByArg.length === 0) {
      throw new UserInputError('orderBy argument is required for connection')
    }

    const req: RelayConnectionRequest<AnyFields> = {
      orderBy: parseOrderBy(model, typeName, orderByArg as unknown[] as string[]),
      where: parseWhere(args.where),
    }

    if (args.first !== null && args.first !== undefined) {
      if (args.first < 0) {
        throw new UserInputError("'first' argument of connection can't be less than 0")
      } else {
        req.first = args.first
      }
    }

    if (args.after !== null && args.after !== undefined) {
      if (decodeRelayConnectionCursor(args.after) == null) {
        throw new UserInputError(`invalid cursor value: ${args.after}`)
      } else {
        req.after = args.after
      }
    }

    const tree = getResolveTree(info, outputType)

    req.totalCount = hasTreeRequest(tree.fields, 'totalCount')
    req.pageInfo = hasTreeRequest(tree.fields, 'pageInfo')

    const edgesTree = getTreeRequest(tree.fields, 'edges')
    if (edgesTree) {
      const edgeFields = simplifyResolveTree(info.schema, edgesTree, edgeType).fields
      req.edgeCursor = hasTreeRequest(edgeFields, 'cursor')
      const nodeTree = getTreeRequest(edgeFields, 'node')
      if (nodeTree) {
        req.edgeNode = parseAnyTree(model, typeName, info.schema, nodeTree)
      }
    }

    ctx.openreader.responseSizeLimit?.check(() => getConnectionSize(model, typeName, req) + 1)

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

    const connectionQuery = new ConnectionQuery(model, ctx.openreader.dialect, typeName, req)

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
      if (video.viewsNum % tick === 0 && video.channelId) {
        await relevanceQueuePublisher.pushChannel(video.channelId)
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
}
