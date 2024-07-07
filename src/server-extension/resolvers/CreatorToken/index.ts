import { Args, Ctx, Info, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { CreatorToken, RevenueShare, TokenAccount } from '../../../model'
import { model } from '../model'
import { GraphQLResolveInfo } from 'graphql'
import { computeTransferrableAmount } from './services'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import {
  GetAccountTransferrableBalanceArgs,
  GetAccountTransferrableBalanceResult,
  GetCumulativeHistoricalShareAllocationArgs,
  GetCumulativeHistoricalShareAllocationResult,
  GetShareDividendsResult,
  GetShareDividensArgs,
  MarketplaceTokensArgs,
  CreatorToken as TokenReturnType,
  MarketplaceTokensReturnType,
  TopSellingTokensReturnType,
  MarketplaceTableTokensArgs,
  MarketplaceToken,
  MarketplaceTokenCount,
  MarketplaceTokensCountArgs,
} from './types'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { parseAnyTree, parseSqlArguments } from '@subsquid/openreader/lib/opencrud/tree'
import { extendClause } from '../../../utils/sql'
import { Context } from '../../check'
import { getCurrentBlockHeight } from '../../../utils/blockHeight'

export const BLOCKS_PER_DAY = 10 * 60 * 24 // 10 blocs per minute, 60 mins * 24 hours

@Resolver()
export class TokenResolver {
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => GetShareDividendsResult)
  async getShareDividend(
    @Args() { tokenId, stakingAmount }: GetShareDividensArgs
  ): Promise<GetShareDividendsResult> {
    const em = await this.em()
    const token = await em.getRepository(CreatorToken).findOneBy({ id: tokenId })
    if (!token) {
      throw new Error('Token not found')
    }
    const { currentRevenueShareId: revenueShareId, totalSupply } = token
    if (!revenueShareId) {
      throw new Error('No Revenue share ongoing for this token')
    }

    const revenueShare = await em.getRepository(RevenueShare).findOneBy({ id: revenueShareId })
    if (!revenueShare) {
      throw new Error('Revenue share not found')
    }
    const { allocation } = revenueShare

    const dividendJoyAmount = (BigInt(stakingAmount) * allocation) / totalSupply
    return {
      dividendJoyAmount: dividendJoyAmount.toString(),
    }
  }

  @Query(() => [TopSellingTokensReturnType])
  async topSellingToken(
    @Args() args: MarketplaceTokensArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ) {
    const em = await this.em()
    const { lastProcessedBlock } = await getCurrentBlockHeight(em)

    if (lastProcessedBlock < 0) {
      throw new Error('Failed to retrieve processor block height')
    }
    const tree = getResolveTree(info)
    const sqlArgs = parseSqlArguments(model, 'CreatorToken', {
      where: args.where,
    })

    const tokenSubTree = tree.fieldsByTypeName.TopSellingTokensReturnType.creatorToken
    const tokenFields = parseAnyTree(model, 'CreatorToken', info.schema, tokenSubTree)

    const topTokensCtes = `
WITH  tokens_volumes AS (
   SELECT ac.token_id,
        SUM(tr.price_paid) as ammVolume
   FROM amm_transaction tr
   JOIN amm_curve ac ON ac.id = tr.amm_id
   WHERE tr.created_in >= ${lastProcessedBlock - args.periodDays * BLOCKS_PER_DAY}
   GROUP BY token_id
)
`

    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'CreatorToken',
      tokenFields,
      sqlArgs
    )

    let listQuerySql = listQuery.sql

    listQuerySql = extendClause(listQuerySql, 'SELECT', 'COALESCE(tV.ammVolume, 0)')

    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      'LEFT JOIN tokens_volumes tV ON tV.token_id = creator_token.id',
      ''
    )

    if (typeof args.orderByPriceDesc === 'boolean') {
      listQuerySql = extendClause(
        listQuerySql,
        'ORDER BY',
        `COALESCE(tV.ammVolume, 0) ${args.orderByPriceDesc ? 'DESC' : 'ASC'}`,
        ''
      )
    }

    const limit = args.limit ?? 10

    listQuerySql = extendClause(listQuerySql, 'LIMIT', String(limit), '')

    listQuerySql = `${topTokensCtes} ${listQuerySql}`
    ;(listQuery as { sql: string }).sql = listQuerySql

    const oldListQMap = listQuery.map.bind(listQuery)
    listQuery.map = (rows: unknown[][]) => {
      const ammVolumes: unknown[] = []

      for (const row of rows) {
        ammVolumes.push(row.pop())
      }
      const channelsMapped = oldListQMap(rows)
      return channelsMapped.map((creatorToken, i) => ({
        creatorToken,
        ammVolume: ammVolumes[i] ?? 0,
      }))
    }

    const result = await ctx.openreader.executeQuery(listQuery)

    return result as TokenReturnType[]
  }

  @Query(() => [MarketplaceTokensReturnType])
  async tokensWithPriceChange(
    @Args() args: MarketplaceTokensArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ) {
    const em = await this.em()
    const { lastProcessedBlock } = await getCurrentBlockHeight(em)

    if (lastProcessedBlock < 0) {
      throw new Error('Failed to retrieve processor block height')
    }

    const tree = getResolveTree(info)
    const sqlArgs = parseSqlArguments(model, 'CreatorToken', {
      where: args.where,
    })

    const tokenSubTree = tree.fieldsByTypeName.MarketplaceTokensReturnType.creatorToken
    const tokenFields = parseAnyTree(model, 'CreatorToken', info.schema, tokenSubTree)

    const topTokensCtes = `
WITH oldest_transactions AS (
    SELECT DISTINCT ON (ac.token_id) tr.amm_id,
                        ac.token_id,
                        tr.price_per_unit as oldest_price_paid,
                        tr.created_in
     FROM amm_transaction tr
     JOIN amm_curve ac ON tr.amm_id = ac.id
     WHERE tr.created_in <
             (SELECT height
              FROM squid_processor.status) - ${
                lastProcessedBlock - args.periodDays * BLOCKS_PER_DAY
              }
     ORDER BY ac.token_id,
              tr.created_in DESC
),
price_changes AS (
    SELECT 
        ot.token_id,
        ot.oldest_price_paid,
        ct.last_price,
        CASE 
            WHEN ot.oldest_price_paid = 0 THEN 0
            ELSE ((ct.last_price - ot.oldest_price_paid) * 100.0 / ot.oldest_price_paid)
        END AS percentage_change
    FROM oldest_transactions ot
    JOIN creator_token as ct ON ot.token_id = ct.id
)
`

    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'CreatorToken',
      tokenFields,
      sqlArgs
    )

    let listQuerySql = listQuery.sql

    listQuerySql = extendClause(
      listQuerySql,
      'SELECT',
      `COALESCE(pc.percentage_change, 0) as pricePercentageChange`
    )

    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      'LEFT JOIN price_changes pc ON creator_token.id = pc.token_id',
      ''
    )

    if (typeof args.orderByPriceDesc === 'boolean') {
      listQuerySql = extendClause(
        listQuerySql,
        'ORDER BY',
        `COALESCE(pc.percentage_change, 0) ${args.orderByPriceDesc ? 'DESC' : 'ASC'}`,
        ''
      )
    }

    const limit = args.limit ?? 10

    listQuerySql = extendClause(listQuerySql, 'LIMIT', String(limit), '')

    listQuerySql = `${topTokensCtes} ${listQuerySql}`
    ;(listQuery as { sql: string }).sql = listQuerySql

    const oldListQMap = listQuery.map.bind(listQuery)
    listQuery.map = (rows: unknown[][]) => {
      const pricePercentageChanges: unknown[] = []

      for (const row of rows) {
        pricePercentageChanges.push(row.pop())
      }
      const channelsMapped = oldListQMap(rows)
      return channelsMapped.map((creatorToken, i) => ({
        creatorToken,
        pricePercentageChange: pricePercentageChanges[i] ?? 0,
      }))
    }

    const result = await ctx.openreader.executeQuery(listQuery)

    return result as TokenReturnType[]
  }

  @Query(() => MarketplaceTokenCount)
  async getMarketplaceTokensCount(
    @Args() args: MarketplaceTokensCountArgs,
    @Info() _: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<MarketplaceTokenCount> {
    const sqlArgs = parseSqlArguments(model, 'MarketplaceToken', {
      where: args.where,
    })

    const idField = [
      {
        'field': 'id',
        'aliases': ['id'],
        'kind': 'scalar',
        'type': { 'kind': 'scalar', 'name': 'ID' },
        'prop': {
          'type': { 'kind': 'scalar', 'name': 'ID' },
          'nullable': false,
          'description': 'runtime token identifier',
        },
        'index': 0,
      },
    ]

    // TODO: this could be replaced with CountQuery
    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'MarketplaceToken',
      idField as any,
      sqlArgs
    )

    let listQuerySql = listQuery.sql

    listQuerySql = `SELECT COUNT(*) ${listQuerySql.slice(listQuerySql.indexOf('FROM'))}`
    listQuerySql = listQuerySql.replace(/marketplace_token/g, 'marketplace_tokens')
    ;(listQuery as { sql: string }).sql = listQuerySql

    const result = await ctx.openreader.executeQuery(listQuery)

    return {
      // since ID is index 0 variable
      count: result[0].id,
    }
  }

  @Query(() => [MarketplaceToken])
  async getMarketplaceTokens(
    @Args() args: MarketplaceTableTokensArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<MarketplaceToken[]> {
    const tree = getResolveTree(info)

    const sqlArgs = parseSqlArguments(model, 'MarketplaceToken', {
      limit: args.limit,
      where: args.where,
      orderBy: args.orderBy,
      offset: args.offset,
    })

    const videoFields = parseAnyTree(model, 'MarketplaceToken', info.schema, tree)
    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'MarketplaceToken',
      videoFields,
      sqlArgs
    )

    let listQuerySql = listQuery.sql

    listQuerySql = listQuerySql.replace(/marketplace_token/g, 'marketplace_tokens')
    ;(listQuery as { sql: string }).sql = listQuerySql

    const result = await ctx.openreader.executeQuery(listQuery)

    return result as MarketplaceToken[]
  }

  @Query(() => GetCumulativeHistoricalShareAllocationResult)
  async getCumulativeHistoricalShareAllocation(
    @Args() { tokenId }: GetCumulativeHistoricalShareAllocationArgs
  ): Promise<GetCumulativeHistoricalShareAllocationResult> {
    const em = await this.em()
    const token = await em
      .getRepository(CreatorToken)
      .findOne({ where: { id: tokenId }, relations: { revenueShares: true } })
    if (!token) {
      throw new Error('Token not found')
    }
    let cumulativeAllocationAmount = BigInt(0)
    for (const share of token.revenueShares) {
      cumulativeAllocationAmount += share.allocation
    }
    return {
      cumulativeHistoricalAllocation: cumulativeAllocationAmount.toString(),
    }
  }

  @Query(() => GetAccountTransferrableBalanceResult)
  async getAccountTransferrableBalance(
    @Args() { tokenId, memberId, currentBlockHeight: block }: GetAccountTransferrableBalanceArgs
  ): Promise<GetAccountTransferrableBalanceResult> {
    // Your implementation here
    const em = await this.em()
    const tokenAccount = await em.getRepository(TokenAccount).findOne({
      where: { tokenId, memberId },
      relations: {
        vestingSchedules: {
          vesting: true,
        },
      },
    })
    if (!tokenAccount) {
      throw new Error('Token account not found')
    }
    return {
      transferrableCrtAmount: Number(computeTransferrableAmount(tokenAccount, block)),
    }
  }
}
