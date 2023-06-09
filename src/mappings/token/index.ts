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
  Video,
} from '../../model'
import {
  addVestingSchedule,
  burnFromVesting,
  createAccount,
  getTokenAccountByMemberByTokenOrFail,
  processValidatedTransfers,
  tokenAccountId,
  tokenSaleId,
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
    annualCreatorReward: patronageRate,
    isInviteOnly: transferPolicy.__kind === 'Permissioned',
    accountsNum: 0, // will be uptdated as account are added
    deissued: false,
  })

  // create accounts for allocation
  for (const [memberId, allocation] of initialAllocation) {
    createAccount(overlay, token, memberId, allocation.amount)
    if (allocation.vestingScheduleParams) {
      addVestingSchedule(
        overlay,
        allocation.vestingScheduleParams,
        block.height,
        tokenId,
        memberId,
        allocation.amount
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
    id: overlay.getRepository(TokenChannel).getNewEntityId(),
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
  // get sourceAccount by getManyByRelation with tokenId and memberId
  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(overlay, sourceMemberId, tokenId)
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())

  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )

  await processValidatedTransfers(overlay, token, validatedTransfers, block.height)
}

export async function processTokenAmountTransferredByIssuerEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(overlay, sourceMemberId, tokenId)
  sourceAccount.totalAmount -= validatedTransfers.reduce(
    (acc, [, validatedPayment]) => acc + validatedPayment.payment.amount,
    BigInt(0)
  )
  await processValidatedTransfers(overlay, token, validatedTransfers, block.height)
}

export async function processTokenDeissuedEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<'ProjectToken.TokenDeissued'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.deissued = true
}

export async function processAccountDustedByEvent({
  overlay,
  event: {
    asV1000: [tokenId, dustedAccountId, , ,],
  },
}: EventHandlerContext<'ProjectToken.AccountDustedBy'>) {
  const account = await getTokenAccountByMemberByTokenOrFail(overlay, dustedAccountId, tokenId)
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
  const id = overlay.getRepository(Token).getNewEntityId()
  token.numberOfAmmActivations++
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
    const vestingData = new VestingScheduleData(tokenSale.vestingScheduleParams, block.height)

    overlay.getRepository(VestingSchedule).new({
      id: overlay.getRepository(VestingSchedule).getNewEntityId(),
      endsAt: vestingData.endsAt(),
      cliffBlock: vestingData.cliffBlock(),
      vestingDurationBlocks: vestingData.duration(),
      cliffPercent: vestingData.cliffPercent(),
      cliffDurationBlocks: vestingData.cliffDuration(),
    })

    overlay.getRepository(VestedSale).new({
      id: overlay.getRepository(VestedSale).getNewEntityId(),
      saleId: tokenId.toString(),
      vestingId: vestingData.id(),
    })
  }

  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(overlay, fundsSourceMemberId, tokenId)
  sourceAccount.totalAmount -= tokenSale.quantityLeft

  const sale = overlay.getRepository(Sale).new({
    id: overlay.getRepository(Sale).getNewEntityId(),
    tokenId: tokenId.toString(),
    tokensSold: BigInt(0),
    createdIn: block.height,
    startBlock: tokenSale.startBlock,
    endsAt: tokenSale.startBlock + tokenSale.duration,
    maxAmountPerMember: tokenSale.capPerMember,
    tokenSaleAllocation: tokenSale.quantityLeft,
    pricePerUnit: tokenSale.unitPrice,
    finalized: false,
    termsAndConditions: '',
    fundsSourceAccountId: sourceAccount.id,
  })

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
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
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  if (typeof newRate === 'number') {
    token.annualCreatorReward = newRate
  } else {
    token.annualCreatorReward = Number(newRate.toString())
  }
}

export async function processPatronageCreditClaimedEvent({
  overlay,
  event: {
    asV1000: [tokenId, amount, memberId],
  },
}: EventHandlerContext<'ProjectToken.PatronageCreditClaimed'>) {
  const creator = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
  creator.totalAmount += amount

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply += amount
}

