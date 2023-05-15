import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'

type RevenueShareIssuedEventDetails = EventDetails<EventType<'projectToken', 'RevenueSplitIssued'>>

export class IssueRevenueShareFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected start: number
  protected duration: number
  protected events: RevenueShareIssuedEventDetails[] = []

  protected bestBlock: BN | undefined

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

  public async preExecHook(): Promise<void> {
    this.bestBlock = await this.api.getBestBlock()
  }
  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    const start = this.api.createType('Option', this.start)
    return [this.api.tx.content.issueRevenueSplit(actor, this.channelId, start, this.duration)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<RevenueShareIssuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'RevenueSplitIssued')
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, startBlock, duration, joyAllocation] = this.events[0].event.data
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))

    assert.isNotNull(qToken)
    const revenueShareNonce = qToken!.revenueShareNonce
    const qRevenueShare = await this.query.retryQuery(() =>
      this.query.getRevenueShareById(revenueShareNonce, tokenId)
    )

    assert.isNotNull(qRevenueShare)
    assert.equal(qRevenueShare!.token.id, tokenId.toString())
    assert.equal(qRevenueShare!.startingAt.toString(), startBlock.toString())
    assert.equal(qRevenueShare!.duration.toString(), duration.toString())
    assert.equal(qRevenueShare!.endsAt.toString(), startBlock.add(duration).toString())
    assert.equal(qRevenueShare!.claimed, '0')
    assert.equal(qRevenueShare!.createdIn.toString(), this.bestBlock!.toString())
    assert.equal(qRevenueShare!.finalized, false)
    assert.equal(qRevenueShare!.participantsNum, 0)
    assert.equal(qRevenueShare!.allocation, joyAllocation.toString())
  }

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
