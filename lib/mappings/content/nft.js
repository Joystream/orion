"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNftSlingedBackToTheOriginalArtistEvent = exports.processBuyNowPriceUpdatedEvent = exports.processBuyNowCanceledEvent = exports.processNftBoughtEvent = exports.processNftSellOrderMadeEvent = exports.processOfferCanceledEvent = exports.processOfferAcceptedEvent = exports.processOfferStartedEvent = exports.processOpenAuctionBidAcceptedEvent = exports.processBidMadeCompletingAuctionEvent = exports.processEnglishAuctionSettledEvent = exports.processAuctionCanceledEvent = exports.processAuctionBidCanceledEvent = exports.processAuctionBidMadeEvent = exports.processNftIssuedEvent = exports.processEnglishAuctionStartedEvent = exports.processOpenAuctionStartedEvent = void 0;
const misc_1 = require("../../utils/misc");
const utils_1 = require("./utils");
const model_1 = require("../../model");
const utils_2 = require("../utils");
const substrate_processor_1 = require("@subsquid/substrate-processor");
async function processOpenAuctionStartedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [contentActor, videoId, auctionParams], }, }) {
    // load the nft
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // create auction
    const auction = await (0, utils_1.createAuction)(overlay, block, nft, auctionParams);
    nft.transactionalStatus = new model_1.TransactionalStatusAuction({
        auction: auction.id,
    });
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.OpenAuctionStartedEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            auction: auction.id,
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processOpenAuctionStartedEvent = processOpenAuctionStartedEvent;
async function processEnglishAuctionStartedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [contentActor, videoId, auctionParams], }, }) {
    // load nft
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // create new auction
    const auction = await (0, utils_1.createAuction)(overlay, block, nft, auctionParams);
    nft.transactionalStatus = new model_1.TransactionalStatusAuction({
        auction: auction.id,
    });
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.EnglishAuctionStartedEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            auction: auction.id,
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processEnglishAuctionStartedEvent = processEnglishAuctionStartedEvent;
async function processNftIssuedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [actor, videoId, nftIssuanceParameters], }, }) {
    // load video
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail(videoId.toString());
    // prepare the new nft
    await (0, utils_1.processNft)(overlay, block, indexInBlock, extrinsicHash, video, actor, nftIssuanceParameters);
}
exports.processNftIssuedEvent = processNftIssuedEvent;
async function processAuctionBidMadeEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [memberId, videoId, bidAmount], }, }) {
    // create a new bid
    const { bid, auction, previousTopBid } = await (0, utils_1.createBid)(overlay, block, indexInBlock, memberId.toString(), videoId.toString(), bidAmount);
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // extend auction duration when needed
    if (auction.auctionType.isTypeOf === 'AuctionTypeEnglish' &&
        auction.auctionType.plannedEndAtBlock - auction.auctionType.extensionPeriod <= block.height) {
        auction.auctionType.plannedEndAtBlock += auction.auctionType.extensionPeriod;
    }
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.AuctionBidMadeEventData({
            bid: bid.id,
            nftOwner: nft.owner,
        }),
    });
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    // Notify outbidded member and the nft owner
    (0, utils_2.addNotification)(overlay, [previousTopBid?.bidderId, nftOwnerMemberId], event.id);
    // Add nft history and activities entry
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [bid.bidderId, previousTopBid?.bidderId], event.id);
}
exports.processAuctionBidMadeEvent = processAuctionBidMadeEvent;
async function processAuctionBidCanceledEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [memberId, videoId], }, }) {
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // FIXME: Allow specifying multiple relations in a single "query" (in this case both `bidderId` and `nftId`)
    const memberBids = await overlay
        .getRepository(model_1.Bid)
        .getManyByRelation('bidderId', memberId.toString());
    const memberBid = (0, substrate_processor_1.assertNotNull)(memberBids.find((b) => b.nftId === videoId.toString() && b.isCanceled === false), `Cannot cancel auction bid: Bid by member ${memberId.toString()} for nft ${videoId} not found`);
    const auction = await overlay
        .getRepository(model_1.Auction)
        .getByIdOrFail((0, substrate_processor_1.assertNotNull)(memberBid.auctionId));
    const auctionBids = await overlay.getRepository(model_1.Bid).getManyByRelation('auctionId', auction.id);
    memberBid.isCanceled = true;
    if (auction.topBidId && memberBid.id === auction.topBidId) {
        // find new top bid
        auction.topBidId = (0, utils_1.findTopBid)(auctionBids)?.id || null;
    }
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.AuctionBidCanceledEventData({
            bid: memberBid.id,
            member: memberId.toString(),
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [memberId.toString()], event.id);
}
exports.processAuctionBidCanceledEvent = processAuctionBidCanceledEvent;
async function processAuctionCanceledEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [contentActor, videoId], }, }) {
    // load nft and auction
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    const auction = await (0, utils_1.getCurrentAuctionFromVideo)(overlay, videoId.toString());
    nft.transactionalStatus = new model_1.TransactionalStatusIdle();
    // mark auction as canceled
    auction.isCanceled = true;
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.AuctionCanceledEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            auction: auction.id,
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processAuctionCanceledEvent = processAuctionCanceledEvent;
async function processEnglishAuctionSettledEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [winnerId, , videoId], }, }) {
    // finish auction
    const { winningBid, auction, previousNftOwner, nft, auctionBids } = await (0, utils_1.finishAuction)(overlay, videoId.toString(), block);
    if (winnerId.toString() !== winningBid.bidderId) {
        (0, misc_1.criticalError)(`Unexpected english auction winner of auction ${auction.id}.`, {
            eventWinnerId: winnerId.toString(),
            queryNodeTopBidder: winnerId,
        });
    }
    // set last sale
    nft.lastSalePrice = winningBid.amount;
    nft.lastSaleDate = new Date(block.timestamp);
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.EnglishAuctionSettledEventData({
            previousNftOwner,
            winningBid: winningBid.id,
        }),
    });
    // Notfy all bidders and the (previous) nft owner
    const previousNftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, previousNftOwner);
    (0, utils_2.addNotification)(overlay, [previousNftOwnerMemberId, ...auctionBids.map((b) => b.bidderId)], event.id);
    // Add nft history and activities entry
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [previousNftOwnerMemberId, winnerId.toString()], event.id);
}
exports.processEnglishAuctionSettledEvent = processEnglishAuctionSettledEvent;
// called when auction bid's value is higher than buy-now value
async function processBidMadeCompletingAuctionEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [memberId, videoId], }, }) {
    // create record for winning bid
    const { bid, auctionBids } = await (0, utils_1.createBid)(overlay, block, indexInBlock, memberId.toString(), videoId.toString());
    // finish auction and transfer ownership
    const { nft, winningBid, previousNftOwner } = await (0, utils_1.finishAuction)(overlay, videoId.toString(), block);
    // set last sale
    nft.lastSalePrice = winningBid.amount;
    nft.lastSaleDate = new Date(block.timestamp);
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.BidMadeCompletingAuctionEventData({
            previousNftOwner,
            winningBid: bid.id,
        }),
    });
    // Notify all bidders and the (previous) nft owner
    const previousNftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, previousNftOwner);
    (0, utils_2.addNotification)(overlay, [previousNftOwnerMemberId, ...auctionBids.map((b) => b.bidderId)], event.id);
    // Add nft history and activities entry
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [previousNftOwnerMemberId, memberId.toString()], event.id);
}
exports.processBidMadeCompletingAuctionEvent = processBidMadeCompletingAuctionEvent;
async function processOpenAuctionBidAcceptedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [contentActor, videoId, winnerId, bidAmount], }, }) {
    // finish auction
    const { previousNftOwner, winningBid, nft, auctionBids } = await (0, utils_1.finishAuction)(overlay, videoId.toString(), block, {
        bidAmount,
        winnerId,
    });
    // set last sale
    nft.lastSalePrice = winningBid.amount;
    nft.lastSaleDate = new Date(block.timestamp);
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.OpenAuctionBidAcceptedEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            previousNftOwner,
            winningBid: winningBid.id,
        }),
    });
    // Notify all bidders (the owner should be the one who triggered the event)
    const previousNftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, previousNftOwner);
    (0, utils_2.addNotification)(overlay, auctionBids.map((b) => b.bidderId), event.id);
    // Add nft history and activities entry
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [previousNftOwnerMemberId, winnerId.toString()], event.id);
}
exports.processOpenAuctionBidAcceptedEvent = processOpenAuctionBidAcceptedEvent;
async function processOfferStartedEvent({ overlay, event: { asV1000: [videoId, , memberId, price], }, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // update NFT transactional status
    const transactionalStatus = new model_1.TransactionalStatusInitiatedOfferToMember({
        member: memberId.toString(),
        price,
    });
    nft.transactionalStatus = transactionalStatus;
    // FIXME: No event?
}
exports.processOfferStartedEvent = processOfferStartedEvent;
async function processOfferAcceptedEvent({ overlay, block, event: { asV1000: videoId }, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // read member from offer
    const memberId = nft.transactionalStatus.member;
    // read price from offer
    const price = nft.transactionalStatus.price;
    if (price) {
        // set last sale
        nft.lastSalePrice = price;
        nft.lastSaleDate = new Date(block.timestamp);
    }
    // update NFT's transactional status
    nft.transactionalStatus = new model_1.TransactionalStatusIdle();
    nft.owner = new model_1.NftOwnerMember({ member: memberId });
    // FIXME: No event?
}
exports.processOfferAcceptedEvent = processOfferAcceptedEvent;
async function processOfferCanceledEvent({ overlay, event: { asV1000: [videoId], }, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // update NFT's transactional status
    nft.transactionalStatus = new model_1.TransactionalStatusIdle();
    // FIXME: No event?
}
exports.processOfferCanceledEvent = processOfferCanceledEvent;
async function processNftSellOrderMadeEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [videoId, contentActor, price], }, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // update NFT transactional status
    const transactionalStatus = new model_1.TransactionalStatusBuyNow({
        price,
    });
    nft.transactionalStatus = transactionalStatus;
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.NftSellOrderMadeEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            nft: nft.id,
            nftOwner: nft.owner,
            price,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processNftSellOrderMadeEvent = processNftSellOrderMadeEvent;
async function processNftBoughtEvent({ overlay, event: { asV1000: [videoId, memberId], }, block, indexInBlock, extrinsicHash, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // NFT bought price
    const price = nft.transactionalStatus.price;
    // set last sale
    nft.lastSalePrice = price;
    nft.lastSaleDate = new Date(block.timestamp);
    // update NFT's transactional status
    nft.transactionalStatus = new model_1.TransactionalStatusIdle();
    // update NFT's owner
    const previousNftOwner = nft.owner;
    nft.owner = new model_1.NftOwnerMember({ member: memberId.toString() });
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.NftBoughtEventData({
            buyer: memberId.toString(),
            nft: nft.id,
            previousNftOwner,
            price,
        }),
    });
    // Notify (previous) nft owner
    const previousNftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, previousNftOwner);
    (0, utils_2.addNotification)(overlay, [previousNftOwnerMemberId], event.id);
    // Add nft history and activities entry
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [previousNftOwnerMemberId, memberId.toString()], event.id);
}
exports.processNftBoughtEvent = processNftBoughtEvent;
async function processBuyNowCanceledEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [videoId, contentActor], }, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    // Update stauts
    nft.transactionalStatus = new model_1.TransactionalStatusIdle();
    // add new event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.BuyNowCanceledEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            nft: nft.id,
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processBuyNowCanceledEvent = processBuyNowCanceledEvent;
async function processBuyNowPriceUpdatedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [videoId, contentActor, newPrice], }, }) {
    // load NFT
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    if (nft.transactionalStatus?.isTypeOf !== 'TransactionalStatusBuyNow') {
        (0, misc_1.criticalError)(`Unexpected transactional status of NFT ${videoId.toString()}.`, {
            expected: 'TransactionalStatusBuyNow',
            got: nft.transactionalStatus?.isTypeOf,
        });
    }
    nft.transactionalStatus = new model_1.TransactionalStatusBuyNow({ price: newPrice });
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.BuyNowPriceUpdatedEventData({
            actor: (0, utils_1.parseContentActor)(contentActor),
            newPrice,
            nft: nft.id,
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await (0, utils_1.getNftOwnerMemberId)(overlay, nft.owner);
    (0, utils_2.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_2.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processBuyNowPriceUpdatedEvent = processBuyNowPriceUpdatedEvent;
async function processNftSlingedBackToTheOriginalArtistEvent({ overlay, event: { asV1000: [videoId], }, }) {
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId.toString());
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail(videoId.toString());
    nft.owner = new model_1.NftOwnerChannel({ channel: (0, substrate_processor_1.assertNotNull)(video.channelId) });
    // FIXME: No event?
}
exports.processNftSlingedBackToTheOriginalArtistEvent = processNftSlingedBackToTheOriginalArtistEvent;
//# sourceMappingURL=nft.js.map