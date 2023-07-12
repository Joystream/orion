import 'reflect-metadata'
import { Args, Query, Mutation, Resolver, Info, Ctx, UseMiddleware } from 'type-graphql'
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
import { Channel, ChannelFollow, Report } from '../../../model'
import { extendClause, withHiddenEntities } from '../../../utils/sql'
import { buildExtendedChannelsQuery, buildTopSellingChannelsQuery } from './utils'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { model } from '../model'
import { Context } from '../../check'
import { uniqueId } from '../../../utils/crypto'
import { AccountOnly } from '../middleware'

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
    const listQuery = buildTopSellingChannelsQuery(args, info, ctx)

    const result = await ctx.openreader.executeQuery(listQuery)
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
  @UseMiddleware(AccountOnly)
  async followChannel(
    @Args() { channelId }: FollowChannelArgs,
    @Ctx() ctx: Context
  ): Promise<ChannelFollowResult> {
    const em = await this.em()
    const { user } = ctx
    return withHiddenEntities(em, async () => {
      // Try to retrieve the channel and lock it for update
      const channel = await em.findOne(Channel, {
        where: { id: channelId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!channel) {
        throw new Error(`Channel by id ${channelId} not found!`)
      }
      // Check whether the user already follows the channel
      const existingFollow = await em.findOne(ChannelFollow, {
        where: { channelId, userId: user.id },
      })
      // If so - just return the result
      if (existingFollow) {
        return {
          channelId,
          followId: existingFollow.id,
          follows: channel.followsNum,
          added: false,
        }
      }
      // Otherwise add a new follow
      channel.followsNum += 1
      const newFollow = new ChannelFollow({
        id: uniqueId(8),
        channelId,
        userId: user.id,
        timestamp: new Date(),
      })

      await em.save([channel, newFollow])

      return {
        channelId,
        follows: channel.followsNum,
        followId: newFollow.id,
        added: true,
      }
    })
  }

  @Mutation(() => ChannelUnfollowResult)
  @UseMiddleware(AccountOnly)
  async unfollowChannel(
    @Args() { channelId }: UnfollowChannelArgs,
    @Ctx() ctx: Context
  ): Promise<ChannelUnfollowResult> {
    const em = await this.em()
    const { user } = ctx
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
        where: { channelId, userId: user.id },
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
    @Ctx() ctx: Context
  ): Promise<ChannelReportInfo> {
    const em = await this.em()
    const { user } = ctx
    return withHiddenEntities(em, async () => {
      // Try to retrieve the channel first
      const channel = await em.findOne(Channel, {
        where: { id: channelId },
      })
      if (!channel) {
        throw new Error(`Channel by id ${channelId} not found!`)
      }
      // Check whether the user already reported the channel
      const existingReport = await em.findOne(Report, {
        where: { channelId, videoId: IsNull(), userId: user.id },
      })
      // If report already exists - return its data with { created: false }
      if (existingReport) {
        return {
          id: existingReport.id,
          channelId,
          created: false,
          createdAt: existingReport.timestamp,
          rationale: existingReport.rationale,
        }
      }
      // If report doesn't exist, create a new one
      const newReport = new Report({
        id: uniqueId(8),
        channelId,
        userId: user.id,
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
      }
    })
  }
}
