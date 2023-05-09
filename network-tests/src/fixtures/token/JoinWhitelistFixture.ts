import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenMerkleProof } from '@polkadot/types/lookup'

type MemberJoinedWhitelistEventDetails = EventDetails<EventType<'projectToken', 'MemberJoinedWhitelist'>>

export class JoinWhitelistFixture extends StandardizedFixture {
  protected memberId: number 
  protected memberAddress: string
  protected tokenId: number
  protected proof: PalletProjectTokenMerkleProof

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

  public async tryQuery(): Promise<void> {
    const token = await this.query.getTokenById(this.api.createType('u64', 0))
    console.log(`Query result:\n ${token}`)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {
  }
}

