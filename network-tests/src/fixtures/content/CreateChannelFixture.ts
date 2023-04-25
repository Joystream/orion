import { StandardizedFixture } from 'src/Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { QueryNodeApi } from '../../QueryNodeApi'
import { Api } from '../../Api'
import {
  PalletContentChannelOwner,
  PalletContentChannelCreationParametersRecord,
} from '@polkadot/types/lookup'

type ChannelCreatedEventDetails = EventDetails<EventType<'content', 'ChannelCreated'>>

export type ChannelCreationParameters = [
  PalletContentChannelOwner,
  PalletContentChannelCreationParametersRecord
]

export class CreateChannelFixture extends StandardizedFixture {
  protected params: Map<string, ChannelCreationParameters>

  public constructor(
    api: Api,
    query: QueryNodeApi,
    params: Map<string, ChannelCreationParameters>
  ) {
    super(api, query)
    this.params = params
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return Array.from(this.params.keys())
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return Array.from(this.params.values()).map(([owner, parameters]) =>
      this.api.tx.content.createChannel(owner, parameters)
    )
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<ChannelCreatedEventDetails> {
    return this.api.getEventDetails(result, 'content', 'ChannelCreated')
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
