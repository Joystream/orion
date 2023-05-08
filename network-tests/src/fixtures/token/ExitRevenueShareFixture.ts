import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'

type RevenueShareLeftEventDetails = EventDetails<EventType<'projectToken', 'RevenueSplitLeft'>>

export class ExitRevenueShareFixture extends StandardizedFixture {
  protected memberAddress: string
  protected memberId: number
  protected tokenId: number

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number,
  ) {
    super(api, query)
    this.memberId =  memberId
    this.memberAddress =  memberAddress
    this.tokenId = tokenId 
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.exitRevenueSplit(this.tokenId, this.memberId)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<RevenueShareLeftEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'RevenueSplitLeft')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
