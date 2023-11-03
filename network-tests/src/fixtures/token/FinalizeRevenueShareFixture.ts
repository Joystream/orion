import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { Utils } from '../../utils'
import { assert } from 'chai'
import { Maybe } from 'graphql/generated/schema'
import { RevenueShareFieldsFragment, TokenFieldsFragment } from 'graphql/generated/operations'

type RevenueShareFinalizedEventDetails = EventDetails<
  EventType<'projectToken', 'RevenueSplitFinalized'>
>

export class FinalizeRevenueShareFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected events: RevenueShareFinalizedEventDetails[] = []

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
    return [this.api.tx.content.finalizeRevenueSplit(actor, this.channelId)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<RevenueShareFinalizedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'RevenueSplitFinalized')
  }

  public async preExecHook(): Promise<void> {
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const qToken = await this.query.getTokenById(tokenId)

    const [{ id: revenueShareId }] = qToken!.revenueShares
    const qRevenueShare = await this.query.getRevenueShareById(revenueShareId)
    assert.isNotNull(qRevenueShare)
    assert.equal(qRevenueShare!.finalized, false)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qRevenueShare: Maybe<RevenueShareFieldsFragment> | undefined = null
    await Utils.until('waiting for for revenue share to be fetched', async () => {
      qToken = await this.query.getTokenById(tokenId)
      const [{ id: revenueShareId }] = qToken!.revenueShares
      qRevenueShare = await this.query.getRevenueShareById(revenueShareId)
      return Boolean(qRevenueShare) && qRevenueShare!.finalized
    })
    assert.equal(qRevenueShare!.finalized, true)
    assert.isNull(qToken!.currentRenvenueShare)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
