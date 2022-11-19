import 'reflect-metadata'
import { Args, Query, Mutation, Resolver, Info, Ctx } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {
  ChannelFollowsInfo,
  ChannelNftCollector,
  ChannelNftCollectorsArgs,
  ExtendedChannel,
  ExtendedChannelsArgs,
  FollowChannelArgs,
  UnfollowChannelArgs,
  MostRecentChannelsArgs,
  ChannelReportInfo,
  ReportChannelArgs,
  ChannelsSearchArgs,
  ChannelsSearchResult,
} from './types'
import { parseSqlArguments, parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { Expr, parse as parseSql, SelectFromStatement, toSql } from 'pgsql-ast-parser'
import { model } from '../model'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'

@Resolver()
export class ChannelsResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ExtendedChannel])
  async extendedChannels(
    @Args() args: ExtendedChannelsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<ExtendedChannel[]> {
    const tree = getResolveTree(info)

    // Extract subsquid-supported Channel sql args
    const sqlArgs = parseSqlArguments(model, 'Channel', {
      ...args,
      where: args.where?.channel, // only supported WHERE part
    })

    // Extract subsquid-supported Channel fields
    const channelSubTree = tree.fieldsByTypeName.ExtendedChannel.channel
    const channelFields = parseAnyTree(model, 'Channel', info.schema, channelSubTree)

    // Generate query using subsquid's ListQuery
    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'Channel',
      channelFields,
      sqlArgs
    )
    const q = parseSql(listQuery.sql)[0] as SelectFromStatement

    // Check whether the query includes non-standard fields / filters
    const isExtraQuery =
      !!tree.fieldsByTypeName.ExtendedChannel.activeVideosCount ||
      !!args.where?.activeVideosCount_gt

    // If it does...
    if (isExtraQuery) {
      // Define a subquery to fetch channel's active videos count
      const activeVideosCountQueryString = `
                SELECT
                    "channel_id",
                    COUNT("video"."id") AS "activeVideosCount"
                FROM
                    "video"
                    INNER JOIN "storage_data_object" AS "media" ON "media"."id" = "video"."media_id"
                    INNER JOIN "storage_data_object" AS "thumbnail" ON "thumbnail"."id" = "video"."thumbnail_photo_id"
                WHERE
                    "video"."is_censored" = '0'
                    AND "video"."is_public" = '1'
                    AND "media"."is_accepted" = '1'
                    AND "thumbnail"."is_accepted" = '1'
                GROUP BY "channel_id"
            `

      // Define the shape of the extra query to be merged with the original query
      const extraQ = parseSql(`
                SELECT
                    "activeVideoCounter"."activeVideosCount"
                FROM
                    "channel"
                    LEFT OUTER JOIN (${activeVideosCountQueryString}) AS "activeVideoCounter"
                        ON "activeVideoCounter"."channel_id" = "channel"."id"
                    WHERE "activeVideoCounter"."activeVideosCount" > ${
                      args.where?.activeVideosCount_gt || -1
                    }
            `)[0] as SelectFromStatement

      // Push SELECT "activeVideoCounter"."activeVideosCount" part of `extraQ` to the original query
      q.columns?.push(extraQ.columns![0])

      // Push LEFT OUTER JOIN part of `extraQ` to the original query
      q.from?.push(extraQ.from![1])

      // If `where: { activeVideosCount_gt: x }` was provided...
      if (args.where?.activeVideosCount_gt) {
        // Push additional `extraQ` WHERE condition to the original query
        q.where = q.where
          ? {
              type: 'binary',
              left: q.where,
              right: extraQ.where as Expr,
              op: 'AND',
            }
          : (extraQ.where as Expr)
      }

      // Override the raw `sql` string in `listQuery` with the modified query
      ;(listQuery as { sql: string }).sql = toSql.statement(q)
      console.log(toSql.statement(q))

      // Override the `listQuery.map` function to take `activeVideosCount` into account
      const oldListQMap = listQuery.map.bind(listQuery)
      listQuery.map = (rows: any[][]) => {
        const activeVideoCounts: string[] = []
        for (const row of rows) {
          activeVideoCounts.push(row.pop())
        }
        const channelsMapped = oldListQMap(rows)
        return channelsMapped.map((channel, i) => ({
          channel,
          activeVideosCount: activeVideoCounts[i],
        }))
      }
    }

    const result = await ctx.openreader.executeQuery(listQuery)
    return result
  }

  @Query(() => [ExtendedChannel])
  async mostRecentChannels(@Args() args: MostRecentChannelsArgs): Promise<ExtendedChannel[]> {
    // TODO: Implement
    return []
  }

  @Query(() => [ChannelNftCollector])
  async channelNftCollectors(
    @Args() args: ChannelNftCollectorsArgs
  ): Promise<ChannelNftCollector[]> {
    // TODO: Implement
    return []
  }

  @Mutation(() => ChannelFollowsInfo)
  async followChannel(@Args() args: FollowChannelArgs): Promise<ChannelFollowsInfo> {
    // TODO: Implement
    return { id: '0', follows: 0 }
  }

  @Query(() => [ChannelsSearchResult!])
  async searchChannels(@Args() args: ChannelsSearchArgs): Promise<ChannelsSearchResult[]> {
    // TODO: Implement
    return []
  }

  @Mutation(() => ChannelFollowsInfo)
  async unfollowChannel(@Args() args: UnfollowChannelArgs): Promise<ChannelFollowsInfo> {
    // TODO: Implement
    return { id: '0', follows: 0 }
  }

  @Mutation(() => ChannelReportInfo)
  async reportChannel(@Args() args: ReportChannelArgs): Promise<ChannelReportInfo> {
    // TODO: Implement
    return {
      id: '0',
      channelId: args.channelId,
      createdAt: new Date(),
      rationale: args.rationale,
      reporterIp: '127.0.0.1',
    }
  }
}
