import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenTokenSaleParams } from '@polkadot/types/lookup'
import { assert } from 'chai'
import BN from 'bn.js'
import { TokenStatus } from '../../../graphql/generated/schema'
import { Utils } from '../../Utils'

type TokenSaleInitializedEventDetails = EventDetails<
  EventType<'projectToken', 'TokenSaleInitialized'>
>

export class InitTokenSaleFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected saleParams: PalletProjectTokenTokenSaleParams
  protected events: TokenSaleInitializedEventDetails[] = []
  protected bestBlock: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    saleParams: PalletProjectTokenTokenSaleParams
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.saleParams = saleParams
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [this.api.tx.content.initCreatorTokenSale(actor, this.channelId, this.saleParams)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokenSaleInitializedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenSaleInitialized')
  }

  public async preExecHook(): Promise<void> {
    this.bestBlock = await this.api.getBestBlock()
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, saleNonce, tokenSale] = this.events[0].event.data
    const { quantityLeft, unitPrice, capPerMember, startBlock, duration, tokensSource } = tokenSale
    const end = startBlock.add(duration)
    const saleId = tokenId.toString() + saleNonce.toString()
    const fundsSourceAccount = tokenId.toString() + tokensSource.toString()

    let qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    assert.isNotNull(qToken)
    await Utils.until('waiting for sale to be commited to db', async () => {
      qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
      return qToken!.status === TokenStatus.Sale
    })
    const qSale = await this.query.retryQuery(() => this.query.getSaleById(saleId.toString()))
    assert.isNotNull(qSale)
    // assert.equal(qSale!.createdIn.toString(), this.bestBlock?.toString())
    assert.equal(qSale!.pricePerUnit, unitPrice.toString())
    assert.equal(qSale!.finalized, false)
    if (!qSale!.maxAmountPerMember && capPerMember.isSome) {
      assert.equal(qSale!.maxAmountPerMember, capPerMember.unwrap().toString())
    }
    assert.equal(qSale!.tokensSold, '0')
    assert.equal(qSale!.startBlock.toString(), startBlock.toString())
    assert.equal(qSale!.durationInBlocks.toString(), duration.toString())
    assert.equal(qSale!.endsAt.toString(), end.toString())
    assert.equal(qSale!.fundsSourceAccount.id, fundsSourceAccount)
    assert.equal(qSale!.tokenSaleAllocation, quantityLeft.toString())

    if (tokenSale.vestingScheduleParams.isSome) {
      const { linearVestingDuration, cliffAmountPercentage, blocksBeforeCliff } =
        tokenSale.vestingScheduleParams.unwrap()
      const cliffBlock = this.bestBlock!.add(blocksBeforeCliff.toBn())
      const endBlock = cliffBlock.add(linearVestingDuration.toBn())
      const vestingId =
        cliffBlock.toString() + linearVestingDuration.toString() + cliffAmountPercentage.toString()
      const qVesting = await this.query.retryQuery(() =>
        this.query.getVestingSchedulById(vestingId)
      )
      assert.isNotNull(qVesting)
      assert.equal(qVesting!.cliffBlock.toString(), cliffBlock.toString())
      assert.equal(qVesting!.cliffDurationBlocks.toString(), linearVestingDuration.toString())
      assert.equal(qVesting!.endsAt.toString(), endBlock.toString())
      assert.equal(qVesting!.vestedSale?.sale.id, saleId.toString())
      assert.isNotNull(qSale!.vestedSale)
      assert.equal(qSale!.vestedSale!.vesting.id, vestingId)
    }
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
