import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import { TokenStatus } from '../../../graphql/generated/schema'
import BN from 'bn.js'
import { Utils } from '../../utils'
import { AmmCurvFieldsFragment, TokenFieldsFragment } from 'graphql/generated/operations'
import { Maybe } from 'src/graphql/generated/schema'

type AmmDeactivatedEventDetails = EventDetails<EventType<'projectToken', 'AmmDeactivated'>>

export class DeactivateAmmFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected creatorMemberId: number
  protected channelId: number
  protected events: AmmDeactivatedEventDetails[] = []

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

    let qToken: Maybe<TokenFieldsFragment> | undefined = null

    await Utils.until('waiting for token to be fetched', async () => {
      qToken = await this.query.getTokenById(tokenId)
      return !!qToken
    })
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, _] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAmm: Maybe<AmmCurvFieldsFragment> | undefined = null

    await Utils.until('waiting for token to be fetched', async () => {
      qToken = await this.query.getTokenById(tokenId)
      return !!qToken && qToken.status === TokenStatus.Idle
    })

    const supplyPost = (await this.api.query.projectToken.tokenInfoById(tokenId)).totalSupply

    assert.isNotNull(qToken)
    assert.equal(qToken!.totalSupply, supplyPost.toString())

    const [{ id: ammId }] = qToken!.ammCurves
    await Utils.until('waiting for token to be fetched', async () => {
      qAmm = await this.query.getAmmById(ammId)
      return !!qAmm
    })
    assert.equal(qAmm!.finalized, true)
  }
}
