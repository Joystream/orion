import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import {
  PalletContentPermissionsContentActor,
} from '@polkadot/types/lookup'
import { TokenFieldsFragment } from '../../../graphql/generated/operations'
import { assert } from 'chai'
import { Utils } from '../../utils'

type TokenDeissuedEventDetails = EventDetails<EventType<'projectToken', 'TokenDeissued'>>

export class DeissueCreatorTokenFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected contentActor: PalletContentPermissionsContentActor
  protected channelId: number
  protected events: TokenDeissuedEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    contentActor: PalletContentPermissionsContentActor,
    channelId: number,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.contentActor = contentActor
    this.channelId = channelId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [
      this.api.tx.content.deissueCreatorToken(this.contentActor, this.channelId),
    ]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokenDeissuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenDeissued')
  }

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void { }

  public async runQueryNodeChecks(): Promise<void> {
    const [
      tokenId,
    ] = this.events[0].event.data

    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    // let qToken: TokenFieldsFragment | null = null
    // await Utils.until('wait for deissue token handler effect to be written to the Store', async () => {
    //   return qToken!.deissued
    // })

    await super.runQueryNodeChecks()

    assert.isNotNull(qToken)
    assert.equal(qToken!.deissued, true)
  }
}

