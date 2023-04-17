import 'reflect-metadata'
import { Args, Query, Mutation, Resolver, Info, Ctx } from 'type-graphql'
import { EntityManager, IsNull } from 'typeorm'
import {
  ChannelNftCollector,
  ChannelNftCollectorsArgs,
  ExtendedChannel,
  ExtendedChannelsArgs,
  FollowChannelArgs,
  UnfollowChannelArgs,
  MostRecentChannelsArgs,
  ChannelReportInfo,
  ReportChannelArgs,
  ChannelFollowResult,
  ChannelUnfollowResult,
  ChannelNftCollectorsOrderByInput,
  TopSellingChannelsArgs,
  TopSellingChannelsResult,
} from './types'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { Channel, ChannelFollow, Report } from '../../../model'
import { randomAsHex } from '@polkadot/util-crypto'
import { extendClause, overrideClause, withHiddenEntities } from '../../../utils/sql'
import { buildExtendedChannelsQuery } from './utils'
import { parseAnyTree, parseSqlArguments } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { model } from '../model'
import { ContextWithIP } from '../../check'

@Resolver()
export class ChannelsResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => [ExtendedChannel])
  async extendedChannels(
    @Args() args: ExtendedChannelsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<ExtendedChannel[]> {
    const listQuery = buildExtendedChannelsQuery(args, info, ctx)
    const result = await ctx.openreader.executeQuery(listQuery)

    return result
  }

  @Query(() => [ExtendedChannel])
  async mostRecentChannels(
    @Args() args: MostRecentChannelsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<ExtendedChannel[]> {
    const listQuery = buildExtendedChannelsQuery(
      {
        where: args.where,
        orderBy: args.orderBy,
        limit: args.resultsLimit,
      },
      info,
      ctx
    )
    const mostRecentChannelsQuerySql = `
      SELECT "id" FROM "channel" ORDER BY "created_at" DESC LIMIT ${args.mostRecentLimit}
    `
    const listQuerySql = extendClause(
      listQuery.sql,
      'WHERE',
      `"channel"."id" IN (${mostRecentChannelsQuerySql})`,
      'AND'
    )
    ;(listQuery as { sql: string }).sql = listQuerySql

    const result = await ctx.openreader.executeQuery(listQuery)
    console.log('Result', result)

    return result
  }

  @Query(() => [TopSellingChannelsResult])
  async topSellingChannels(
    @Args() args: TopSellingChannelsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<TopSellingChannelsResult[]> {
    const roundedDate = new Date().setMinutes(0, 0, 0)

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
    let listQuerySql = listQuery.sql

    listQuerySql = extendClause(listQuerySql, 'SELECT', '"top_selling_channels"."amount"')
    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      `
    INNER JOIN (
        SELECT 
          previous_owner_id, SUM (price) AS amount
        FROM (
         SELECT
          data#>>'{previousNftOwner,channel}' AS previous_owner_id,
          (data#>>'{price}')::bigint AS price,
          "timestamp"
        FROM 
          event
        WHERE 
          data#>>'{isTypeOf}' = 'NftBoughtEventData'
          AND "timestamp" > '${new Date(
            roundedDate - args.periodDays * 24 * 60 * 60 * 1000
          ).toISOString()}'
          AND data#>>'{previousNftOwner,isTypeOf}' = 'NftOwnerChannel'
        UNION ALL
        SELECT
          data#>>'{previousNftOwner,channel}' AS previous_owner_id,
          bid.amount::bigint AS price,
          "timestamp"
        FROM
          event
        LEFT JOIN bid ON data#>>'{winningBid}' = bid.id
        WHERE
          data#>>'{isTypeOf}' in ('EnglishAuctionSettledEventData', 'BidMadeCompletingAuctionEventData', 'OpenAuctionBidAcceptedEventData')
          AND "timestamp" > '${new Date(
            roundedDate - args.periodDays * 24 * 60 * 60 * 1000
          ).toISOString()}'
          AND data#>>'{previousNftOwner,isTypeOf}' = 'NftOwnerChannel'
          ) s
          GROUP BY previous_owner_id
          ORDER BY amount DESC  
    ) AS top_selling_channels ON top_selling_channels.previous_owner_id = channel.id`,
      ''
    )
    listQuerySql = overrideClause(listQuerySql, 'LIMIT', `${args.limit}`)

    // const topSellingChannelsSql = `
    //     WITH nftBoughtEvents AS (SELECT
    //       (data#>>'{price}')::bigint AS price,
    //       data#>>'{previousNftOwner,channel}' AS previous_owner_id,
    //       "timestamp"
    //     FROM
    //       processor.event
    //     WHERE
    //       data#>>'{isTypeOf}' = 'NftBoughtEventData'
    //       AND "timestamp" > '${new Date(
    //         roundedDate - args.periodDays * 24 * 60 * 60 * 1000
    //       ).toISOString()}'
    //       AND data#>>'{previousNftOwner,isTypeOf}' = 'NftOwnerChannel'),
    //     auctionSettledEvents AS (SELECT
    //       data#>>'{winningBid}' AS bid_id,
    //       data#>>'{previousNftOwner,channel}' AS previous_owner_id,
    //       bid.amount AS price,
    //       "timestamp"
    //     FROM
    //       processor.event
    //     LEFT JOIN bid ON data#>>'{winningBid}' = bid.id
    //     WHERE
    //       data#>>'{isTypeOf}' in ('EnglishAuctionSettledEventData', 'BidMadeCompletingAuctionEventData', 'OpenAuctionBidAcceptedEventData')
    //       AND "timestamp" > '${new Date(
    //         roundedDate - args.periodDays * 24 * 60 * 60 * 1000
    //       ).toISOString()}'
    //       AND data#>>'{previousNftOwner,isTypeOf}' = 'NftOwnerChannel')
    //     SELECT
    //       previous_owner_id, sum(price::bigint)
    //     FROM (
    //       SELECT price, previous_owner_id FROM nftBoughtEvents
    //       UNION ALL
    //       SELECT price, previous_owner_id FROM auctionSettledEvents
    //       ) s
    //       GROUP BY previous_owner_id
    //       ORDER BY sum DESC
    // `
    ;(listQuery as { sql: string }).sql = listQuerySql

    console.log('look', listQuerySql)

    // const oldListQMap = listQuery.map.bind(listQuery)
    // listQuery.map = (rows: unknown[][]) => {
    //   const sellAmounts: unknown[] = []
    //   for (const row of rows) {
    //     sellAmounts.push(row.pop())
    //   }
    //   const channelsMapped = oldListQMap(rows)
    //   return channelsMapped.map((channel, i) => ({ channel, amount: sellAmounts[i] }))
    // }

    const result = await ctx.openreader.executeQuery(listQuery)

    console.log('Result', result)

    return result
  }

  @Query(() => [ChannelNftCollector])
  async channelNftCollectors(
    @Args() args: ChannelNftCollectorsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<ChannelNftCollector[]> {
    const tree = getResolveTree(info)

    // Extract subsquid-supported Membership fields
    const membershipSubTree = tree.fieldsByTypeName.ChannelNftCollector.member
    const membershipFields = parseAnyTree(model, 'Membership', info.schema, membershipSubTree)

    // Generate query using subsquid's ListQuery
    const listQuery = new ListQuery(model, ctx.openreader.dialect, 'Membership', membershipFields, {
      limit: args.limit,
    })
    let listQuerySql = listQuery.sql

    listQuerySql = extendClause(listQuerySql, 'SELECT', '"collectors"."nft_count"')
    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      `
        INNER JOIN (
          SELECT
              owned_nft.owner->>'member' AS member_id,
              COUNT(owned_nft.id) AS nft_count
          FROM
              channel
              INNER JOIN video ON video.channel_id = channel.id
              INNER JOIN owned_nft ON owned_nft.video_id = video.id
          WHERE channel.id = $${listQuery.params.length + 1}
          GROUP BY owned_nft.owner->>'member'
          HAVING COUNT(owned_nft.id) > 0
        ) AS collectors ON collectors.member_id = membership.id
      `,
      ''
    )
    listQuery.params.push(args.channelId)

    if (args.orderBy !== undefined) {
      listQuerySql = extendClause(
        listQuerySql,
        'ORDER BY',
        args.orderBy === ChannelNftCollectorsOrderByInput.amount_ASC
          ? '"nft_count" ASC'
          : '"nft_count" DESC'
      )
    }

    ;(listQuery as { sql: string }).sql = listQuerySql

    const oldListQMap = listQuery.map.bind(listQuery)
    listQuery.map = (rows: unknown[][]) => {
      const nftCounts: unknown[] = []
      for (const row of rows) {
        nftCounts.push(row.pop())
      }
      const membersMapped = oldListQMap(rows)
      return membersMapped.map((member, i) => ({ member, amount: nftCounts[i] }))
    }

    const result = await ctx.openreader.executeQuery(listQuery)
    console.log('Result', result)

    return result
  }

  @Mutation(() => ChannelFollowResult)
  async followChannel(
    @Args() { channelId }: FollowChannelArgs,
    @Ctx() ctx: ContextWithIP
  ): Promise<ChannelFollowResult> {
    const em = await this.em()
    const { ip } = ctx
    return withHiddenEntities(em, async () => {
      // Try to retrieve the channel and lock it for update
      const channel = await em.findOne(Channel, {
        where: { id: channelId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!channel) {
        throw new Error(`Channel by id ${channelId} not found!`)
      }
      // Check if there's already an existing follow by this IP
      const existingFollow = await em.findOne(ChannelFollow, {
        where: { channelId, ip },
      })
      // If so - just return the result
      if (existingFollow) {
        return {
          channelId,
          cancelToken: existingFollow.id,
          follows: channel.followsNum,
          added: false,
        }
      }
      // Otherwise add a new follow
      const cancelToken = randomAsHex(16).replace('0x', '')
      channel.followsNum += 1
      const newFollow = new ChannelFollow({
        id: cancelToken,
        channelId,
        ip,
        timestamp: new Date(),
      })

      await em.save([channel, newFollow])

      return {
        channelId,
        follows: channel.followsNum,
        cancelToken,
        added: true,
      }
    })
  }

  @Mutation(() => ChannelUnfollowResult)
  async unfollowChannel(
    @Args() { channelId, token }: UnfollowChannelArgs
  ): Promise<ChannelUnfollowResult> {
    const em = await this.em()
    return withHiddenEntities(em, async () => {
      // Try to retrieve the channel and lock it for update
      const channel = await em.findOne(Channel, {
        where: { id: channelId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!channel) {
        throw new Error(`Channel by id ${channelId} not found!`)
      }
      // Check if there's a follow matching the request data
      const follow = await em.findOne(ChannelFollow, {
        where: { channelId, id: token },
      })
      // If not - just return the current number of follows
      if (!follow) {
        return { channelId, follows: channel.followsNum, removed: false }
      }
      // Otherwise remove the follow
      channel.followsNum -= 1

      await Promise.all([em.remove(follow), em.save(channel)])

      return { channelId, follows: channel.followsNum, removed: true }
    })
  }

  @Mutation(() => ChannelReportInfo)
  async reportChannel(
    @Args() { channelId, rationale }: ReportChannelArgs,
    @Ctx() ctx: ContextWithIP
  ): Promise<ChannelReportInfo> {
    const em = await this.em()
    const { ip } = ctx
    return withHiddenEntities(em, async () => {
      // Try to retrieve the channel first
      const channel = await em.findOne(Channel, {
        where: { id: channelId },
      })
      if (!channel) {
        throw new Error(`Channel by id ${channelId} not found!`)
      }
      // We allow only one report per specific entity per ip
      const existingReport = await em.findOne(Report, {
        where: { ip, channelId, videoId: IsNull() },
      })
      // If report already exists - return its data with { created: false }
      if (existingReport) {
        return {
          id: existingReport.id,
          channelId,
          created: false,
          reporterIp: existingReport.ip,
          createdAt: existingReport.timestamp,
          rationale: existingReport.rationale,
        }
      }
      // If report doesn't exist, create a new one
      const newReport = new Report({
        id: randomAsHex(16).replace('0x', ''),
        channelId,
        ip,
        rationale,
        timestamp: new Date(),
      })
      await em.save(newReport)

      return {
        id: newReport.id,
        channelId,
        created: true,
        createdAt: newReport.timestamp,
        rationale,
        reporterIp: ip,
      }
    })
  }
}
