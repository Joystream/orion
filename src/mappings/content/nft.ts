import { criticalError, EventHandlerContext } from '../../utils'
import {
  createAuction,
  createBid,
  findTopBid,
  finishAuction,
  getCurrentAuctionFromVideo,
  parseContentActor,
  processNft,
} from './utils'
import {
  AuctionBidCanceledEventData,
  AuctionBidMadeEventData,
  AuctionCanceledEventData,
  BidMadeCompletingAuctionEventData,
  BuyNowCanceledEventData,
  BuyNowPriceUpdatedEventData,
  EnglishAuctionSettledEventData,
  EnglishAuctionStartedEventData,
  Event,
  NftBoughtEventData,
  NftOwnerChannel,
  NftOwnerMember,
  NftSellOrderMadeEventData,
  OpenAuctionBidAcceptedEventData,
  OpenAuctionStartedEventData,
  TransactionalStatusAuction,
  TransactionalStatusBuyNow,
  TransactionalStatusIdle,
  TransactionalStatusInitiatedOfferToMember,
} from '../../model'
import { genericEventFields } from '../utils'

export async function processOpenAuctionStartedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId, auctionParams],
  },
}: EventHandlerContext<'Content.OpenAuctionStarted'>): Promise<void> {
  // load the nft
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  // create auction
  const auction = createAuction(ec, block, nft, auctionParams)

  nft.transactionalStatus = new TransactionalStatusAuction({
    auction: auction.id,
  })

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new OpenAuctionStartedEventData({
        actor: parseContentActor(contentActor),
        auction: auction.id,
        nftOwner: nft.owner,
      }),
    })
  )
}

export async function processEnglishAuctionStartedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId, auctionParams],
  },
}: EventHandlerContext<'Content.EnglishAuctionStarted'>): Promise<void> {
  // load nft
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  // create new auction
  const auction = createAuction(ec, block, nft, auctionParams)

  nft.transactionalStatus = new TransactionalStatusAuction({
    auction: auction.id,
  })

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new EnglishAuctionStartedEventData({
        actor: parseContentActor(contentActor),
        auction: auction.id,
        nftOwner: nft.owner,
      }),
    })
  )
}

export async function processNftIssuedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [actor, videoId, nftIssuanceParameters],
  },
}: EventHandlerContext<'Content.NftIssued'>): Promise<void> {
  // load video
  const video = await ec.collections.Video.getOrFail(videoId.toString(), {
    channel: { ownerMember: true },
  })

  // prepare the new nft
  processNft(ec, block, indexInBlock, extrinsicHash, video, actor, nftIssuanceParameters)
}

export async function processAuctionBidMadeEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, videoId, bidAmount],
  },
}: EventHandlerContext<'Content.AuctionBidMade'>): Promise<void> {
  // create a new bid
  const bid = await createBid(
    ec,
    block,
    indexInBlock,
    memberId.toString(),
    videoId.toString(),
    bidAmount
  )
  const { auction } = bid

  // extend auction duration when needed
  if (
    auction.auctionType.isTypeOf === 'AuctionTypeEnglish' &&
    auction.auctionType.plannedEndAtBlock - auction.auctionType.extensionPeriod <= block.height
  ) {
    auction.auctionType.plannedEndAtBlock += auction.auctionType.extensionPeriod
  }

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new AuctionBidMadeEventData({
        bid: bid.id,
        nftOwner: auction.nft.owner,
      }),
    })
  )
}

export async function processAuctionBidCanceledEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, videoId],
  },
}: EventHandlerContext<'Content.AuctionBidCanceled'>): Promise<void> {
  const bid = await ec.collections.Bid.getOrFailWhere(
    {
      bidder: { id: memberId.toString() },
      nft: { id: videoId.toString() },
      isCanceled: false,
    },
    {
      bidder: true,
      auction: {
        topBid: true,
        bids: {
          bidder: true,
        },
      },
      nft: true,
    }
  )

  const {
    auction,
    nft: { owner },
  } = bid

  bid.isCanceled = true

  if (auction.topBid && bid.id === auction.topBid.id) {
    // find new top bid (bid reference in auction.bids should already be up to date)
    auction.topBid = findTopBid(auction.bids)
    ec.collections.Auction.push(auction)
  }

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new AuctionBidCanceledEventData({
        bid: bid.id,
        member: memberId.toString(),
        nftOwner: owner,
      }),
    })
  )
}

export async function processAuctionCanceledEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId],
  },
}: EventHandlerContext<'Content.AuctionCanceled'>): Promise<void> {
  // load video and auction
  const auction = await getCurrentAuctionFromVideo(ec, videoId.toString(), { nft: true })

  auction.nft.transactionalStatus = new TransactionalStatusIdle()
  // mark auction as canceled
  auction.isCanceled = true

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new AuctionCanceledEventData({
        actor: parseContentActor(contentActor),
        auction: auction.id,
        nftOwner: auction.nft.owner,
      }),
    })
  )
}

export async function processEnglishAuctionSettledEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [winnerId, , videoId],
  },
}: EventHandlerContext<'Content.EnglishAuctionSettled'>): Promise<void> {
  // finish auction
  const { winningBid, auction, previousNftOwner } = await finishAuction(
    ec,
    videoId.toString(),
    block
  )

  if (winnerId.toString() !== winningBid.bidder.id) {
    criticalError(`Unexpected english auction winner of auction ${auction.id}.`, {
      eventWinnerId: winnerId.toString(),
      queryNodeTopBidder: winnerId,
    })
  }

  // set last sale
  auction.nft.lastSalePrice = winningBid.amount
  auction.nft.lastSaleDate = new Date(block.timestamp)

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new EnglishAuctionSettledEventData({
        previousNftOwner,
        winningBid: winningBid.id,
      }),
    })
  )
}

