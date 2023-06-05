import { EventHandlerContext } from "../../utils/events";
import {
  Token,
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
  Benefit,
  TokenAvatarUri,
  Video,
  TrailerVideo,
  InitialIssuanceVestingSource,
  SaleVestingSource,
  CreatorToken,
} from "../../model";
import {
  addVestingScheduleToAccount,
  burnFromVesting,
  createAccount,
  getTokenAccountByMemberByToken,
  getTokenAccountByMemberByTokenOrFail,
  processTokenMetadata,
  processValidatedTransfers,
  VestingScheduleData,
} from "./utils";
import { deserializeMetadata } from "../utils";
import {
  SaleMetadata,
  CreatorTokenIssuerRemarked,
} from "@joystream/metadata-protobuf";
import { isSet } from "lodash";

export const MAX_NUMBER_OF_BENEFITS = 10

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
        metadata,
      },
    ],
  },
}: EventHandlerContext<"ProjectToken.TokenIssued">) {
  // create token
  const totalSupply = initialAllocation.reduce((acc, [_, allocation]) => {
    return acc + allocation.amount;
  }, BigInt(0));

  const token = overlay.getRepository(CreatorToken).new({
    id: tokenId.toString(),
    status: TokenStatus.IDLE,
    createdAt: new Date(block.timestamp),
    totalSupply,
    revenueShareRatioPermill: revenueSplitRate,
    annualCreatorReward: patronageRate,
    isInviteOnly: transferPolicy.__kind === "Permissioned",
    accountsNum: 0, // will be uptdated as account are added
    deissued: false,
    numberOfVestedTransferIssued: 0,
    numberOfRevenueShareActivations: 0,
  });

  // create accounts for allocation
  for (const [memberId, allocation] of initialAllocation) {
    const newAccount = createAccount(
      overlay,
      token,
      memberId,
      allocation.amount
    );
    if (allocation.vestingScheduleParams) {
      const vestingData = new VestingScheduleData(
        allocation.vestingScheduleParams,
        block.height
      );
      overlay.getRepository(VestingSchedule).new({
        id: vestingData.id,
        cliffBlock: vestingData.cliffBlock,
        cliffDurationBlocks: vestingData.cliffDuration,
        cliffPercent: vestingData.cliffPercent,
        endsAt: vestingData.endsAt,
        vestingDurationBlocks: vestingData.duration,
      });
      await addVestingScheduleToAccount(
        overlay,
        newAccount,
        vestingData.id,
        allocation.amount,
        new InitialIssuanceVestingSource()
      );
    }
  }

  await processTokenMetadata(token, metadata, overlay);
}

export async function processCreatorTokenIssuedEvent({
  overlay,
  event: {
    asV2001: [, channelId, tokenId],
  },
}: EventHandlerContext<"Content.CreatorTokenIssued">) {
  overlay.getRepository(TokenChannel).new({
    id: overlay.getRepository(TokenChannel).getNewEntityId(),
    channelId: channelId.toString(),
    tokenId: tokenId.toString(),
  });
}

export async function processTokenAmountTransferredEvent({
  overlay,
  event: {
    asV2001: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<"ProjectToken.TokenAmountTransferred">) {
  // get sourceAccount by getManyByRelation with tokenId and memberId
  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    sourceMemberId,
    tokenId
  );
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());

  await processValidatedTransfers(
    overlay,
    token,
    sourceAccount,
    validatedTransfers,
    block.height
  );
}

export async function processTokenAmountTransferredByIssuerEvent({
  overlay,
  block,
  event: {
    asV2001: [tokenId, sourceMemberId, validatedTransfers],
  },
}: EventHandlerContext<"ProjectToken.TokenAmountTransferredByIssuer">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    sourceMemberId,
    tokenId
  );
  token.numberOfVestedTransferIssued += 1;
  await processValidatedTransfers(
    overlay,
    token,
    sourceAccount,
    validatedTransfers,
    block.height
  );
}

export async function processTokenDeissuedEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<"ProjectToken.TokenDeissued">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.deissued = true;
}

