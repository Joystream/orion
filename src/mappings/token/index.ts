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
  Benefit,
  TokenAvatarUri,
} from '../../model'
import {
  addVestingSchedule,
  burnFromVesting,
  createAccount,
  revenueShareId,
  tokenAccountId,
  tokenSaleId,
  ammIdForToken,
  issuedRevenueShareForToken,
  VestingScheduleData,
} from './utils'
import { deserializeMetadata } from '../utils'
import { SaleMetadata, TokenMetadata } from '@joystream/metadata-protobuf'
import { isSet } from 'lodash'

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
    deissued: false,
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
    id: tokenId.toString() + channelId.toString(),
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
      destinationAccount.totalAmount += validatedPayment.payment.amount
    } else {
      const token = await overlay.getTokenOrFail(tokenId)
      createAccount(overlay, token, validatedMemberId.value, validatedPayment.payment.amount)
    }
    // no vesting schedule for transfers as the parameter TransferVestingOf has no vesting options
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
      destinationAccount.totalAmount += validatedPaymentWithVesting.payment.amount
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
    asV2002: [tokenId, , { slope, intercept }],
  },
}: EventHandlerContext<'ProjectToken.AmmActivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.MARKET
  const id = tokenId.toString() + token.ammNonce.toString()
  token.ammNonce++
  overlay.getRepository(AmmCurve).new({
    burnedByAmm: BigInt(0),
    mintedByAmm: BigInt(0),
    tokenId: tokenId.toString(),
    id,
    ammSlopeParameter: BigInt(slope),
    ammInitPrice: BigInt(intercept),
    finalized: false,
  })
}

export async function processTokenSaleInitializedEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, saleNonce, tokenSale, metadataBytes],
  },
}: EventHandlerContext<'ProjectToken.TokenSaleInitialized'>) {
  const fundsSourceMemberId = tokenSale.tokensSource

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
      saleId: tokenId.toString(),
      vestingId: vestingData.id(),
    })
  }

  const sourceAccount = await overlay.getTokenAccountOrFail(tokenId, fundsSourceMemberId)
  sourceAccount.totalAmount -= tokenSale.quantityLeft

  const sale = overlay.getRepository(Sale).new({
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
    termsAndConditions: '',
    fundsSourceAccountId: tokenAccountId(tokenId, fundsSourceMemberId),
  })

  const token = await overlay.getTokenOrFail(tokenId)
  token.status = TokenStatus.SALE

  if (metadataBytes) {
    const metadata = deserializeMetadata(SaleMetadata, metadataBytes)
    if (metadata) {
      if (isSet(metadata!.termsAndConditions)) {
        sale.termsAndConditions = metadata!.termsAndConditions.toString()
      }
    }
  }
}

export async function processPatronageRateDecreasedToEvent({
  overlay,
  event,
}: EventHandlerContext<'ProjectToken.PatronageRateDecreasedTo'>) {
  const [tokenId, newRate] = event.isV1000 ? event.asV1000 : event.asV2002
  const token = await overlay.getTokenOrFail(tokenId)
  token.annualCreatorReward = BigInt(newRate)
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
    asV2002: [tokenId, memberId, crtMinted, joysDeposited],
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

  const ammId = ammIdForToken(token)
  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId)
  amm.mintedByAmm += crtMinted
  overlay.getRepository(AmmTransaction).new({
    ammId: ammId.toString(),
    accountId: tokenAccountId(tokenId, memberId),
    id: overlay.getRepository(AmmTransaction).getNextIdNumber().toString(),
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
    asV2002: [tokenId, memberId, crtBurned, joysRecovered],
  },
}: EventHandlerContext<'ProjectToken.TokensSoldOnAmm'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= crtBurned
  const ammId = ammIdForToken(token)

  const sellerAccount = await overlay.getTokenAccountOrFail(tokenId, memberId)
  sellerAccount.totalAmount -= crtBurned

  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId)
  amm.burnedByAmm += crtBurned

  overlay.getRepository(AmmTransaction).new({
    ammId,
    accountId: tokenAccountId(tokenId, memberId),
    id: overlay.getRepository(AmmTransaction).getNextIdNumber().toString(),
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
  if (vestingForSale !== undefined) {
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
  const revenueShareNonce = token.revenueShareNonce
  const id = revenueShareId(tokenId, revenueShareNonce)

  overlay.getRepository(RevenueShare).new({
    id,
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

  token.revenueShareNonce += 1
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
    asV2002: [tokenId, burnedAmount],
  },
}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= burnedAmount
  token.status = TokenStatus.IDLE

  const ammCurve = await overlay.getRepository(AmmCurve).getByIdOrFail(ammIdForToken(token))
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
  const token = await overlay.getTokenOrFail(tokenId)
  const accountId = tokenAccountId(tokenId, memberId)
  const _revenueShareId = issuedRevenueShareForToken(token)

  const id = accountId + _revenueShareId
  const revenueShare = await overlay.getRepository(RevenueShare).getByIdOrFail(_revenueShareId)
  revenueShare.participantsNum -= 1

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
    .getByIdOrFail(issuedRevenueShareForToken(token))
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
  const accountId = tokenAccountId(tokenId, memberId)
  const _revenueShareId = issuedRevenueShareForToken(token)
  const id = accountId + _revenueShareId

  const revenueShare = await overlay.getRepository(RevenueShare).getByIdOrFail(_revenueShareId)
  revenueShare.claimed += joyDividend
  revenueShare.participantsNum += 1

  overlay.getRepository(RevenueShareParticipation).new({
    id,
    accountId,
    revenueShareId: _revenueShareId,
    stakedAmount,
    earnings: joyDividend,
    createdIn: block.height,
  })
  const account = await overlay.getTokenAccountOrFail(tokenId, memberId)
  account.stakedAmount += stakedAmount
}

export async function processCreatorTokenIssuerRemarkedEvent({
  overlay,
  event: {
    asV2001: [tokenId, metadataBytes],
  },
}: EventHandlerContext<'Content.CreatorTokenIssuerRemarked'>) {
  const metadata = deserializeMetadata(TokenMetadata, metadataBytes)
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())

  if (!metadata) {
    return
  }

  if (metadata!.description) {
    token.description = metadata!.description!
  }

  if (metadata!.benefits) {
    for (const benefit of metadata!.benefits!) {
      overlay.getRepository(Benefit).new({
        id: overlay.getRepository(Benefit).getNextIdNumber().toString(),
        title: benefit.title ? benefit.title! : undefined,
        description: benefit.description ? benefit.description! : undefined,
        emojiCode: benefit.emoji ? benefit.emoji! : undefined,
        displayOrder: benefit.displayOrder ? benefit.displayOrder! : undefined,
      })
    }
  }

  if (isSet(metadata!.whitelistApplicationNote)) {
    token.whitelistApplicantNote = metadata!.whitelistApplicationNote || null
  }

  if (isSet(metadata!.whitelistApplicationApplyLink)) {
    token.whitelistApplicantLink = metadata!.whitelistApplicationApplyLink || null
  }

  if (isSet(metadata!.avatarUri)) {
    token.avatar = metadata!.avatarUri
      ? new TokenAvatarUri({ avatarUri: metadata!.avatarUri })
      : null
  }

  if (isSet(metadata!.trailerVideoId)) {
    token.trailerVideoId = metadata!.trailerVideoId
  }
}
