import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { Maybe, VestedAccount } from '../../../graphql/generated/schema'
import {
  SaleFields,
  SaleFieldsFragment,
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
  VestedAccountFieldsFragment,
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
  protected vestingSchedulesPre: VestedAccountFieldsFragment[] | undefined
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
      this.vestingSchedulesPre = qAccount!.vestingSchedules
    } else {
      this.amountPre = new BN(0)
      this.vestingSchedulesPre = []
    }
    const qSale = await this.query.getCurrentSaleForTokenId(
      this.api.createType('u64', this.tokenId)
    )

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

    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qSale: Maybe<SaleFieldsFragment> | undefined = null

    await Utils.until('waiting for token sale to be update', async () => {
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      qToken = await this.query.getTokenById(tokenId)
      qSale = await this.query.getCurrentSaleForTokenId(tokenId)
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
      const vestingSchedulestPost = qAccount!.vestingSchedules
      assert.equal(vestingSchedulestPost.length, this.vestingSchedulesPre!.length + 1)
      const latestVestingSchedule = qAccount!.vestingSchedules.sort((a, b) =>
        a.acquiredAt > b.acquiredAt ? -1 : 1
      )[0]
      assert.equal(
        qSale!.vestedSale.vesting.id,
        latestVestingSchedule.vesting.id,
        'vesting id mismatch'
      )

      const bestBlock = await this.api.getBestBlock()
      const transferrableBalance = await this.query.getAccountTransferrableBalance(
        tokenId.toString(),
        memberId.toString(),
        bestBlock.toNumber()
      )
      assert.isDefined(transferrableBalance)
    }

    const qSaleTx = qSale!.transactions.find((tx) => {
      return tx.account.id === qAccount!.id
    })

    assert.equal(qSale!.pricePerUnit.toString(), qToken!.lastPrice!.toString())

    assert(qSaleTx !== undefined)
    assert.equal(qSaleTx!.quantity, amountPurchased.toString())
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
