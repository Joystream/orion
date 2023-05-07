import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import {
  PalletProjectTokenTokenSaleParams
} from '@polkadot/types/lookup'

type TokenSaleInitializedEventDetails = EventDetails<EventType<'projectToken', 'TokenSaleInitialized'>>

export class InitTokenSaleFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected saleParams: PalletProjectTokenTokenSaleParams

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    saleParams: PalletProjectTokenTokenSaleParams
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.saleParams = saleParams
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId })
    return [this.api.tx.content.initCreatorTokenSale(actor, this.channelId, this.saleParams)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokenSaleInitializedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenSaleInitialized')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
