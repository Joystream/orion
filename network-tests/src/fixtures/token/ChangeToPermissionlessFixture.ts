import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'

type ChangeToPermissionlessEventDetails = EventDetails<EventType<'projectToken', 'TransferPolicyChangedToPermissionless'>>

export class ChangeToPermissionlessFixture extends StandardizedFixture {
  protected creatorAddress
  protected creatorMemberId
  protected channelId

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId })
    return [this.api.tx.content.makeCreatorTokenPermissionless(actor, this.channelId)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<ChangeToPermissionlessEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TransferPolicyChangedToPermissionless')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
