import { useSubscription } from '@apollo/client'
import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
  OperationVariables,
} from '@apollo/client/core'
import { extendDebug, Debugger } from './Debugger'
import { Maybe } from './graphql/generated/schema'
import { TokenId } from './consts'
import {
  GetChannelByIdSubscription,
  GetAmmTransactionById,
  GetAmmById,
  AmmCurvFieldsFragment,
  GetAmmByIdSubscription,
  GetVestedAccountByIdSubscription,
  VestedAccountFieldsFragment,
  GetSaleByIdSubscription,
  GetSaleByIdSubscriptionVariables,
  GetVestingScheduleById,
  VestingScheduleFieldsFragment,
  GetVestingScheduleByIdSubscription,
  GetRevenueShareParticipationById,
  RevenueShareParticipationFieldsFragment,
  GetRevenueShareByIdSubscription,
  GetRevenueShareById,
  GetRevenueShareByIdSubscriptionVariables,
  GetRevenueShareParticipationByIdSubscription,
  GetRevenueShareParticipationByIdSubscriptionVariables,
  GetTokenAccountById,
  GetTokenById,
  RevenueShareFieldsFragment,
  TokenAccountFieldsFragment,
  GetTokenAccountByIdSubscription,
  GetTokenByIdSubscription,
  GetTokenByIdSubscriptionVariables,
  TokenFieldsFragment,
  GetVestedAccountByIdSubscriptionVariables,
  GetVestingScheduleByIdSubscriptionVariables,
  GetSaleById,
  SaleFieldsFragment,
  GetVestedAccountById,
  GetAmmTransactionByIdSubscriptionVariables,
  GetAmmTransactionByIdSubscription,
  ChannelFieldsFragment,
  GetChannelByIdSubscriptionVariables,
  AmmTransactionFieldsFragment,
  GetChannelById,
  GetShareDividend,
  GetCumulativeHistoricalShareAllocationForToken,
  GetAccountTransferrableBalance,
} from '../graphql/generated/operations'

export class OrionApi {
  private readonly apolloClient: ApolloClient<NormalizedCacheObject>
  private readonly debug: Debugger.Debugger
  private readonly queryDebug: Debugger.Debugger
  private readonly tryDebug: Debugger.Debugger

  constructor(apolloClient: ApolloClient<NormalizedCacheObject>) {
    this.apolloClient = apolloClient
    this.debug = extendDebug('query-node-api')
    this.queryDebug = this.debug.extend('query')
    this.tryDebug = this.debug.extend('try')
  }

  /**
   * Get entity from subscription
   *
   * @param query - actual query
   * @param variables - query parameters
   * @param resultKey - helps result parsing
   */
  public async uniqueEntitySubscription<
    SubscriptionT extends { [k: string]: Maybe<Record<string, unknown>> },
    VariablesT extends Record<string, unknown>
  >(
    query: DocumentNode,
    variables: VariablesT,
    resultKey: keyof SubscriptionT
  ): Promise<SubscriptionT[keyof SubscriptionT] | null> {
    return new Promise((resolve) => {
      this.apolloClient.subscribe({ query, variables }).subscribe(({ data }) => {
        resolve(data ? data[resultKey] : null)
      })
    })
  }

  /**
   * Run query from query
   *
   * @param query - actual query
   * @param variables - query parameters
   * @param resultKey - helps result parsing
   */
  public async runQuery<
    QueryT extends { [k: string]: Maybe<Record<string, unknown>> },
    VariablesT extends Record<string, unknown>
  >(
    query: DocumentNode,
    variables: VariablesT,
    resultKey: keyof QueryT
  ): Promise<QueryT[keyof QueryT] | null> {
    return new Promise((resolve) => {
      this.apolloClient.query({ query, variables }).then(({ data }) => {
        resolve(data ? data[resultKey] : null)
      })
    })
  }

  public async retryQuery<QueryResultT>(
    query: () => Promise<QueryResultT>,
    attempts = 6,
    timeout = 6000
  ): Promise<QueryResultT | null> {
    const label = query.toString().replace(/^.*\.([A-za-z0-9]+\(.*\))$/g, '$1')
    const debug = this.tryDebug.extend(label)
    let result = null

    while (attempts < 6 && result === null) {
      debug(`trying subscription: ${label}`)
      result = await query()

      if (result === null) {
        // Wait for 6 seconds before trying again
        await new Promise((resolve) => setTimeout(resolve, timeout))
        attempts++
      }
    }

    if (result === null) {
      debug('max amount of retries for orion graphql server')
    }

    return result
  }

