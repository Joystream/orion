import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
  OperationVariables,
} from '@apollo/client/core'
import { extendDebug, Debugger } from './Debugger'
import { Maybe } from './graphql/generated/schema'
import { TokenId } from './consts'
import { u64 } from '@polkadot/types/primitive'
import {
  GetChannelByIdSubscription,
  AmmTranactionFieldsFragment,
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
    >(GetTokenById, { id: id.toString() }, 'tokenById')
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
    tokenId: TokenId,
    memberId: u64
  ): Promise<Maybe<RevenueShareParticipationFieldsFragment> | undefined> {
    const accountId = tokenId.toString() + memberId.toString()
    return this.uniqueEntitySubscription<
      GetRevenueShareParticipationByIdSubscription,
      GetRevenueShareParticipationByIdSubscriptionVariables
    >(
      GetRevenueShareParticipationById,
      { id: accountId + shareId.toString() },
      'revenueShareParticipationById'
    )
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

  public async getAmmById(id: string): Promise<Maybe<AmmCurvFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetAmmByIdSubscription,
      GetAmmTransactionByIdSubscriptionVariables
    >(GetAmmById, { id }, 'ammCurveById')
  }

  public async getAmmTransactionById(
    id: string
  ): Promise<Maybe<AmmTranactionFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetAmmTransactionByIdSubscription,
      GetAmmTransactionByIdSubscriptionVariables
    >(GetAmmTransactionById, { id }, 'ammTransactionById')
  }

  public async getChannelById(id: string): Promise<Maybe<ChannelFieldsFragment> | undefined> {
    return this.uniqueEntitySubscription<
      GetChannelByIdSubscription,
      GetChannelByIdSubscriptionVariables
    >(GetAmmTransactionById, { id }, 'channelById')
  }
}
