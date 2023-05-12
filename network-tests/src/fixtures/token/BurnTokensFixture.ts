
import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import BN from 'bn.js'

type TokensBurnedEventDetails = EventDetails<EventType<'projectToken', 'TokensBurned'>>

export class BurnTokensFixture extends StandardizedFixture {
  protected creatorAddress
  protected tokenId: number
  protected fromMemberId: number
  protected events: TokensBurnedEventDetails[] = []
  protected amount: BN

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    tokenId: number,
    fromMemberId: number,
    amount: BN,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.tokenId = tokenId
    this.fromMemberId = fromMemberId
    this.amount = amount
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.burn(this.tokenId, this.fromMemberId, this.amount)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokensBurnedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensBurned')
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }

  // add a general key-map record to the runQueryNodeChecks as a parameter
  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, amountBurned] = this.events[0].event.data
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(tokenId + memberId.toString()))

    assert.isNotNull(qToken)
    assert.isNotNull(qAccount)
  }
}
