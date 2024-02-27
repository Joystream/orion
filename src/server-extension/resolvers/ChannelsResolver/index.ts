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
  ExcludeChannelArgs,
  ExcludeChannelResult,
  VerifyChannelArgs,
  VerifyChannelResult,
  SuspendChannelResult,
  SuspendChannelArgs,
} from './types'
import { GraphQLResolveInfo } from 'graphql'
import {
  Account,
  Channel,
  ChannelFollow,
  Report,
  Membership,
  Exclusion,
  NewChannelFollower,
  ChannelExcluded,
  ChannelVerified,
  ChannelVerification,
  ChannelSuspension,
  ChannelSuspended,
  YppVerified,
  YppSuspended,
  ChannelRecipient,
  MemberRecipient,
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
import { FALLBACK_CHANNEL_TITLE } from '../../../mappings/content/utils'
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

  @Mutation(() => [SuspendChannelResult])
  @UseMiddleware(OperatorOnly())
  async suspendChannels(
    @Args() { channelIds }: SuspendChannelArgs
  ): Promise<SuspendChannelResult[]> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const channels = await em.find(Channel, {
        where: { id: In(channelIds) },
      })

      const suspendChannel = async (channel: Channel) => {
        // If channel already suspended - return its data
        if (channel.yppStatus.isTypeOf === 'YppSuspended') {
          const existingSuspension = await em.getRepository(ChannelSuspension).findOneOrFail({
            where: { id: channel.yppStatus.suspension },
          })
          return {
            id: existingSuspension.id,
            channelId: channel.id,
            createdAt: existingSuspension.timestamp,
          }
        }
        // otherwise create a new suspension
        const newSuspension = new ChannelSuspension({
          id: uniqueId(),
          channelId: channel.id,
          timestamp: new Date(),
        })
        channel.yppStatus = new YppSuspended({ suspension: newSuspension.id })
        await em.save([newSuspension, channel])

        // in case account exist deposit notification
        const channelOwnerMemberId = channel.ownerMemberId
        if (channelOwnerMemberId) {
          const account = await em.findOne(Account, {
            where: { membershipId: channelOwnerMemberId },
          })
          await addNotification(
            em,
            account,
            new ChannelRecipient({ channel: channel.id }),
            new ChannelSuspended({})
          )
        }

        return {
          id: newSuspension.id,
          channelId: channel.id,
          createdAt: newSuspension.timestamp,
        }
      }

      const limit = pLimit(5) // Limit to 5 concurrent promises
      const existingChannels = channels.filter((channel) => channel)
      return await Promise.all(
        existingChannels.map((channel) => limit(async () => await suspendChannel(channel)))
      )
    })
  }

  @Mutation(() => VerifyChannelResult)
  @UseMiddleware(OperatorOnly())
  async verifyChannel(@Args() { channelIds }: VerifyChannelArgs): Promise<VerifyChannelResult[]> {
    const em = await this.em()
    return await verifyChannelService(em, channelIds)
  }

  @Mutation(() => ExcludeChannelResult)
  @UseMiddleware(OperatorOnly())
  async excludeChannel(
    @Args() { channelId, rationale }: ExcludeChannelArgs
  ): Promise<ExcludeChannelResult> {
    const em = await this.em()
    return await excludeChannelService(em, channelId, rationale)
  }
}

export const excludeChannelService = async (
  em: EntityManager,
  channelId: string,
  rationale: string
): Promise<ExcludeChannelResult> => {
  return withHiddenEntities(em, async () => {
    const channel = await em.findOne(Channel, {
      where: { id: channelId },
    })

    if (!channel) {
      throw new Error(`Channel by id ${channelId} not found!`)
    }
    const existingExclusion = await em.findOne(Exclusion, {
      where: { channelId: channel.id, videoId: IsNull() },
    })
    // If exclusion already exists - return its data with { created: false }
    if (existingExclusion) {
      return {
        id: existingExclusion.id,
        channelId: channel.id,
        created: false,
        createdAt: existingExclusion.timestamp,
        rationale: existingExclusion.rationale,
      }
    }
    // If exclusion doesn't exist, create a new one
    const newExclusion = new Exclusion({
      id: uniqueId(8),
      channelId: channel.id,
      rationale,
      timestamp: new Date(),
    })
    channel.isExcluded = true
    await em.save([newExclusion, channel])

    // in case account exist deposit notification
    const channelOwnerMemberId = channel.ownerMemberId
    if (channelOwnerMemberId) {
      const account = await em.findOne(Account, { where: { membershipId: channelOwnerMemberId } })
      await addNotification(
        em,
        account,
        new MemberRecipient({ membership: channelOwnerMemberId }),
        new ChannelExcluded({ channelTitle: channel.title ?? FALLBACK_CHANNEL_TITLE })
      )
    }

    return {
      id: newExclusion.id,
      channelId: channel.id,
      videoId: null,
      created: true,
      createdAt: newExclusion.timestamp,
      rationale,
    }
  })
}

export const verifyChannelService = async (em: EntityManager, channelIds: string[]) => {
  return withHiddenEntities(em, async () => {
    const channels = await em.getRepository(Channel).find({
      where: { id: In(channelIds) },
    })

    const verifyChannel = async (channel: Channel) => {
      // If channel already verified - return its data
      if (channel.yppStatus.isTypeOf === 'YppVerified') {
        const existingVerification = await em.getRepository(ChannelVerification).findOneOrFail({
          where: { channelId: channel.id },
        })
        return {
          id: existingVerification.id,
          channelId: channel.id,
          createdAt: existingVerification.timestamp,
        }
      }
      // othewise create new verification regardless whether the channel was previously verified
      const newVerification = new ChannelVerification({
        id: uniqueId(),
        channelId: channel.id,
        timestamp: new Date(),
      })
      channel.yppStatus = new YppVerified({ verification: newVerification.id })
      await em.save([newVerification, channel])

      // in case account exist deposit notification
      const channelOwnerMemberId = channel.ownerMemberId
      if (channelOwnerMemberId) {
        const account = await em.findOne(Account, {
          where: { membershipId: channelOwnerMemberId },
        })
        await addNotification(
          em,
          account,
          new ChannelRecipient({ channel: channel.id }),
          new ChannelVerified({})
        )
      }

      return {
        id: newVerification.id,
        channelId: channel.id,
        createdAt: newVerification.timestamp,
      }
    }

    const limit = pLimit(5) // Limit to 5 concurrent promises
    const existingChannels = channels.filter((channel) => channel)
    return await Promise.all(
      existingChannels.map((channel) => limit(async () => await verifyChannel(channel)))
    )
  })
}
