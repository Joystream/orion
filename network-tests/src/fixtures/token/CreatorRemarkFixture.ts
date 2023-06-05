import { TokenMetadata, ITokenMetadata } from '@joystream/metadata-protobuf'
import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import {
  PalletContentPermissionsContentActor,
  PalletProjectTokenTokenIssuanceParameters,
} from '@polkadot/types/lookup'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { TokenFieldsFragment } from '../../../graphql/generated/operations'

type CreatorRemarkEventDetails = EventDetails<EventType<'content', 'CreatorTokenIssuerRemarked'>>

export class CreatorRemarkFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected metadata: ITokenMetadata
  protected events: CreatorRemarkEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    metadata: ITokenMetadata,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.metadata = metadata
  }


  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const metadataBytes = Utils.metadataToBytes(TokenMetadata, this.metadata)
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId })
    return [
      this.api.tx.content.creatorTokenIssuerRemark(actor, this.channelId, metadataBytes),
    ]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<CreatorRemarkEventDetails> {
    return this.api.getEventDetails(result, 'content', 'CreatorTokenIssuerRemarked')
  }

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void { }

  public async runQueryNodeChecks(): Promise<void> {
    const [
      tokenId,
      ,
    ] = this.events[0].event.data
    let qToken: TokenFieldsFragment | null = null
    await Utils.until('waiting for creator token remark handle to be completed', async () => {
      qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
      assert.isNotNull(qToken)
      return qToken!.description !== null
    })
    assert.isNotNull(qToken!.benefits)
    const [benefit] = qToken!.benefits!
    assert.equal(qToken!.description, this.metadata.description)
    assert.equal(qToken!.trailerVideo!.id, this.metadata.trailerVideoId!.toString())
    assert.equal(benefit!.title, this.metadata.benefits![0].title)
    assert.equal(benefit!.emojiCode, this.metadata.benefits![0].emoji)
    assert.equal(benefit!.displayOrder, this.metadata.benefits![0].displayOrder)
    assert.equal(benefit!.description, this.metadata.benefits![0].description)
  }
}
