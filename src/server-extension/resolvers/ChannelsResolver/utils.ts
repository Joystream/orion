import 'reflect-metadata'
import { ExtendedChannelsArgs } from './types'
import { parseSqlArguments, parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { model } from '../model'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { extendClause } from '../../../utils/sql'

export function buildExtendedChannelsQuery(
  args: ExtendedChannelsArgs,
  info: GraphQLResolveInfo,
  ctx: Context
) {
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
  const listQuery = new ListQuery(model, ctx.openreader.dialect, 'Channel', channelFields, sqlArgs)
  let listQuerySql = listQuery.sql

  // Check whether the query includes non-standard fields / filters
  const isExtraQuery =
    !!tree.fieldsByTypeName.ExtendedChannel.activeVideosCount || !!args.where?.activeVideosCount_gt

  // If it does...
  if (isExtraQuery) {
    // Define a subquery to fetch channel's active videos count
    const activeVideosCountQuerySql = `
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

    // Extend SELECT clause of the original query
    listQuerySql = extendClause(
      listQuerySql,
      'SELECT',
      'COALESCE("activeVideoCounter"."activeVideosCount", 0) AS "activeVideosCount"'
    )

    // Extend FROM clause of the original query
    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      `LEFT OUTER JOIN (${activeVideosCountQuerySql}) AS "activeVideoCounter"
          ON "activeVideoCounter"."channel_id" = "channel"."id"`,
      ''
    )

    // If `where: { activeVideosCount_gt: x }` was provided...
    if (args.where?.activeVideosCount_gt) {
      // Extend WHERE condition of the original query
      listQuerySql = extendClause(
        listQuerySql,
        'WHERE',
        `"activeVideoCounter"."activeVideosCount" > ${args.where.activeVideosCount_gt}`,
        'AND'
      )
    }

    // Override the raw `sql` string in `listQuery` with the modified query
    ;(listQuery as { sql: string }).sql = listQuerySql
  }

  // Override the `listQuery.map` function
  const oldListQMap = listQuery.map.bind(listQuery)
  listQuery.map = (rows: unknown[][]) => {
    const activeVideoCounts: unknown[] = []
    if (isExtraQuery) {
      for (const row of rows) {
        activeVideoCounts.push(row.pop())
      }
    }
    const channelsMapped = oldListQMap(rows)
    return channelsMapped.map((channel, i) => {
      const resultRow: { channel: unknown; activeVideosCount?: unknown } = { channel }
      if (isExtraQuery) {
        resultRow.activeVideosCount = activeVideoCounts[i]
      }
      return resultRow
    })
  }

  return listQuery
}
