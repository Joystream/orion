import {
  VestedAccount,
} from '../../model'
import { VestingScheduleParams } from '../../types/v1000'
import { EntityManagerOverlay } from '../../utils/overlay'

export function tokenAccountId(tokenId: bigint, memberId: bigint): string {
  return tokenId.toString() + memberId.toString()
}

export async function removeVesting(overlay: EntityManagerOverlay, accountId: string) {
  // remove vesting schedules relation
  const vestedAccountRepository = overlay.getRepository(VestedAccount)
  const vestingSchedulesForToken = await vestedAccountRepository.getManyByRelation(
    'accountId',
    accountId
  )
  vestedAccountRepository.remove(...vestingSchedulesForToken)
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
  const vestedAccounts = await overlay
    .getRepository(VestedAccount)
    .getManyByRelation('accountId', accountId)
  var tallyBurnedAmount = burnedAmount
  for (const vesting of vestedAccounts) {
    if (tallyBurnedAmount === BigInt(0)) {
      return
    }
    if (vesting.amount <= tallyBurnedAmount) {
      await removeVesting(overlay, accountId)
      tallyBurnedAmount -= vesting.amount
    }
  }
}