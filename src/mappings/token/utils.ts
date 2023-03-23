import {
  TokenAccount,
  SaleTransaction,
  AmmTransaction,
  RevenueShareParticipation,
  VestedAccount,
  VestingSchedule,
} from '../../model'
import { EntityManagerOverlay } from '../../utils/overlay'
import { deserializeMetadata } from '../utils'

export function tokenAccountId(tokenId: bigint, memberId: bigint): string {
  return tokenId.toString() + memberId.toString()
}

export async function deleteTokenAccount(
  overlay: EntityManagerOverlay,
  tokenId: string,
  memberId: string, 
) {
  // remove sales Txs
  const salesTxRepository = overlay.getRepository(SaleTransaction)
  const salesTxForAccount = await salesTxRepository.getManyByRelation(
    'accountId',
    memberId
  )
  salesTxRepository.remove(...salesTxForAccount)

  // remove Amm TXs
  const ammTxRepository = overlay.getRepository(AmmTransaction)
  const ammTxForAccount = await ammTxRepository.getManyByRelation('accountId', memberId)
  ammTxRepository.remove(...ammTxForAccount)

  // remove shares participations
  const shareParticipationsRepository = overlay.getRepository(RevenueShareParticipation)
  const sharesParticipationsForAccount = await shareParticipationsRepository.getManyByRelation(
    'accountId',
    memberId
  )
  shareParticipationsRepository.remove(...sharesParticipationsForAccount)

  // remove vesting schedules relation
  const vestedAccountRepository = overlay.getRepository(VestedAccount)
  const vestingSchedulesForToken = await vestedAccountRepository.getManyByRelation('accountId', tokenId + memberId)
  vestedAccountRepository.remove(...vestingSchedulesForToken)
  // if any of the above schedules has zero accounts for it remove the schedule
  for (const {id} of vestingSchedulesForToken) {
    const isUsed = (await vestedAccountRepository.getById(id)) !== undefined
    if (!isUsed) {
      overlay.getRepository(VestingSchedule).remove(id)
    }
  }

  // remove account
  overlay.getRepository(TokenAccount).remove(tokenId+memberId)
}
