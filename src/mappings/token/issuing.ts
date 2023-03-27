import { EventHandlerContext } from '../../utils/events'
import {
  Token,
  TokenAccount,
  TokenStatus,
  VestedAccount,
  VestingSchedule,
  TokenChannel,
  AmmCurve,
  Sale,
  RevenueShare,
  AmmTransaction,
  AmmTransactionType,
  VestedSale,
  RevenueShareParticipation,
} from '../../model'
import { burnFromVesting, deleteTokenAccount, revenueShareId, tokenAccountId, tokenAmmId, tokenSaleId, VestingScheduleData } from './utils'
import { getRepository } from 'typeorm'
import { over } from 'lodash'

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
  const vestingSchedules = initialAllocation.map(([, allocation]) => {
    var vestingSchedule
    if (allocation.vestingScheduleParams != undefined) {
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
    symbol: symbol.toString(),
    annualCreatorReward: BigInt(patronageRate),
    isInviteOnly: transferPolicy.__kind === 'Permissioned',
    accountsNum,
    ammNonce: 0,
    revenueShareNonce: 0,
  })

  //  create accounts
  initialAllocation.map(([memberId, allocation], i) => {
    if (vestingSchedules[i] != undefined) {
      overlay.getRepository(VestedAccount).new({
        id: vestingSchedules[i]!.id.toString() + memberId.toString(),
        accountId: memberId.toString(),
        vestingId: vestingSchedules[i]!.id.toString(),
      })
    }
    overlay.getRepository(TokenAccount).new({
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
    asV1000: [, channelId, tokenId],
  },
}: EventHandlerContext<'Content.CreatorTokenIssued'>) {
  overlay.getRepository(TokenChannel).new({
    channelId: channelId.toString(),
    tokenId: tokenId.toString(),
  })
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
    if (validatedMemberId.__kind === 'Existing') {
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

export async function processTokenAmountTransferredByIssuerEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, sourceMemberId, validatedTransfers,],
  },
}: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
  const sourceAccount = await overlay
    .getRepository(TokenAccount)
    .getByIdOrFail(tokenAccountId(tokenId, sourceMemberId))
  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )
  var accountsAdded = 0
  for (const [validatedMemberId, validatedPaymentWithVesting] of validatedTransfers) {
    if (validatedMemberId.__kind === 'Existing') {
      const destinationAccount = await overlay
        .getRepository(TokenAccount)
        .getByIdOrFail(tokenAccountId(tokenId, validatedMemberId.value))
      destinationAccount.totalAmount -= validatedPaymentWithVesting.payment.amount
    } else {
      overlay.getRepository(TokenAccount).new({
        id: tokenAccountId(tokenId, validatedMemberId.value),
        memberId: validatedMemberId.toString(),
        stakedAmount: BigInt(0),
        totalAmount: validatedPaymentWithVesting.payment.amount,
      })
      accountsAdded += 1
    }

    if (validatedPaymentWithVesting.payment.vestingSchedule) {
      const vestingData = new VestingScheduleData(validatedPaymentWithVesting.payment.vestingSchedule!, block.height)
      const memberId = validatedMemberId.value

      overlay.getRepository(VestingSchedule).new({
        id: vestingData.id(),
        endsAt: vestingData.endsAt(),
        cliffBlock: vestingData.cliffBlock(),
        vestingDurationBlocks: vestingData.duration(),
        cliffPercent: vestingData.cliffPercent()
      })

      overlay.getRepository(VestedAccount).new({
        id: tokenAccountId(tokenId, memberId) + vestingData.id(),
        accountId: tokenAccountId(tokenId, memberId),
        vestingId: vestingData.id(),
      })
    }
  }
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.accountsNum += accountsAdded
}

