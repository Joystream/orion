import { StandardizedFixture } from '../../Fixture'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'
import { assert } from 'chai'
import { Utils } from '../../utils'
import BN from 'bn.js'
import { PalletProjectTokenPaymentWithVesting } from '@polkadot/types/lookup'
import { TokenAccountFieldsFragment } from 'graphql/generated/operations'
import { Maybe } from 'graphql/generated/schema'

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
    const qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
      tokenId,
      this.sourceMemberId
    )
    this.sourceAmountPre = new BN(qAccount!.totalAmount)
  }

  public async runQueryNodeChecks(): Promise<void> {
    const [tokenId, sourceMemberId, validatedTransfers] = this.events[0].event.data

    let qAccount: Maybe<TokenAccountFieldsFragment> | undefined = null

    await Utils.until('waiting for issuer tranfer handler to be completed', async () => {
      qAccount = await this.query.getTokenAccountByTokenIdAndMemberId(
        tokenId,
        sourceMemberId.toNumber()
      )
      const currentAmount = new BN(qAccount!.totalAmount)
      return currentAmount.lt(this.sourceAmountPre!)
    })

    const sourceAmountPost = (
      await this.api.query.projectToken.accountInfoByTokenAndMember(tokenId, sourceMemberId)
    ).amount.toString()

    assert.isNotNull(qAccount)
    assert.equal(qAccount!.totalAmount, sourceAmountPost.toString())

    const observedAmounts = await Promise.all(
      this.outputs.map(async ([memberId]) => {
        let qDestAccount: Maybe<TokenAccountFieldsFragment> | undefined = null
        await Utils.until('waiting for issuer tranfer recipient to recieve funds', async () => {
          qDestAccount = await this.query.getTokenAccountByTokenIdAndMemberId(tokenId, memberId)
          return Boolean(qDestAccount)
        })
        return qDestAccount!.totalAmount
      })
    )

    const nodeAmounts = await Promise.all(
      [...validatedTransfers.keys()].map(async (validated) => {
        const memberId = validated.isExisting ? validated.asExisting : validated.asNonExisting
        const nodeAccount = await this.api.query.projectToken.accountInfoByTokenAndMember(
          tokenId,
          memberId
        )
        return nodeAccount.amount.toString()
      })
    )

    assert.deepEqual(observedAmounts, nodeAmounts)

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

        const id = qAccount!.id + vestingId
        const qVestedAccount = await this.query.retryQuery(() =>
          this.query.getVestedAccountById(id)
        )
        assert.isNotNull(qVestedAccount)
      }
    }
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}
}
