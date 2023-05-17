import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'

type TokensBoughtOnAmmEventDetails = EventDetails<EventType<'projectToken', 'TokensBoughtOnAmm'>>

export class BuyOnAmmFixture extends StandardizedFixture {
  protected tokenId: number
  protected memberAddress: string
  protected memberId: number
  protected amount: BN
  protected events: TokensBoughtOnAmmEventDetails[] = []
  protected amountPre: BN | undefined
  protected supplyPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number,
    amount: BN
  ) {
    super(api, query)
    this.amount = amount
    this.memberAddress = memberAddress
    this.memberId = memberId
    this.tokenId = tokenId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const deadline = null
    const slippageTolerance = null
    return [
      this.api.tx.projectToken.buyOnAmm(
        this.tokenId,
        this.memberId,
        this.amount,
        deadline,
        slippageTolerance
      ),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokensBoughtOnAmmEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensBoughtOnAmm')
  }

  public async preExecHook(): Promise<void> {
    const qAccount = await this.query.retryQuery(() =>
      this.query.getTokenAccountById(this.tokenId.toString() + this.memberId.toString())
    )
    if (!qAccount) {
      this.amountPre = new BN(qAccount!.totalAmount)
    } else {
      this.amountPre = new BN(0)
    }
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(_tokenId))
    assert.isNotNull(qToken)
    this.supplyPre = new BN(qToken!.totalSupply)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, crtMinted] = this.events[0].event.data
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    const qAccount = await this.query.retryQuery(() =>
      this.query.getTokenAccountById(tokenId.toString() + memberId.toString())
    )

    const supplyPost = this.supplyPre!.add(crtMinted)
    const amountPost = this.amountPre!.add(crtMinted)

    assert.isNotNull(qAccount)
    assert.isNotNull(qToken)

    assert.equal(qToken!.totalSupply, supplyPost.toString())
    assert.equal(qAccount!.totalAmount, amountPost.toString())
    // TODO: check transaction
  }
  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
