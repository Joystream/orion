import { Args, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { CreatorToken, RevenueShare, TokenAccount } from '../../../model'
import { computeTransferrableAmount } from './services'
import {
  GetAccountTransferrableBalanceArgs,
  GetAccountTransferrableBalanceResult,
  GetCumulativeHistoricalShareAllocationArgs,
  GetCumulativeHistoricalShareAllocationResult,
  GetShareDividendsResult,
  GetShareDividensArgs,
} from './types'

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
