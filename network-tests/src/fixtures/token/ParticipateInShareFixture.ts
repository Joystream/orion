import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'

type UserParticipatedInSplitEventDetails = EventDetails<
  EventType<'projectToken', 'UserParticipatedInSplit'>
>

export class ParticipateInShareFixture extends StandardizedFixture {
  protected memberAddress: string
  protected memberId: number
  protected tokenId: number
  protected amount: BN
  protected bestBlock: BN | undefined
  protected events: UserParticipatedInSplitEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number,
    amount: BN
  ) {
    super(api, query)
    this.memberId = memberId
    this.memberAddress = memberAddress
    this.tokenId = tokenId
    this.amount = amount
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  public async preExecHook(): Promise<void> {
    this.bestBlock = await this.api.getBestBlock()
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.participateInSplit(this.tokenId, this.memberId, this.amount)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<UserParticipatedInSplitEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'UserParticipatedInSplit')
  }

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, stakedAmount, joyDividend] = this.events[0].event.data
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))

    assert.isNotNull(qToken)
    const revenueShareNonce = qToken!.revenueShareNonce
    const qRevenueShareParticipation = await this.query.retryQuery(() =>
      this.query.getRevenueShareParticpationById(revenueShareNonce, tokenId, memberId)
    )

    assert.isNotNull(qRevenueShareParticipation)
    assert.equal(qRevenueShareParticipation!.account.member.id, memberId.toString())
    assert.equal(qRevenueShareParticipation!.earnings, joyDividend.toString())
    assert.equal(qRevenueShareParticipation!.stakedAmount, stakedAmount.toString())
    assert.equal(qRevenueShareParticipation!.createdIn.toString(), this.bestBlock!.toString())
  }
}
