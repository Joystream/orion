import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenAmmParams } from '@polkadot/types/lookup'
import { assert } from 'chai'
import { TokenStatus } from '../../../graphql/generated/schema'
import BN from 'bn.js'
import { Utils } from '../../utils'

type AmmDeactivatedEventDetails = EventDetails<EventType<'projectToken', 'AmmDeactivated'>>

export class DeactivateAmmFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected events: AmmDeactivatedEventDetails[] = []
  protected supplyPre: BN | undefined

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
    return [this.api.tx.content.deactivateAmm(actor, this.channelId)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<AmmDeactivatedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'AmmDeactivated')
  }
  public async preExecHook(): Promise<void> {
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    assert.isNotNull(qToken)
    this.supplyPre = new BN(qToken!.totalSupply)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void { }
  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, burnedAmount] = this.events[0].event.data
    let qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    await Utils.until('waiting for token to be saved', async ({ debug }) => {
      qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
      return qToken!.status === TokenStatus.Idle
    })
    const supplyPost = this.supplyPre!.sub(burnedAmount)

    assert.isNotNull(qToken)
    assert.equal(qToken!.totalSupply, supplyPost.toString())

    const ammId = tokenId.toString() + (qToken!.ammNonce - 1).toString()
    const qAmm = await this.query.retryQuery(() => this.query.getAmmById(ammId))
    assert.isNotNull(qAmm)
    assert.equal(qAmm!.finalized, true)
  }
}
