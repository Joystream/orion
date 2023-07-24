import { EventHandlerContext } from '../../utils/events'
import { criticalError } from '../../utils/misc'
import {
  createAuction,
  createBid,
  findTopBid,
  finishAuction,
  getCurrentAuctionFromVideo,
  getNftOwnerMemberId,
  parseContentActor,
  processNft,
} from './utils'
import {
  Auction,
  AuctionBidCanceledEventData,
  AuctionBidMadeEventData,
  AuctionCanceledEventData,
  Bid,
  BidMadeCompletingAuctionEventData,
  BuyNowCanceledEventData,
  BuyNowPriceUpdatedEventData,
  ChannelNotification,
  EnglishAuctionSettledEventData,
  EnglishAuctionStartedEventData,
  Event,
  Channel,
  MemberNotification,
  NftBoughtEventData,
  NftOwnerChannel,
  NftOwnerMember,
  NftSellOrderMadeEventData,
  OpenAuctionBidAcceptedEventData,
  OpenAuctionStartedEventData,
  OwnedNft,
  TransactionalStatusAuction,
  TransactionalStatusBuyNow,
  TransactionalStatusIdle,
  TransactionalStatusInitiatedOfferToMember,
  Video,
  ChannelFollow,
} from '../../model'
import {
  addNftActivity,
  addNftHistoryEntry,
  addNotificationForRuntimeData,
  genericEventFields,
} from '../utils'
import { assertNotNull } from '@subsquid/substrate-processor'
import { NftOfferedEventData } from '../../model/generated/_nftOfferedEventData'

export async function processOpenAuctionStartedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId, auctionParams],
  },
}: EventHandlerContext<'Content.OpenAuctionStarted'>): Promise<void> {
  // load the nft
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // create auction
  const auction = createAuction(overlay, block, nft, auctionParams)

  nft.transactionalStatus = new TransactionalStatusAuction({
    auction: auction.id,
  })

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new OpenAuctionStartedEventData({
      actor: parseContentActor(contentActor),
      auction: auction.id,
      nftOwner: nft.owner,
    }),
  })

  const channelId = (await overlay.getRepository(Video).getByIdOrFail(videoId.toString())).channelId
  if (channelId) {
    const followers = (
      await overlay.getEm().getRepository(ChannelFollow).findBy({ channelId })
    ).map((follow) => follow.user.id)
    await addNotificationForRuntimeData(overlay, followers, event, new MemberNotification())
  }

  // Add nft history and activities entry
  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [nftOwnerMemberId], event.id)
}

export async function processEnglishAuctionStartedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId, auctionParams],
  },
}: EventHandlerContext<'Content.EnglishAuctionStarted'>): Promise<void> {
  // load nft
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // create new auction
  const auction = createAuction(overlay, block, nft, auctionParams)

  nft.transactionalStatus = new TransactionalStatusAuction({
    auction: auction.id,
  })

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new EnglishAuctionStartedEventData({
      actor: parseContentActor(contentActor),
      auction: auction.id,
      nftOwner: nft.owner,
    }),
  })

  // Add nft history and activities entry
  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [nftOwnerMemberId], event.id)
}

export async function processNftIssuedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [actor, videoId, nftIssuanceParameters],
  },
}: EventHandlerContext<'Content.NftIssued'>): Promise<void> {
  // load video
  const video = await overlay.getRepository(Video).getByIdOrFail(videoId.toString())

  // prepare the new nft
  await processNft(overlay, block, indexInBlock, extrinsicHash, video, actor, nftIssuanceParameters)
}

