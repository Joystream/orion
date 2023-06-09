import { criticalError } from '../../utils/misc'
import { Flat, EntityManagerOverlay } from '../../utils/overlay'
import { Token, TokenAccount, VestedAccount, VestingSchedule } from '../../model'
import { Validated, ValidatedPayment, VestingScheduleParams } from '../../types/v1000'
import { Block } from '../../types/support'

export function tokenAccountId(tokenId: bigint, memberId: bigint): string {
  return tokenId.toString() + memberId.toString()
}

export async function removeVesting(overlay: EntityManagerOverlay, vestedAccountId: string) {
  // remove information that a particular vesting schedule is pending on an account
  const vestedAccountRepository = overlay.getRepository(VestedAccount)
  const vestedAccountToRemove = await vestedAccountRepository.getByIdOrFail(vestedAccountId)
  vestedAccountRepository.remove(vestedAccountToRemove)
}

export function tokenSaleId(tokenId: bigint, saleId: number): string {
  return tokenId.toString() + saleId.toString()
}

export class VestingScheduleData {
  private _params: VestingScheduleParams
  private _block: number

  public constructor(params: VestingScheduleParams, block: number) {
    this._params = params
    this._block = block
  }

  public cliffBlock(): number {
    return this._params.blocksBeforeCliff + this._block
  }

  public cliffDuration(): number {
    return this._params.blocksBeforeCliff
  }

  public duration(): number {
    return this._params.linearVestingDuration
  }

  public endsAt(): number {
    return this.cliffBlock() + this.duration()
  }

  public cliffPercent(): number {
    return this._params.cliffAmountPercentage
  }

  public id(): string {
    return (
      this.cliffBlock().toString() + this.duration().toString() + this.cliffPercent().toString()
    )
  }
}

export function tokenAmmId(tokenId: bigint, ammNonce: number): string {
  return tokenId.toString() + ammNonce.toString()
}


export function revenueShareId(tokenId: bigint, revenueNonce: number): string {
  return tokenId.toString() + revenueNonce.toString()
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
      return
    }
    if (vesting.totalVestingAmount <= tallyBurnedAmount) {
      await removeVesting(overlay, vesting.id)
      tallyBurnedAmount -= vesting.totalVestingAmount
    }
  }
}

export function addVestingSchedule(
  overlay: EntityManagerOverlay,
  vestingParams: VestingScheduleParams,
  blockHeight: number,
  tokenId: bigint,
  memberId: bigint,
  amount: bigint
) {
  const vestingData = new VestingScheduleData(vestingParams, blockHeight)

  overlay.getRepository(VestingSchedule).new({
    id: vestingData.id(),
    endsAt: vestingData.endsAt(),
    cliffBlock: vestingData.cliffBlock(),
    vestingDurationBlocks: vestingData.duration(),
    cliffPercent: vestingData.cliffPercent(),
    cliffDurationBlocks: vestingData.cliffDuration(),
  })

  overlay.getRepository(VestedAccount).new({
    id: tokenAccountId(tokenId, memberId) + vestingData.id(),
    accountId: tokenAccountId(tokenId, memberId),
    vestingId: vestingData.id(),
    totalVestingAmount: amount,
  })
}

export function createAccount(
  overlay: EntityManagerOverlay,
  token: Flat<Token>,
  memberId: bigint,
  allocationAmount: bigint,
): Flat<TokenAccount> {
  const newAccount = overlay.getRepository(TokenAccount).new({
    tokenId: token.id,
    memberId: memberId.toString(),
    id: token.id + memberId.toString(),
    stakedAmount: BigInt(0),
    totalAmount: allocationAmount,
    deleted: false,
  })
  token.accountsNum += 1
  return newAccount
}

export async function getTokenAccountByMemberByTokenOrFail(overlay: EntityManagerOverlay,
  memberId: bigint, tokenId: bigint): Promise<Flat<TokenAccount>> {
  const results = (await overlay.getRepository(TokenAccount).getManyByRelation('memberId', memberId.toString()))
    .filter((account) => account.tokenId === tokenId.toString() && !account.deleted)
  if (results.length === 0) {
    criticalError("Token account not found")
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
    if (validatedMemberId.__kind === 'Existing') {
      const destinationAccount = await getTokenAccountByMemberByTokenOrFail(
        overlay,
        validatedMemberId.value,
        tokenId,
      )
      destinationAccount.totalAmount += validatedPaymentWithVesting.payment.amount
    } else {
      const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
      createAccount(
        overlay,
        token,
        validatedMemberId.value,
        validatedPaymentWithVesting.payment.amount
      )
    }

    if (validatedPaymentWithVesting.payment.vestingSchedule) {
      addVestingSchedule(
        overlay,
        validatedPaymentWithVesting.payment.vestingSchedule,
        blockHeight,
        tokenId,
        validatedMemberId.value,
        validatedPaymentWithVesting.payment.amount
      )
    }
  }

}
