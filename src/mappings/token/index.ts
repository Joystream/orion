import { EventHandlerContext } from '../../utils/events'
import {
  TokenAccount,
  TokenStatus,
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
  InitialIssuanceVestingSource,
  SaleVestingSource,
  CreatorToken,
} from '../../model'
import {
  addVestingScheduleToAccount,
  burnFromVesting,
  createAccount,
  getTokenAccountByMemberByToken,
  getTokenAccountByMemberByTokenOrFail,
  processTokenMetadata,
  processValidatedTransfers,
  VestingScheduleData,
} from './utils'
import { deserializeMetadata } from '../utils'
import {
  SaleMetadata,
  CreatorTokenIssuerRemarked,
  TokenMetadata,
} from '@joystream/metadata-protobuf'
import { isSet } from '@joystream/metadata-protobuf/utils'

export async function processTokenIssuedEvent({
  overlay,
  block,
  event: {
    asV2002: [
      tokenId,
      {
        initialAllocation,
        transferPolicy,
        patronageRate,
        revenueSplitRate,
        metadata: metadataBytes,
      },
    ],
  },
}: EventHandlerContext<'ProjectToken.TokenIssued'>) {
  // create token
  const totalSupply = initialAllocation.reduce((acc, [_, allocation]) => {
    return acc + allocation.amount
  }, BigInt(0))

  const token = overlay.getRepository(CreatorToken).new({
    id: tokenId.toString(),
    status: TokenStatus.IDLE,
    createdAt: new Date(block.timestamp),
    totalSupply,
    revenueShareRatioPermill: revenueSplitRate,
    annualCreatorRewardPermill: patronageRate,
    isInviteOnly: transferPolicy.__kind === 'Permissioned',
    accountsNum: 0, // will be uptdated as account are added
    deissued: false,
    numberOfVestedTransferIssued: 0,
    numberOfRevenueShareActivations: 0,
  })

  // create accounts for allocation
  for (const [memberId, allocation] of initialAllocation) {
    const newAccount = createAccount(overlay, token, memberId, allocation.amount)
    if (allocation.vestingScheduleParams) {
      const vestingData = new VestingScheduleData(allocation.vestingScheduleParams, block.height)
      overlay.getRepository(VestingSchedule).new({
        id: vestingData.id,
        cliffBlock: vestingData.cliffBlock,
        cliffDurationBlocks: vestingData.cliffDuration,
        cliffRatioPermill: vestingData.cliffPercent,
        endsAt: vestingData.endsAt,
        vestingDurationBlocks: vestingData.duration,
      })
      await addVestingScheduleToAccount(
        overlay,
        newAccount,
        vestingData.id,
        allocation.amount,
        new InitialIssuanceVestingSource(),
        block.height
      )
    }
  }

  const metadata = deserializeMetadata(TokenMetadata, metadataBytes)
  if (metadata) {
    await processTokenMetadata(token, metadata, overlay, false)
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
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())

  await processValidatedTransfers(overlay, token, sourceAccount, validatedTransfers, block.height)
}

export async function processTokenAmountTransferredByIssuerEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<'ProjectToken.TokenAmountTransferredByIssuer'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(overlay, sourceMemberId, tokenId)
  token.numberOfVestedTransferIssued += 1
  await processValidatedTransfers(overlay, token, sourceAccount, validatedTransfers, block.height)
}

export async function processTokenDeissuedEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<'ProjectToken.TokenDeissued'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.deissued = true
}

export async function processAccountDustedByEvent({
  overlay,
  event: {
    asV1000: [tokenId, dustedAccountId, , ,],
  },
}: EventHandlerContext<'ProjectToken.AccountDustedBy'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const account = await getTokenAccountByMemberByTokenOrFail(overlay, dustedAccountId, tokenId)
  account.deleted = true
  token.accountsNum -= 1
}

export async function processAmmActivatedEvent({
  overlay,
  event: {
    asV2002: [tokenId, , { slope, intercept }],
  },
}: EventHandlerContext<'ProjectToken.AmmActivated'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.MARKET
  const id = overlay.getRepository(AmmCurve).getNewEntityId()
  const amm = overlay.getRepository(AmmCurve).new({
    burnedByAmm: BigInt(0),
    mintedByAmm: BigInt(0),
    tokenId: tokenId.toString(),
    id,
    ammSlopeParameter: BigInt(slope),
    ammInitPrice: BigInt(intercept),
    finalized: false,
  })
  token.lastPrice = amm.ammInitPrice
  token.currentAmmSaleId = id
}

