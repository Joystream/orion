import { criticalError } from '../../utils/misc'
import { Flat, EntityManagerOverlay } from '../../utils/overlay'
import {
  Benefit,
  CreatorToken,
  IssuerTransferVestingSource,
  TokenAccount,
  TokenAvatarUri,
  TrailerVideo,
  VestedAccount,
  VestingSchedule,
  VestingSource,
  Video,
} from '../../model'
import { Validated, ValidatedPayment, VestingScheduleParams } from '../../types/v1000'
import { isSet } from '@joystream/metadata-protobuf/utils'
import { uniqueId } from '../../utils/crypto'
import { ITokenMetadata } from '@joystream/metadata-protobuf'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'

export async function removeVesting(overlay: EntityManagerOverlay, vestedAccountId: string) {
  // remove information that a particular vesting schedule is pending on an account
  const vestedAccountRepository = overlay.getRepository(VestedAccount)
  const vestedAccountToRemove = await vestedAccountRepository.getByIdOrFail(vestedAccountId)
  vestedAccountRepository.remove(vestedAccountToRemove)
}

export class VestingScheduleData {
  private _params: VestingScheduleParams
  private _block: number

  public constructor(params: VestingScheduleParams, block: number) {
    this._params = params
    this._block = block
  }

  public get id(): string {
    return this.cliffBlock + '-' + this.duration + '-' + this.cliffPercent
  }

  public get cliffBlock(): number {
    return this._params.blocksBeforeCliff + this._block
  }

  public get cliffDuration(): number {
    return this._params.blocksBeforeCliff
  }

  public get duration(): number {
    return this._params.linearVestingDuration
  }

  public get endsAt(): number {
    return this.cliffBlock + this.duration
  }

  public get cliffPercent(): number {
    return this._params.cliffAmountPercentage
  }
}

export async function burnFromVesting(
  overlay: EntityManagerOverlay,
  accountId: string,
  burnedAmount: bigint
) {
  const vestingSchedulesForAccount = (
    await overlay.getRepository(VestedAccount).getManyByRelation('accountId', accountId)
  ).sort((a, b) => {
    return BigInt(a.id) - BigInt(b.id) > 0 ? 1 : -1
  })
  let tallyBurnedAmount = burnedAmount
  for (const vesting of vestingSchedulesForAccount) {
    if (tallyBurnedAmount === BigInt(0)) {
      return // no-op
    }
    if (vesting.totalVestingAmount <= tallyBurnedAmount) {
      await removeVesting(overlay, vesting.id)
      tallyBurnedAmount -= vesting.totalVestingAmount
    } else {
      vesting.totalVestingAmount -= tallyBurnedAmount
    }
  }
}

export async function addVestingScheduleToAccount(
  overlay: EntityManagerOverlay,
  account: Flat<TokenAccount>,
  vestingId: string,
  amount: bigint,
  vestingSource: VestingSource,
  currentBlock: number
) {
  const existingVestingSchedulesForAccount = await overlay
    .getRepository(VestedAccount)
    .getManyByRelation('accountId', account.id)

  const vestedAccountToBeUpdated = existingVestingSchedulesForAccount.filter((vestedAccount) => {
    return (
      vestedAccount.vestingSource.isTypeOf === 'SaleVestingSource' &&
      vestingSource.isTypeOf === 'SaleVestingSource' &&
      vestedAccount.vestingSource.sale === vestingSource.sale
    )
  })

  if (vestedAccountToBeUpdated.length > 0) {
    vestedAccountToBeUpdated.forEach((vestedAccount) => {
      vestedAccount.totalVestingAmount += amount
      account.totalAmount += amount
    })
  } else {
    const vestedAccountId = overlay.getRepository(VestedAccount).getNewEntityId()
    overlay.getRepository(VestedAccount).new({
      id: vestedAccountId,
      accountId: account.id,
      vestingId,
      totalVestingAmount: amount,
      vestingSource: vestingSource,
      acquiredAt: currentBlock,
    })
  }
}

export function createAccount(
  overlay: EntityManagerOverlay,
  token: Flat<CreatorToken>,
  memberId: bigint,
  allocationAmount: bigint
): Flat<TokenAccount> {
  const accountId = overlay.getRepository(TokenAccount).getNewEntityId()
  const newAccount = overlay.getRepository(TokenAccount).new({
    tokenId: token.id,
    memberId: memberId.toString(),
    id: accountId,
    stakedAmount: BigInt(0),
    totalAmount: allocationAmount,
    deleted: false,
  })
  token.accountsNum += 1
  return newAccount
}

export async function getTokenAccountByMemberByToken(
  overlay: EntityManagerOverlay,
  memberId: bigint,
  tokenId: bigint
): Promise<Flat<TokenAccount> | undefined> {
  const results = (
    await overlay.getRepository(TokenAccount).getManyByRelation('memberId', memberId.toString())
  ).filter((account) => account.tokenId === tokenId.toString() && !account.deleted)
  if (results.length === 0) {
    return undefined
  }
  return results[0]
}