  public async getTokenById(id: TokenId): Promise<Maybe<TokenFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetTokenByIdSubscription,
      GetTokenByIdSubscriptionVariables
    >(GetTokenById, { id: id.toString() }, 'creatorTokenById')
  }

  public async getTokenAccountByTokenIdAndMemberId(
    tokenId: TokenId,
    memberId: number
  ): Promise<Maybe<TokenAccountFieldsFragment> | undefined> {
    const qToken = await this.getTokenById(tokenId)
    const qAccountInfo = qToken!.accounts.find(
      (account: any) => account.member.id.toString() === memberId.toString()
    )
    if (Boolean(qAccountInfo)) {
      return await this.getTokenAccountById(qAccountInfo!.id)
    } else {
      return undefined
    }
  }

  public async getTokenAccountById(
    id: string
  ): Promise<Maybe<TokenAccountFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetTokenAccountByIdSubscription,
      GetTokenByIdSubscriptionVariables
    >(GetTokenAccountById, { id: id }, 'tokenAccountById')
  }

  public async getRevenueShareById(
    id: string
  ): Promise<Maybe<RevenueShareFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetRevenueShareByIdSubscription,
      GetRevenueShareByIdSubscriptionVariables
    >(GetRevenueShareById, { id }, 'revenueShareById')
  }

  public async getRevenueShareParticpationById(
    shareId: string,
    accountId: string
  ): Promise<Maybe<RevenueShareParticipationFieldsFragment> | undefined> {
    const account = await this.getTokenAccountById(accountId)
    if (!Boolean(account?.revenueShareParticipation)) {
      return undefined
    }
    const maybeParticipationInfo = account?.revenueShareParticipation.find((participation) => {
      return participation.revenueShare.id === shareId
    })
    if (!Boolean(maybeParticipationInfo)) {
      return undefined
    } else {
      const { id } = maybeParticipationInfo!
      return this.uniqueEntitySubscription<
        GetRevenueShareParticipationByIdSubscription,
        GetRevenueShareParticipationByIdSubscriptionVariables
      >(GetRevenueShareParticipationById, { id }, 'revenueShareParticipationById')
    }
  }

  public async getVestingSchedulById(
    id: string
  ): Promise<Maybe<VestingScheduleFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetVestingScheduleByIdSubscription,
      GetVestingScheduleByIdSubscriptionVariables
    >(GetVestingScheduleById, { id }, 'vestingScheduleById')
  }

  public async getSaleById(id: string): Promise<Maybe<SaleFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<GetSaleByIdSubscription, GetSaleByIdSubscriptionVariables>(
      GetSaleById,
      { id },
      'saleById'
    )
  }

  public async getVestedAccountById(
    id: string
  ): Promise<Maybe<VestedAccountFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetVestedAccountByIdSubscription,
      GetVestedAccountByIdSubscriptionVariables
    >(GetVestedAccountById, { id }, 'vestedAccountById')
  }

  public async getCurrentSaleForTokenId(
    tokenId: TokenId
  ): Promise<Maybe<SaleFieldsFragment> | undefined> {
    const qToken = await this.getTokenById(tokenId)
    if (!Boolean(qToken!.currentSale)) {
      return undefined
    }
    const qSale = await this.getSaleById(qToken!.currentSale!.id.toString())
    return qSale
  }

  public async getAmmById(id: string): Promise<Maybe<AmmCurvFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetAmmByIdSubscription,
      GetAmmTransactionByIdSubscriptionVariables
    >(GetAmmById, { id }, 'ammCurveById')
  }

  public async getAmmTransactionById(
    id: string
  ): Promise<Maybe<AmmTransactionFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetAmmTransactionByIdSubscription,
      GetAmmTransactionByIdSubscriptionVariables
    >(GetAmmTransactionById, { id }, 'ammTransactionById')
  }

  public async getChannelById(id: string): Promise<Maybe<ChannelFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetChannelByIdSubscription,
      GetChannelByIdSubscriptionVariables
    >(GetChannelById, { id }, 'channelById')
  }

  public async getShareDividend(
    tokenId: string,
    stakingAmount: number
  ): Promise<number | undefined> {
    const result = await this.runQuery(
      GetShareDividend,
      { tokenId, stakingAmount },
      'getShareDividend'
    )
    if (result?.dividendJoyAmount !== undefined) {
      return result.dividendJoyAmount as number
    }
    return undefined
  }

  public async getCumulativeHistoricalAllocationForToken(
    tokenId: string
  ): Promise<number | undefined> {
    const result = await this.runQuery(
      GetCumulativeHistoricalShareAllocationForToken,
      { tokenId },
      'getCumulativeHistoricalShareAllocation'
    )
    if (result?.cumulativeHistoricalAllocation !== undefined) {
      return result.cumulativeHistoricalAllocation as number
    }
    return undefined
  }

  public async getAccountTransferrableBalance(
    tokenId: string,
    memberId: string,
    currentBlockHeight: number
  ): Promise<number | undefined> {
    const result = await this.runQuery(
      GetAccountTransferrableBalance,
      { tokenId, memberId, currentBlockHeight },
      'getAccountTransferrableBalance'
    )
    if (result?.transferrableCrtAmount !== undefined) {
      return result.transferrableCrtAmount as number
    }
    return undefined
  }
}
