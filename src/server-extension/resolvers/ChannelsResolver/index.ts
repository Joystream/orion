import 'reflect-metadata'
import { Args, Query, Mutation, Resolver, Info, Ctx, UseMiddleware } from 'type-graphql'
import { EntityManager, In, IsNull } from 'typeorm'
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
  SetChannelYppStatusResult,
  SetChannelYppStatusArgs,
  SetChannelYppStatusInput,
  ChannelYppInputStatus,
  SetChannelYtSyncEnabledArgs,
  SetChannelYtSyncEnabledResult,
} from './types'
import { GraphQLResolveInfo } from 'graphql'
import {
  Account,
  Channel,
  ChannelFollow,
  Report,
  Membership,
  NewChannelFollower,
  ChannelVerified,
  YppVerified,
  YppSuspended,
  ChannelRecipient,
  ChannelTier,
  OperatorPermission,
  ChannelYppStatus,
  YppUnverified,
  ChannelSuspended,
} from '../../../model'
import { extendClause, withHiddenEntities } from '../../../utils/sql'
import { buildExtendedChannelsQuery, buildTopSellingChannelsQuery } from './utils'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { model } from '../model'
import { Context } from '../../check'
import { uniqueId } from '../../../utils/crypto'
import { AccountOnly, OperatorOnly, UserOnly } from '../middleware'
import { addNotification } from '../../../utils/notification'
import { assertNotNull } from '@subsquid/substrate-processor'
import pLimit from 'p-limit'

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

      const ownerAccount = channel.ownerMemberId
        ? await em.getRepository(Account).findOneBy({ membershipId: channel.ownerMemberId })
        : null
      if (ownerAccount) {
        if (!ctx.account) {
          // account not null because of the UseMiddleware(AccountOnly) decorator
          throw new Error('Account not specified')
        }
        const followerMembership = await em
          .getRepository(Membership)
          .findOneByOrFail({ id: ctx.account.membershipId })
        await addNotification(
          em,
          ownerAccount,
          new ChannelRecipient({ channel: channel.id }),
          new NewChannelFollower({
            followerId: assertNotNull(followerMembership.id),
            followerHandle: assertNotNull(followerMembership.handle),
          })
        )
      }

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

  @UseMiddleware(UserOnly)
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

  @Mutation(() => [SetChannelYppStatusResult])
  @UseMiddleware(OperatorOnly(OperatorPermission.SET_CHANNEL_YPP_STATUS))
  async setChannelYppStatus(
    @Args() { channels, skipNotification }: SetChannelYppStatusArgs
  ): Promise<SetChannelYppStatusResult[]> {
    const em = await this.em()
    return await setChannelsYppStatus(em, channels, skipNotification)
  }

  @Mutation(() => SetChannelYtSyncEnabledResult)
  @UseMiddleware(OperatorOnly(OperatorPermission.SET_CHANNEL_YPP_STATUS))
  async setChannelYoutubeSyncEnabled(
    @Args() { ids, isYtSyncEnabled }: SetChannelYtSyncEnabledArgs
  ): Promise<SetChannelYtSyncEnabledResult> {
    const em = await this.em()
    return withHiddenEntities(em, async () => {
      const result = await em.getRepository(Channel).update({ id: In(ids) }, { isYtSyncEnabled })
      return { updatedChannels: result.affected || 0 }
    })
  }
}

export const channelYppStatusToInputStatus = (
  status?: ChannelYppStatus | null
): ChannelYppInputStatus => {
  if (status?.isTypeOf === 'YppVerified') {
    switch (status.tier) {
      case ChannelTier.BRONZE:
        return ChannelYppInputStatus.VerifiedBronze
      case ChannelTier.SILVER:
        return ChannelYppInputStatus.VerifiedSilver
      case ChannelTier.GOLD:
        return ChannelYppInputStatus.VerifiedGold
      case ChannelTier.DIAMOND:
        return ChannelYppInputStatus.VerifiedDiamond
      default:
        throw new Error(`Unknown ChannelTier: ${status.tier}`)
    }
  }
  if (status?.isTypeOf === 'YppSuspended') {
    return ChannelYppInputStatus.Suspended
  }
  if (status?.isTypeOf === 'YppUnverified') {
    return ChannelYppInputStatus.Unverified
  }
  return ChannelYppInputStatus.Empty
}