export async function processAccountDustedByEvent({
  overlay,
  event: {
    asV2001: [tokenId, dustedAccountId, , ,],
  },
}: EventHandlerContext<"ProjectToken.AccountDustedBy">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const account = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    dustedAccountId,
    tokenId
  );
  account.deleted = true;
  token.accountsNum -= 1;
}

export async function processAmmActivatedEvent({
  overlay,
  event: {
    asV2002: [tokenId, , { slope, intercept }],
  },
}: EventHandlerContext<"ProjectToken.AmmActivated">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.status = TokenStatus.MARKET;
  const id = overlay.getRepository(AmmCurve).getNewEntityId();
  overlay.getRepository(AmmCurve).new({
    burnedByAmm: BigInt(0),
    mintedByAmm: BigInt(0),
    tokenId: tokenId.toString(),
    id,
    ammSlopeParameter: BigInt(slope),
    ammInitPrice: BigInt(intercept),
    finalized: false,
  });
  token.currentAmmSaleId = id;
}

export async function processTokenSaleInitializedEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, , tokenSale, metadataBytes],
  },
}: EventHandlerContext<"ProjectToken.TokenSaleInitialized">) {
  const fundsSourceMemberId = tokenSale.tokensSource;

  const sourceAccount = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    fundsSourceMemberId,
    tokenId
  );
  sourceAccount.totalAmount -= tokenSale.quantityLeft;

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
    termsAndConditions: "",
    fundsSourceAccountId: sourceAccount.id,
  });

  if (tokenSale.vestingScheduleParams !== undefined) {
    const vestingData = new VestingScheduleData(
      tokenSale.vestingScheduleParams,
      block.height
    );

    const vesting = overlay.getRepository(VestingSchedule).new({
      id: vestingData.id,
      endsAt: vestingData.endsAt,
      cliffBlock: vestingData.cliffBlock,
      vestingDurationBlocks: vestingData.duration,
      cliffPercent: vestingData.cliffPercent,
      cliffDurationBlocks: vestingData.cliffDuration,
    });

    overlay.getRepository(VestedSale).new({
      id: overlay.getRepository(VestedSale).getNewEntityId(),
      saleId: sale.id.toString(),
      vestingId: vesting.id,
    });
  }
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.status = TokenStatus.SALE;
  token.currentSaleId = sale.id;

  if (metadataBytes) {
    const metadata = deserializeMetadata(SaleMetadata, metadataBytes);
    if (metadata) {
      if (isSet(metadata.termsAndConditions)) {
        sale.termsAndConditions = metadata.termsAndConditions.toString();
      }
    }
  }
}

export async function processPatronageRateDecreasedToEvent({
  overlay,
  event: {
    asV2001: [tokenId, newRate],
  },
}: EventHandlerContext<"ProjectToken.PatronageRateDecreasedTo">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  if (typeof newRate === "number") {
    token.annualCreatorReward = newRate;
  } else {
    token.annualCreatorReward = Number(newRate.toString());
  }
}

export async function processPatronageCreditClaimedEvent({
  overlay,
  event: {
    asV2001: [tokenId, amount, memberId],
  },
}: EventHandlerContext<"ProjectToken.PatronageCreditClaimed">) {
  const creator = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    memberId,
    tokenId
  );
  creator.totalAmount += amount;

  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.totalSupply += amount;
}

export async function processTokensBoughtOnAmmEvent({
  overlay,
  block,
  event: {
    asV2002: [tokenId, memberId, crtMinted, joysDeposited],
  },
}: EventHandlerContext<"ProjectToken.TokensBoughtOnAmm">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.totalSupply += crtMinted;

  let buyerAccount = await getTokenAccountByMemberByToken(
    overlay,
    memberId,
    tokenId
  );
  if (buyerAccount === undefined) {
    buyerAccount = createAccount(overlay, token, memberId, crtMinted);
  } else {
    buyerAccount.totalAmount += crtMinted;
  }

  const activeAmm = await overlay
    .getRepository(AmmCurve)
    .getByIdOrFail(token.currentAmmSaleId!);

  activeAmm.mintedByAmm += crtMinted;
  overlay.getRepository(AmmTransaction).new({
    ammId: activeAmm.id,
    accountId: buyerAccount.id,
    id: overlay.getRepository(AmmTransaction).getNewEntityId(),
    transactionType: AmmTransactionType.BUY,
    createdIn: block.height,
    quantity: crtMinted,
    pricePaid: joysDeposited,
    pricePerUnit: joysDeposited / crtMinted, // truncates decimal values
  });
}

