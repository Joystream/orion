import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'

type RevenueShareIssuedEventDetails = EventDetails<EventType<'projectToken', 'RevenueSplitIssued'>>

export class IssueRevenueShareFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected start: number
  protected duration: number

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    start: number,
    duration: number
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.start = start
    this.duration = duration
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId })
    const start = this.api.createType('Option', this.start)
    return [this.api.tx.content.issueRevenueSplit(actor, this.channelId, start, this.duration)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<RevenueShareIssuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'RevenueSplitIssued')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
