import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'

type TokensBoughtOnAmmEventDetails = EventDetails<EventType<'projectToken', 'TokensBoughtOnAmm'>>

export class BuyOnAmmFixture extends StandardizedFixture {
  protected tokenId: number
  protected memberAddress: string
  protected memberId: number 
  protected amount: BN

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number,
    amount: BN
  ) {
    super(api, query)
    this.amount = amount
    this.memberAddress = memberAddress
    this.memberId = memberId
    this.tokenId = tokenId 
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const deadline = null
    const slippageTolerance = null
    return [this.api.tx.projectToken.buyOnAmm(this.tokenId, this.memberId, this.amount, deadline, slippageTolerance)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokensBoughtOnAmmEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensBoughtOnAmm')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