export async function processTokensSoldOnAmmEvent({
  overlay,
  block,
  event: {
    asV2002: [tokenId, memberId, crtBurned, joysRecovered],
  },
}: EventHandlerContext<"ProjectToken.TokensSoldOnAmm">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.totalSupply -= crtBurned;
  const activeAmm = await overlay
    .getRepository(AmmCurve)
    .getByIdOrFail(token.currentAmmSaleId!);
  const ammId = activeAmm.id;

  const sellerAccount = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    memberId,
    tokenId
  );
  sellerAccount.totalAmount -= crtBurned;

  const amm = await overlay.getRepository(AmmCurve).getByIdOrFail(ammId);
  amm.burnedByAmm += crtBurned;

  overlay.getRepository(AmmTransaction).new({
    ammId,
    accountId: sellerAccount.id,
    id: overlay.getRepository(AmmTransaction).getNewEntityId(),
    transactionType: AmmTransactionType.SELL,
    createdIn: block.height,
    quantity: crtBurned,
    pricePaid: joysRecovered,
    pricePerUnit: joysRecovered / crtBurned, // truncates decimal values
  });
}

export async function processTokensPurchasedOnSaleEvent({
  overlay,
  block,
  event: {
    asV1000: [tokenId, , amountPurchased, memberId],
  },
<<<<<<< HEAD
}: EventHandlerContext<"ProjectToken.TokensPurchasedOnSale">) {
  let buyerAccount = await getTokenAccountByMemberByToken(
    overlay,
    memberId,
    tokenId
  );
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
}: EventHandlerContext<'ProjectToken.TokensPurchasedOnSale'>) {
<<<<<<< HEAD
<<<<<<< HEAD
  let buyerAccount = await overlay
    .getRepository(TokenAccount)
    .getById(tokenAccountId(tokenId, memberId))
=======
}: EventHandlerContext<'ProjectToken.TokensPurchasedOnSale'>) {

  let buyerAccount = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)
||||||| parent of 5be047255 (fix: purchase token on sale)
  let buyerAccount = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
=======
  const buyerAccounts =
    (
      await overlay.getRepository(TokenAccount).getManyByRelation('memberId', memberId.toString())
    ).filter((account) => account.tokenId === tokenId.toString() && !account.deleted)
  let buyerAccount = buyerAccounts.length > 0 ? buyerAccounts[0] : undefined

>>>>>>> 5be047255 (fix: purchase token on sale)
||||||| parent of 35f17bf30 (fix: address PR)
  const buyerAccounts =
    (
      await overlay.getRepository(TokenAccount).getManyByRelation('memberId', memberId.toString())
    ).filter((account) => account.tokenId === tokenId.toString() && !account.deleted)
  let buyerAccount = buyerAccounts.length > 0 ? buyerAccounts[0] : undefined

=======
  let buyerAccount = await getTokenAccountByMemberByToken(overlay, memberId, tokenId)
>>>>>>> 35f17bf30 (fix: address PR)
  if (buyerAccount === undefined) {
    const token = await overlay
      .getRepository(CreatorToken)
      .getByIdOrFail(tokenId.toString());
    buyerAccount = createAccount(overlay, token, memberId, amountPurchased);
  } else {
<<<<<<< HEAD
    buyerAccount.totalAmount += amountPurchased;
||||||| parent of 35f17bf30 (fix: address PR)
    buyerAccount!.totalAmount += amountPurchased
=======
    buyerAccount.totalAmount += amountPurchased
>>>>>>> 35f17bf30 (fix: address PR)
  }

