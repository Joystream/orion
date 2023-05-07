import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenTransfersPaymentWithVesting } from '@polkadot/types/lookup'

type TransferEventDetails = EventDetails<EventType<'projectToken', 'TokenAmountTransferred'>>

export class TransferFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected tokenId: number
  protected srcMemberId: number
  protected outputs: PalletProjectTokenTransfersPaymentWithVesting
  protected metadata: string

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    srcMemberId: number,
    tokenId: number,
    outputs: PalletProjectTokenTransfersPaymentWithVesting,
    metadata: string
  ) {
    super(api, query)
    this.srcMemberId = srcMemberId 
    this.tokenId = tokenId 
    this.outputs = outputs
    this.metadata = metadata
    this.creatorAddress = creatorAddress
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.transfer(this.srcMemberId, this.tokenId, this.outputs, this.metadata)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TransferEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenAmountTransferred')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