export async function processTokenDeissuedEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<'ProjectToken.TokenDeissued'>) {
  const saleRepository = overlay.getRepository(Sale)
  const ammRepository = overlay.getRepository(AmmCurve)
  const revenueShareRepository = overlay.getRepository(RevenueShare)

  const salesForToken = await saleRepository.getManyByRelation('tokenId', tokenId.toString())
  const ammsForToken = await ammRepository.getManyByRelation('tokenId', tokenId.toString())
  const revenueSharesForToken = await revenueShareRepository.getManyByRelation(
    'tokenId',
    tokenId.toString()
  )

  saleRepository.remove(...salesForToken)
  ammRepository.remove(...ammsForToken)
  revenueShareRepository.remove(...revenueSharesForToken)

  overlay.getRepository(Token).remove(tokenId.toString())
}

export async function processAccountDustedByEvent({
  overlay,
  event: {
    asV1000: [tokenId, dustedAccountId, , ,],
  },
}: EventHandlerContext<'ProjectToken.AccountDustedBy'>) {
  await deleteTokenAccount(overlay, tokenId.toString(), dustedAccountId.toString())
}

export async function processAmmActivatedEvent({
  overlay,
  event: {
    asV2001: [tokenId, , { slope, intercept }],
  },
}: EventHandlerContext<'ProjectToken.AmmActivated'>) {
  const id = overlay.getRepository(AmmCurve).getNextIdNumber()
  overlay.getRepository(AmmCurve).new({
    burnedByAmm: BigInt(0),
    mintedByAmm: BigInt(0),
    tokenId: tokenId.toString(),
    id: id.toString(),
    ammSlopeParameter: BigInt(slope),
    ammInitPrice: BigInt(intercept),
    finalized: false,
  })
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.MARKET
}

export async function processTokenSaleInitializedEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, saleId, tokenSale, ,],
  },
}: EventHandlerContext<'ProjectToken.TokenSaleInitialized'>) {
  if (tokenSale.vestingScheduleParams != null) {
    const vestingData = new VestingScheduleData(tokenSale.vestingScheduleParams!, block.height)

    overlay.getRepository(VestingSchedule).new({
      id: vestingData.id(),
      endsAt: vestingData.endsAt(),
      cliffBlock: vestingData.cliffBlock(),
      vestingDurationBlocks: vestingData.duration(),
      cliffPercent: vestingData.cliffPercent()
    })

    overlay.getRepository(VestedSale).new({
      id: overlay.getRepository(VestedSale).getNextIdNumber().toString(),
      saleId: tokenId.toString() + saleId.toString(),
      vestingId: vestingData.id(),
    })
  }

  overlay.getRepository(Sale).new({
    id: tokenId.toString() + saleId.toString(),
    tokenId: tokenId.toString(),
    tokensSold: BigInt(0),
    createdIn: block.height,
    startBlock: tokenSale.startBlock,
    durationInBlocks: tokenSale.duration,
    endsAt: tokenSale.startBlock + tokenSale.duration,
    maxAmountPerMember: tokenSale.capPerMember,
    tokenSaleallocation: tokenSale.quantityLeft,
    pricePerUnit: tokenSale.unitPrice,
    finalized: false,
    termsAndConditions: '', // TODO Sale metadata
  })

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.SALE
}

export async function processPatronageRateDecreasedToEvent({
  overlay,
  event: {
    asV1000: [tokenId, newRate],
  },
}: EventHandlerContext<'ProjectToken.PatronageRateDecreasedTo'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.annualCreatorReward = newRate
}

export async function processPatronageCreditClaimedEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      amount,
      memberId,
    ]
  }
}: EventHandlerContext<'ProjectToken.PatronageCreditClaimed'>) {
  const creator = await overlay.getRepository(TokenAccount).getByIdOrFail(tokenAccountId(tokenId, memberId))
  creator.totalAmount += amount

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply += amount
}

