import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenAmmParams } from '@polkadot/types/lookup'

type AmmActivatedEventDetails = EventDetails<EventType<'projectToken', 'AmmActivated'>>

export class ActivateAmmFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number 
  protected channelId: number
  protected parameters: PalletProjectTokenAmmParams

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    parameters: PalletProjectTokenAmmParams,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId 
    this.parameters = parameters
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId})
    return [this.api.tx.content.activateAmm(actor, this.channelId, this.parameters)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<AmmActivatedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'AmmActivated')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