export async function processTokenSaleInitializedEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, , tokenSale, metadataBytes],
  },
}: EventHandlerContext<'ProjectToken.TokenSaleInitialized'>) {
  const fundsSourceMemberId = tokenSale.tokensSource

  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    fundsSourceMemberId,
    tokenId
  )
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

  if (tokenSale.vestingScheduleParams !== undefined) {
    const vestingData = new VestingScheduleData(tokenSale.vestingScheduleParams, block.height)

    const vesting = overlay.getRepository(VestingSchedule).new({
      id: vestingData.id,
      endsAt: vestingData.endsAt,
      cliffBlock: vestingData.cliffBlock,
      vestingDurationBlocks: vestingData.duration,
      cliffRatioPermill: vestingData.cliffPercent,
      cliffDurationBlocks: vestingData.cliffDuration,
    })

    overlay.getRepository(VestedSale).new({
      id: overlay.getRepository(VestedSale).getNewEntityId(),
      saleId: sale.id.toString(),
      vestingId: vesting.id,
    })
  }
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.SALE
  token.currentSaleId = sale.id
  token.lastPrice = sale.pricePerUnit

  if (metadataBytes) {
    const metadata = deserializeMetadata(SaleMetadata, metadataBytes)
    if (metadata) {
      if (isSet(metadata.termsAndConditions)) {
        sale.termsAndConditions = metadata.termsAndConditions.toString()
      }
    }
  }
}

export async function processPatronageRateDecreasedToEvent({
  overlay,
  event,
}: EventHandlerContext<'ProjectToken.PatronageRateDecreasedTo'>) {
  const [tokenId, newRate] = event.isV1000 ? event.asV1000 : event.asV2002
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  if (typeof newRate === 'number') {
    token.annualCreatorRewardPermill = newRate
  } else {
    token.annualCreatorRewardPermill = Number(newRate.toString())
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

  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.totalSupply += amount
}

export async function processTokensBoughtOnAmmEvent({
  overlay,
  block,
  event: {
    asV2002: [tokenId, memberId, crtMinted, joysDeposited],
  },
}: EventHandlerContext<'ProjectToken.TokensBoughtOnAmm'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.totalSupply += crtMinted

  let buyerAccount = await getTokenAccountByMemberByToken(overlay, memberId, tokenId)
  if (buyerAccount === undefined) {
    buyerAccount = createAccount(overlay, token, memberId, crtMinted)
  } else {
    buyerAccount.totalAmount += crtMinted
  }

  const activeAmm = await overlay.getRepository(AmmCurve).getByIdOrFail(token.currentAmmSaleId!)

  activeAmm.mintedByAmm += crtMinted
  const tx = overlay.getRepository(AmmTransaction).new({
    ammId: activeAmm.id,
    accountId: buyerAccount.id,
    id: overlay.getRepository(AmmTransaction).getNewEntityId(),
    transactionType: AmmTransactionType.BUY,
    createdIn: block.height,
    quantity: crtMinted,
    pricePaid: joysDeposited,
    pricePerUnit: joysDeposited / crtMinted, // truncates decimal values
  })

  token.lastPrice = tx.pricePerUnit
}

export async function processTokensSoldOnAmmEvent({
  overlay,
  block,
  event: {
    asV2002: [tokenId, memberId, crtBurned, joysRecovered],
  },
}: EventHandlerContext<'ProjectToken.TokensSoldOnAmm'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.totalSupply -= crtBurned
  const activeAmm = await overlay.getRepository(AmmCurve).getByIdOrFail(token.currentAmmSaleId!)
  const ammId = activeAmm.id

  const sellerAccount = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
  sellerAccount.totalAmount -= crtBurned

  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId)
  amm.burnedByAmm += crtBurned

  const tx = overlay.getRepository(AmmTransaction).new({
    ammId,
    accountId: sellerAccount.id,
    id: overlay.getRepository(AmmTransaction).getNewEntityId(),
    transactionType: AmmTransactionType.SELL,
    createdIn: block.height,
    quantity: crtBurned,
    pricePaid: joysRecovered,
    pricePerUnit: joysRecovered / crtBurned, // truncates decimal values
  })

  token.lastPrice = tx.pricePerUnit
}

export async function processTokensPurchasedOnSaleEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, , amountPurchased, memberId],
  },
}: EventHandlerContext<'ProjectToken.TokensPurchasedOnSale'>) {
  let buyerAccount = await getTokenAccountByMemberByToken(overlay, memberId, tokenId)
  if (buyerAccount === undefined) {
    const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
    buyerAccount = createAccount(overlay, token, memberId, amountPurchased)
  } else {
    buyerAccount.totalAmount += amountPurchased
  }

  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const sale = await overlay.getRepository(Sale).getByIdOrFail(token.currentSaleId!)
  sale.tokensSold += amountPurchased

  overlay.getRepository(SaleTransaction).new({
    id: overlay.getRepository(SaleTransaction).getNewEntityId(),
    quantity: amountPurchased,
    saleId: sale.id,
    accountId: buyerAccount.id,
    createdIn: block.height,
  })

  const vestingForSale = await overlay.getRepository(VestedSale).getOneByRelation('saleId', sale.id)

  if (vestingForSale !== undefined) {
    await addVestingScheduleToAccount(
      overlay,
      buyerAccount,
      vestingForSale.vestingId,
      amountPurchased,
      new SaleVestingSource({ sale: sale.id }),
      block.height
    )
  }
}

