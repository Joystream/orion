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
),
ranked_tokens AS (
    SELECT token_id, ammVolume,
           ROW_NUMBER() OVER (ORDER BY ammVolume DESC) AS growth_rank
    FROM tokens_volumes
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

    listQuerySql = extendClause(listQuerySql, 'SELECT', 'rT.ammVolume')

    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      'LEFT JOIN ranked_tokens rT ON rT.token_id = creator_token.id',
      ''
    )

    listQuerySql = extendClause(listQuerySql, 'WHERE', 'rT.growth_rank <= 10', 'AND')
    listQuerySql = extendClause(listQuerySql, 'ORDER BY', 'rT.growth_rank', '')

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
  async hotAndColdTokens(
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
WITH recent_transactions AS (
    SELECT
        tr.amm_id,
        ac.token_id,
        ROUND(tr.price_paid / tr.quantity) AS price_paid,
        tr.created_in
    FROM amm_transaction tr
    JOIN amm_curve ac ON tr.amm_id = ac.id
    WHERE tr.created_in >= ${lastProcessedBlock - args.periodDays * BLOCKS_PER_DAY}
),
oldest_transactions AS (
    SELECT
        tr.token_id,
        tr.price_paid AS oldest_price_paid
    FROM recent_transactions tr
    JOIN (
        SELECT token_id, MIN(created_in) AS oldest_created_in
        FROM recent_transactions
        GROUP BY token_id
    ) oldest ON tr.token_id = oldest.token_id AND tr.created_in = oldest.oldest_created_in
),
newest_transactions AS (
    SELECT
        tr.token_id,
        tr.price_paid AS newest_price_paid
    FROM recent_transactions tr
    JOIN (
        SELECT token_id, MAX(created_in) AS newest_created_in
        FROM recent_transactions
        GROUP BY token_id
    ) newest ON tr.token_id = newest.token_id AND tr.created_in = newest.newest_created_in
),
price_changes AS (
    SELECT 
        ot.token_id,
        ot.oldest_price_paid,
        nt.newest_price_paid,
        CASE 
            WHEN ot.oldest_price_paid = 0 THEN 0
            ELSE ((nt.newest_price_paid - ot.oldest_price_paid) * 100.0 / ot.oldest_price_paid)
        END AS percentage_change
    FROM oldest_transactions ot
    JOIN newest_transactions nt ON ot.token_id = nt.token_id
),
ranked_tokens AS (
    SELECT token_id, percentage_change, newest_price_paid, oldest_price_paid,
           ROW_NUMBER() OVER (ORDER BY percentage_change DESC) AS growth_rank,
           ROW_NUMBER() OVER (ORDER BY percentage_change ASC) AS shrink_rank
    FROM price_changes
),
top_tokens AS (
    SELECT *
    FROM ranked_tokens
    WHERE growth_rank <= 10 OR shrink_rank <= 10
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
      `tT.percentage_change as pricePercentageChange,
(CASE WHEN tT.growth_rank <= 10 THEN 'hot' ELSE 'cold' END) AS result_type
      `
    )

    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      'LEFT JOIN top_tokens tT ON creator_token.id = tT.token_id',
      ''
    )

    listQuerySql = extendClause(
      listQuerySql,
      'WHERE',
      '(tT.growth_rank <= 10 OR tT.shrink_rank <= 10) AND tT.percentage_change > 0',
      'AND'
    )

    listQuerySql = `${topTokensCtes} ${listQuerySql}`
    console.log('sql,', listQuerySql)
    ;(listQuery as { sql: string }).sql = listQuerySql

    const oldListQMap = listQuery.map.bind(listQuery)
    listQuery.map = (rows: unknown[][]) => {
      const pricePercentageChanges: unknown[] = []
      const resultTypes: unknown[] = []

      for (const row of rows) {
        resultTypes.push(row.pop())
        pricePercentageChanges.push(row.pop())
      }
      const channelsMapped = oldListQMap(rows)
      return channelsMapped.map((creatorToken, i) => ({
        creatorToken,
        pricePercentageChange: pricePercentageChanges[i] ?? 0,
        resultType: resultTypes[i],
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
    console.log('xd', JSON.stringify(videoFields), sqlArgs)
    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'MarketplaceToken',
      videoFields,
      sqlArgs
    )

    let listQuerySql = listQuery.sql

    console.log('test', listQuerySql)
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
