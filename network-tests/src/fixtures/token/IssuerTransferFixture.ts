import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import { Utils } from '../../utils'
import BN from 'bn.js'
import { u64 } from '@polkadot/types/primitive'
import { PalletProjectTokenPaymentWithVesting } from '@polkadot/types/lookup'

type IssuerTransferEventDetails = EventDetails<
  EventType<'projectToken', 'TokenAmountTransferredByIssuer'>
>

export class IssuerTransferFixture extends StandardizedFixture {
  protected sourceMemberId: number
  protected creatorAddress: string
  protected channelId: number
  protected outputs: [number, PalletProjectTokenPaymentWithVesting][]
  protected metadata: string
  protected events: IssuerTransferEventDetails[] = []
  protected sourceAmountPre: BN | undefined
  protected destinationsAmountPre: BN[] | undefined
  protected bestBlock: BN | undefined

  public constructor(
    api: Api,
    query: OrionApi,
    creatorAddress: string,
    sourceMemberId: number,
    channelId: number,
    outputs: [number, PalletProjectTokenPaymentWithVesting][],
    metadata: string
  ) {
    super(api, query)
    this.sourceMemberId = sourceMemberId
    this.channelId = channelId
    this.outputs = outputs
    this.metadata = metadata
    this.creatorAddress = creatorAddress
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return [this.creatorAddress]
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const actor = this.api.createType('PalletContentPermissionsContentActor', {
      Member: this.sourceMemberId,
    })
    return [
      this.api.tx.content.creatorTokenIssuerTransfer(
        actor,
        this.channelId,
        this.outputs,
        this.metadata
      ),
    ]
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<IssuerTransferEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenAmountTransferredByIssuer')
  }

  public async preExecHook(): Promise<void> {
    this.bestBlock = await this.api.getBestBlock()
    const tokenId = (
      await this.api.query.content.channelById(this.channelId)
    ).creatorTokenId.unwrap()
    const accountId = tokenId.toString() + this.sourceMemberId.toString()
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(accountId))
    assert.isNotNull(qAccount)
    this.sourceAmountPre = new BN(qAccount!.totalAmount)
    this.destinationsAmountPre = await Promise.all(
      this.outputs.map(async ([memberId]) => {
        const destAccountId = tokenId.toString() + memberId.toString()
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
    await Utils.wait(20000)
    const accountId = tokenId.toString() + sourceMemberId.toString()
    const qAccount = await this.query.retryQuery(() => this.query.getTokenAccountById(accountId))

    const total = this.outputs
      .map(([, payment]) => payment.amount)
      .reduce((item, acc) => acc.add(item), new BN(0))
    const sourceAmountPost = this.sourceAmountPre!.sub(total)

    assert.isNotNull(qAccount)
    assert.equal(qAccount!.totalAmount, sourceAmountPost.toString())

    const observedAmounts = await Promise.all(
      this.outputs.map(async ([memberId]) => {
        console.log(`destination ${memberId}`)
        const destAccountId = tokenId.toString() + memberId.toString()
        const qDestAccount = await this.query.retryQuery(() =>
          this.query.getTokenAccountById(destAccountId)
        )
        assert.isNotNull(qDestAccount)
        return new BN(qDestAccount!.totalAmount)
      })
    )

    const destinationsAmountPost = [...validatedTransfers.values()].map((transfer, i) =>
      this.destinationsAmountPre![i].add(transfer.payment.amount)
    )
    assert.deepEqual(observedAmounts, destinationsAmountPost)

    for (const transfer of validatedTransfers.values()) {
      const { payment } = transfer
      const { vestingSchedule } = payment
      if (vestingSchedule.isSome) {
        const { blocksBeforeCliff, linearVestingDuration, cliffAmountPercentage } =
          vestingSchedule.unwrap()
        const cliffBlock = blocksBeforeCliff.add(this.bestBlock!)
        const endBlock = cliffBlock.add(linearVestingDuration)
        const vestingId =
          cliffBlock.toString() +
          linearVestingDuration.toString() +
          cliffAmountPercentage.toString()
        const qVesting = await this.query.retryQuery(() =>
          this.query.getVestingSchedulById(vestingId)
        )
        assert.isNotNull(qVesting)
        assert.equal(qVesting!.cliffBlock.toString(), cliffBlock.toString())
        assert.equal(qVesting!.cliffDurationBlocks.toString(), linearVestingDuration.toString())
        assert.equal(qVesting!.endsAt.toString(), endBlock.toString())

        const id = accountId + vestingId
        const qVestedAccount = await this.query.retryQuery(() =>
          this.query.getVestedAccountById(id)
        )
        assert.isNotNull(qVestedAccount)
      }
    }
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
