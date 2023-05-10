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
import { TokenFieldsFragment } from '../../../graphql/generated/queries'
import { assert } from 'chai'
import { TokenStatus } from '../../../graphql/generated/schema'

type TokenIssuedEventDetails = EventDetails<EventType<'projectToken', 'TokenIssued'>>

export class IssueCreatorTokenFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected contentActor: PalletContentPermissionsContentActor
  protected channelId: number
  protected crtParams: PalletProjectTokenTokenIssuanceParameters
  protected events: TokenIssuedEventDetails[] = []

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

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
    //   const [tokenId, { initialAllocation, symbol, transferPolicy, patronageRate, revenueSplitRate }] =
    //     this.events[i].event.data
    //   assert.equal(qEvent.status, TokenStatus.Idle)
    //   assert.equal(qEvent.isInviteOnly, true)
    //   assert.equal(qEvent.id, tokenId.toString())
    //   // assert.equal(qToken.symbol, symbol.toString())
    //   // assert.equal(qToken.annualCreatorReward, patronageRate.toString())
  }

  public async runQueryNodeChecks(): Promise<void> {
    await super.runQueryNodeChecks()
    const qToken = await this.query.retryQuery(
      () => this.query.getTokenById(this.api.createType('u64', 0)),
    )
    assert.isNotNull(qToken)
    assert.equal(qToken!.id, '0')
    assert.equal(qToken!.status, TokenStatus.Idle)
  }

}
