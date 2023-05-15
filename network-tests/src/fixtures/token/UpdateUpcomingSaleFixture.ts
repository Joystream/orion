import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { u32 } from '@polkadot/types/primitive'
import { BN } from 'bn.js'

type TokenSaleUpdatedEventDetails = EventDetails<
  EventType<'projectToken', 'UpcomingTokenSaleUpdated'>
>

export class UpdateUpcomingSaleFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected newStartBlock: u32 | null
  protected newDuration: u32 | null

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

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
