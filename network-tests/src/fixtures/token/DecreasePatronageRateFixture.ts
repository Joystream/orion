import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { TokenFieldsFragment } from '../../../graphql/generated/operations'
import BN from 'bn.js'
import { Maybe } from 'graphql/generated/schema'

type PatronageRateDecreasedToEventDetails = EventDetails<
  EventType<'projectToken', 'PatronageRateDecreasedTo'>
>

export class DecreasePatronageRateFixture extends StandardizedFixture {
  protected creatorMemberId: number
  protected creatorAddress: string
  protected channelId: number
  protected targetRate: number
  protected events: PatronageRateDecreasedToEventDetails[] = []
  protected previousRate: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    targetRate: number
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.targetRate = targetRate
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [
      this.api.tx.content.reduceCreatorTokenPatronageRateTo(actor, this.channelId, this.targetRate),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<PatronageRateDecreasedToEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'PatronageRateDecreasedTo')
  }

  public async preExecHook(): Promise<void> {
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    await Utils.until('waiting for patronage rate to be updated in DB', async () => {
      qToken = await this.query.getTokenById(tokenId)
      return !!qToken
    })
    assert.isNotNull(qToken)
    this.previousRate = new BN(qToken!.annualCreatorRewardPermill)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, newRate] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    await Utils.until('waiting for patronage rate to be updated in DB', async () => {
      qToken = await this.query.getTokenById(tokenId)
      if (!!qToken) {
        const currentRate = new BN(qToken!.annualCreatorRewardPermill)
        return !currentRate.eq(this.previousRate!)
      } else {
        return false
      }
    })

    assert.isNotNull(qToken)
    assert.equal(qToken!.annualCreatorRewardPermill, newRate.toNumber())
  }
  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
