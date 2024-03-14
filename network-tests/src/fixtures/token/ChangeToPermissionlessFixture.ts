import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { TokenFieldsFragment } from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'

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

  public async preExecHook(): Promise<void> {
    const _tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const qToken = await this.query.getTokenById(_tokenId)
    assert.isNotNull(qToken)
    assert.equal(qToken!.isInviteOnly, true)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    await Utils.until('waiting for token to be permissionless', async () => {
      qToken = await this.query.getTokenById(tokenId)
      return !!qToken && qToken!.isInviteOnly === false
    })

    assert.equal(qToken!.isInviteOnly, false)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
