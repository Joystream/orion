import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'
import { Utils } from '../../utils'

type RevenueShareIssuedEventDetails = EventDetails<EventType<'projectToken', 'RevenueSplitIssued'>>

export class IssueRevenueShareFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected start: number | undefined
  protected duration: number
  protected allocationAmount: BN
  protected events: RevenueShareIssuedEventDetails[] = []

  protected bestBlock: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    duration: number,
    allocationAmount: BN,
    start?: number
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.start = start
    this.allocationAmount = allocationAmount
    this.duration = duration
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  public async preExecHook(): Promise<void> {
    const qChannel = await this.query.retryQuery(() => this.query.getChannelById(this.channelId))
    assert.isNotNull(qChannel)
    const rewardAccount = qChannel!.rewardAccount
    await this.api.treasuryTransferBalance(rewardAccount, this.allocationAmount)
    this.bestBlock = await this.api.getBestBlock()
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    const start = this.start ? this.start!.toString() : null
    return [this.api.tx.content.issueRevenueSplit(actor, this.channelId, start, this.duration)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<RevenueShareIssuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'RevenueSplitIssued')
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, startBlock, duration, joyAllocation] = this.events[0].event.data
    await Utils.wait(20000)
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))

    assert.isNotNull(qToken)
    const [{ id: revenueShareId }] = qToken!.revenueShare
    const qRevenueShare = await this.query.retryQuery(() =>
      this.query.getRevenueShareById(revenueShareId)
    )

    assert.isNotNull(qRevenueShare)
    assert.equal(qRevenueShare!.token.id, tokenId.toString())
    assert.equal(qRevenueShare!.startingAt.toString(), startBlock.toString())
    assert.equal(qRevenueShare!.duration.toString(), duration.toString())
    assert.equal(qRevenueShare!.endsAt.toString(), startBlock.add(duration).toString())
    assert.equal(qRevenueShare!.claimed, '0')
    assert.equal(qRevenueShare!.finalized, false)
    assert.equal(qRevenueShare!.participantsNum, 0)
    assert.equal(qRevenueShare!.allocation, joyAllocation.toString())
  }

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