<<<<<<< HEAD
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const sale = await overlay
    .getRepository(Sale)
    .getByIdOrFail(token.currentSaleId!);
  sale.tokensSold += amountPurchased;
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.tokensSold += amountPurchased
=======
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const sale = await overlay.getRepository(Sale).getByIdOrFail(token.currentSaleId!)
  sale.tokensSold += amountPurchased
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)

  overlay.getRepository(SaleTransaction).new({
    id: overlay.getRepository(SaleTransaction).getNewEntityId(),
    quantity: amountPurchased,
    saleId: sale.id,
    accountId: buyerAccount.id,
    createdIn: block.height,
  });

  overlay.getRepository(SaleTransaction).new({
    id: overlay.getRepository(SaleTransaction).getNewEntityId(),
    quantity: amountPurchased,
    saleId: sale.id,
    accountId: buyerAccount.id,
    createdIn: block.height,
  });

  const vestingForSale = await overlay
    .getRepository(VestedSale)
<<<<<<< HEAD
    .getOneByRelation("saleId", sale.id);

||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
    .getOneByRelation('saleId', tokenSaleId(tokenId, saleId))
=======
    .getOneByRelation('saleId', sale.id)

>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)
  if (vestingForSale !== undefined) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    await addVestingScheduleToAccount(
      overlay,
      buyerAccount,
      vestingForSale.vestingId,
      amountPurchased,
      new SaleVestingSource()
    );
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
    const id = overlay.getRepository(VestedAccount).getNewEntityId()
    overlay.getRepository(VestedAccount).new({
      id,
      accountId: buyerAccount.id,
      vestingId: vestingForSale.vestingId,
      totalVestingAmount: amountPurchased,
    })
=======
    // add vesting to account
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)
||||||| parent of 35f17bf30 (fix: address PR)
    // add vesting to account
=======
    addVestingScheduleToAccount(
||||||| parent of 098a31664 (fix: migration ok)
    addVestingScheduleToAccount(
=======
    await addVestingScheduleToAccount(
>>>>>>> 098a31664 (fix: migration ok)
      overlay,
      buyerAccount,
      vestingForSale.vestingId,
      amountPurchased,
      new SaleVestingSource()
    )
>>>>>>> 35f17bf30 (fix: address PR)
  }
}

export async function processUpcomingTokenSaleUpdatedEvent({
  overlay,
  event: {
    asV1000: [tokenId, , newStart, newDuration],
  },
<<<<<<< HEAD
}: EventHandlerContext<"ProjectToken.UpcomingTokenSaleUpdated">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const sale = await overlay
    .getRepository(Sale)
    .getByIdOrFail(token.currentSaleId!);
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
}: EventHandlerContext<'ProjectToken.UpcomingTokenSaleUpdated'>) {
  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
=======
}: EventHandlerContext<'ProjectToken.UpcomingTokenSaleUpdated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const sale = await overlay.getRepository(Sale).getByIdOrFail(token.currentSaleId!)
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)

  if (newStart) {
    sale.startBlock = newStart;
  }

  sale.endsAt =
    newDuration === undefined ? sale.endsAt : sale.startBlock + newDuration;
}

export async function processRevenueSplitIssuedEvent({
  overlay,
  block,
  event: {
    asV2001: [tokenId, startBlock, duration, joyAllocation],
  },
}: EventHandlerContext<"ProjectToken.RevenueSplitIssued">) {
  const endsAt = startBlock + duration;
  const id = overlay.getRepository(RevenueShare).getNewEntityId();
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());

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
  });

  token.currentRenvenueShareId = id;
}

export async function processMemberJoinedWhitelistEvent({
  overlay,
  event: {
    asV2001: [tokenId, memberId],
  },
}: EventHandlerContext<"ProjectToken.MemberJoinedWhitelist">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  createAccount(overlay, token, memberId, BigInt(0));
}

