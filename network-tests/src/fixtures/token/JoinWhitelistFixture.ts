import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenMerkleProof, PalletProjectTokenMerkleSide } from '@polkadot/types/lookup'
import { assert } from 'chai'
import {
  TokenAccountFields,
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
} from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'
import { Utils } from '../../utils'

type MemberJoinedWhitelistEventDetails = EventDetails<
  EventType<'projectToken', 'MemberJoinedWhitelist'>
>

export class JoinWhitelistFixture extends StandardizedFixture {
  protected memberId: number
  protected memberAddress: string
  protected tokenId: number
  protected events: MemberJoinedWhitelistEventDetails[] = []
  protected proof: PalletProjectTokenMerkleProof | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number
  ) {
    super(api, query)
    this.memberId = memberId
    this.memberAddress = memberAddress
    this.tokenId = tokenId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.joinWhitelist(this.memberId, this.tokenId, this.proof!)]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<MemberJoinedWhitelistEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'MemberJoinedWhitelist')
  }

  public async preExecHook(): Promise<void> {
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.getTokenById(_tokenId)
    assert.isNotNull(qToken)
    const bloatBond = (await this.api.query.projectToken.bloatBond()).toBn()
    await this.api.treasuryTransferBalance(this.memberAddress, bloatBond)
    this.proof = this.api.createType('PalletProjectTokenMerkleProof')
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId] = this.events[0].event.data
    const nodeAccount = await this.api.query.projectToken.accountInfoByTokenAndMember(
      tokenId,
      memberId
    )

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for joinwhitelst handler to be finalized', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      return !!qToken && !!qAccount
    })

    const tokenAccountNumberPost = (
      await this.api.query.projectToken.tokenInfoById(tokenId)
    ).accountsNumber.toNumber()

    assert.equal(qToken!.accountsNum, tokenAccountNumberPost)
    assert.equal(qAccount!.totalAmount, nodeAccount.amount.toString())
    assert.equal(qAccount!.member.id, memberId.toString())
    assert.equal(qAccount!.stakedAmount, '0')
    assert.equal(qAccount!.token.id, tokenId.toString())
    assert.equal(qAccount!.deleted, false)
  }
}
