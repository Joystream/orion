import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { AmmTransactionType } from '../../../graphql/generated/schema'
import { Permill } from '@polkadot/types/interfaces/runtime'

type TokensSoldOnAmmEventDetails = EventDetails<EventType<'projectToken', 'TokensSoldOnAmm'>>

export class SellOnAmmFixture extends StandardizedFixture {
  protected tokenId: number
  protected memberAddress: string
  protected memberId: number
  protected amount: BN
  protected events: TokensSoldOnAmmEventDetails[] = []
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
      this.api.tx.projectToken.sellOnAmm(
        this.tokenId,
        this.memberId,
        this.amount,
        slippageTolerance
      ),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokensSoldOnAmmEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensSoldOnAmm')
  }

  public async preExecHook(): Promise<void> {
    await this.api.treasuryTransferBalance(this.memberAddress, this.amount.muln(10000000))
    assert.notEqual(this.amount, new BN(0))
    const qAccount = await this.query.retryQuery(() =>
      this.query.getTokenAccountById(this.tokenId.toString() + this.memberId.toString())
    )
    assert.isNotNull(qAccount)
    this.amountPre = new BN(qAccount!.totalAmount)
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(_tokenId))
    assert.isNotNull(qToken)
    this.supplyPre = new BN(qToken!.totalSupply)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, crtBurned, joysRecovered] = this.events[0].event.data
    let qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    let qAccount = await this.query.retryQuery(() =>
      this.query.getTokenAccountById(tokenId.toString() + memberId.toString())
    )
    await Utils.until('waiting for sell on amm effects to take place', async () => {
      qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
      qAccount = await this.query.retryQuery(() =>
        this.query.getTokenAccountById(tokenId.toString() + memberId.toString())
      )
      assert.isNotNull(qToken)
      assert.isNotNull(qAccount)
      const currSupply = new BN(qToken!.totalSupply)
      const currAmount = new BN(qAccount!.totalAmount)
      return currSupply < this.supplyPre! && currAmount < this.amountPre!
    })

    const ammId = qToken!.id + (qToken!.ammNonce - 1).toString()
    const qAmmCurve = await this.query.retryQuery(() => this.query.getAmmById(ammId))
    assert.isNotNull(qAmmCurve)
    const qTransaction = qAmmCurve!.transactions.find((qTx) => {
      return qTx !== null && qTx!.transactionType === AmmTransactionType.Sell
    })

    const supplyPost = this.supplyPre!.sub(crtBurned)
    const amountPost = this.amountPre!.sub(crtBurned)

    assert.isNotNull(qAccount)
    assert.isNotNull(qToken)
    assert(qTransaction !== undefined, 'transaction not found')

    assert.equal(qAmmCurve!.burnedByAmm, crtBurned.toString())
    assert.equal(qToken!.totalSupply, supplyPost.toString())
    assert.equal(qAccount!.totalAmount, amountPost.toString())
    assert.equal(qTransaction!.transactionType, AmmTransactionType.Sell)
    assert.equal(qTransaction!.quantity, crtBurned.toString())
    assert.equal(qTransaction!.pricePaid, joysRecovered.toString())
    assert.equal(qTransaction!.pricePerUnit, crtBurned.div(joysRecovered).toString())
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
