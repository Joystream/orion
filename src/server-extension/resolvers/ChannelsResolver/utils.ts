import 'reflect-metadata'
import { ExtendedChannelsArgs, TopSellingChannelsArgs } from './types'
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
    !!tree.fieldsByTypeName.ExtendedChannel.activeVideosCount ||
    args.where?.activeVideosCount_gt !== undefined

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
    if (args.where?.activeVideosCount_gt !== undefined) {
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

export function buildTopSellingChannelsQuery(
  args: TopSellingChannelsArgs,
  info: GraphQLResolveInfo,
  ctx: Context
) {
  const roundedDate = new Date().setMinutes(0, 0, 0)

  const tree = getResolveTree(info)

  // Extract subsquid-supported Channel sql args
  const sqlArgs = parseSqlArguments(model, 'Channel', {
    ...args,
    where: args.where?.channel, // only supported WHERE part
  })

  // Extract subsquid-supported Channel fields
  const channelSubTree = tree.fieldsByTypeName.TopSellingChannelsResult.channel
  const channelFields = parseAnyTree(model, 'Channel', info.schema, channelSubTree)

  // Generate query using subsquid's ListQuery
  const listQuery = new ListQuery(model, ctx.openreader.dialect, 'Channel', channelFields, sqlArgs)
  let listQuerySql = listQuery.sql

  // Count NFT sells from the auctions and buy now events and add them to the query
  listQuerySql = extendClause(
    listQuerySql,
    'SELECT',
    '"top_selling_channels"."amount", "top_selling_channels"."nftSold"'
  )

  listQuerySql = extendClause(
    listQuerySql,
    'FROM',
    `
    INNER JOIN (
      SELECT
        (SUM((COALESCE(event.data->>'price', '0')::bigint)) + SUM(COALESCE(winning_bid.amount, 0))) AS "amount",
        "data"->'previousNftOwner'->>'channel' AS "channel_id",
        COUNT("event"."data"->'previousNftOwner'->>'channel') as "nftSold"
      FROM "event"
      LEFT JOIN bid AS winning_bid ON "data"->>'winningBid' = winning_bid.id
      WHERE
      ${
        args?.periodDays > 0
          ? ` "event"."timestamp" > '${new Date(
              roundedDate - args.periodDays * 24 * 60 * 60 * 1000
            ).toISOString()}' AND`
          : ''
      }
        "event"."data"->>'isTypeOf' IN (
          'NftBoughtEventData',
          'EnglishAuctionSettledEventData',
          'BidMadeCompletingAuctionEventData',
          'OpenAuctionBidAcceptedEventData'
        ) AND
        "data"->'previousNftOwner'->>'channel' IS NOT NULL
        GROUP BY "event"."data"->'previousNftOwner'->>'channel'
    ) AS "top_selling_channels" ON "top_selling_channels"."channel_id" = "channel"."id"
    `,
    ''
  )

  listQuerySql = extendClause(listQuerySql, 'ORDER BY', '"top_selling_channels"."amount" DESC')
  ;(listQuery as { sql: string }).sql = listQuerySql

  // Attach channels earnings amounts in the response
  const oldListQMap = listQuery.map.bind(listQuery)
  listQuery.map = (rows: unknown[][]) => {
    const sellAmounts: unknown[] = []
    const nftCount: unknown[] = []
    for (const row of rows) {
      nftCount.push(row.pop())
      sellAmounts.push(row.pop())
    }
    const channelsMapped = oldListQMap(rows)
    return channelsMapped.map((channel, i) => ({
      channel,
      amount: sellAmounts[i],
      nftSold: nftCount[i],
    }))
  }

  return listQuery
}
