import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import BN from 'bn.js'
import {
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
} from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'
import { Utils } from '../../utils'

type TokensBurnedEventDetails = EventDetails<EventType<'projectToken', 'TokensBurned'>>

export class BurnTokensFixture extends StandardizedFixture {
  protected creatorAddress
  protected tokenId: number
  protected fromMemberId: number
  protected events: TokensBurnedEventDetails[] = []
  protected amount: BN
  protected supplyPre: BN | undefined
  protected accountAmountPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    tokenId: number,
    fromMemberId: number,
    amount: BN
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.tokenId = tokenId
    this.fromMemberId = fromMemberId
    this.amount = amount
  }

  public async preExecHook(): Promise<void> {
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.getTokenById(_tokenId)
    const qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      _tokenId,
      this.fromMemberId
    )
    assert.isNotNull(qToken)
    assert.isNotNull(qAccount)

    this.supplyPre = new BN(qToken!.totalSupply)
    this.accountAmountPre = new BN(qAccount!.totalAmount)
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.burn(this.tokenId, this.fromMemberId, this.amount)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokensBurnedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensBurned')
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}

  // add a general key-map record to the runQueryNodeChecks as a parameter
  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, amountBurned] = this.events[0].event.data

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for burn token fixture to be finalized', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      return new BN(qAccount!.totalAmount).lt(this.accountAmountPre!)
    })

    const supplyPost = this.supplyPre!.sub(amountBurned.toBn()).toString()
    const accountAmountPost = this.accountAmountPre!.sub(amountBurned.toBn()).toString()

    assert.isNotNull(qToken)
    assert.isNotNull(qAccount)
    assert.equal(amountBurned.toString(), this.amount.toString())
    assert.equal(qToken!.totalSupply, supplyPost)
    assert.equal(qAccount!.totalAmount, accountAmountPost)
  }
}
