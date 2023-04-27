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

type TokenIssuedEventDetails = EventDetails<EventType<'projectToken', 'TokenIssued'>>

export class IssueCreatorTokenFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected contentActor: PalletContentPermissionsContentActor
  protected channelId: number
  protected crtParams: PalletProjectTokenTokenIssuanceParameters

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    contentActor: PalletContentPermissionsContentActor,
    channelId: number,
    crtParams: PalletProjectTokenTokenIssuanceParameters,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.contentActor = contentActor
    this.channelId = channelId
    this.crtParams = crtParams
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.content.issueCreatorToken(this.contentActor, this.channelId, this.crtParams)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokenIssuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenIssued')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
