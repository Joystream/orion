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
import {
  TokenFieldsFragment,
  TokenAccountFieldsFragment,
  AmmTransactionFieldsFragment,
} from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'

type TokensBoughtOnAmmEventDetails = EventDetails<EventType<'projectToken', 'TokensBoughtOnAmm'>>

export class BuyOnAmmFixture extends StandardizedFixture {
  protected tokenId: number
  protected memberAddress: string
  protected memberId: number
  protected amount: BN
  protected events: TokensBoughtOnAmmEventDetails[] = []
  protected amountPre: BN | undefined
  protected supplyPre: BN | undefined

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
      this.api.tx.projectToken.buyOnAmm(
        this.tokenId,
        this.memberId,
        this.amount,
        slippageTolerance
      ),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokensBoughtOnAmmEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokensBoughtOnAmm')
  }

  public async preExecHook(): Promise<void> {
    await this.api.treasuryTransferBalance(this.memberAddress, new BN(10000000000))
    const qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      this.api.createType('u64', this.tokenId),
      this.memberId
    )
    if (qAccount) {
      this.amountPre = new BN(qAccount!.totalAmount)
    } else {
      this.amountPre = new BN(0)
    }
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.getTokenById(_tokenId)
    assert.isNotNull(qToken)
    this.supplyPre = new BN(qToken!.totalSupply)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId, crtMinted, joysDeposited] = this.events[0].event.data

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for buy on amm effects to take place', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      if (!!qAccount) {
        const currSupply = new BN(qToken!.totalSupply)
        const currAmount = new BN(qAccount!.totalAmount)
        return currSupply > this.supplyPre! && currAmount > this.amountPre!
      } else {
        return false
      }
    })

    const [{ id: ammId }] = qToken!.ammCurves
    const qAmmCurve = await this.query.getAmmById(ammId)

    let qTransaction: Maybe<AmmTransactionFieldsFragment> | undefined = null
    await Utils.until('waiting for buy on amm transaction to be indexed', async () => {
      qTransaction = qAmmCurve!.transactions.find((qTx) => {
        assert.isNotNull(qAmmCurve)
        return (
          qTx && qTx!.transactionType === AmmTransactionType.Buy && qTx!.account.id === qAccount!.id
        )
      })
      return Boolean(qTransaction)
    })

    assert.isNotNull(qAccount)
    assert.isNotNull(qToken)
    assert(qTransaction !== undefined, 'transaction not found')

    const nodeMintedByAmm = (await this.api.query.projectToken.tokenInfoById(this.tokenId)).ammCurve
      .unwrap()
      .providedSupply.toString()
    const nodeSupply = (
      await this.api.query.projectToken.tokenInfoById(this.tokenId)
    ).totalSupply.toString()
    const nodeAmount = (
      await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, memberId)
    ).amount.toString()

    assert.equal(qAmmCurve!.mintedByAmm, nodeMintedByAmm)
    assert.equal(qToken!.totalSupply, nodeSupply)
    assert.equal(qAccount!.totalAmount, nodeAmount)
    assert.equal(qTransaction!.transactionType, AmmTransactionType.Buy)
    assert.equal(qTransaction!.quantity, crtMinted.toString())
    assert.equal(qTransaction!.pricePaid, joysDeposited.toString())
    assert.equal(qTransaction!.pricePerUnit, joysDeposited.div(crtMinted).toString())

    assert.equal(qTransaction!.pricePerUnit.toString(), qToken!.lastPrice!.toString())
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