export async function processAmmDeactivatedEvent({
  overlay,
  event: {
    asV2002: [tokenId, , burnedAmount],
  },
<<<<<<< HEAD
}: EventHandlerContext<"ProjectToken.AmmDeactivated">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.totalSupply -= burnedAmount;
  token.status = TokenStatus.IDLE;
||||||| parent of 35f17bf30 (fix: address PR)
}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= burnedAmount
  token.status = TokenStatus.IDLE
  token.currentAmmSaleId = null
=======
}: EventHandlerContext<'ProjectToken.AmmDeactivated'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.totalSupply -= burnedAmount
  token.status = TokenStatus.IDLE
>>>>>>> 35f17bf30 (fix: address PR)

<<<<<<< HEAD
  const activeAmm = await overlay
    .getRepository(AmmCurve)
    .getByIdOrFail(token.currentAmmSaleId!);
  activeAmm.finalized = true;

  token.currentAmmSaleId = null;
||||||| parent of 35f17bf30 (fix: address PR)
  const activeAmm = (
    await overlay.getRepository(AmmCurve).getManyByRelation('tokenId', token.id)
  ).filter((amm) => !amm.finalized)[0]
  activeAmm.finalized = true
=======
  const activeAmm = await overlay.getRepository(AmmCurve).getByIdOrFail(token.currentAmmSaleId!)
  activeAmm.finalized = true

  token.currentAmmSaleId = null
>>>>>>> 35f17bf30 (fix: address PR)
}

export async function processTokensBurnedEvent({
  overlay,
  event: {
    asV2001: [tokenId, memberId, amountBurned],
  },
}: EventHandlerContext<"ProjectToken.TokensBurned">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.totalSupply -= amountBurned;

  const account = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    memberId,
    tokenId
  );
  if (account.stakedAmount > 0) {
    account.stakedAmount =
      account.stakedAmount > amountBurned
        ? account.stakedAmount - amountBurned
        : BigInt(0);
  }
<<<<<<< HEAD
  account.totalAmount -= amountBurned;
  await burnFromVesting(overlay, account.id, amountBurned);
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
  account.totalAmount -= amountBurned
  await burnFromVesting(overlay, tokenAccountId(tokenId, memberId), amountBurned)
=======
  account.totalAmount -= amountBurned
  await burnFromVesting(overlay, account.id, amountBurned)
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)
}

export async function processTransferPolicyChangedToPermissionlessEvent({
  overlay,
  event: { asV1000: tokenId },
}: EventHandlerContext<"ProjectToken.TransferPolicyChangedToPermissionless">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  token.isInviteOnly = false;
}

export async function processTokenSaleFinalizedEvent({
  overlay,
  event: {
    asV1000: [tokenId, , quantityLeft, ,],
  },
<<<<<<< HEAD
}: EventHandlerContext<"ProjectToken.TokenSaleFinalized">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const sale = await overlay
    .getRepository(Sale)
    .getByIdOrFail(token.currentSaleId!);
  sale.finalized = true;
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
}: EventHandlerContext<'ProjectToken.TokenSaleFinalized'>) {
  const sale = await overlay.getRepository(Sale).getByIdOrFail(tokenSaleId(tokenId, saleId))
  sale.finalized = true
=======
}: EventHandlerContext<'ProjectToken.TokenSaleFinalized'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const sale = await overlay.getRepository(Sale).getByIdOrFail(token.currentSaleId!)
  sale.finalized = true
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)

  const sourceAccount = await overlay
    .getRepository(TokenAccount)
    .getByIdOrFail(sale.fundsSourceAccountId!);
  sourceAccount.totalAmount += quantityLeft;

<<<<<<< HEAD
  token.status = TokenStatus.IDLE;
  token.currentSaleId = null;
||||||| parent of 2f0acc3d5 (fix: vesting schedule schema & mappings)
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  token.status = TokenStatus.IDLE
  token.currentSaleId = null
=======
  token.status = TokenStatus.IDLE
  token.currentSaleId = null
>>>>>>> 2f0acc3d5 (fix: vesting schedule schema & mappings)
}

