import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { PalletProjectTokenTransfersPayment } from '@polkadot/types/lookup'
import { Api } from '../../Api'
import BN from 'bn.js'
import { assert } from 'chai'
import { u128 } from '@polkadot/types/primitive'
import { Utils } from '../../utils'
import { TokenAccountFieldsFragment } from 'graphql/generated/operations'
import { Maybe } from 'graphql/generated/schema'

type TransferEventDetails = EventDetails<EventType<'projectToken', 'TokenAmountTransferred'>>

export class TransferFixture extends StandardizedFixture {
  protected sourceAccountId: string
  protected tokenId: number
  protected sourceMemberId: number
  protected outputs: [number, BN | u128][]
  protected metadata: string
  protected events: TransferEventDetails[] = []
  protected srcAmountPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    sourceAccountId: string,
    sourceMemberId: number,
    tokenId: number,
    outputs: [number, BN][],
    metadata: string
  ) {
    super(api, query)
    this.sourceMemberId = sourceMemberId
    this.tokenId = tokenId
    this.outputs = outputs
    this.metadata = metadata
    this.sourceAccountId = sourceAccountId
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.sourceAccountId]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const outputs: PalletProjectTokenTransfersPayment = this.api.createType(
      'BTreeMap<u64, ProjectTokenPayment>'
    )
    for (const [memberId, payment] of this.outputs) {
      outputs.set(
        this.api.createType('u64', memberId),
        this.api.createType('PalletProjetTokenPayment', { amount: payment })
      )
    }
    return [
      this.api.tx.projectToken.transfer(this.sourceMemberId, this.tokenId, outputs, this.metadata),
    ]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TransferEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenAmountTransferred')
  }

  public async preExecHook(): Promise<void> {
    const accountId = this.tokenId.toString() + this.sourceMemberId.toString()
    const qAccount = await this.query.getTokenAccountById(accountId)

    if (qAccount === null) {
      this.srcAmountPre = new BN(0)
    } else {
      this.srcAmountPre = new BN(qAccount!.totalAmount)
    }
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, sourceMemberId, validatedTransfers] = this.events[0].event.data
    const accountId = tokenId.toString() + sourceMemberId.toString()

    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for transfers to be committed', async () => {
      qAccount = await this.query.getTokenAccountById(accountId)
      const currentAmount = new BN(qAccount!.totalAmount)
      return currentAmount.lt(this.srcAmountPre!)
    })

    const sourceAmountPost = (
      await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, sourceMemberId)
    ).amount.toString()

    assert.isNotNull(qAccount)
    assert.equal(qAccount!.totalAmount, sourceAmountPost)

    const observedAmounts = await Promise.all(
      this.outputs.map(async ([memberId]) => {
        const destAccountId = tokenId.toString() + memberId.toString()
        const qDestAccount = await this.query.getTokenAccountById(destAccountId)
        assert.isNotNull(qDestAccount)
        return qDestAccount!.totalAmount
      })
    )

    // unpack validatedTransfers into amount, vesting
    const nodeDestinationAmounts = await Promise.all(
      [...validatedTransfers.keys()].map(async (validated) => {
        const memberId = validated.isExisting ? validated.asExisting : validated.asNonExisting
        return (
          await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, memberId)
        ).amount.toString()
      })
    )

    assert.deepEqual(observedAmounts, nodeDestinationAmounts)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
