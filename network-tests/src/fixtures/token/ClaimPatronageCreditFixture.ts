import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import BN from 'bn.js'
import { Utils } from '../../utils'
import {
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
} from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'

type PatronageCreditClaimedEventDetails = EventDetails<
  EventType<'projectToken', 'PatronageCreditClaimed'>
>

export class ClaimPatronageCreditFixture extends StandardizedFixture {
  protected creatorMemberId: number
  protected creatorAddress: string
  protected channelId: number
  protected events: PatronageCreditClaimedEventDetails[] = []
  protected supplyPre: BN | undefined
  protected amountPre: BN | undefined

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
    return [this.api.tx.content.claimCreatorTokenPatronageCredit(actor, this.channelId)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<PatronageCreditClaimedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'PatronageCreditClaimed')
  }

  public async preExecHook(): Promise<void> {
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const qToken = await this.query.getTokenById(tokenId)
    const qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      tokenId,
      this.creatorMemberId
    )
    this.supplyPre = new BN(qToken!.totalSupply)
    this.amountPre = new BN(qAccount!.totalAmount)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, , memberId] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('claim patronage handler finalized', async () => {
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      qToken = await this.query.getTokenById(tokenId)

      assert.isNotNull(qToken)
      assert.isNotNull(qAccount)

      const currentSupply = new BN(qToken!.totalSupply)
      const currentAmount = new BN(qAccount!.totalAmount)

      return currentSupply.gt(this.supplyPre!) && currentAmount.gt(this.amountPre!)
    })

    const supplyPost = (
      await this.api.query.projectToken.tokenInfoById(tokenId)
    ).totalSupply.toString()
    const accountAmountPost = (
      await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, memberId)
    ).amount.toString()

    assert.equal(qToken!.totalSupply, supplyPost)
    assert.equal(qAccount!.totalAmount, accountAmountPost)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
