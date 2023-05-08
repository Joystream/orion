import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'

type TokensBurnedEventDetails = EventDetails<EventType<'projectToken', 'AmmActivated'>>

export class BurnTokensFixture extends StandardizedFixture {
  protected creatorAddress
  protected tokenId: number
  protected fromMemberId: number
  protected amount: BN

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    tokenId: number,
    fromMemberId: number,
    amount: BN
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

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
