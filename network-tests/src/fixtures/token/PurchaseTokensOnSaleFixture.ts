import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { Maybe } from '../../../graphql/generated/schema'
import {
  SaleFields,
  SaleFieldsFragment,
  TokenAccountFieldsFragment,
} from 'graphql/generated/operations'

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
    const qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      this.api.createType('u64', this.tokenId),
      this.memberId
    )
    if (qAccount) {
      this.amountPre = new BN(qAccount!.totalAmount)
    } else {
      this.amountPre = new BN(0)
    }
    const saleNonce = (
      await this.api.query.projectToken.tokenInfoById(this.tokenId)
    ).nextSaleId.subn(1)
    const saleId = this.tokenId.toString() + saleNonce.toString()
    const qSale = await this.query.getSaleById(saleId)

    assert.isNotNull(qSale)
    this.tokenSoldPre = new BN(qSale!.tokensSold)

    await Utils.until('waiting for sale to start', async () => {
      const token = await this.api.query.projectToken.tokenInfoById(this.tokenId)
      const currentBlock = await this.api.getBestBlock()
      if (token.sale.isSome) {
        const { startBlock } = token.sale.unwrap()
        return currentBlock >= startBlock.toBn()
      }
      return false
    })
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, saleNonce, amountPurchased, memberId] = this.events[0].event.data

    const tokenSoldPost = (await this.api.query.projectToken.tokenInfoById(tokenId)).sale.unwrap()
      .fundsCollected
    const amountPost = (
      await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, memberId)
    ).amount

    const saleId = tokenId.toString() + saleNonce.toString()

    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null
    let qSale: Maybe<SaleFieldsFragment> | undefined = null

    await Utils.until('waiting for token sale to be update', async () => {
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      qSale = await this.query.getSaleById(saleId)
      if (Boolean(qAccount)) {
        const currentAmount = new BN(qAccount!.totalAmount)
        const currentTokensSold = new BN(qSale!.tokensSold)
        return currentAmount.gt(this.amountPre!) && currentTokensSold.gt(this.tokenSoldPre!)
      } else {
        return false
      }
    })

    assert.equal(qAccount!.totalAmount, amountPost.toString())
    assert.equal(qSale!.tokensSold, tokenSoldPost.toString())

    if (qSale!.vestedSale) {
      const vestingId = qSale!.vestedSale.vesting.id
      // query vested account
      const id = qAccount!.id + vestingId
      const qVestedAccount = await this.query.getVestedAccountById(id)
      assert.isNotNull(qVestedAccount)
      assert.equal(qVestedAccount!.account.id, qAccount!.id)
      assert.equal(qVestedAccount!.vesting.id, vestingId)
    }

    const qSaleTx = qSale!.transactions.find((tx) => {
      return tx.account.id === qAccount!.id
    })

    assert(qSaleTx !== undefined)
    assert.equal(qSaleTx!.quantity, amountPurchased.toString())
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
