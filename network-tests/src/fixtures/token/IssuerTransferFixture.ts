
import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletContentPermissionsContentActor, PalletProjectTokenTransfersPaymentWithVesting } from '@polkadot/types/lookup'

type IssuerTransferEventDetails = EventDetails<EventType<'projectToken', 'TokenAmountTransferredByIssuer'>>

export class IssuerTransferFixture extends StandardizedFixture {
  protected actor: PalletContentPermissionsContentActor 
  protected creatorAddress: string
  protected channelId: number
  protected outputs: PalletProjectTokenTransfersPaymentWithVesting
  protected metadata: string

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    actor: PalletContentPermissionsContentActor,
    channelId: number,
    outputs: PalletProjectTokenTransfersPaymentWithVesting,
    metadata: string
  ) {
    super(api, query)
    this.actor = actor
    this.channelId = channelId
    this.outputs = outputs
    this.metadata = metadata
    this.creatorAddress = creatorAddress
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.content.creatorTokenIssuerTransfer(this.actor, this.channelId, this.outputs, this.metadata)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<IssuerTransferEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenAmountTransferredByIssuer')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
