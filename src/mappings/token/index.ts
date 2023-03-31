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
  SaleTransaction,
  RevenueShare,
  AmmTransaction,
  AmmTransactionType,
  VestedSale,
  RevenueShareParticipation,
} from '../../model'
import {
  addVestingSchedule,
  burnFromVesting,
  createAccount,
  revenueShareId,
  tokenAccountId,
  tokenAmmId,
  tokenSaleId,
  ammId,
  VestingScheduleData,
} from './utils'

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
  // create token
  const totalSupply = initialAllocation.reduce((acc, [_, allocation]) => {
    return acc + allocation.amount
  }, BigInt(0))

  const token = overlay.getRepository(Token).new({
    id: tokenId.toString(),
    status: TokenStatus.IDLE,
    createdAt: new Date(block.timestamp),
    totalSupply,
    revenueShareRatioPercent: revenueSplitRate,
    symbol: symbol.toString(),
    annualCreatorReward: BigInt(patronageRate),
    isInviteOnly: transferPolicy.__kind === 'Permissioned',
    accountsNum: 0, // will be uptdated as account are added
    ammNonce: 0,
    revenueShareNonce: 0,
    deissued: false, // trailer video: set using metadata (next PR)
  })

  // create accounts for allocation
  for (const [memberId, allocation] of initialAllocation) {
    createAccount(overlay, token, memberId, allocation.amount)
    if (allocation.vestingScheduleParams) {
      addVestingSchedule(
        overlay,
        allocation.vestingScheduleParams!,
        block.height,
        tokenId,
        memberId
      )
    }
  }
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
  block,
  event: {
    asV1000: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<'ProjectToken.TokenAmountTransferred'>) {
  const sourceAccount = await overlay.getTokenAccountOrFail(tokenId, sourceMemberId)
  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )
  for (const [validatedMemberId, validatedPayment] of validatedTransfers) {
    if (validatedMemberId.__kind === 'Existing') {
      const destinationAccount = await overlay.getTokenAccountOrFail(
        tokenId,
        validatedMemberId.value
      )
      destinationAccount.totalAmount -= validatedPayment.payment.amount
    } else {
      const token = await overlay.getTokenOrFail(tokenId)
      createAccount(overlay, token, validatedMemberId.value, validatedPayment.payment.amount)
    }

    if (validatedPayment.payment.vestingSchedule) {
      addVestingSchedule(
        overlay,
        validatedPayment.payment.vestingSchedule!,
        block.height,
        tokenId,
        validatedMemberId.value
      )
    }
  }
}

export async function processTokenAmountTransferredByIssuerEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
  const sourceAccount = await overlay.getTokenAccountOrFail(tokenId, sourceMemberId)
  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )

  for (const [validatedMemberId, validatedPaymentWithVesting] of validatedTransfers) {
    if (validatedMemberId.__kind === 'Existing') {
      const destinationAccount = await overlay.getTokenAccountOrFail(
        tokenId,
        validatedMemberId.value
      )
      destinationAccount.totalAmount -= validatedPaymentWithVesting.payment.amount
    } else {
      const token = await overlay.getTokenOrFail(tokenId)
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
        validatedPaymentWithVesting.payment.vestingSchedule!,
        block.height,
        tokenId,
        validatedMemberId.value
      )
    }
  }
}

export async function processTokenDeissuedEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<'ProjectToken.TokenDeissued'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  token.deissued = true
}

