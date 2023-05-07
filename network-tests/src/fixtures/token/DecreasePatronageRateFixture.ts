
import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'

type PatronageRateDecreasedToEventDetails = EventDetails<EventType<'projectToken', 'PatronageRateDecreasedTo'>>

export class DecreasePatronageRateFixture extends StandardizedFixture {
  protected creatorMemberId: number
  protected creatorAddress: string
  protected channelId: number
  protected targetRate: number

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    targetRate: number
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.targetRate = targetRate
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId})
    return [this.api.tx.content.reduceCreatorTokenPatronageRateTo(actor, this.channelId, this.targetRate)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<PatronageRateDecreasedToEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'PatronageRateDecreasedTo')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
