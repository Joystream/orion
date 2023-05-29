import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import BN from 'bn.js'
import { Utils } from '../../utils'

type TokenSaleFinalizedEventDetails = EventDetails<EventType<'projectToken', 'TokenSaleFinalized'>>

export class FinalizeTokenSaleFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected events: TokenSaleFinalizedEventDetails[] = []
  protected fundsSourceAmountPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number
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
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [this.api.tx.content.finalizeCreatorTokenSale(actor, this.channelId)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokenSaleFinalizedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenSaleFinalized')
  }

  public async preExecHook(): Promise<void> {
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const token = await this.api.query.projectToken.tokenInfoById(tokenId)
    const saleNonce = token.nextSaleId.subn(1)
    const { tokensSource } = token.sale.unwrap()
    const saleId = tokenId.toString() + saleNonce.toString()
    let qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId.toString()))
    const qFundsSource = await this.query.retryQuery(() =>
      this.query.getTokenAccountById(tokenId.toString() + tokensSource.toString())
    )

    assert.isNotNull(qSale)
    assert.equal(qSale!.finalized, false)
    assert.isNotNull(qFundsSource)

    this.fundsSourceAmountPre = new BN(qFundsSource!.totalAmount)

    await Utils.until('waiting for the sale to end', async ({ debug }) => {
      qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId.toString()))
      let endBlock = qSale!.endsAt
      const currentBlock = (await this.api.getBestBlock()).toNumber()
      return endBlock <= currentBlock
    })
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, saleNonce, quantityLeft] = this.events[0].event.data
    const saleId = tokenId.toString() + saleNonce.toString()
    const fundsSourceAmountPost = this.fundsSourceAmountPre!.add(quantityLeft)

    let qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId))
    let qFundsSource = await this.query.retryQuery(() =>
      this.query.getTokenAccountById(qSale!.fundsSourceAccount.id)
    )
    await Utils.until('waiting for the sale to end', async () => {
      qFundsSource = await this.query.retryQuery(() =>
        this.query.getTokenAccountById(qSale!.fundsSourceAccount.id)
      )
      qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId.toString()))

      assert.isNotNull(qFundsSource)
      assert.isNotNull(qSale)

      const currFundsSourceAmount = new BN(qFundsSource!.totalAmount)
      return qSale!.finalized && currFundsSourceAmount > this.fundsSourceAmountPre!
    })

    assert.equal(qSale!.finalized, true)
    assert.equal(qFundsSource!.totalAmount, fundsSourceAmountPost.toString())
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void { }
}
