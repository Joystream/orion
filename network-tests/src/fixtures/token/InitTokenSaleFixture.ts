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
import { Utils } from '../../utils'
import { Maybe } from '../../../graphql/generated/schema'
import {
  SaleFieldsFragment,
  TokenFieldsFragment,
  VestingScheduleFieldsFragment,
} from '../../../graphql/generated/operations'

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
    const [tokenId, , tokenSale] = this.events[0].event.data
    const eventBlock = this.events[0].blockNumber
    const { quantityLeft, unitPrice, capPerMember, startBlock, duration } = tokenSale
    const end = startBlock.add(duration)
    const fundsSourceAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      tokenId,
      this.creatorMemberId
    )

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qSale: Maybe<SaleFieldsFragment> | undefined = null

    await Utils.until('waiting for sale to be commited to db', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qSale = await this.query.getCurrentSaleForTokenId(tokenId)
      return qToken!.status === TokenStatus.Sale && !!qSale
    })
    assert.equal(qSale!.pricePerUnit, unitPrice.toString())
    assert.equal(qSale!.finalized, false)
    if (!qSale!.maxAmountPerMember && capPerMember.isSome) {
      assert.equal(qSale!.maxAmountPerMember, capPerMember.unwrap().toString())
    }
    assert.equal(qSale!.tokensSold, '0')
    assert.equal(qSale!.startBlock.toString(), startBlock.toString())
    assert.equal(qSale!.endsAt.toString(), end.toString())
    assert.equal(qSale!.fundsSourceAccount.id, fundsSourceAccount!.id) // funds from the sale are taken from the creator's account
    assert.equal(qSale!.tokenSaleAllocation, quantityLeft.toString())

    assert.equal(qSale!.pricePerUnit.toString(), qToken!.lastPrice!.toString())

    if (tokenSale.vestingScheduleParams.isSome) {
      const { linearVestingDuration, cliffAmountPercentage, blocksBeforeCliff } =
        tokenSale.vestingScheduleParams.unwrap()
      const cliffBlock = new BN(eventBlock).add(blocksBeforeCliff.toBn())
      const endBlock = cliffBlock.add(linearVestingDuration.toBn())
      const vestingId =
        cliffBlock.toString() +
        '-' +
        linearVestingDuration.toString() +
        '-' +
        cliffAmountPercentage.toString()

      let qVesting: Maybe<VestingScheduleFieldsFragment> | undefined = null
      await Utils.until('waiting for vesting to be fetched', async () => {
        qVesting = await this.query.getVestingSchedulById(vestingId)
        return !!qVesting
      })
      assert.equal(qVesting!.cliffBlock.toString(), cliffBlock.toString())

      assert.equal(
        (qVesting!.endsAt - qVesting!.cliffDurationBlocks - eventBlock).toString(),
        linearVestingDuration.toString()
      )
      assert.equal(qVesting!.endsAt.toString(), endBlock.toString())
      assert.equal(qVesting!.vestedSale?.sale.id, qSale!.id)
      assert.isNotNull(qSale!.vestedSale)
      assert.equal(qSale!.vestedSale!.vesting.id, vestingId)
    }
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
