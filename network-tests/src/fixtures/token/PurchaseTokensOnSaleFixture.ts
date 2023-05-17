import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'

type TokensPurchasedOnSaleEventDetails = EventDetails<
  EventType<'projectToken', 'TokensPurchasedOnSale'>
>

export class PurchaseTokensOnSaleFixture extends StandardizedFixture {
  protected tokenId: number
  protected memberAddress: string
  protected memberId: number
  protected amount: BN
  protected events: TokensPurchasedOnSaleEventDetails[] = []
  protected amountPre: BN | undefined
  protected tokenSoldPre: BN | undefined

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
    return [this.api.tx.projectToken.purchaseTokensOnSale(this.tokenId, this.memberId, this.amount)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokensPurchasedOnSaleEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensPurchasedOnSale')
  }

  public async preExecHook(): Promise<void> {
    const accountId = this.tokenId.toString() + this.memberId.toString()
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(accountId))
    assert.isNotNull(qAccount)
    this.amountPre = new BN(qAccount!.totalAmount)

    const saleNonce = (
      await this.api.query.projectToken.tokenInfoById(this.tokenId)
    ).nextSaleId.subn(1)
    const saleId = this.tokenId.toString() + saleNonce.toString()
    const qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId))

    assert.isNotNull(qSale)
    this.tokenSoldPre = new BN(qSale!.tokensSold)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, saleNonce, amountPurchased, memberId] = this.events[0].event.data

    const amountPost = this.amountPre!.add(amountPurchased)
    const tokenSoldPost = this.tokenSoldPre!.add(amountPurchased)
    const saleId = tokenId.toString() + saleNonce.toString()
    const accountId = tokenId.toString() + memberId.toString()

    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(accountId))
    const qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId))

    assert.isNotNull(qAccount)
    assert.equal(qAccount!.totalAmount, amountPost.toString())

    assert.isNotNull(qSale)
    assert.equal(qSale!.tokensSold, tokenSoldPost.toString())

    if (qSale!.vestedSale) {
      const vestingId = qSale!.vestedSale.vesting.id
      // query vested account
      const id = accountId + vestingId
      const qVestedAccount = await this.query.retryQuery(() => this.query.getVestedAccountById(id))
      assert.isNotNull(qVestedAccount)
      assert.equal(qVestedAccount!.account.id, accountId)
      assert.equal(qVestedAccount!.vesting.id, vestingId)
    }
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
