import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import BN from 'bn.js'
import { Utils } from '../../utils'
import { Maybe } from 'graphql/generated/schema'
import {
  RevenueShareFieldsFragment,
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
} from '../../../graphql/generated/operations'

type RevenueShareLeftEventDetails = EventDetails<EventType<'projectToken', 'RevenueSplitLeft'>>

export class ExitRevenueShareFixture extends StandardizedFixture {
  protected memberAddress: string
  protected memberId: number
  protected tokenId: number
  protected events: RevenueShareLeftEventDetails[] = []
  protected participantsNumPre: number | undefined
  protected stakedAmountPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number
  ) {
    super(api, query)
    this.memberId = memberId
    this.memberAddress = memberAddress
    this.tokenId = tokenId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.exitRevenueSplit(this.tokenId, this.memberId)]
  }

  public async preExecHook(): Promise<void> {
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.getTokenById(_tokenId)
    const qAccount = await this.query.getTokenAccountById(
      _tokenId.toString() + this.memberId.toString()
    )

    assert.isNotNull(qToken)
    assert.isNotNull(qAccount)
    const [{ id: revenueShareId }] = qToken!.revenueShare
    const qRevenueShare = await this.query.getRevenueShareById(revenueShareId)
    assert.isNotNull(qRevenueShare)

    this.participantsNumPre = qRevenueShare!.participantsNum
    this.stakedAmountPre = new BN(qAccount!.stakedAmount)
    await Utils.until(
      'waiting for revenue share to end',
      async () => {
        const block = await this.api.getBestBlock()
        const qRev = await this.query.getRevenueShareById(revenueShareId)
        const end = new BN(qRev!.endsAt)
        return end.lte(block)
      },
      10000,
      10000 * 20
    )
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<RevenueShareLeftEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'RevenueSplitLeft')
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, unstakedAmount] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null
    const accountId = tokenId.toString() + memberId.toString()
    await Utils.until('waiting for exit revenue split handler to be finalized', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qAccount = await this.query.getTokenAccountById(accountId)
      return !!qToken && !!qAccount
    })

    const participantsNumPost = this.participantsNumPre! - 1
    const stakedAmountPost = this.stakedAmountPre!.sub(unstakedAmount.toBn())

    const [{ id: revenueShareId }] = qToken!.revenueShare
    let qRevenueShare: Maybe<RevenueShareFieldsFragment> | undefined = null
    await Utils.until('waiting for revenue share to be fetched', async () => {
      qRevenueShare = await this.query.getRevenueShareById(revenueShareId)
      return !!qRevenueShare
    })
    assert.equal(qRevenueShare!.participantsNum, participantsNumPost)
    assert.equal(qAccount!.stakedAmount, stakedAmountPost.toString())
  }
}
