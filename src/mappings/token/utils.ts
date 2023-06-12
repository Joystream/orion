import { criticalError } from '../../utils/misc'
import { Flat, EntityManagerOverlay } from '../../utils/overlay'
import { IssuerTransferVestingSource, Token, TokenAccount, VestedAccount, VestingSchedule, VestingSource } from '../../model'
import { Validated, ValidatedPayment, VestingScheduleParams } from '../../types/v1000'

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
  const vestingSchedulesForAccount = await overlay
    .getRepository(VestedAccount)
    .getManyByRelation('accountId', accountId)
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
  vestingSource: VestingSource
) {
  const existingVestingSchedulesForAccount = await overlay.getRepository(VestedAccount)
    .getManyByRelation('accountId', account.id)

  const vestedAccountToBeUpdated = existingVestingSchedulesForAccount.filter((vestedAccount) => {
    return vestedAccount.vestingSource === vestingSource
  })
  if (vestedAccountToBeUpdated.length > 0) {
    vestedAccountToBeUpdated.map((vestedAccount) => {
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
    })
  }
}

export function createAccount(
  overlay: EntityManagerOverlay,
  token: Flat<Token>,
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

export async function getTokenAccountByMemberByTokenOrFail(
  overlay: EntityManagerOverlay,
  memberId: bigint,
  tokenId: bigint
): Promise<Flat<TokenAccount>> {
  const results = (
    await overlay.getRepository(TokenAccount).getManyByRelation('memberId', memberId.toString())
  ).filter((account) => account.tokenId === tokenId.toString() && !account.deleted)
  if (results.length === 0) {
    criticalError('Token account not found')
  }
  return results[0]
}

export async function processValidatedTransfers(
  overlay: EntityManagerOverlay,
  token: Flat<Token>,
  validatedTransfers: [Validated, ValidatedPayment][],
  blockHeight: number
): Promise<void> {
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
      const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
      destinationAccount = createAccount(
        overlay,
        token,
        validatedMemberId.value,
        validatedPaymentWithVesting.payment.amount
      )
    }

    if (validatedPaymentWithVesting.payment.vestingSchedule) {
      const vestingData = new VestingScheduleData(validatedPaymentWithVesting.payment.vestingSchedule, blockHeight)
      const { id: vestingScheduleId, } = overlay.getRepository(VestingSchedule).new({
        ...vestingData
      })
      addVestingScheduleToAccount(
        overlay,
        destinationAccount,
        vestingScheduleId,
        validatedPaymentWithVesting.payment.amount,
        new IssuerTransferVestingSource
      )
    }
  }
}