// called when auction bid's value is higher than buy-now value
export async function processBidMadeCompletingAuctionEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, videoId],
  },
}: EventHandlerContext<'Content.BidMadeCompletingAuction'>): Promise<void> {
  // create record for winning bid
  const bid = await createBid(ec, block, indexInBlock, memberId.toString(), videoId.toString())

  // finish auction and transfer ownership
  const { auction, winningBid, previousNftOwner } = await finishAuction(
    ec,
    videoId.toString(),
    block
  )

  // set last sale
  auction.nft.lastSalePrice = winningBid.amount
  auction.nft.lastSaleDate = new Date(block.timestamp)

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new BidMadeCompletingAuctionEventData({
        previousNftOwner,
        winningBid: bid.id,
      }),
    })
  )
}

export async function processOpenAuctionBidAcceptedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, videoId, winnerId, bidAmount],
  },
}: EventHandlerContext<'Content.OpenAuctionBidAccepted'>): Promise<void> {
  // finish auction
  const { auction, previousNftOwner, winningBid } = await finishAuction(
    ec,
    videoId.toString(),
    block,
    {
      bidAmount,
      winnerId,
    }
  )

  // set last sale
  auction.nft.lastSalePrice = winningBid.amount
  auction.nft.lastSaleDate = new Date(block.timestamp)

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new OpenAuctionBidAcceptedEventData({
        actor: parseContentActor(contentActor),
        previousNftOwner,
        winningBid: winningBid.id,
      }),
    })
  )
}

export async function processOfferStartedEvent({
  ec,
  event: {
    asV1000: [videoId, , memberId, price],
  },
}: EventHandlerContext<'Content.OfferStarted'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  // update NFT transactional status
  const transactionalStatus = new TransactionalStatusInitiatedOfferToMember({
    member: memberId.toString(),
    price,
  })
  nft.transactionalStatus = transactionalStatus

  // FIXME: No event?
}

export async function processOfferAcceptedEvent({
  ec,
  block,
  event: { asV1000: videoId },
}: EventHandlerContext<'Content.OfferAccepted'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

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

  // FIXME: No event?
}

export async function processOfferCanceledEvent({
  ec,
  event: {
    asV1000: [videoId],
  },
}: EventHandlerContext<'Content.OfferCanceled'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  // update NFT's transactional status
  nft.transactionalStatus = new TransactionalStatusIdle()

  // FIXME: No event?
}

export async function processNftSellOrderMadeEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, contentActor, price],
  },
}: EventHandlerContext<'Content.NftSellOrderMade'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  // update NFT transactional status
  const transactionalStatus = new TransactionalStatusBuyNow({
    price,
  })
  nft.transactionalStatus = transactionalStatus

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new NftSellOrderMadeEventData({
        actor: parseContentActor(contentActor),
        nft: nft.id,
        nftOwner: nft.owner,
        price,
      }),
    })
  )
}

export async function processNftBoughtEvent({
  ec,
  event: {
    asV1000: [videoId, memberId],
  },
  block,
  indexInBlock,
  extrinsicHash,
}: EventHandlerContext<'Content.NftBought'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

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
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new NftBoughtEventData({
        buyer: memberId.toString(),
        nft: nft.id,
        previousNftOwner,
        price,
      }),
    })
  )
}

export async function processBuyNowCanceledEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, contentActor],
  },
}: EventHandlerContext<'Content.BuyNowCanceled'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  // Update stauts
  nft.transactionalStatus = new TransactionalStatusIdle()

  // add new event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new BuyNowCanceledEventData({
        actor: parseContentActor(contentActor),
        nft: nft.id,
        nftOwner: nft.owner,
      }),
    })
  )
}

export async function processBuyNowPriceUpdatedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [videoId, contentActor, newPrice],
  },
}: EventHandlerContext<'Content.BuyNowPriceUpdated'>): Promise<void> {
  // load NFT
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString())

  if (nft.transactionalStatus?.isTypeOf !== 'TransactionalStatusBuyNow') {
    criticalError(`Unexpected transactional status of NFT ${videoId.toString()}.`, {
      expected: 'TransactionalStatusBuyNow',
      got: nft.transactionalStatus?.isTypeOf,
    })
  }

  nft.transactionalStatus = new TransactionalStatusBuyNow({ price: newPrice })

  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new BuyNowPriceUpdatedEventData({
        actor: parseContentActor(contentActor),
        newPrice,
        nft: nft.id,
        nftOwner: nft.owner,
      }),
    })
  )
}

export async function processNftSlingedBackToTheOriginalArtistEvent({
  ec,
  event: {
    asV1000: [videoId],
  },
}: EventHandlerContext<'Content.NftSlingedBackToTheOriginalArtist'>): Promise<void> {
  const nft = await ec.collections.OwnedNft.getOrFail(videoId.toString(), {
    video: { channel: true },
  })

  nft.owner = new NftOwnerChannel({ channel: nft.video.channel.id })

  // FIXME: No event?
}
