import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'
import { Utils } from '../../utils'
import { AmmTransactionType } from '../../../graphql/generated/schema'
import { Maybe } from '../../../graphql/generated/schema'
import {
  AmmTransactionFieldsFragment,
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
} from '../../../graphql/generated/operations'

type TokensSoldOnAmmEventDetails = EventDetails<EventType<'projectToken', 'TokensSoldOnAmm'>>

export class SellOnAmmFixture extends StandardizedFixture {
  protected tokenId: number
  protected memberAddress: string
  protected memberId: number
  protected amount: BN
  protected events: TokensSoldOnAmmEventDetails[] = []
  protected amountPre: BN | undefined
  protected supplyPre: BN | undefined
  protected burnedByAmmPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number,
    amount: BN
  ) {
    super(api, query)
    this.amount = amount
    this.memberAddress = memberAddress
    this.memberId = memberId
    this.tokenId = tokenId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const slippageTolerance = null
    return [
      this.api.tx.projectToken.sellOnAmm(
        this.tokenId,
        this.memberId,
        this.amount,
        slippageTolerance
      ),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokensSoldOnAmmEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensSoldOnAmm')
  }

  public async preExecHook(): Promise<void> {
    await this.api.treasuryTransferBalance(this.memberAddress, this.amount.muln(10000000))
    assert.notEqual(this.amount, new BN(0))
    const qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      this.api.createType('u64', this.tokenId),
      this.memberId
    )

    assert.isNotNull(qAccount)
    this.amountPre = new BN(qAccount!.totalAmount)
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.getTokenById(_tokenId)
    assert.isNotNull(qToken)
    this.supplyPre = new BN(qToken!.totalSupply)
    const [{ id: ammId }] = qToken!.ammCurves
    const qAmmCurve = await this.query.getAmmById(ammId)
    this.burnedByAmmPre = new BN(qAmmCurve!.burnedByAmm)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, crtBurned, joysRecovered] = this.events[0].event.data
    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for sell on amm effects to take place', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      const currSupply = new BN(qToken!.totalSupply)
      const currAmount = new BN(qAccount!.totalAmount)

      return (
        currSupply.toString() != this.supplyPre!.toString() &&
        currAmount.toString() != this.amountPre!.toString()
      )
    })

    const [{ id: ammId }] = qToken!.ammCurves
    const qAmmCurve = await this.query.getAmmById(ammId)
    assert.isNotNull(qAmmCurve)

    let qTransaction: Maybe<AmmTransactionFieldsFragment> | undefined = null
    await Utils.until('waiting for sell on amm transaction to be indexed', async () => {
      qTransaction = qAmmCurve!.transactions.find((qTx) => {
        assert.isNotNull(qAmmCurve)
        return (
          qTx &&
          qTx!.transactionType === AmmTransactionType.Sell &&
          qTx!.account.id === qAccount!.id
        )
      })
      return Boolean(qTransaction)
    })

    assert.isNotNull(qAccount)
    assert.isNotNull(qToken)
    assert(qTransaction !== undefined, 'transaction not found')

    const nodeSupply = (
      await this.api.query.projectToken.tokenInfoById(this.tokenId)
    ).totalSupply.toString()
    const nodeAmount = (
      await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, memberId)
    ).amount.toString()
    const burnedByAmmPost = this.burnedByAmmPre!.add(crtBurned).toString()

    assert.equal(qAmmCurve!.burnedByAmm, burnedByAmmPost)
    assert.equal(qToken!.totalSupply, nodeSupply)
    assert.equal(qAccount!.totalAmount, nodeAmount)
    assert.equal(qTransaction!.transactionType, AmmTransactionType.Sell)
    assert.equal(qTransaction!.quantity, crtBurned.toString())
    assert.equal(qTransaction!.pricePaid, joysRecovered.toString())
    assert.equal(qTransaction!.pricePerUnit, joysRecovered.div(crtBurned).toString())

    assert.equal(qTransaction!.pricePerUnit.toString(), qToken!.lastPrice!.toString())
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
