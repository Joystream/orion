import 'reflect-metadata'
import { Arg, Args, Ctx, Info, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { EntityManager, MoreThan } from 'typeorm'
import {
  AddVideoViewResult,
  ExcludeVideoInfo,
  MostViewedVideosConnectionArgs,
  ReportVideoArgs,
  VideoReportInfo,
} from './types'
import { VideosConnection } from '../baseTypes'
import {
  VideoViewEvent,
  Video,
  Report,
  Exclusion,
  Account,
  VideoExcluded,
  ChannelRecipient,
} from '../../../model'
import { ensureArray } from '@subsquid/openreader/lib/util/util'
import { UserInputError } from 'apollo-server-core'
import { parseOrderBy } from '@subsquid/openreader/lib/opencrud/orderBy'
import { parseWhere } from '@subsquid/openreader/lib/opencrud/where'
import {
  decodeRelayConnectionCursor,
  RelayConnectionRequest,
} from '@subsquid/openreader/lib/ir/connection'
import { AnyFields } from '@subsquid/openreader/lib/ir/fields'
import {
  getResolveTree,
  getTreeRequest,
  hasTreeRequest,
  simplifyResolveTree,
} from '@subsquid/openreader/lib/util/resolve-tree'
import { model } from '../model'
import { GraphQLResolveInfo } from 'graphql'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getConnectionSize } from '@subsquid/openreader/lib/limit.size'
import { ConnectionQuery, CountQuery } from '@subsquid/openreader/lib//sql/query'
import { extendClause, overrideClause, withHiddenEntities } from '../../../utils/sql'
import { config, ConfigVariable } from '../../../utils/config'
import { Context } from '../../check'
import { isObject } from 'lodash'
import { has } from '../../../utils/misc'
import { videoRelevanceManager } from '../../../mappings/utils'
import { uniqueId } from '../../../utils/crypto'
import { addNotification } from '../../../utils/notification'
import { parseVideoTitle } from '../../../mappings/content/utils'
import { UserOnly, OperatorOnly } from '../middleware'

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
        videoRelevanceManager.scheduleRecalcForVideo(videoId)
      }
      await em.save([video, video.channel, newView])
      await videoRelevanceManager.updateVideoRelevanceValue(em)
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
