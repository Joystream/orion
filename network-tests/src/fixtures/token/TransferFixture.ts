import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { PalletProjectTokenTransfers } from '@polkadot/types/lookup'
import BN from 'bn.js'
import { assert } from 'chai'
import { u128 } from '@polkadot/types/primitive'

type TransferEventDetails = EventDetails<EventType<'projectToken', 'TokenAmountTransferred'>>

export class TransferFixture extends StandardizedFixture {
  protected creatorAddress: string
  protected tokenId: number
  protected creatorMemberId: number
  protected outputs: [number, BN | u128][]
  protected metadata: string
  protected events: TransferEventDetails[] = []
  protected destinationsAmountPre: BN[] | undefined
  protected srcAmountPre: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    creatorMemberId: number,
    tokenId: number,
    outputs: [number, BN][],
    metadata: string
  ) {
    super(api, query)
    this.creatorMemberId = creatorMemberId
    this.tokenId = tokenId
    this.outputs = outputs
    this.metadata = metadata
    this.creatorAddress = creatorAddress
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return [
      this.api.tx.projectToken.transfer(
        this.creatorMemberId,
        this.tokenId,
        this.outputs,
        this.metadata
      ),
    ]
  }

  protected async getEventFromResult(result: SubmittableResult): Promise<TransferEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenAmountTransferred')
  }

  public async preExecHook(): Promise<void> {
    const accountId = this.tokenId.toString() + this.creatorMemberId.toString()
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(accountId))
    assert.isNotNull(qAccount)
    this.destinationsAmountPre = await Promise.all(
      [...this.outputs.entries()].map(async ([memberId]) => {
        const destAccountId = this.tokenId.toString() + memberId.toString()
        const qDestAccount = await this.query.retryQuery(() =>
          this.query.getTokenAccountById(destAccountId)
        )
        if (qDestAccount) {
          return new BN(qDestAccount!.totalAmount)
        } else {
          return new BN(0)
        }
      })
    )
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, sourceMemberId, validatedTransfers] = this.events[0].event.data
    const accountId = tokenId.toString() + sourceMemberId.toString()
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(accountId))

    const total = this.outputs
      .map(([, amount]) => amount)
      .reduce((item, acc) => acc.add(item), new BN(0))
    const sourceAmountPost = this.srcAmountPre!.sub(total)

    assert.isNotNull(qAccount)
    assert.equal(qAccount!.totalAmount, sourceAmountPost.toString())

    const observedAmounts = await Promise.all(
      [...this.outputs.entries()].map(async ([memberId]) => {
        const destAccountId = tokenId.toString() + memberId.toString()
        const qDestAccount = await this.query.retryQuery(() =>
          this.query.getTokenAccountById(destAccountId)
        )
        assert.isNotNull(qDestAccount)
        return new BN(qDestAccount!.totalAmount)
      })
    )

    // unpack validatedTransfers into amount, vesting
    const destinationsAmountPost = [...validatedTransfers.values()].map((transfer, i) =>
      this.destinationsAmountPre![i].add(transfer.payment.amount)
    )
    assert.deepEqual(observedAmounts, destinationsAmountPost)
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
