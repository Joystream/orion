import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenMerkleProof } from '@polkadot/types/lookup'
import { assert } from 'chai'
import BN from 'bn.js'

type MemberJoinedWhitelistEventDetails = EventDetails<EventType<'projectToken', 'MemberJoinedWhitelist'>>

export class JoinWhitelistFixture extends StandardizedFixture {
  protected memberId: number
  protected memberAddress: string
  protected tokenId: number
  protected events: MemberJoinedWhitelistEventDetails[] = []
  protected proof: PalletProjectTokenMerkleProof
  protected tokenAccountNumberPre: number | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    memberAddress: string,
    memberId: number,
    tokenId: number,
    proof: PalletProjectTokenMerkleProof
  ) {
    super(api, query)
    this.memberId = memberId
    this.memberAddress = memberAddress
    this.tokenId = tokenId
    this.proof = proof
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.memberAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.joinWhitelist(this.memberId, this.tokenId, this.proof)]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<MemberJoinedWhitelistEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'MemberJoinedWhitelist')
  }

  public async preExecHook(): Promise<void> {
    const _tokenId = this.api.createType('u64', this.tokenId)
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(_tokenId))
    assert.isNotNull(qToken)
    this.tokenAccountNumberPre = qToken!.accountsNum
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId] = this.events[0].event.data
    const nodeAccount = await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, memberId)
    const qToken = await this.query.retryQuery(() => this.query.getTokenById(tokenId))
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(tokenId.toString() + memberId.toString()))
    const tokenAccountNumberPost = this.tokenAccountNumberPre! + 1

    assert.isNotNull(qAccount)
    assert.isNotNull(qToken)
    assert.equal(qToken!.accountsNum, tokenAccountNumberPost)
    assert.equal(qAccount!.totalAmount, nodeAccount.amount.toString())
    assert.equal(qAccount!.member.id, memberId.toString())
    assert.equal(qAccount!.stakedAmount, '0')
    assert.equal(qAccount!.token.id, tokenId.toString())
    assert.equal(qAccount!.whitelisted!, true)
    assert.equal(qAccount!.deleted, false)
  }
}

