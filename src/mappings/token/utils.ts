import { Flat, EntityManagerOverlay } from '../../utils/overlay'
import { Token, TokenAccount, VestedAccount, VestingSchedule } from '../../model'
import { VestingScheduleParams } from '../../types/v1000'

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

export function ammIdForToken(token: Flat<Token>): string {
  const _ammNonce = token.ammNonce - 1
  return tokenAmmId(BigInt(token.id), _ammNonce)
}

export function revenueShareId(tokenId: bigint, revenueNonce: number): string {
  return tokenId.toString() + revenueNonce.toString()
}

export function issuedRevenueShareForToken(token: Flat<Token>): string {
  const _revId = token.revenueShareNonce - 1
  return revenueShareId(BigInt(token.id), _revId)
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

export function createAccount(
  overlay: EntityManagerOverlay,
  token: Flat<Token>,
  memberId: bigint,
  allocationAmount: bigint,
  whitelisted?: boolean
) {
  overlay.getRepository(TokenAccount).new({
    tokenId: token.id,
    memberId: memberId.toString(),
    id: token.id + memberId.toString(),
    stakedAmount: BigInt(0),
    totalAmount: allocationAmount,
    whitelisted,
    deleted: false,
  })
  token.accountsNum += 1
}

export function ammId(token: Flat<Token>): string {
  return token.id + token.ammNonce.toString()
}
