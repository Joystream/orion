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
} from './types'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { Channel, ChannelFollow } from '../../../model'
import { randomAsHex } from '@polkadot/util-crypto'
import { Report } from '../../../model/Report'
import { extendClause } from '../../../utils/sql'
import { buildExtendedChannelsQuery } from './utils'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { model } from '../model'

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
    @Ctx() ctx: Context
  ): Promise<ChannelFollowResult> {
    const em = await this.em()
    const { ip } = ctx.req
    return em.transaction(async (em) => {
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
        where: { channel: { id: channelId }, ip },
      })
      // If so - just return the result
      if (existingFollow) {
        return {
          channelId,
          followId: existingFollow.id,
          follows: channel.followsNum,
          cancelToken: existingFollow.cancelToken,
          added: false,
        }
      }
      // Otherwise add a new follow
      const cancelToken = randomAsHex(32).replace('0x', '')
      channel.followsNum += 1
      const newFollow = new ChannelFollow({
        cancelToken,
        channel,
        ip,
        timestamp: new Date(),
      })

      await em.save([channel, newFollow])

      return {
        channelId,
        followId: newFollow.id,
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
    return em.transaction(async (em) => {
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
        where: { channel: { id: channelId }, cancelToken: token },
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
    const { ip } = ctx.req
    return em.transaction(async (em) => {
      // Try to retrieve the channel first
      const channel = await em.findOne(Channel, {
        where: { id: channelId },
      })
      if (!channel) {
        throw new Error(`Channel by id ${channelId} not found!`)
      }
      // We allow only one report per specific entity per ip
      const existingReport = await em.findOne(Report, {
        where: { ip, channel: { id: channelId }, video: IsNull() },
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
        channel,
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
