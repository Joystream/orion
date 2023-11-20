import { TokenAccount } from '../../../model'

const bigintMax = (a: bigint, b: bigint): bigint => {
  return a > b ? a : b
}

export const computeTransferrableAmount = (tokenAccount: TokenAccount, block: number): bigint => {
  let lockedCrtAmount = BigInt(0)
  const schedules = tokenAccount.vestingSchedules
  if (!schedules || Array(schedules).length === 0) {
    if (tokenAccount.stakedAmount) {
      return tokenAccount.totalAmount - tokenAccount.stakedAmount
    } else {
      return tokenAccount.totalAmount
    }
  }
  for (const { vesting: schedule, totalVestingAmount } of schedules) {
    if (block < schedule.cliffBlock) {
      lockedCrtAmount += totalVestingAmount
    } else {
      // block >= schedule.cliffBlock
      if (schedule.endsAt > block) {
        // schedule.cliffBlock <= block < schedule.endsAt
        const postCliffAmount =
          (totalVestingAmount * BigInt(schedule.cliffRatioPermill)) / BigInt(1000000)
        const remainingBlocks =
          block > schedule.cliffBlock ? schedule.endsAt - block : schedule.vestingDurationBlocks

        const locked =
          (postCliffAmount * BigInt(remainingBlocks)) / BigInt(schedule.vestingDurationBlocks)
        lockedCrtAmount += locked
      }
      // block > schedule.endsAt
    }
  }
  return tokenAccount.totalAmount - bigintMax(lockedCrtAmount, tokenAccount.stakedAmount)
}
