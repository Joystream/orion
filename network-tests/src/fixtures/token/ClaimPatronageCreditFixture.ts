import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import BN from 'bn.js'

type PatronageCreditClaimedEventDetails = EventDetails<EventType<'projectToken', 'PatronageCreditClaimed'>>

export class ClaimPatronageCreditFixture extends StandardizedFixture {
  protected creatorMemberId: number
  protected creatorAddress: string
  protected channelId: number
  protected events: PatronageCreditClaimedEventDetails[] = []
  protected supplyPre: BN | undefined
  protected accountAmountPre: BN | undefined

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
    const actor = this.api.createType('PalletContentPermissionsContentActor', { Member: this.creatorMemberId})
    return [this.api.tx.content.claimCreatorTokenPatronageCredit(actor, this.channelId)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<PatronageCreditClaimedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'PatronageCreditClaimed')
  }

  public async preExecHook(): Promise<void> {
    const tokenId = (await this.api.query.content.channelById(this.channelId)).creatorTokenId.unwrap()
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(tokenId.toString() + this.creatorMemberId.toString()))
    assert.isNotNull(qToken)
    assert.isNotNull(qAccount)

    this.supplyPre = new BN(qToken!.totalSupply)
    this.accountAmountPre = new BN(qAccount!.totalAmount)
  }
  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, amount, memberId] = this.events[0].event.data
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(tokenId + memberId.toString()))

    const supplyPost = (this.supplyPre!.sub(amount.toBn())).toString()
    const accountAmountPost = (this.accountAmountPre!.sub(amount.toBn())).toString()

    assert.isNotNull(qToken)
    assert.isNotNull(qAccount)
    assert.equal(qToken!.totalSupply, supplyPost)
    assert.equal(qAccount!.totalAmount, accountAmountPost)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}
