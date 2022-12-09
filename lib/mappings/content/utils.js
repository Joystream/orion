"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeAssets = exports.processAppActionMetadata = exports.finishAuction = exports.getNftOwnerMemberId = exports.getChannelOwnerMemberByChannelId = exports.getChannelOwnerMemberByVideoId = exports.createBid = exports.findTopBid = exports.getCurrentAuctionFromVideo = exports.parseContentActor = exports.createAuction = exports.processNftInitialTransactionalStatus = exports.processNft = exports.deleteVideo = exports.deleteChannel = exports.ASSETS_MAP = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const model_1 = require("../../model");
const misc_1 = require("../../utils/misc");
const utils_1 = require("../utils");
const substrate_processor_1 = require("@subsquid/substrate-processor");
const util_crypto_1 = require("@polkadot/util-crypto");
const utils_2 = require("@joystream/metadata-protobuf/utils");
const types_1 = require("@joystream/types");
const bn_js_1 = __importDefault(require("bn.js"));
exports.ASSETS_MAP = {
    channel: [
        {
            DataObjectTypeConstructor: model_1.DataObjectTypeChannelAvatar,
            entityProperty: 'avatarPhotoId',
            metaProperty: 'avatarPhoto',
            createDataObjectType: (e) => new model_1.DataObjectTypeChannelAvatar({ channel: e.id }),
        },
        {
            DataObjectTypeConstructor: model_1.DataObjectTypeChannelCoverPhoto,
            entityProperty: 'coverPhotoId',
            metaProperty: 'coverPhoto',
            createDataObjectType: (e) => new model_1.DataObjectTypeChannelCoverPhoto({ channel: e.id }),
        },
    ],
    video: [
        {
            DataObjectTypeConstructor: model_1.DataObjectTypeVideoMedia,
            entityProperty: 'mediaId',
            metaProperty: 'video',
            createDataObjectType: (e) => new model_1.DataObjectTypeVideoMedia({ video: e.id }),
        },
        {
            DataObjectTypeConstructor: model_1.DataObjectTypeVideoThumbnail,
            entityProperty: 'thumbnailPhotoId',
            metaProperty: 'thumbnailPhoto',
            createDataObjectType: (e) => new model_1.DataObjectTypeVideoThumbnail({ video: e.id }),
        },
    ],
    subtitle: [
        {
            DataObjectTypeConstructor: model_1.DataObjectTypeVideoSubtitle,
            entityProperty: 'assetId',
            metaProperty: 'newAsset',
            createDataObjectType: (e) => new model_1.DataObjectTypeVideoSubtitle({ video: (0, substrate_processor_1.assertNotNull)(e.videoId), subtitle: e.id }),
        },
    ],
};
async function deleteChannel(overlay, channelId) {
    const bannedMembers = await overlay
        .getRepository(model_1.BannedMember)
        .getManyByRelation('channelId', channelId.toString());
    overlay.getRepository(model_1.BannedMember).remove(...bannedMembers);
    overlay.getRepository(model_1.Channel).remove(channelId.toString());
}
exports.deleteChannel = deleteChannel;
async function deleteVideo(overlay, videoId) {
    const videoRepository = overlay.getRepository(model_1.Video);
    const commentRepository = overlay.getRepository(model_1.Comment);
    const commentReactionRepository = overlay.getRepository(model_1.CommentReaction);
    const licenseRepository = overlay.getRepository(model_1.License);
    const videoReactionRepository = overlay.getRepository(model_1.VideoReaction);
    const mediaMetadataRepository = overlay.getRepository(model_1.VideoMediaMetadata);
    const mediaEncodingRepository = overlay.getRepository(model_1.VideoMediaEncoding);
    const subtitlesRepository = overlay.getRepository(model_1.VideoSubtitle);
    const notificationRepository = overlay.getRepository(model_1.Notification);
    const em = overlay.getEm();
    const video = await videoRepository.getByIdOrFail(videoId.toString());
    const comments = await commentRepository.getManyByRelation('videoId', video.id);
    const commentReactions = await commentReactionRepository.getManyByRelation('videoId', video.id);
    const videoReactions = await videoReactionRepository.getManyByRelation('videoId', video.id);
    const mediaMetadata = await mediaMetadataRepository.getOneByRelation('videoId', video.id);
    const mediaEncoding = await mediaEncodingRepository.getById(mediaMetadata?.encodingId || '');
    const subtitles = await subtitlesRepository.getManyByRelation('videoId', video.id);
    // Events to remove
    const eventsToRemove = [];
    const notificationsToRemove = [];
    if (comments.length) {
        // FIXME: We need to persist the state to get all CommentCreated/CommentTextUpdated events,
        // as the relationship is nested inside jsonb field, so we can't use any existing RepositoryOverlay methods.
        await overlay.updateDatabase();
        const relatedEvents = await em
            .getRepository(model_1.Event)
            .createQueryBuilder('e')
            .where(`e.data->>'comment' IN (${comments.map((c, i) => `:cid_${i}`).join(', ')})`)
            .setParameters(Object.fromEntries(comments.map((c, i) => [`cid_${i}`, c.id])))
            .getMany();
        eventsToRemove.push(...relatedEvents);
        const relatedNotifications = (await Promise.all(eventsToRemove.map((e) => notificationRepository.getManyByRelation('eventId', e.id)))).flat();
        notificationsToRemove.push(...relatedNotifications);
    }
    commentReactionRepository.remove(...commentReactions);
    commentRepository.remove(...comments);
    if (video.licenseId) {
        licenseRepository.remove(video.licenseId);
    }
    videoReactionRepository.remove(...videoReactions);
    if (mediaMetadata?.id) {
        mediaMetadataRepository.remove(mediaMetadata.id);
    }
    if (mediaEncoding?.id) {
        mediaEncodingRepository.remove(mediaEncoding.id);
    }
    subtitlesRepository.remove(...subtitles);
    videoRepository.remove(video);
    notificationRepository.remove(...notificationsToRemove);
    overlay.getRepository(model_1.Event).remove(...eventsToRemove);
}
exports.deleteVideo = deleteVideo;
async function processNft(overlay, block, indexInBlock, extrinsicHash, video, issuer, nftIssuanceParameters) {
    const owner = nftIssuanceParameters.nonChannelOwner !== undefined
        ? new model_1.NftOwnerMember({ member: nftIssuanceParameters.nonChannelOwner.toString() })
        : new model_1.NftOwnerChannel({ channel: (0, substrate_processor_1.assertNotNull)(video.channelId) });
    const creatorRoyalty = nftIssuanceParameters.royalty !== undefined
        ? // Royalty type is Perbill (1/10^9), so we divide by 10^7 to get Percent
            nftIssuanceParameters.royalty / Math.pow(10, 7)
        : undefined;
    const nftRepository = overlay.getRepository(model_1.OwnedNft);
    const nft = nftRepository.new({
        id: video.id,
        videoId: video.id,
        creatorRoyalty,
        owner,
        createdAt: new Date(block.timestamp),
        isFeatured: false,
    });
    // update NFT transactional status
    processNftInitialTransactionalStatus(overlay, block, nft, nftIssuanceParameters.initTransactionalStatus);
    // Push a new NftIssued event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.NftIssuedEventData({
            actor: parseContentActor(issuer),
            nft: nft.id,
            nftOwner: nft.owner,
        }),
    });
    // Add nft history and activities entry
    const nftOwnerMemberId = await getNftOwnerMemberId(overlay, nft.owner);
    (0, utils_1.addNftHistoryEntry)(overlay, nft.id, event.id);
    (0, utils_1.addNftActivity)(overlay, [nftOwnerMemberId], event.id);
}
exports.processNft = processNft;
function processNftInitialTransactionalStatus(overlay, block, nft, transactionalStatus) {
    switch (transactionalStatus.__kind) {
        case 'Idle': {
            nft.transactionalStatus = new model_1.TransactionalStatusIdle();
            return;
        }
        case 'InitiatedOfferToMember': {
            const [memberId, price] = transactionalStatus.value;
            nft.transactionalStatus = new model_1.TransactionalStatusInitiatedOfferToMember({
                member: memberId.toString(),
                price,
            });
            return;
        }
        case 'OpenAuction':
        case 'EnglishAuction': {
            const auctionParams = transactionalStatus.value;
            const auction = createAuction(overlay, block, nft, auctionParams);
            // create new auction
            nft.transactionalStatus = new model_1.TransactionalStatusAuction({
                auction: auction.id,
            });
            return;
        }
        case 'BuyNow': {
            nft.transactionalStatus = new model_1.TransactionalStatusBuyNow({ price: transactionalStatus.value });
            return;
        }
        default: {
            (0, misc_1.criticalError)(`Unknown TransactionalStatus type`, { transactionalStatus });
        }
    }
}
exports.processNftInitialTransactionalStatus = processNftInitialTransactionalStatus;
function createAuction(overlay, block, nft, auctionParams) {
    const startsAtBlock = auctionParams.startsAt ?? block.height;
    const auctionRepository = overlay.getRepository(model_1.Auction);
    // prepare auction record
    const auction = auctionRepository.new({
        id: auctionRepository.getNewEntityId(),
        nftId: nft.id,
        startingPrice: auctionParams.startingPrice,
        buyNowPrice: auctionParams.buyNowPrice,
        auctionType: createAuctionType(block, auctionParams),
        startsAtBlock,
        isCanceled: false,
        isCompleted: false,
    });
    auctionParams.whitelist.forEach((m) => overlay.getRepository(model_1.AuctionWhitelistedMember).new({
        id: `${m.toString()}-${auction.id}`,
        memberId: m.toString(),
        auctionId: auction.id,
    }));
    return auction;
}
exports.createAuction = createAuction;
function createAuctionType(block, auctionParams) {
    const startsAtBlock = auctionParams.startsAt ?? block.height;
    // auction type `english`
    if ('duration' in auctionParams) {
        return new model_1.AuctionTypeEnglish({
            duration: auctionParams.duration,
            extensionPeriod: auctionParams.extensionPeriod,
            minimalBidStep: auctionParams.minBidStep,
            plannedEndAtBlock: startsAtBlock + auctionParams.duration,
        });
    }
    // auction type `open`
    return new model_1.AuctionTypeOpen({
        bidLockDuration: auctionParams.bidLockDuration,
    });
}
function parseContentActor(contentActor) {
    if (contentActor.__kind === 'Member') {
        return new model_1.ContentActorMember({
            member: contentActor.value.toString(),
        });
    }
    if (contentActor.__kind === 'Curator') {
        const [, curatorId] = contentActor.value;
        return new model_1.ContentActorCurator({
            curator: curatorId.toString(),
        });
    }
    if (contentActor.__kind === 'Lead') {
        return new model_1.ContentActorLead();
    }
    (0, misc_1.criticalError)('Unknown ContentActor type', { contentActor });
}
exports.parseContentActor = parseContentActor;
async function getCurrentAuctionFromVideo(overlay, videoId) {
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId);
    if (nft.transactionalStatus?.isTypeOf !== 'TransactionalStatusAuction') {
        (0, misc_1.criticalError)(`Nft of video ${videoId} was expected to be in TransactionalStatusAuction.`, {
            actualStatus: nft.transactionalStatus?.isTypeOf,
        });
    }
    return overlay.getRepository(model_1.Auction).getByIdOrFail(nft.transactionalStatus.auction);
}
exports.getCurrentAuctionFromVideo = getCurrentAuctionFromVideo;
function findTopBid(bids) {
    return bids.reduce((topBid, bid) => {
        if (bid.isCanceled) {
            return topBid;
        }
        if (!topBid) {
            return bid;
        }
        if (topBid.amount > bid.amount) {
            return topBid;
        }
        if (topBid.amount < bid.amount) {
            return bid;
        }
        // bids are equal, use the oldest one
        return topBid.createdInBlock < bid.createdInBlock ||
            (topBid.createdInBlock === bid.createdInBlock && topBid.indexInBlock < bid.indexInBlock)
            ? topBid
            : bid;
    }, null);
}
exports.findTopBid = findTopBid;
async function createBid(overlay, block, indexInBlock, memberId, videoId, bidAmount) {
    const auction = await getCurrentAuctionFromVideo(overlay, videoId);
    const bidRepository = overlay.getRepository(model_1.Bid);
    const auctionBids = await bidRepository.getManyByRelation('auctionId', auction.id);
    // cancel any previous bids done by same member
    auctionBids
        .filter((b) => b.bidderId === memberId && !b.isCanceled)
        .forEach((b) => {
        b.isCanceled = true;
    });
    const amount = bidAmount ?? auction.buyNowPrice;
    const previousTopBidId = auction.topBidId;
    // prepare bid record
    const newBid = bidRepository.new({
        id: bidRepository.getNewEntityId(),
        createdAt: new Date(block.timestamp),
        auctionId: auction.id,
        nftId: videoId,
        bidderId: memberId,
        amount,
        createdInBlock: block.height,
        isCanceled: false,
        indexInBlock,
    });
    auctionBids.push(newBid);
    // check if the auction's top bid needs to be updated, this can happen in those cases:
    // 1. auction doesn't have the top bid at the moment, new bid should be new top bid
    // 2. new bid is higher than the current top bid
    // 3. new bid canceled previous top bid (user changed their bid to a lower one), so we need to find a new one
    const previousTopBid = auctionBids.find((b) => b.id === previousTopBidId);
    if (!previousTopBid || newBid.amount > previousTopBid.amount) {
        // handle cases 1 and 2
        auction.topBidId = newBid.id;
    }
    else {
        // handle case 3
        auction.topBidId = findTopBid(auctionBids)?.id || null;
    }
    // Only set previous top bid if auction.topBid has been updated
    // and the action type is AuctionTypeEnglish
    if (auction.topBidId !== previousTopBidId &&
        auction.auctionType.isTypeOf === 'AuctionTypeEnglish') {
        newBid.previousTopBidId = previousTopBidId;
        return { bid: newBid, auction, previousTopBid, auctionBids };
    }
    return { bid: newBid, auction, auctionBids };
}
exports.createBid = createBid;
async function getChannelOwnerMemberByVideoId(overlay, videoId) {
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail(videoId);
    if (video.channelId) {
        return getChannelOwnerMemberByChannelId(overlay, video.channelId);
    }
}
exports.getChannelOwnerMemberByVideoId = getChannelOwnerMemberByVideoId;
async function getChannelOwnerMemberByChannelId(overlay, channelId) {
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId);
    return channel.ownerMemberId ?? undefined;
}
exports.getChannelOwnerMemberByChannelId = getChannelOwnerMemberByChannelId;
async function getNftOwnerMemberId(overlay, nftOwner) {
    return nftOwner.isTypeOf === 'NftOwnerMember'
        ? nftOwner.member
        : getChannelOwnerMemberByChannelId(overlay, nftOwner.channel);
}
exports.getNftOwnerMemberId = getNftOwnerMemberId;
async function finishAuction(overlay, videoId, block, openAuctionWinner) {
    function findOpenAuctionWinningBid(bids, bidAmount, winnerId, videoId) {
        const winningBid = bids.find((bid) => !bid.isCanceled && bid.bidderId === winnerId && bid.amount === bidAmount);
        if (!winningBid) {
            (0, misc_1.criticalError)(`Open auction won by non-existing bid!`, {
                videoId,
                bidAmount,
                winnerId,
            });
        }
        return winningBid;
    }
    // load video and auction
    const auction = await getCurrentAuctionFromVideo(overlay, videoId);
    const nft = await overlay.getRepository(model_1.OwnedNft).getByIdOrFail(videoId);
    const bidRepository = overlay.getRepository(model_1.Bid);
    const auctionBids = await bidRepository.getManyByRelation('auctionId', auction.id);
    const winningBid = openAuctionWinner
        ? findOpenAuctionWinningBid(auctionBids, openAuctionWinner.bidAmount, openAuctionWinner.winnerId.toString(), videoId)
        : (0, substrate_processor_1.assertNotNull)(auctionBids.find((b) => b.id === auction.topBidId));
    // update NFT's transactional status
    nft.transactionalStatus = new model_1.TransactionalStatusIdle();
    // update NFT owner
    const previousNftOwner = nft.owner;
    nft.owner = new model_1.NftOwnerMember({ member: (0, substrate_processor_1.assertNotNull)(winningBid.bidderId) });
    // update auction
    auction.isCompleted = true;
    auction.winningMemberId = winningBid.bidderId;
    auction.endedAtBlock = block.height;
    return { winningBid, nft, auction, previousNftOwner, auctionBids };
}
exports.finishAuction = finishAuction;
async function validateAndGetApp(overlay, expectedSignedCommitment, appAction) {
    // If one is missing we cannot verify the signature
    if (!appAction.appId || !appAction.signature) {
        (0, utils_1.invalidMetadata)(metadata_protobuf_1.AppAction, 'Missing action fields to verify app', { decodedMessage: appAction });
        return undefined;
    }
    const app = await overlay.getRepository(model_1.App).getById(appAction.appId);
    if (!app) {
        (0, utils_1.invalidMetadata)(metadata_protobuf_1.AppAction, 'No app of given id found', { decodedMessage: appAction });
        return undefined;
    }
    if (!app.authKey) {
        (0, utils_1.invalidMetadata)(metadata_protobuf_1.AppAction, 'The provided app has no auth key assigned', {
            decodedMessage: appAction,
            app,
        });
        return undefined;
    }
    try {
        const isSignatureValid = (0, util_crypto_1.ed25519Verify)(expectedSignedCommitment, appAction.signature, app.authKey);
        if (!isSignatureValid) {
            (0, utils_1.invalidMetadata)(metadata_protobuf_1.AppAction, 'Invalid app action signature', { decodedMessage: appAction });
        }
        return isSignatureValid ? app : undefined;
    }
    catch (e) {
        (0, utils_1.invalidMetadata)(metadata_protobuf_1.AppAction, `Could not verify signature: ${e?.message}`, {
            decodedMessage: appAction,
        });
        return undefined;
    }
}
async function processAppActionMetadata(overlay, entity, meta, expectedSignedCommitment, entityMetadataProcessor) {
    const app = await validateAndGetApp(overlay, expectedSignedCommitment, meta);
    if (!app) {
        return entityMetadataProcessor(entity);
    }
    (0, utils_2.integrateMeta)(entity, { entryAppId: app.id }, ['entryAppId']);
    return entityMetadataProcessor(entity);
}
exports.processAppActionMetadata = processAppActionMetadata;
function encodeAssets(assets) {
    return (0, types_1.createType)('Option<PalletContentStorageAssetsRecord>', assets
        ? {
            expectedDataSizeFee: new bn_js_1.default(assets.expectedDataSizeFee.toString()),
            objectCreationList: assets.objectCreationList.map((o) => ({
                size_: new bn_js_1.default(o.size.toString()),
                ipfsContentId: Array.from(o.ipfsContentId),
            })),
        }
        : null).toU8a();
}
exports.encodeAssets = encodeAssets;
//# sourceMappingURL=utils.js.map