export async function processTokensBoughtOnAmmEvent({
  overlay,
  block,
  event: {
    asV2001: [
      tokenId,
      memberId,
      crtMinted,
      joysDeposited,
    ]
  }
}: EventHandlerContext<'ProjectToken.TokensBoughtOnAmm'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply += crtMinted

  const buyerAccount = await overlay.getRepository(TokenAccount).getById(tokenAccountId(tokenId, memberId))
  if (buyerAccount == undefined) {
    overlay.getRepository(TokenAccount).new({
      totalAmount: crtMinted,
      memberId: memberId.toString(),
      stakedAmount: BigInt(0),
      id: tokenAccountId(tokenId, memberId),
      tokenId: tokenId.toString(),
    })
  } else {
    buyerAccount!.totalAmount += crtMinted
  }

  const ammId = tokenAmmId(tokenId, token.ammNonce)
  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId)
  amm.mintedByAmm += crtMinted

  overlay.getRepository(AmmTransaction).new({
    ammId: ammId.toString(),
    accountId: tokenAccountId(tokenId, memberId),
    id: ammId.toString() + tokenAccountId(tokenId, memberId),
    transactionType: AmmTransactionType.BUY,
    createdIn: block.height,
    quantity: crtMinted,
    pricePaid: crtMinted / joysDeposited, // FIX(verify)
  })
}

export async function processTokensSoldOnAmmEvent({
  overlay,
  block,
  event: {
    asV2001: [
      tokenId,
      memberId,
      crtBurned,
      joysRecovered,
    ]
  }
}: EventHandlerContext<'ProjectToken.TokensSoldOnAmm'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= crtBurned

  const sellerAccount = await overlay.getRepository(TokenAccount).getByIdOrFail(tokenAccountId(tokenId, memberId))
  sellerAccount.totalAmount += crtBurned

  const ammId = overlay.getRepository(AmmCurve).getNextIdNumber() - 1
  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId.toString())
  amm.burnedByAmm += crtBurned

  overlay.getRepository(AmmTransaction).new({
    ammId: ammId.toString(),
    accountId: tokenAccountId(tokenId, memberId),
    id: ammId.toString() + tokenAccountId(tokenId, memberId),
    transactionType: AmmTransactionType.SELL,
    createdIn: block.height,
    quantity: crtBurned,
    pricePaid: crtBurned / joysRecovered, // FIX(verify)
  })
}

export async function processTokensPurchasedOnSaleEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      saleId,
      amountPurchased,
      memberId,
    ]
  }
}: EventHandlerContext<'ProjectToken.TokensPurchasedOnSale'>) {

  const buyerAccount = await overlay.getRepository(TokenAccount).getById(tokenAccountId(tokenId, memberId))
  if (buyerAccount == undefined) { // FIXME(check whether there is a more appropriate comparison for null / undefined types)
    overlay.getRepository(TokenAccount).new({
      tokenId: tokenId.toString(),
      memberId: memberId.toString(),
      id: tokenAccountId(tokenId, memberId),
      stakedAmount: BigInt(0),
      totalAmount: amountPurchased,
    })
  } else {
    buyerAccount!.totalAmount += amountPurchased
  }

  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.tokensSold += amountPurchased

  const vestingForSale = await overlay.getRepository(VestedSale).getOneByRelation('saleId', tokenSaleId(tokenId, saleId))
  if (!vestingForSale) {
    overlay.getRepository(VestedAccount).new({
      id: tokenAccountId(tokenId, memberId) + vestingForSale!.id,
      accountId: tokenAccountId(tokenId, memberId),
      vestingId: vestingForSale!.vestingId,
    })
  }
}

export async function processUpcomingTokenSaleUpdatedEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      saleId,
      newStart,
      newDuration,
    ]
  }
}: EventHandlerContext<'ProjectToken.UpcomingTokenSaleUpdated'>) {
  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))

  if (newDuration) {
    sale.durationInBlocks = newDuration
  }
  if (newStart) {
    sale.startBlock = newStart
  }

  sale.endsAt = sale.startBlock + sale.durationInBlocks
}


