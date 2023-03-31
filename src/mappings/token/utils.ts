import { Token, TokenAccount, VestedAccount, VestingSchedule } from '../../model'
import { VestingScheduleParams } from '../../types/v1000'
import { EntityManagerOverlay } from '../../utils/overlay'

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
  return tokenId.toString() + revenueNonce.toString
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
    if (vesting.amount <= tallyBurnedAmount) {
      await removeVesting(overlay, vesting.id)
      tallyBurnedAmount -= vesting.amount
    }
  }
}

export function addVestingSchedule(
  overlay: EntityManagerOverlay,
  vestingParams: VestingScheduleParams,
  blockHeight: number,
  tokenId: bigint,
  memberId: bigint
) {
  const vestingData = new VestingScheduleData(vestingParams, blockHeight)

  overlay.getRepository(VestingSchedule).new({
    id: vestingData.id(),
    endsAt: vestingData.endsAt(),
    cliffBlock: vestingData.cliffBlock(),
    vestingDurationBlocks: vestingData.duration(),
    cliffPercent: vestingData.cliffPercent(),
  })

  overlay.getRepository(VestedAccount).new({
    id: tokenAccountId(tokenId, memberId) + vestingData.id(),
    accountId: tokenAccountId(tokenId, memberId),
    vestingId: vestingData.id(),
  })
}

export async function createAccount(
  overlay: EntityManagerOverlay,
  tokenId: bigint,
  memberId: bigint,
  allocationAmount: bigint,
  whitelisted?: boolean
) {
  overlay.getRepository(TokenAccount).new({
    tokenId: tokenId.toString(),
    memberId: memberId.toString(),
    id: tokenAccountId(tokenId, memberId),
    stakedAmount: BigInt(0),
    totalAmount: allocationAmount,
    whitelisted,
  })
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.accountsNum += 1
}