export const channelYppInputStatusToStatus = (
  status: ChannelYppInputStatus,
  timestamp: Date
): ChannelYppStatus | null => {
  switch (status) {
    case ChannelYppInputStatus.VerifiedBronze:
      return new YppVerified({ tier: ChannelTier.BRONZE, timestamp })
    case ChannelYppInputStatus.VerifiedSilver:
      return new YppVerified({ tier: ChannelTier.SILVER, timestamp })
    case ChannelYppInputStatus.VerifiedGold:
      return new YppVerified({ tier: ChannelTier.GOLD, timestamp })
    case ChannelYppInputStatus.VerifiedDiamond:
      return new YppVerified({ tier: ChannelTier.DIAMOND, timestamp })
    case ChannelYppInputStatus.Suspended:
      return new YppSuspended({ timestamp })
    case ChannelYppInputStatus.Unverified:
      return new YppUnverified({ timestamp })
    case ChannelYppInputStatus.Empty:
      return null
    default:
      throw new Error(`Unknown ChannelYppInputStatus: ${status}`)
  }
}

export const setChannelYppStatus = async (
  em: EntityManager,
  channel: Channel,
  status: ChannelYppInputStatus,
  skipNotification = false
): Promise<SetChannelYppStatusResult> => {
  const currentTimestamp = new Date()
  const previousStatus = channelYppStatusToInputStatus(channel.yppStatus)
  const newStatus = status
  const changed = previousStatus !== newStatus
  const result: SetChannelYppStatusResult = {
    id: channel.id,
    newStatus,
    previousStatus,
    timestamp: changed ? currentTimestamp : channel.yppStatus?.timestamp,
    updated: false,
    notificationAdded: false,
  }
  // If channel status didn't change - just return the current status
  if (!changed) {
    return result
  }
  // othewise update the status
  channel.yppStatus = channelYppInputStatusToStatus(status, currentTimestamp)
  await em.save(channel)
  result.updated = true

  const statusType = channel.yppStatus?.isTypeOf
  // Deposit notification if:
  // 1. skipNotification is false
  // 2. channel has an owner member ID and an associated account
  // 3. status changed to either YppSuspended or YppVerified
  if (
    !skipNotification &&
    channel.ownerMemberId &&
    (statusType === 'YppSuspended' || statusType === 'YppVerified')
  ) {
    const account = await em.findOne(Account, {
      where: { membershipId: channel.ownerMemberId },
    })
    if (account) {
      await addNotification(
        em,
        account,
        new ChannelRecipient({ channel: channel.id }),
        statusType === 'YppVerified' ? new ChannelVerified({}) : new ChannelSuspended({})
      )
      result.notificationAdded = true
    }
  }

  return result
}

export const setChannelsYppStatus = async (
  em: EntityManager,
  inputs: SetChannelYppStatusInput[],
  skipNotification = false
): Promise<SetChannelYppStatusResult[]> => {
  return withHiddenEntities(em, async () => {
    const channels = await em.getRepository(Channel).find({
      where: { id: In(inputs.map(({ id }) => id)) },
    })
    const limit = pLimit(5) // Limit to 5 concurrent promises
    const channelUpdates = channels.flatMap((channel) => {
      const input = inputs.find((i) => i.id === channel.id)
      return input ? [[channel, input.status] as const] : []
    })
    return await Promise.all(
      channelUpdates.map(([channel, status]) =>
        limit(() => setChannelYppStatus(em, channel, status, skipNotification))
      )
    )
  })
}
