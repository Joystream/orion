import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'

type DustAccountEventDetails = EventDetails<EventType<'projectToken', 'AccountDustedBy'>>

export class DustAccountFixture extends StandardizedFixture {
  protected creatorAddress
  protected tokenId: number
  protected memberId: number

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    tokenId: number,
    memberId: number,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.tokenId = tokenId
    this.memberId = memberId 
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.dustAccount(this.tokenId, this.memberId)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<DustAccountEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'AccountDustedBy')
  }

  public async tryQuery(): Promise<void> {
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