export async function processAuctionBidMadeEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, videoId, bidAmount],
  },
}: EventHandlerContext<'Content.AuctionBidMade'>): Promise<void> {
  // create a new bid
  const { bid, auction, previousTopBid } = await createBid(
    overlay,
    block,
    indexInBlock,
    memberId.toString(),
    videoId.toString(),
    bidAmount
  )
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // extend auction duration when needed
  if (
    auction.auctionType.isTypeOf === 'AuctionTypeEnglish' &&
    auction.auctionType.plannedEndAtBlock - auction.auctionType.extensionPeriod <= block.height
  ) {
    auction.auctionType.plannedEndAtBlock += auction.auctionType.extensionPeriod
  }

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new AuctionBidMadeEventData({
      bid: bid.id,
      nftOwner: nft.owner,
    }),
  })

  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  // Notify outbidded member, nft owner and the new bidder
  await addNotificationForRuntimeData(
    overlay,
    [previousTopBid?.bidderId, nftOwnerMemberId, memberId.toString()],
    event,
    new ChannelNotification()
  )
  // Add nft history and activities entry
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [bid.bidderId, previousTopBid?.bidderId], event.id)
}

export async function processAuctionBidCanceledEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, videoId],
  },
}: EventHandlerContext<'Content.AuctionBidCanceled'>): Promise<void> {
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())
  // FIXME: Allow specifying multiple relations in a single "query" (in this case both `bidderId` and `nftId`)
  const memberBids = await overlay
    .getRepository(Bid)
    .getManyByRelation('bidderId', memberId.toString())
  const memberBid = assertNotNull(
    memberBids.find((b) => b.nftId === videoId.toString() && b.isCanceled === false),
    `Cannot cancel auction bid: Bid by member ${memberId.toString()} for nft ${videoId} not found`
  )
  const auction = await overlay
    .getRepository(Auction)
    .getByIdOrFail(assertNotNull(memberBid.auctionId))
  const auctionBids = await overlay.getRepository(Bid).getManyByRelation('auctionId', auction.id)

  memberBid.isCanceled = true

  if (auction.topBidId && memberBid.id === auction.topBidId) {
    // find new top bid
    auction.topBidId = findTopBid(auctionBids)?.id || null
  }

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new AuctionBidCanceledEventData({
      bid: memberBid.id,
      member: memberId.toString(),
      nftOwner: nft.owner,
    }),
  })

  // Add nft history and activities entry
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [memberId.toString()], event.id)
}

export async function processAuctionCanceledEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId],
  },
}: EventHandlerContext<'Content.AuctionCanceled'>): Promise<void> {
  // load nft and auction
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())
  const auction = await getCurrentAuctionFromVideo(overlay, videoId.toString())

  nft.transactionalStatus = new TransactionalStatusIdle()
  // mark auction as canceled
  auction.isCanceled = true

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new AuctionCanceledEventData({
      actor: parseContentActor(contentActor),
      auction: auction.id,
      nftOwner: nft.owner,
    }),
  })

  // Add nft history and activities entry
  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [nftOwnerMemberId], event.id)
}

export async function processEnglishAuctionSettledEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [winnerId, , videoId],
  },
}: EventHandlerContext<'Content.EnglishAuctionSettled'>): Promise<void> {
  // finish auction
  const { winningBid, auction, previousNftOwner, nft, auctionBids } = await finishAuction(
    overlay,
    videoId.toString(),
    block
  )

  if (winnerId.toString() !== winningBid.bidderId) {
    criticalError(`Unexpected english auction winner of auction ${auction.id}.`, {
      eventWinnerId: winnerId.toString(),
      queryNodeTopBidder: winnerId,
    })
  }

  // set last sale
  nft.lastSalePrice = winningBid.amount
  nft.lastSaleDate = new Date(block.timestamp)

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new EnglishAuctionSettledEventData({
      previousNftOwner,
      winningBid: winningBid.id,
    }),
  })

  // Notfy all bidders and the (previous) nft owner
  const previousNftOwnerMemberId = await getNftOwnerMemberId(overlay, previousNftOwner)
  await addNotificationForRuntimeData(
    overlay,
    [previousNftOwnerMemberId, ...auctionBids.map((b) => b.bidderId)],
    event,
    new ChannelNotification(),
    winnerId.toString()
  )
  // Add nft history and activities entry
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [previousNftOwnerMemberId, winnerId.toString()], event.id)
}