export async function processUpcomingTokenSaleUpdatedEvent({
  overlay,
  event: {
    asV1000: [tokenId, , newStart, newDuration],
  },
}: EventHandlerContext<'ProjectToken.UpcomingTokenSaleUpdated'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const sale = await overlay.getRepository(Sale).getByIdOrFail(token.currentSaleId!)

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
  const token = (await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString())) as CreatorToken

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
    potentialParticipantsNum: token.accountsNum,
  }) as RevenueShare

  token.currentRenvenueShareId = id
}

export async function processMemberJoinedWhitelistEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId],
  },
}: EventHandlerContext<'ProjectToken.MemberJoinedWhitelist'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  createAccount(overlay, token, memberId, BigInt(0))
}

export async function processAmmDeactivatedEvent({
  overlay,
  event: {
    asV2002: [tokenId, , burnedAmount],
  },
}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.IDLE

  const activeAmm = await overlay.getRepository(AmmCurve).getByIdOrFail(token.currentAmmSaleId!)
  activeAmm.finalized = true

  token.currentAmmSaleId = null
}

export async function processTokensBurnedEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId, amountBurned],
  },
}: EventHandlerContext<'ProjectToken.TokensBurned'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.totalSupply -= amountBurned

  const account = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
  if (account.stakedAmount > 0) {
    account.stakedAmount =
      account.stakedAmount > amountBurned ? account.stakedAmount - amountBurned : BigInt(0)
  }
  account.totalAmount -= amountBurned
  await burnFromVesting(overlay, account.id, amountBurned)
}

export async function processTransferPolicyChangedToPermissionlessEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<'ProjectToken.TransferPolicyChangedToPermissionless'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  token.isInviteOnly = false
}

export async function processTokenSaleFinalizedEvent({
  overlay,
  event: {
    asV1000: [tokenId, , quantityLeft, ,],
  },
}: EventHandlerContext<'ProjectToken.TokenSaleFinalized'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const sale = await overlay.getRepository(Sale).getByIdOrFail(token.currentSaleId!)
  sale.finalized = true

  const sourceAccount = await overlay
    .getRepository(TokenAccount)
    .getByIdOrFail(sale.fundsSourceAccountId!)
  sourceAccount.totalAmount += quantityLeft

  token.status = TokenStatus.IDLE
  token.currentSaleId = null
}

export async function processRevenueSplitLeftEvent({
  overlay,
  event: {
    asV1000: [tokenId, memberId, unstakedAmount],
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitLeft'>) {
  const account = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
  account.stakedAmount -= unstakedAmount
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  if (token.currentRenvenueShareId) {
    // TODO: refactor this as should be true all the times, might be a good idea to panic
    const revenueShare = await overlay
      .getRepository(RevenueShare)
      .getByIdOrFail(token.currentRenvenueShareId!)
    revenueShare.participantsNum -= 1
    const qRevenueShareParticipation = (
      await overlay
        .getRepository(RevenueShareParticipation)
        .getManyByRelation('accountId', account.id)
    ).find((participation) => participation.revenueShareId === revenueShare.id)
    if (qRevenueShareParticipation) {
      qRevenueShareParticipation.recovered = true
    }
  }
}

export async function processRevenueSplitFinalizedEvent({
  overlay,
  event: {
    asV1000: [tokenId, ,], // leftover JOYs not processed in orion
  },
}: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(token.currentRenvenueShareId!)
  revenueShare.finalized = true
  token.currentRenvenueShareId = null
}

export async function processUserParticipatedInSplitEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, memberId, stakedAmount, joyDividend],
  },
}: EventHandlerContext<'ProjectToken.UserParticipatedInSplit'>) {
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  const account = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)

  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(token.currentRenvenueShareId!)
  revenueShare.claimed += joyDividend
  revenueShare.participantsNum += 1

  overlay.getRepository(RevenueShareParticipation).new({
    id: overlay.getRepository(RevenueShareParticipation).getNewEntityId(),
    accountId: account.id,
    revenueShareId: revenueShare.id,
    stakedAmount,
    earnings: joyDividend,
    createdIn: block.height,
    recovered: false,
  })
  account.stakedAmount += stakedAmount
}

export async function processCreatorTokenIssuerRemarkedEvent({
  overlay,
  event: {
    asV2002: [_, tokenId, metadataBytes],
  },
}: EventHandlerContext<'Content.CreatorTokenIssuerRemarked'>) {
  const creatorRemarked = deserializeMetadata(CreatorTokenIssuerRemarked, metadataBytes)
  if (creatorRemarked === null) {
    return
  }
  const metadata = creatorRemarked.updateTokenMetadata
  if (!isSet(metadata?.newMetadata)) {
    return
  }

  const newMetadata = metadata!.newMetadata!
  const token = await overlay.getRepository(CreatorToken).getByIdOrFail(tokenId.toString())
  await processTokenMetadata(token, newMetadata, overlay, true)
}