export async function processRevenueSplitLeftEvent({
  overlay,
  event: {
    asV2001: [tokenId, memberId, unstakedAmount],
  },
}: EventHandlerContext<"ProjectToken.RevenueSplitLeft">) {
  const account = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    memberId,
    tokenId
  );
  account.stakedAmount -= unstakedAmount;
}

export async function processRevenueSplitFinalizedEvent({
  overlay,
  event: {
    asV2001: [tokenId, ,], // leftover JOYs not processed in orion
  },
<<<<<<< HEAD
}: EventHandlerContext<"ProjectToken.RevenueSplitFinalized">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(token.currentRenvenueShareId!);
  revenueShare.finalized = true;
  token.currentRenvenueShareId = null;
||||||| parent of 35f17bf30 (fix: address PR)
}: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const revenueShare = (
    await overlay.getRepository(RevenueShare).getManyByRelation('tokenId', token.id)
  ).filter((share) => !share.finalized)[0]
  revenueShare.finalized = true
  token.currentRenvenueShareId = null
=======
}: EventHandlerContext<'ProjectToken.RevenueSplitFinalized'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(token.currentRenvenueShareId!)
  revenueShare.finalized = true
  token.currentRenvenueShareId = null
>>>>>>> 35f17bf30 (fix: address PR)
}

export async function processUserParticipatedInSplitEvent({
  overlay,
  block,
  event: {
    asV2001: [tokenId, memberId, stakedAmount, joyDividend],
  },
<<<<<<< HEAD
}: EventHandlerContext<"ProjectToken.UserParticipatedInSplit">) {
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  const account = await getTokenAccountByMemberByTokenOrFail(
    overlay,
    memberId,
    tokenId
  );
||||||| parent of 35f17bf30 (fix: address PR)
}: EventHandlerContext<'ProjectToken.UserParticipatedInSplit'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const account = (
    await overlay.getRepository(TokenAccount).getManyByRelation('tokenId', token.id)
  ).filter((account) => account.memberId === memberId.toString() && !account.deleted)[0]
=======
}: EventHandlerContext<'ProjectToken.UserParticipatedInSplit'>) {
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  const account = await getTokenAccountByMemberByTokenOrFail(overlay, memberId, tokenId)
>>>>>>> 35f17bf30 (fix: address PR)

<<<<<<< HEAD
<<<<<<< HEAD
  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(token.currentRenvenueShareId!);
  revenueShare.claimed += joyDividend;
  revenueShare.participantsNum += 1;
||||||| parent of 35f17bf30 (fix: address PR)
  const revenueShare = (
    await overlay.getRepository(RevenueShare).getManyByRelation('tokenId', token.id)
  ).filter((share) => !share.finalized)[0]
  revenueShare.claimed += joyDividend
  revenueShare.participantsNum += 1
=======
  const revenueShare = await overlay.getRepository(RevenueShare).getByIdOrFail(token.currentRenvenueShareId!)
||||||| parent of 74cc6a90a (fix: hidden entities)
  const revenueShare = await overlay.getRepository(RevenueShare).getByIdOrFail(token.currentRenvenueShareId!)
=======
  const revenueShare = await overlay
    .getRepository(RevenueShare)
    .getByIdOrFail(token.currentRenvenueShareId!)
>>>>>>> 74cc6a90a (fix: hidden entities)
  revenueShare.claimed += joyDividend
  revenueShare.participantsNum += 1
>>>>>>> 35f17bf30 (fix: address PR)

  overlay.getRepository(RevenueShareParticipation).new({
    id: overlay.getRepository(RevenueShareParticipation).getNewEntityId(),
    accountId: account.id,
    revenueShareId: revenueShare.id,
    stakedAmount,
    earnings: joyDividend,
    createdIn: block.height,
  });
  account.stakedAmount += stakedAmount;
}

