import { EventHandlerContext } from '../../utils/events'
import {
  Channel,
  Token,
  TokenAccount,
  TokenStatus,
  VestedAccount,
  VestingSchedule,
  TokenChannel,
  ContentActorMember,
} from '../../model'
import { tokenAccountId } from '../utils'

export async function processTokenIssuedEvent({
  overlay,
  block,
  event: {
    asV1000: [
      tokenId,
      { initialAllocation, symbol, transferPolicy, patronageRate, revenueSplitRate },
    ],
  },
}: EventHandlerContext<'ProjectToken.TokenIssued'>) {
  // create vesting schedules
  const vestingSchedules = initialAllocation.map(([memberId, allocation]) => {
    var vestingSchedule
    if (allocation.vestingScheduleParams) {
      const { linearVestingDuration, blocksBeforeCliff, cliffAmountPercentage } =
        allocation.vestingScheduleParams
      const cliffBlock = block.height + blocksBeforeCliff
      const id =
        cliffBlock.toString() + linearVestingDuration.toString() + cliffAmountPercentage.toString()
      vestingSchedule = overlay.getRepository(VestingSchedule).new({
        id,
        cliffPercent: cliffAmountPercentage,
        vestingDurationBlocks: linearVestingDuration,
        cliffDurationBlocks: blocksBeforeCliff,
        endsAt: cliffBlock + linearVestingDuration,
        cliffBlock,
        totalAmount: allocation.amount,
      })
    }
    return vestingSchedule
  })

  // create token
  const accountsNum = initialAllocation.length
  const totalSupply = initialAllocation.reduce((acc, [_, allocation]) => {
    return acc + allocation.amount
  }, BigInt(0))
  overlay.getRepository(Token).new({
    id: tokenId.toString(),
    status: TokenStatus.IDLE,
    createdAt: new Date(block.timestamp),
    totalSupply,
    revenueShareRatioPercent: revenueSplitRate,
    accountsNum,
  })

  //  create accounts
  initialAllocation.map(([memberId, allocation], i) => {
    var vestedAccount
    if (vestingSchedules[i]) {
      vestedAccount = overlay.getRepository(VestedAccount).new({
        id: vestingSchedules[i]!.id.toString() + memberId.toString(),
        accountId: memberId.toString(),
        vestingId: vestingSchedules[i]!.id.toString(),
      })
    }
    const account = overlay.getRepository(TokenAccount).new({
      id: tokenId.toString() + memberId.toString(),
      memberId: memberId.toString(),
      stakedAmount: BigInt(0),
      totalAmount: allocation.amount,
    })
  })
}

export async function processCreatorTokenIssuedEvent({
  overlay,
  event: {
    asV1000: [contentActor, channelId, tokenId],
  },
}: EventHandlerContext<'Content.CreatorTokenIssued'>) {
  overlay.getRepository(TokenChannel).new({
    channelId: channelId.toString(),
    tokenId: tokenId.toString(),
  })

  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())
  if (contentActor.__kind === 'Member') {
    const tokenAccount = await overlay
      .getRepository(TokenAccount)
      .getByIdOrFail(tokenId.toString() + channel.ownerMemberId!.toString())
    tokenAccount.isCreator = true
  }
}

export async function processTokenAmountTransferredEvent({
  overlay,
  event: {
    asV1000: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<'ProjectToken.TokenAmountTransferred'>) {
  const sourceAccount = await overlay
    .getRepository(TokenAccount)
    .getByIdOrFail(tokenAccountId(tokenId, sourceMemberId))
  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )
  var accountsAdded = 0
  for (const [validatedMemberId, validatedPayment] of validatedTransfers) {
    if (validatedMemberId.__kind == 'Existing') {
      const destinationAccount = await overlay
        .getRepository(TokenAccount)
        .getByIdOrFail(tokenAccountId(tokenId, validatedMemberId.value))
      destinationAccount.totalAmount -= validatedPayment.payment.amount
    } else {
      overlay.getRepository(TokenAccount).new({
        id: tokenAccountId(tokenId, validatedMemberId.value),
        memberId: validatedMemberId.toString(),
        stakedAmount: BigInt(0),
        totalAmount: validatedPayment.payment.amount,
      })
      accountsAdded += 1
    }
  }
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.accountsNum += accountsAdded
}

// export async function processTokenAmountTransferredByIssuerEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       sourceMemberId,
//       validatedTransfers,
//     ],
//   },
// }: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
//   // 1. edit accounts sourceMemberId and validatedTransfers
//   // 2. Eventually create new account
//   // 3. eventually update vesting schedules
// }

// export async function processTokenDeissuedEvent(
//   {
//     overlay,
//     block,
//     event: {
//       asV1001: [
//         tokenId
//       ]
//     }
//   }: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
//   // 1. remove token Id
//   // 2. cascade remove
// }

// export async function processAccountDustedByEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       dustedAccountId,
//       sender,
//       policy,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.AccountDustedBy'>) {
//   // 1. remove account
// }

// export async function processAmmActivatedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       memberId,
//       {
//         slope,
//         intercept,
//       }
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.AmmActivated'>) {
//   // 1. create new AMM Curve
//   // 2. add it as a reference to token
// }

// export async function processMemberJoinedWhitelistEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       memberId,
//       policy,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.MemberJoinedWhitelist'>) {
//   // 1. create new account
// }

// export async function processPatronageCreditClaimedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       creditAmount,
//       memberId,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.PatronageCreditClaimed'>) {
//   // 1. create new account
// }

// export async function processPatronageRateDecreasedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       newRate,
//     ]
//   }
// }: EventHandlerContext<'ProjectToken.PatronageRateDecreasedTo'>) {
//   // 1. decrease Token.reward
// }

// export async function processRevenueSplitfinalizedEvent({
//   overlay,
//   block,
//   event: {
//     asV1001: [
//       tokenId,
//       _recoveryAccount,
//       leftoverFunds,
//     ]
//   }

// }: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) { }
