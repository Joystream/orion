import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenAmmParams } from '@polkadot/types/lookup'
import { TokenStatus } from '../../../graphql/generated/schema'
import { assert } from 'chai'

type AmmActivatedEventDetails = EventDetails<EventType<'projectToken', 'AmmActivated'>>

export class ActivateAmmFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected parameters: PalletProjectTokenAmmParams
  protected events: AmmActivatedEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    channelId: number,
    parameters: PalletProjectTokenAmmParams
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.creatorMemberId = creatorMemberId
    this.channelId = channelId
    this.parameters = parameters
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.creatorMemberId,
    })
    return [this.api.tx.content.activateAmm(actor, this.channelId, this.parameters)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<AmmActivatedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'AmmActivated')
  }

  public async preExecHook(): Promise<void> {
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    assert.isNotNull(qToken)
    assert.equal(qToken!.status, TokenStatus.Idle)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, , { slope, intercept }] = this.events[0].event.data

    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    assert.isNotNull(qToken)
    assert.equal(qToken!.status, TokenStatus.Market)
    const ammId = tokenId.toString() + qToken!.ammNonce.toString()
    const qAmm = await this.query.retryQuery(() => this.query.getAmmById(ammId))
    assert.isNotNull(qAmm)
    assert.equal(qAmm!.ammInitPrice, intercept.toString())
    assert.equal(qAmm!.ammSlopeParameter, slope.toString())
    assert.equal(qAmm!.burnedByAmm, '0')
    assert.equal(qAmm!.mintedByAmm, '0')
    assert.equal(qAmm!.finalized, false)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