// called when auction bid's value is higher than buy-now value
export async function processBidMadeCompletingAuctionEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, videoId],
  },
}: EventHandlerContext<'Content.BidMadeCompletingAuction'>): Promise<void> {
  // create record for winning bid
  const { bid, auctionBids } = await createBid(
    overlay,
    block,
    indexInBlock,
    memberId.toString(),
    videoId.toString()
  )

  // finish auction and transfer ownership
  const { nft, winningBid, previousNftOwner } = await finishAuction(
    overlay,
    videoId.toString(),
    block
  )

  // set last sale
  nft.lastSalePrice = winningBid.amount
  nft.lastSaleDate = new Date(block.timestamp)

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new BidMadeCompletingAuctionEventData({
      previousNftOwner,
      winningBid: bid.id,
    }),
  })

  // Notify all bidders and the (previous) nft owner
  const previousNftOwnerMemberId = await getNftOwnerMemberId(overlay, previousNftOwner)
  await addNotificationForRuntimeData(
    overlay,
    [previousNftOwnerMemberId, ...auctionBids.map((b) => b.bidderId)],
    event,
    new ChannelNotification()
  )
  // Add nft history and activities entry
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [previousNftOwnerMemberId, memberId.toString()], event.id)
}

export async function processOpenAuctionBidAcceptedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId, winnerId, bidAmount],
  },
}: EventHandlerContext<'Content.OpenAuctionBidAccepted'>): Promise<void> {
  // finish auction
  const { previousNftOwner, winningBid, nft, auctionBids } = await finishAuction(
    overlay,
    videoId.toString(),
    block,
    {
      bidAmount,
      winnerId,
    }
  )

  // set last sale
  nft.lastSalePrice = winningBid.amount
  nft.lastSaleDate = new Date(block.timestamp)

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new OpenAuctionBidAcceptedEventData({
      actor: parseContentActor(contentActor),
      previousNftOwner,
      winningBid: winningBid.id,
    }),
  })

  // Notify all bidders (the owner should be the one who triggered the event)
  const previousNftOwnerMemberId = await getNftOwnerMemberId(overlay, previousNftOwner)
  await addNotificationForRuntimeData(
    overlay,
    auctionBids.map((b) => b.bidderId),
    event,
    new ChannelNotification()
  )
  // Add nft history and activities entry
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [previousNftOwnerMemberId, winnerId.toString()], event.id)
}

export async function processOfferStartedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, , memberId, price],
  },
}: EventHandlerContext<'Content.OfferStarted'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // update NFT transactional status
  const transactionalStatus = new TransactionalStatusInitiatedOfferToMember({
    member: memberId.toString(),
    price,
  })
  nft.transactionalStatus = transactionalStatus

  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new NftOfferedEventData(),
  })

  const nftOwnerId = await getNftOwnerMemberId(overlay, nft.owner)
  await addNotificationForRuntimeData(overlay, [nftOwnerId], event, new ChannelNotification())
}

export async function processOfferAcceptedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: { asV1000: videoId },
}: EventHandlerContext<'Content.OfferAccepted'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())
  const previousNftOwnerId = await getNftOwnerMemberId(overlay, nft.owner)

  // read member from offer
  const memberId = (nft.transactionalStatus as TransactionalStatusInitiatedOfferToMember).member
  // read price from offer
  const price = (nft.transactionalStatus as TransactionalStatusInitiatedOfferToMember).price

  if (price) {
    // set last sale
    nft.lastSalePrice = price
    nft.lastSaleDate = new Date(block.timestamp)
  }

  // update NFT's transactional status
  nft.transactionalStatus = new TransactionalStatusIdle()
  nft.owner = new NftOwnerMember({ member: memberId })

  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new NftOfferedEventData(), // FIXME:
  })

  await addNotificationForRuntimeData(
    overlay,
    [previousNftOwnerId, memberId],
    event,
    new ChannelNotification()
  )
}

export async function processOfferCanceledEvent({
  overlay,
  event: {
    asV1000: [videoId],
  },
}: EventHandlerContext<'Content.OfferCanceled'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // update NFT's transactional status
  nft.transactionalStatus = new TransactionalStatusIdle()

  // FIXME: No event?
}

