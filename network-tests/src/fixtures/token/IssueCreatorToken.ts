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
import { Token, TokenStatus } from '../../../graphql/generated/schema'
import { BN } from 'bn.js'
import { Utils } from '../../utils'
import { u64 } from '@polkadot/types/primitive'
import { TokenMetadata } from '@joystream/metadata-protobuf'
import {
  TokenFieldsFragment,
  TokenAccountFieldsFragment,
} from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'

type TokenIssuedEventDetails = EventDetails<EventType<'projectToken', 'TokenIssued'>>

export class IssueCreatorTokenFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected metadata: TokenMetadata | undefined
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
    crtParams: PalletProjectTokenTokenIssuanceParameters,
    metadata: TokenMetadata
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.contentActor = contentActor
    this.channelId = channelId
    this.crtParams = crtParams
    this.metadata = metadata
  }

  public getTokenId(): u64 {
    const [tokenId] = this.events[0].event.data
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

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, { initialAllocation, transferPolicy, patronageRate, revenueSplitRate }] =
      this.events[0].event.data
    const initialMembers = [...initialAllocation.keys()]
    const initialBalances = [...initialAllocation.values()].map((item) => item.amount)

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccounts: (Maybe<TokenAccountFieldsFragment> | undefined)[] = []

    await Utils.until('waiting for issue token handler to be finalize token creation', async () => {
      qToken = await this.query.getTokenById(tokenId)
      return !!qToken
    })

    const accountIds = qToken!.accounts.map((account: any) => account.id)
    await Utils.until('waiting for issue token handler to finalize accounts', async () => {
      qAccounts = await Promise.all(
        accountIds.map(async (id: any) => await this.query.getTokenAccountById(id))
      )
      return qAccounts.every((qAccount) => !!qAccount)
    })

    let totalSupply = new BN(0)
    initialAllocation.forEach((item) => {
      totalSupply = totalSupply.add(item.amount)
    })

    assert.isNotNull(qToken)
    assert.equal(qToken!.id, tokenId.toString())
    assert.equal(qToken!.status, TokenStatus.Idle)
    assert.equal(qToken!.revenueShareRatioPermill, revenueSplitRate.toNumber())
    assert.equal(qToken!.totalSupply, totalSupply.toString())
    assert.equal(qToken!.annualCreatorRewardPermill, patronageRate.toNumber())
    assert.equal(qToken!.isInviteOnly, transferPolicy.isPermissioned)
    assert.equal(qToken!.accountsNum, initialAllocation.size)
    assert.equal(qToken!.deissued, false)

    if (this.metadata) {
      assert.equal(qToken!.description, this.metadata.description)

      assert.isNotNull(qToken!.benefits)
      const benefits = qToken!.benefits!

      benefits.forEach((benefit, i) => {
        assert.equal(benefit!.title, this.metadata!.benefits![i].title)
        assert.equal(benefit!.emojiCode, this.metadata!.benefits![i].emoji)
        assert.equal(benefit!.displayOrder, this.metadata!.benefits![i].displayOrder)
        assert.equal(benefit!.description, this.metadata!.benefits![i].description)
      })
    }

    qAccounts.forEach((qAccount, i) => {
      assert.isNotNull(qAccount)
      assert.isNotNull(qAccount!.member.id, initialMembers[i].toString())
      assert.isNotNull(qAccount!.token.id, tokenId.toString())
      assert.isNotNull(qAccount!.stakedAmount, '0')
      assert.isNotNull(qAccount!.totalAmount, initialBalances[i].toString())
    })
  }
}
