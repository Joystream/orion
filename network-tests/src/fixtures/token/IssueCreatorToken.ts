import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import {
  PalletContentPermissionsContentActor,
  PalletProjectTokenTokenIssuanceParameters,
} from '@polkadot/types/lookup'
import { assert } from 'chai'
import { TokenStatus } from '../../../graphql/generated/schema'
import { BN } from 'bn.js'
import { Utils } from '../../utils'
import { u64 } from '@polkadot/types/primitive'
import { SubTokenById, TokenFieldsFragment, GetTokenById } from '../../../graphql/generated/operations'
import { useQuery, useSubscription } from '@apollo/client'

type TokenIssuedEventDetails = EventDetails<EventType<'projectToken', 'TokenIssued'>>

export class IssueCreatorTokenFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected contentActor: PalletContentPermissionsContentActor
  protected channelId: number
  protected crtParams: PalletProjectTokenTokenIssuanceParameters
  protected events: TokenIssuedEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    contentActor: PalletContentPermissionsContentActor,
    channelId: number,
    crtParams: PalletProjectTokenTokenIssuanceParameters
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.contentActor = contentActor
    this.channelId = channelId
    this.crtParams = crtParams
  }

  public getTokenId(): u64 {
    const [tokenId,] = this.events[0].event.data
    return tokenId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [
      this.api.tx.content.issueCreatorToken(this.contentActor, this.channelId, this.crtParams),
    ]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TokenIssuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenIssued')
  }

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void { }

  public async runQueryNodeChecks(): Promise<void> {
    const [
      tokenId,
      { initialAllocation, symbol, transferPolicy, patronageRate, revenueSplitRate },
    ] = this.events[0].event.data
    let qToken: TokenFieldsFragment | null = null

    await this.query.subTokenById(tokenId.toString())

    // await Utils.until('waiting for issue token handler to be completed', async () => {
    //   qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    //   return qToken !== null
    // })

    const initialMembers = [...initialAllocation.keys()]
    const initialBalances = [...initialAllocation.values()].map((item) => item.amount)
    const qAccounts = await Promise.all(
      initialMembers.map(async (memberId) => {
        return await this.query.retryQuery(() =>
          this.query.getTokenAccountById(tokenId.toString() + memberId.toString())
        )
      })
    )

    let totalSupply = new BN(0)
    initialAllocation.forEach((item) => {
      totalSupply = totalSupply.add(item.amount)
    })

    assert.isNotNull(qToken)
    assert.equal(qToken!.id, tokenId.toString())
    assert.equal(qToken!.status, TokenStatus.Idle)
    assert.equal(qToken!.revenueShareNonce, 0)
    assert.equal(qToken!.revenueShareRatioPercent, revenueSplitRate.toNumber())
    assert.equal(qToken!.totalSupply, totalSupply.toString())
    assert.equal(qToken!.annualCreatorReward, patronageRate.toString())
    // assert.equal(qToken!.createdAt, new Date(this.events[0].blockTimestamp * 1000))
    assert.equal(qToken!.isInviteOnly, transferPolicy.isPermissioned)
    assert.equal(qToken!.accountsNum, initialAllocation.size)
    assert.equal(qToken!.deissued, false)

    qAccounts.forEach((qAccount, i) => {
      assert.isNotNull(qAccount)
      assert.isNotNull(qAccount!.member.id, initialMembers[i].toString())
      assert.isNotNull(qAccount!.token.id, tokenId.toString())
      assert.isNotNull(qAccount!.stakedAmount, '0')
      assert.isNotNull(qAccount!.totalAmount, initialBalances[i].toString())
    })
  }
}
