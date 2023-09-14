import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletContentVideoCreationParametersRecord } from '@polkadot/types/lookup'
import { u64 } from '@polkadot/types/primitive'

type VideoCreatedEventDetails = EventDetails<EventType<'content', 'VideoCreated'>>

export class CreateVideoFixture extends StandardizedFixture {
  protected params: PalletContentVideoCreationParametersRecord
  protected events: VideoCreatedEventDetails[] = []
  protected channelId: number
  protected creatorAddress: string
  protected creatorMemberId: number

  public constructor(
    api: Api,
    query: OrionApi,
    memberId: number,
    address: string,
    params: PalletContentVideoCreationParametersRecord,
    channelId: number
  ) {
    super(api, query)
    this.channelId = channelId
    this.params = params
    this.creatorAddress = address
    this.creatorMemberId = memberId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [this.api.tx.content.createVideo(actor, this.channelId, this.params)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<VideoCreatedEventDetails> {
    return this.api.getEventDetails(result, 'content', 'VideoCreated')
  }

  public getVideoId(): u64 {
    const [, , videoId] = this.events[0].event.data
    return videoId
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