export async function getTokenAccountByMemberByTokenOrFail(
  overlay: EntityManagerOverlay,
  memberId: bigint,
  tokenId: bigint
): Promise<Flat<TokenAccount>> {
  const result = await getTokenAccountByMemberByToken(overlay, memberId, tokenId)
  if (result === undefined) {
    criticalError(`Token account for member ${memberId} and token ${tokenId} does not exist.`)
  } else {
    return result
  }
}

export async function processValidatedTransfers(
  overlay: EntityManagerOverlay,
  token: Flat<CreatorToken>,
  sourceAccount: Flat<TokenAccount>,
  validatedTransfers: [Validated, ValidatedPayment][],
  blockHeight: number
): Promise<void> {
  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )
  const tokenId = BigInt(token.id)
  for (const [validatedMemberId, validatedPaymentWithVesting] of validatedTransfers) {
    let destinationAccount: Flat<TokenAccount>
    if (validatedMemberId.__kind === 'Existing') {
      destinationAccount = await getTokenAccountByMemberByTokenOrFail(
        overlay,
        validatedMemberId.value,
        tokenId
      )
      destinationAccount.totalAmount += validatedPaymentWithVesting.payment.amount
    } else {
      const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
      destinationAccount = createAccount(
        overlay,
        token,
        validatedMemberId.value,
        validatedPaymentWithVesting.payment.amount
      )
    }

    if (validatedPaymentWithVesting.payment.vestingSchedule) {
      const vestingData = new VestingScheduleData(
        validatedPaymentWithVesting.payment.vestingSchedule,
        blockHeight
      )
      const { id: vestingScheduleId } = overlay.getRepository(VestingSchedule).new({
        ...vestingData,
      })
      await addVestingScheduleToAccount(
        overlay,
        destinationAccount,
        vestingScheduleId,
        validatedPaymentWithVesting.payment.amount,
        new IssuerTransferVestingSource(),
        blockHeight
      )
    }
  }
}

export async function processTokenMetadata(
  token: Flat<CreatorToken>,
  metadata: DecodedMetadataObject<ITokenMetadata>,
  overlay: EntityManagerOverlay,
  isUpdate: boolean
) {
  if (!metadata) {
    return
  }
  if (isSet(metadata.description)) {
    token.description = metadata.description
  }

  // remove all current bnefits
  const existingBenefit = await overlay
    .getRepository(Benefit)
    .getManyByRelation('tokenId', token.id)
  if (existingBenefit !== undefined) {
    overlay.getRepository(Benefit).remove(...existingBenefit)
  }

  if (isSet(metadata.benefits)) {
    for (const benefit of metadata.benefits) {
      if (benefit.displayOrder !== null) {
        if (isSet(benefit.title)) {
          const benefitEntity = overlay.getRepository(Benefit).new({
            id: overlay.getRepository(Benefit).getNewEntityId(),
            title: benefit.title,
            emojiCode: benefit.emoji,
            displayOrder: benefit.displayOrder,
            tokenId: token.id,
          })
          if (isSet(benefit.description)) {
            benefitEntity.description = benefit.description
          }
        }
      }
    }
  }

  if (isSet(metadata.whitelistApplicationNote)) {
    token.whitelistApplicantNote = metadata.whitelistApplicationNote || null
  }

  if (isSet(metadata.whitelistApplicationApplyLink)) {
    token.whitelistApplicantLink = metadata.whitelistApplicationApplyLink || null
  }

  if (isSet(metadata.avatarUri)) {
    token.avatar = metadata.avatarUri ? new TokenAvatarUri({ avatarUri: metadata.avatarUri }) : null
  }

  if (isSet(metadata.symbol)) {
    token.symbol = metadata.symbol
  } else {
    if (!isUpdate) {
      token.symbol = uniqueId(32) // create artificial unique symbol in case it's not provided
    }
  }

  if (isSet(metadata.trailerVideoId)) {
    const video = await overlay.getRepository(Video).getById(metadata.trailerVideoId)
    if (video) {
      const trailerVideoRepository = overlay.getRepository(TrailerVideo)
      const oldTrailer = await trailerVideoRepository.getOneByRelation('tokenId', token.id)
      if (oldTrailer?.videoId === metadata.trailerVideoId) {
        // makes no sense to update the same trailer video
        return
      }
      if (oldTrailer) {
        trailerVideoRepository.remove(oldTrailer)
      }

      const id = overlay.getRepository(TrailerVideo).getNewEntityId()
      overlay.getRepository(TrailerVideo).new({
        id,
        tokenId: token.id,
        videoId: video.id,
      })
    }
  } else {
    const trailerVideoRepository = overlay.getRepository(TrailerVideo)
    const oldTrailer = await trailerVideoRepository.getOneByRelation('tokenId', token.id)
    if (oldTrailer) {
      trailerVideoRepository.remove(oldTrailer)
    }
  }
}