export async function processAccountDustedByEvent({
  overlay,
  event: {
    asV1000: [tokenId, dustedAccountId, , ,],
  },
}: EventHandlerContext<'ProjectToken.AccountDustedBy'>) {
  const account = await overlay.getTokenAccountOrFail(tokenId, dustedAccountId)
  account.deleted = true
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
    asV2001: [tokenId, saleNonce, fundsSourceMemberId, tokenSale],
  },
}: EventHandlerContext<'ProjectToken.TokenSaleInitialized'>) {
  if (tokenSale.vestingScheduleParams !== undefined) {
    const vestingData = new VestingScheduleData(tokenSale.vestingScheduleParams!, block.height)

    overlay.getRepository(VestingSchedule).new({
      id: vestingData.id(),
      endsAt: vestingData.endsAt(),
      cliffBlock: vestingData.cliffBlock(),
      vestingDurationBlocks: vestingData.duration(),
      cliffPercent: vestingData.cliffPercent(),
    })

    overlay.getRepository(VestedSale).new({
      id: overlay.getRepository(VestedSale).getNextIdNumber().toString(),
      saleId: tokenId.toString() + saleNonce.toString(),
      vestingId: vestingData.id(),
    })
  }

  const sourceAccount = await overlay.getTokenAccountOrFail(tokenId, fundsSourceMemberId)
  sourceAccount.totalAmount -= tokenSale.quantityLeft

  overlay.getRepository(Sale).new({
    id: tokenId.toString() + saleNonce.toString(),
    tokenId: tokenId.toString(),
    tokensSold: BigInt(0),
    createdIn: block.height,
    startBlock: tokenSale.startBlock,
    durationInBlocks: tokenSale.duration,
    endsAt: tokenSale.startBlock + tokenSale.duration,
    maxAmountPerMember: tokenSale.capPerMember,
    tokenSaleAllocation: tokenSale.quantityLeft,
    pricePerUnit: tokenSale.unitPrice,
    finalized: false,
    termsAndConditions: '', // TODO Sale metadata (next PR)
    fundsSourceAccountId: tokenAccountId(tokenId, fundsSourceMemberId),
  })

  const token = await overlay.getTokenOrFail(tokenId)
  token.status = TokenStatus.SALE
}

export async function processPatronageRateDecreasedToEvent({
  overlay,
  event: {
    asV1000: [tokenId, newRate],
  },
}: EventHandlerContext<'ProjectToken.PatronageRateDecreasedTo'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  token.annualCreatorReward = newRate
}

export async function processPatronageCreditClaimedEvent({
  overlay,
  event: {
    asV1000: [tokenId, amount, memberId],
  },
}: EventHandlerContext<'ProjectToken.PatronageCreditClaimed'>) {
  const creator = await overlay.getTokenAccountOrFail(tokenId, memberId)
  creator.totalAmount += amount

  const token = await overlay.getTokenOrFail(tokenId)
  token.totalSupply += amount
}

export async function processTokensBoughtOnAmmEvent({
  overlay,
  block,
  event: {
    asV2001: [tokenId, memberId, crtMinted, joysDeposited],
  },
}: EventHandlerContext<'ProjectToken.TokensBoughtOnAmm'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  token.totalSupply += crtMinted

  const buyerAccount = await overlay
    .getRepository(TokenAccount)
    .getById(tokenAccountId(tokenId, memberId))
  if (buyerAccount === undefined) {
    createAccount(overlay, token, memberId, crtMinted)
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
    pricePaid: joysDeposited,
    pricePerUnit: crtMinted / joysDeposited, // truncates decimal values
  })
}

export async function processTokensSoldOnAmmEvent({
  overlay,
  block,
  event: {
    asV2001: [tokenId, memberId, crtBurned, joysRecovered],
  },
}: EventHandlerContext<'ProjectToken.TokensSoldOnAmm'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= crtBurned

  const sellerAccount = await overlay.getTokenAccountOrFail(tokenId, memberId)
  sellerAccount.totalAmount -= crtBurned

  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId(token))
  amm.burnedByAmm += crtBurned

  overlay.getRepository(AmmTransaction).new({
    ammId: ammId(token),
    accountId: tokenAccountId(tokenId, memberId),
    id: ammId + tokenAccountId(tokenId, memberId),
    transactionType: AmmTransactionType.SELL,
    createdIn: block.height,
    quantity: crtBurned,
    pricePaid: joysRecovered,
    pricePerUnit: crtBurned / joysRecovered, // truncates decimal values
  })
}

export async function processTokensPurchasedOnSaleEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, saleId, amountPurchased, memberId],
  },
}: EventHandlerContext<'ProjectToken.TokensPurchasedOnSale'>) {
  const buyerAccount = await overlay
    .getRepository(TokenAccount)
    .getById(tokenAccountId(tokenId, memberId))
  if (buyerAccount === undefined) {
    const token = await overlay.getTokenOrFail(tokenId)
    createAccount(overlay, token, memberId, amountPurchased)
  } else {
    buyerAccount!.totalAmount += amountPurchased
  }

  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.tokensSold += amountPurchased

  overlay.getRepository(SaleTransaction).new({
    id: overlay.getRepository(SaleTransaction).getNewEntityId(),
    quantity: amountPurchased,
    pricePaid: sale.pricePerUnit,
    saleId: sale.id,
    accountId: tokenAccountId(tokenId, memberId),
    createdIn: block.height,
  })

  const vestingForSale = await overlay
    .getRepository(VestedSale)
    .getOneByRelation('saleId', tokenSaleId(tokenId, saleId))
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
    asV1000: [tokenId, saleId, newStart, newDuration],
  },
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
    asV1000: [tokenId, startBlock, duration, joyAllocation],
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitIssued'>) {
  const endsAt = startBlock + duration

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.revenueShareNonce += 1

  overlay.getRepository(RevenueShare).new({
    id: revenueShareId(tokenId, token.revenueShareNonce),
    duration,
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
    asV1000: [tokenId, memberId],
  },
}: EventHandlerContext<'ProjectToken.MemberJoinedWhitelist'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  createAccount(overlay, token, memberId, BigInt(0), true)
}

export async function processAmmDeactivatedEvent({
  overlay,
  event: {
    asV2001: [tokenId, burnedAmount],
  },
}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= burnedAmount
  token.status = TokenStatus.IDLE

  const ammCurve = await overlay
    .getRepository(AmmCurve)
    .getByIdOrFail(tokenAmmId(tokenId, token.ammNonce))
  ammCurve.finalized = true
}

export async function processTokensBurnedEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId, amountBurned],
  },
}: EventHandlerContext<'ProjectToken.TokensBurned'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  token.totalSupply -= amountBurned

  const account = await overlay.getTokenAccountOrFail(tokenId, memberId)
  if (account.stakedAmount > 0) {
    account.stakedAmount =
      account.stakedAmount > amountBurned ? account.stakedAmount - amountBurned : BigInt(0)
  }
  account.totalAmount -= amountBurned
  await burnFromVesting(overlay, tokenAccountId(tokenId, memberId), amountBurned)
}

export async function processTransferPolicyChangedToPermissionlessEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<'ProjectToken.TransferPolicyChangedToPermissionless'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  token.isInviteOnly = false
}

export async function processTokenSaleFinalizedEvent({
  overlay,
  event: {
    asV1000: [tokenId, saleId, quantityLeft, ,],
  },
}: EventHandlerContext<'ProjectToken.TokenSaleFinalized'>) {
  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.finalized = true

  const sourceAccount = await overlay
    .getRepository(TokenAccount)
    .getByIdOrFail(sale.fundsSourceAccountId!)
  sourceAccount.totalAmount += quantityLeft

  const token = await overlay.getTokenOrFail(tokenId)
  token.status = TokenStatus.IDLE
}

export async function processRevenueSplitLeftEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId, unstakedAmount],
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitLeft'>) {
  const account = await overlay.getTokenAccountOrFail(tokenId, memberId)
  account.stakedAmount -= unstakedAmount
}

export async function processRevenueSplitFinalizedEvent({
  overlay,
  event: {
    asV1000: [tokenId, ,], // leftover JOYs not processed in orion
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(revenueShareId(tokenId, token.revenueShareNonce))
  revenueShare.finalized = true
}

export async function processUserParticipatedInSplitEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, memberId, stakedAmount, joyDividend],
  },
}: EventHandlerContext<'ProjectToken.UserParticipatedInSplit'>) {
  const token = await overlay.getTokenOrFail(tokenId)
  overlay.getRepository(RevenueShareParticipation).new({
    id: tokenAccountId(tokenId, memberId) + revenueShareId(tokenId, token.revenueShareNonce),
    accountId: tokenAccountId(tokenId, memberId),
    revenueShareId: revenueShareId(tokenId, token.revenueShareNonce),
    stakedAmount,
    earnings: joyDividend,
    createdIn: block.height,
  })
  const account = await overlay.getTokenAccountOrFail(tokenId, memberId)
  account.stakedAmount += stakedAmount
}
