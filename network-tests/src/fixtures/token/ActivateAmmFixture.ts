import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenAmmParams } from '@polkadot/types/lookup'
import { TokenStatus } from '../../../graphql/generated/schema'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { AmmCurvFieldsFragment, TokenFieldsFragment } from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'

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
    const qToken = await this.query.getTokenById(tokenId)
    assert.isNotNull(qToken)
    assert.equal(qToken!.status, TokenStatus.Idle, 'preExecHook: token.status assertion')
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, , { slope, intercept }] = this.events[0].event.data

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAmm: Maybe<AmmCurvFieldsFragment> | undefined = null

    await Utils.until('waiting for token to be saved', async () => {
      qToken = await this.query.getTokenById(tokenId)
      return !!qToken && qToken!.status === TokenStatus.Market
    })

    const [{ id: ammId }] = qToken!.ammCurves
    await Utils.until('waiting for token to be saved', async () => {
      qAmm = await this.query.getAmmById(ammId)
      return !!qAmm
    })

    assert.equal(qToken!.status, TokenStatus.Market)
    assert.equal(qAmm!.ammInitPrice, intercept.toString())
    assert.equal(qAmm!.ammSlopeParameter, slope.toString())
    assert.equal(qToken!.lastPrice, qAmm!.ammInitPrice)
    assert.equal(qAmm!.burnedByAmm, '0')
    assert.equal(qAmm!.mintedByAmm, '0')
    assert.equal(qAmm!.finalized, false)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