export async function processCreatorTokenIssuerRemarkedEvent({
  overlay,
  event: {
    asV2002: [tokenId, _, metadataBytes],
  },
<<<<<<< HEAD
}: EventHandlerContext<"Content.CreatorTokenIssuerRemarked">) {
  const creatorRemarked = deserializeMetadata(
    CreatorTokenIssuerRemarked,
    metadataBytes
  );
  if (creatorRemarked === null) {
    return;
  }
  const metadata = creatorRemarked.updateTokenMetadata;
  if (metadata === null && metadata!.newMetadata === null) {
    return;
||||||| parent of 35f17bf30 (fix: address PR)
}: EventHandlerContext<'Content.CreatorTokenIssuerRemarked'>) {
  const metadata = deserializeMetadata(TokenMetadata, metadataBytes)
  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())

  if (!metadata) {
    return
=======
}: EventHandlerContext<'Content.CreatorTokenIssuerRemarked'>) {
  const creatorRemarked = deserializeMetadata(CreatorTokenIssuerRemarked, metadataBytes)
  if (creatorRemarked === null) {
    return
  }
  const metadata = creatorRemarked.updateTokenMetadata
  if (metadata === null && metadata!.newMetadata === null) {
    return
>>>>>>> 35f17bf30 (fix: address PR)
  }

<<<<<<< HEAD
  const newMetadata = metadata!.newMetadata!;
  const token = await overlay
    .getRepository(CreatorToken)
    .getByIdOrFail(tokenId.toString());
  await processTokenMetadata(token, newMetadata, overlay);
||||||| parent of 35f17bf30 (fix: address PR)
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
        tokenId: token.id,
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
      const id = overlay.getRepository(TrailerVideo).getNewEntityId()
      overlay.getRepository(TrailerVideo).new({
        id,
        tokenId: token.id,
        videoId: video.id,
      })
      token.trailerVideoId = id
    }
  }
=======
  const newMetadata = metadata!.newMetadata!

  const token = await overlay.getRepository(Token).getByIdOrFail(tokenId.toString())
  if (isSet(newMetadata.description)) {
    token.description = newMetadata.description
  }

  if (isSet(newMetadata.benefits)) {
    for (const benefit of newMetadata.benefits) {
      if (benefit.displayOrder !== null && benefit.displayOrder < MAX_NUMBER_OF_BENEFITS) {
        // remove existing benefit with the same display order (if exists)
        const existingBenefit = (
          await overlay.getRepository(Benefit).getManyByRelation('tokenId', token.id)
        ).find((b) => b.displayOrder === benefit.displayOrder)

        if (existingBenefit !== undefined) {
          overlay.getRepository(Benefit).remove(existingBenefit)
        }

        // if the benefit title is null, it means we want to remove the benefit
        if (benefit.title !== null) {
          overlay.getRepository(Benefit).new({
            id: overlay.getRepository(Benefit).getNewEntityId(),
            title: benefit.title,
            description: benefit.description,
            emojiCode: benefit.emoji,
            displayOrder: benefit.displayOrder,
            tokenId: token.id,
          })
        }
      }
    }
  }

  if (isSet(newMetadata.whitelistApplicationNote)) {
    token.whitelistApplicantNote = newMetadata.whitelistApplicationNote || null
  }

  if (isSet(newMetadata.whitelistApplicationApplyLink)) {
    token.whitelistApplicantLink = newMetadata.whitelistApplicationApplyLink || null
  }

  if (isSet(newMetadata.avatarUri)) {
    token.avatar = newMetadata.avatarUri
      ? new TokenAvatarUri({ avatarUri: newMetadata.avatarUri })
      : null
  }

  if (isSet(newMetadata.trailerVideoId)) {
    const video = await overlay.getRepository(Video).getById(newMetadata.trailerVideoId)
    if (video) {
      const trailerVideoRepository = overlay.getRepository(TrailerVideo)
      const oldTrailer = await trailerVideoRepository.getOneByRelationOrFail('tokenId', token.id)
      trailerVideoRepository.remove(oldTrailer)

      const id = overlay.getRepository(TrailerVideo).getNewEntityId()
      overlay.getRepository(TrailerVideo).new({
        id,
        tokenId: token.id,
        videoId: video.id,
      })
      token.trailerVideoId = id
    }
  }
>>>>>>> 35f17bf30 (fix: address PR)
}