export async function processTokensBoughtOnAmmEvent({
  overlay,
  block,
  event: {
    asV2002: [tokenId, memberId, crtMinted, joysDeposited],
  },
}: EventHandlerContext<'ProjectToken.TokensBoughtOnAmm'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply += crtMinted

  let buyerAccount = await overlay
    .getRepository(TokenAccount)
    .getById(tokenAccountId(tokenId, memberId))
  
  if (buyerAccount === undefined) {
    buyerAccount = createAccount(overlay, token, memberId, crtMinted)
  } else {
    buyerAccount.totalAmount += crtMinted
  }

  const activeAmm = (await overlay.getRepository(AmmCurve).getManyByRelation('tokenId', token.id)).filter((amm) => !amm.finalized)[0]
  activeAmm.mintedByAmm += crtMinted
  overlay.getRepository(AmmTransaction).new({
    ammId: activeAmm.id,
    accountId: buyerAccount.id,
    id: overlay.getRepository(AmmTransaction).getNewEntityId(),
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
  const activeAmm = (await overlay.getRepository(AmmCurve).getManyByRelation('tokenId', token.id)).filter((amm) => !amm.finalized)[0]
  const ammId = activeAmm.id

  const sellerAccount = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
  sellerAccount.totalAmount -= crtBurned

  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId)
  amm.burnedByAmm += crtBurned

  overlay.getRepository(AmmTransaction).new({
    ammId,
    accountId: sellerAccount.id,
    id: overlay.getRepository(AmmTransaction).getNewEntityId(),
    transactionType: AmmTransactionType.SELL,
    createdIn: block.height,
    quantity: crtBurned,
    pricePaid: joysRecovered,
    pricePerUnit: joysRecovered / crtBurned, // truncates decimal values
  })
}

export async function processTokensPurchasedOnSaleEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, saleId, amountPurchased, memberId],
  },
}: EventHandlerContext<'ProjectToken.TokensPurchasedOnSale'>) {
  let buyerAccount = await overlay
    .getRepository(TokenAccount)
    .getById(tokenAccountId(tokenId, memberId))
  if (buyerAccount === undefined) {
    const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
    buyerAccount = createAccount(overlay, token, memberId, amountPurchased)
  } else {
    buyerAccount!.totalAmount += amountPurchased
  }

  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.tokensSold += amountPurchased

  overlay.getRepository(SaleTransaction).new({
    id: overlay.getRepository(SaleTransaction).getNewEntityId(),
    quantity: amountPurchased,
    saleId: sale.id,
    accountId: buyerAccount.id,
    createdIn: block.height,
  })

  const vestingForSale = await overlay
    .getRepository(VestedSale)
    .getOneByRelation('saleId', tokenSaleId(tokenId, saleId))
  if (vestingForSale !== undefined) {
    const id = overlay.getRepository(VestedAccount).getNewEntityId()
    overlay.getRepository(VestedAccount).new({
      id,
      accountId: buyerAccount.id,
      vestingId: vestingForSale.vestingId,
      totalVestingAmount: amountPurchased,
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

  if (newStart) {
    sale.startBlock = newStart
  }

  sale.endsAt = newDuration === undefined ? sale.endsAt : sale.startBlock + newDuration
}

export async function processRevenueSplitIssuedEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, startBlock, duration, joyAllocation],
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitIssued'>) {
  const endsAt = startBlock + duration
  const id = overlay.getRepository(RevenueShare).getNewEntityId()

  overlay.getRepository(RevenueShare).new({
    id,
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
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  createAccount(overlay, token, memberId, BigInt(0))
}

export async function processAmmDeactivatedEvent({
  overlay,
  event: {
    asV2002: [tokenId, , burnedAmount],
  },
}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= burnedAmount
  token.status = TokenStatus.IDLE

  const activeAmm = (await overlay.getRepository(AmmCurve).getManyByRelation('tokenId', token.id)).filter((amm) => !amm.finalized)[0]
  activeAmm.finalized = true
}

export async function processTokensBurnedEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId, amountBurned],
  },
}: EventHandlerContext<'ProjectToken.TokensBurned'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= amountBurned

  const account = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
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
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
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

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.IDLE
}

export async function processRevenueSplitLeftEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId, unstakedAmount],
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitLeft'>) {

  const account = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
  account.stakedAmount -= unstakedAmount
}

export async function processRevenueSplitFinalizedEvent({
  overlay,
  event: {
    asV1000: [tokenId, ,], // leftover JOYs not processed in orion
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const revenueShare = (await overlay
    .getRepository(RevenueShare)
    .getManyByRelation('tokenId', token.id)
  ).filter((share) => !share.finalized)[0]
  revenueShare.finalized = true
}

export async function processUserParticipatedInSplitEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, memberId, stakedAmount, joyDividend],
  },
}: EventHandlerContext<'ProjectToken.UserParticipatedInSplit'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const account = (await overlay.getRepository(TokenAccount).getManyByRelation('tokenId', token.id))
    .filter((account) => (account.memberId == memberId.toString()) && !account.deleted)[0]

  const revenueShare = (await overlay.getRepository(RevenueShare).getManyByRelation('tokenId', token.id)).filter((share) => !share.finalized)[0]
  revenueShare.claimed += joyDividend
  revenueShare.participantsNum += 1

  overlay.getRepository(RevenueShareParticipation).new({
    id: overlay.getRepository(RevenueShareParticipation).getNewEntityId(),
    accountId: account.id,
    revenueShareId: revenueShare.id,
    stakedAmount,
    earnings: joyDividend,
    createdIn: block.height,
  })
  account.stakedAmount += stakedAmount
}

export async function processCreatorTokenIssuerRemarkedEvent({
  overlay,
  event: {
    asV2002: [tokenId, metadataBytes],
  },
}: EventHandlerContext<'Content.CreatorTokenIssuerRemarked'>) {
  const metadata = deserializeMetadata(TokenMetadata, metadataBytes)
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())

  if (!metadata) {
    return
  }

  if (isSet(metadata.description)) {
    token.description = metadata.description
  }

  if (isSet(metadata.benefits)) {
    for (const benefit of metadata!.benefits!) {
      overlay.getRepository(Benefit).new({
        id: overlay.getRepository(Benefit).getNewEntityId(),
        title: benefit.title ? benefit.title! : undefined,
        description: benefit.description ? benefit.description! : undefined,
        emojiCode: benefit.emoji ? benefit.emoji! : undefined,
        displayOrder: benefit.displayOrder ? benefit.displayOrder! : undefined,
        tokenId: token.id
      })
    }
  }

  if (isSet(metadata.whitelistApplicationNote)) {
    token.whitelistApplicantNote = metadata.whitelistApplicationNote || null
  }

  if (isSet(metadata.whitelistApplicationApplyLink)) {
    token.whitelistApplicantLink = metadata.whitelistApplicationApplyLink || null
  }

  if (isSet(metadata.avatarUri)) {
    token.avatar = metadata!.avatarUri
      ? new TokenAvatarUri({ avatarUri: metadata.avatarUri })
      : null
  }

  if (isSet(metadata.trailerVideoId)) {
    const video = await overlay.getRepository(Video).getByIdOrFail(metadata.trailerVideoId)
    if (video) {
      token.trailerVideoId = metadata.trailerVideoId
    }
  }
}