export async function processRevenueSplitIssuedEvent({
  overlay,
  block,
  event: {
    asV1000: [
      tokenId,
      startBlock,
      duration,
      joyAllocation,
    ]
  }
}: EventHandlerContext<'ProjectToken.RevenueSplitIssued'>) {
  const endsAt = startBlock + duration

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.revenueShareNonce += 1

  overlay.getRepository(RevenueShare).new({
    id: revenueShareId(tokenId, token.revenueShareNonce),
    duration: duration,
    allocation: joyAllocation,
    tokenId: tokenId.toString(),
    createdIn: block.height,
    participantsNum: 0,
    finalized: false,
    claimed: BigInt(0),
    startingAt: startBlock,
    endsAt,
  })
}

export async function processMemberJoinedWhitelistEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      memberId,
    ]
  }

}: EventHandlerContext<'ProjectToken.MemberJoinedWhitelist'>) {
  overlay.getRepository(TokenAccount).new({
    id: tokenAccountId(tokenId, memberId),
    stakedAmount: BigInt(0),
    totalAmount: BigInt(0),
    tokenId: tokenId.toString(),
    memberId: memberId.toString(),
    whitelisted: true,
  })
}

export async function processAmmDeactivatedEvent({
  overlay,
  event: {
    asV2001: [
      tokenId,
      burnedAmount,
    ]
  }

}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= burnedAmount
  token.status = TokenStatus.IDLE

  const ammCurve = await overlay.getRepository(AmmCurve).getByIdOrFail(tokenAmmId(tokenId, token.ammNonce))
  ammCurve.finalized = true
}

export async function processTokensBurnedEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      memberId,
      amountBurned,
    ]
  }

}: EventHandlerContext<'ProjectToken.TokensBurned'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= amountBurned

  const account = await overlay.getRepository(TokenAccount).getByIdOrFail(tokenAccountId(tokenId, memberId))
  if (account.stakedAmount > 0) {
    account.stakedAmount = account.stakedAmount > amountBurned ? account.stakedAmount - amountBurned : BigInt(0)
  }
  account.totalAmount -= amountBurned
  await burnFromVesting(overlay, tokenAccountId(tokenId, memberId), amountBurned)
}

export async function processTransferPolicyChangedToPermissionlessEvent({
  overlay,
  event: {
    asV1000:
    tokenId
  }
}: EventHandlerContext<'ProjectToken.TransferPolicyChangedToPermissionless'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.isInviteOnly = false
}

export async function processTokenSaleFinalizedEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      saleId,
      ,
      ,
    ]
  }
}: EventHandlerContext<'ProjectToken.TokenSaleFinalized'>) {
  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.finalized = true
}

export async function processRevenueSplitLeftEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      memberId,
      unstakedAmount,
    ]
  }
}: EventHandlerContext<'ProjectToken.RevenueSplitLeft'>) {
  const account = await overlay.getRepository(TokenAccount).getByIdOrFail(tokenAccountId(tokenId, memberId))
  account.stakedAmount -= unstakedAmount
}

export async function processRevenueSplitFinalizedEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      , ,
    ]
  }
}: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const revenueShare = await overlay.getRepository(RevenueShare).getByIdOrFail(revenueShareId(tokenId, token.revenueShareNonce))
  revenueShare.finalized = true
}

export async function processUserParticipatedInSplitEvent({
  overlay,
  event: {
    asV1000: [
      tokenId,
      memberId,
      stakedAmount,
      joyDividend,
      ,
    ]
  }
}: EventHandlerContext<'ProjectToken.UserParticipatedInSplit'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  overlay.getRepository(RevenueShareParticipation).new({
    id: tokenAccountId(tokenId, memberId) + revenueShareId(tokenId, token.revenueShareNonce),
    accountId: tokenAccountId(tokenId, memberId),
    revenueShareId: revenueShareId(tokenId, token.revenueShareNonce),
    stakedAmount,
    earnings: joyDividend,
  })
  const account = await overlay.getRepository(TokenAccount).getByIdOrFail(tokenAccountId(tokenId, memberId))
  account.stakedAmount += stakedAmount
}
