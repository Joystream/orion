import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { u32 } from '@polkadot/types/primitive'
import { BN } from 'bn.js'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { SaleFieldsFragment } from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'

type TokenSaleUpdatedEventDetails = EventDetails<
  EventType<'projectToken', 'UpcomingTokenSaleUpdated'>
>

export class UpdateUpcomingSaleFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected newStartBlock: u32 | null
  protected newDuration: u32 | null
  protected events: TokenSaleUpdatedEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    newStartBlock?: number,
    newDuration?: number
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.newStartBlock = newStartBlock ? this.api.createType('u32', new BN(newStartBlock!)) : null
    this.newDuration = newDuration ? this.api.createType('u32', new BN(newDuration!)) : null
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [
      this.api.tx.content.updateUpcomingCreatorTokenSale(
        actor,
        this.channelId,
        this.newStartBlock,
        this.newDuration
      ),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokenSaleUpdatedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'UpcomingTokenSaleUpdated')
  }

  public async preExecHook(): Promise<void> {}

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, saleNonce, newStart, newDuration] = this.events[0].event.data

    let qSale: Maybe<SaleFieldsFragment> | undefined = null
    await Utils.until('wait for sale to be updated', async () => {
      qSale = await this.query.getCurrentSaleForTokenId(tokenId)
      return qSale!.startBlock === this.newStartBlock!.toNumber()
    })

    assert.isNotNull(qSale)
    if (newStart.isSome) {
      assert.equal(qSale!.startBlock.toString(), newStart.unwrap().toString())
    }
    if (newDuration.isSome) {
      const newEnd = qSale!.startBlock + newDuration.unwrap().toNumber()
      assert.equal(qSale!.endsAt.toString(), newEnd.toString())
    }
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
