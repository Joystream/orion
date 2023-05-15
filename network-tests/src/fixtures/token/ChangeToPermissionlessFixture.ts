import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'

type ChangeToPermissionlessEventDetails = EventDetails<
  EventType<'projectToken', 'TransferPolicyChangedToPermissionless'>
>

export class ChangeToPermissionlessFixture extends StandardizedFixture {
  protected creatorAddress
  protected creatorMemberId
  protected channelId
  protected events: ChangeToPermissionlessEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number
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
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [this.api.tx.content.makeCreatorTokenPermissionless(actor, this.channelId)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<ChangeToPermissionlessEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TransferPolicyChangedToPermissionless')
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId] = this.events[0].event.data
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))

    assert.isNotNull(qToken)
    const revenueShareId = qToken!.revenueShareNonce.toString() + tokenId.toString()
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