export async function processNftSellOrderMadeEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, contentActor, price],
  },
}: EventHandlerContext<'Content.NftSellOrderMade'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // update NFT transactional status
  const transactionalStatus = new TransactionalStatusBuyNow({
    price,
  })
  nft.transactionalStatus = transactionalStatus

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new NftSellOrderMadeEventData({
      actor: parseContentActor(contentActor),
      nft: nft.id,
      nftOwner: nft.owner,
      price,
    }),
  })

  const nftPreviousOwnerId =
    nft.owner.isTypeOf === 'NftOwnerMember'
      ? nft.owner.member
      : (await overlay.getRepository(Channel).getByIdOrFail(nft.owner.channel)).ownerMemberId

  addNotificationForRuntimeData(overlay, [nftPreviousOwnerId], event, new MemberNotification())

  // Add nft history and activities entry
  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [nftOwnerMemberId], event.id)
}

export async function processNftBoughtEvent({
  overlay,
  event: {
    asV1000: [videoId, memberId],
  },
  block,
  indexInBlock,
  extrinsicHash,
}: EventHandlerContext<'Content.NftBought'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // NFT bought price
  const price = (nft.transactionalStatus as TransactionalStatusBuyNow).price

  // set last sale
  nft.lastSalePrice = price
  nft.lastSaleDate = new Date(block.timestamp)

  // update NFT's transactional status
  nft.transactionalStatus = new TransactionalStatusIdle()
  // update NFT's owner
  const previousNftOwner = nft.owner
  nft.owner = new NftOwnerMember({ member: memberId.toString() })

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new NftBoughtEventData({
      buyer: memberId.toString(),
      nft: nft.id,
      previousNftOwner,
      price,
    }),
  })

  // Notify (previous) nft owner
  const previousNftOwnerMemberId = await getNftOwnerMemberId(overlay, previousNftOwner)
  await addNotificationForRuntimeData(
    overlay,
    [previousNftOwnerMemberId],
    event,
    new ChannelNotification()
  )
  // Add nft history and activities entry
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [previousNftOwnerMemberId, memberId.toString()], event.id)
}

export async function processBuyNowCanceledEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, contentActor],
  },
}: EventHandlerContext<'Content.BuyNowCanceled'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  // Update stauts
  nft.transactionalStatus = new TransactionalStatusIdle()

  // add new event
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new BuyNowCanceledEventData({
      actor: parseContentActor(contentActor),
      nft: nft.id,
      nftOwner: nft.owner,
    }),
  })

  // Add nft history and activities entry
  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [nftOwnerMemberId], event.id)
}

export async function processBuyNowPriceUpdatedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, contentActor, newPrice],
  },
}: EventHandlerContext<'Content.BuyNowPriceUpdated'>): Promise<void> {
  // load NFT
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())

  if (nft.transactionalStatus?.isTypeOf !== 'TransactionalStatusBuyNow') {
    criticalError(`Unexpected transactional status of NFT ${videoId.toString()}.`, {
      expected: 'TransactionalStatusBuyNow',
      got: nft.transactionalStatus?.isTypeOf,
    })
  }

  nft.transactionalStatus = new TransactionalStatusBuyNow({ price: newPrice })
  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new BuyNowPriceUpdatedEventData({
      actor: parseContentActor(contentActor),
      newPrice,
      nft: nft.id,
      nftOwner: nft.owner,
    }),
  })

  // Add nft history and activities entry
  const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner)
  addNftHistoryEntry(overlay, nft.id, event.id)
  addNftActivity(overlay, [nftOwnerMemberId], event.id)
}

export async function processNftSlingedBackToTheOriginalArtistEvent({
  overlay,
  event: {
    asV1000: [videoId],
  },
}: EventHandlerContext<'Content.NftSlingedBackToTheOriginalArtist'>): Promise<void> {
  const nft = await overlay.getRepository(OwnedNft).getByIdOrFail(videoId.toString())
  const video = await overlay.getRepository(Video).getByIdOrFail(videoId.toString())

  nft.owner = new NftOwnerChannel({ channel: assertNotNull(video.channelId) })

  // FIXME: No event?
}
