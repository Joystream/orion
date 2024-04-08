import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import {
  PalletContentChannelOwner,
  PalletContentChannelCreationParametersRecord,
} from '@polkadot/types/lookup'
import { u64 } from '@polkadot/types/primitive'

type ChannelCreatedEventDetails = EventDetails<EventType<'content', 'ChannelCreated'>>

export type ChannelCreationParameters = [
  PalletContentChannelOwner,
  PalletContentChannelCreationParametersRecord
]

export class CreateChannelFixture extends StandardizedFixture {
  protected channelCreationParams: PalletContentChannelCreationParametersRecord
  protected channelOwner: PalletContentChannelOwner
  protected channelOwnerAddress: string
  protected events: ChannelCreatedEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    channelCreationParams: PalletContentChannelCreationParametersRecord,
    channelOwner: PalletContentChannelOwner,
    channelOwnerAddress: string
  ) {
    super(api, query)
    this.channelCreationParams = channelCreationParams
    this.channelOwner = channelOwner
    this.channelOwnerAddress = channelOwnerAddress
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.channelOwnerAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.content.createChannel(this.channelOwner, this.channelCreationParams)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<ChannelCreatedEventDetails> {
    return this.api.getEventDetails(result, 'content', 'ChannelCreated')
  }

  public getChannelId(): u64 {
    const [channelId] = this.events[0].event.data
    return channelId
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
