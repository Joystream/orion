import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import {
  TokenAccountFieldsFragment,
  TokenFieldsFragment,
} from '../../../graphql/generated/operations'
import { Maybe } from '../../../graphql/generated/schema'
import { Utils } from '../../utils'
import { assert } from 'chai'

type DustAccountEventDetails = EventDetails<EventType<'projectToken', 'AccountDustedBy'>>

export class DustAccountFixture extends StandardizedFixture {
  protected creatorAddress
  protected tokenId: number
  protected memberId: number
  protected accountsPre: number | undefined
  protected events: DustAccountEventDetails[] = []

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    tokenId: number,
    memberId: number
  ) {
    super(api, query)
    this.creatorAddress = creatorAddress
    this.tokenId = tokenId
    this.memberId = memberId
  }
  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [this.api.tx.projectToken.dustAccount(this.tokenId, this.memberId)]
  }

  public async preExecHook() {
    const qToken = await this.query.getTokenById(this.api.createType('u64', this.tokenId))
    this.accountsPre = qToken!.accountsNum
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<DustAccountEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'AccountDustedBy')
  }

  public async tryQuery(): Promise<void> {}

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, memberId] = this.events[0].event.data

    let qToken: Maybe<TokenFieldsFragment> | undefined = null
    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for dust account handler to be finalized', async () => {
      qToken = await this.query.getTokenById(tokenId)
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId.toNumber())
      if (Boolean(qToken && qAccount)) {
        return qToken!.accountsNum != this.accountsPre! && qAccount!.deleted
      }
      return false
    })

    const nodeAccountNumber = (
      await this.api.query.projectToken.tokenInfoById(tokenId)
    ).accountsNumber.toNumber()
    assert.equal(qToken!.accountsNum, nodeAccountNumber)
    assert.equal(qAccount!.deleted, true)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
