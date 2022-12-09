"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const substrate_processor_1 = require("@subsquid/substrate-processor");
const typeorm_store_1 = require("@subsquid/typeorm-store");
const logger_1 = require("./logger");
const storage_1 = require("./mappings/storage");
const channel_1 = require("./mappings/content/channel");
const video_1 = require("./mappings/content/video");
const nft_1 = require("./mappings/content/nft");
const membership_1 = require("./mappings/membership");
const misc_1 = require("./utils/misc");
const overlay_1 = require("./utils/overlay");
const events_1 = require("./utils/events");
const utils_1 = require("./mappings/utils");
const offchainState_1 = require("./utils/offchainState");
const defaultEventOptions = {
    data: {
        event: {
            args: true,
            indexInBlock: true,
            extrinsic: {
                hash: true,
            },
        },
    },
};
const archiveUrl = process.env.ARCHIVE_GATEWAY_URL || 'http://localhost:8888/graphql';
const maxCachedEntities = parseInt(process.env.MAX_CACHED_ENTITIES || '1000');
const processor = new substrate_processor_1.SubstrateBatchProcessor()
    .setDataSource({ archive: archiveUrl })
    .addEvent('Content.VideoCreated', defaultEventOptions);
// By adding other events separately, we sacrifice some type safety,
// but otherwise the compilation of this file takes forever.
processor.addEvent('Content.VideoUpdated', defaultEventOptions);
processor.addEvent('Content.VideoDeleted', defaultEventOptions);
processor.addEvent('Content.VideoDeletedByModerator', defaultEventOptions);
processor.addEvent('Content.VideoVisibilitySetByModerator', defaultEventOptions);
processor.addEvent('Content.ChannelCreated', defaultEventOptions);
processor.addEvent('Content.ChannelUpdated', defaultEventOptions);
processor.addEvent('Content.ChannelDeleted', defaultEventOptions);
processor.addEvent('Content.ChannelDeletedByModerator', defaultEventOptions);
processor.addEvent('Content.ChannelVisibilitySetByModerator', defaultEventOptions);
processor.addEvent('Content.ChannelOwnerRemarked', defaultEventOptions);
processor.addEvent('Content.ChannelAgentRemarked', defaultEventOptions);
processor.addEvent('Content.OpenAuctionStarted', defaultEventOptions);
processor.addEvent('Content.EnglishAuctionStarted', defaultEventOptions);
processor.addEvent('Content.NftIssued', defaultEventOptions);
processor.addEvent('Content.AuctionBidMade', defaultEventOptions);
processor.addEvent('Content.AuctionBidCanceled', defaultEventOptions);
processor.addEvent('Content.AuctionCanceled', defaultEventOptions);
processor.addEvent('Content.EnglishAuctionSettled', defaultEventOptions);
processor.addEvent('Content.BidMadeCompletingAuction', defaultEventOptions);
processor.addEvent('Content.OpenAuctionBidAccepted', defaultEventOptions);
processor.addEvent('Content.OfferStarted', defaultEventOptions);
processor.addEvent('Content.OfferAccepted', defaultEventOptions);
processor.addEvent('Content.OfferCanceled', defaultEventOptions);
processor.addEvent('Content.NftSellOrderMade', defaultEventOptions);
processor.addEvent('Content.NftBought', defaultEventOptions);
processor.addEvent('Content.BuyNowCanceled', defaultEventOptions);
processor.addEvent('Content.BuyNowPriceUpdated', defaultEventOptions);
processor.addEvent('Content.NftSlingedBackToTheOriginalArtist', defaultEventOptions);
processor.addEvent('Content.ChannelPayoutsUpdated', defaultEventOptions);
processor.addEvent('Content.ChannelRewardUpdated', defaultEventOptions);
processor.addEvent('Content.ChannelFundsWithdrawn', defaultEventOptions);
processor.addEvent('Content.ChannelRewardClaimedAndWithdrawn', defaultEventOptions);
processor.addEvent('Storage.StorageBucketCreated', defaultEventOptions);
processor.addEvent('Storage.StorageBucketInvitationAccepted', defaultEventOptions);
processor.addEvent('Storage.StorageBucketsUpdatedForBag', defaultEventOptions);
processor.addEvent('Storage.StorageOperatorMetadataSet', defaultEventOptions);
processor.addEvent('Storage.StorageBucketVoucherLimitsSet', defaultEventOptions);
processor.addEvent('Storage.PendingDataObjectsAccepted', defaultEventOptions);
processor.addEvent('Storage.StorageBucketInvitationCancelled', defaultEventOptions);
processor.addEvent('Storage.StorageBucketOperatorInvited', defaultEventOptions);
processor.addEvent('Storage.StorageBucketOperatorRemoved', defaultEventOptions);
processor.addEvent('Storage.StorageBucketStatusUpdated', defaultEventOptions);
processor.addEvent('Storage.StorageBucketDeleted', defaultEventOptions);
processor.addEvent('Storage.VoucherChanged', defaultEventOptions);
processor.addEvent('Storage.DynamicBagCreated', defaultEventOptions);
processor.addEvent('Storage.DynamicBagDeleted', defaultEventOptions);
processor.addEvent('Storage.DataObjectsUploaded', defaultEventOptions);
processor.addEvent('Storage.DataObjectsUpdated', defaultEventOptions);
processor.addEvent('Storage.DataObjectsMoved', defaultEventOptions);
processor.addEvent('Storage.DataObjectsDeleted', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketCreated', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketStatusUpdated', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketDeleted', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketsUpdatedForBag', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketModeUpdated', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketOperatorInvited', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketInvitationCancelled', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketInvitationAccepted', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketMetadataSet', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketOperatorRemoved', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketFamilyCreated', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketFamilyMetadataSet', defaultEventOptions);
processor.addEvent('Storage.DistributionBucketFamilyDeleted', defaultEventOptions);
processor.addEvent('Members.MemberCreated', defaultEventOptions);
processor.addEvent('Members.MembershipBought', defaultEventOptions);
processor.addEvent('Members.MembershipGifted', defaultEventOptions);
processor.addEvent('Members.MemberInvited', defaultEventOptions);
processor.addEvent('Members.MemberAccountsUpdated', defaultEventOptions);
processor.addEvent('Members.MemberProfileUpdated', defaultEventOptions);
processor.addEvent('Members.MemberRemarked', defaultEventOptions);
(0, misc_1.assertAssignable)(events_1.eventConstructors);
const eventHandlers = {
    'Content.VideoCreated': video_1.processVideoCreatedEvent,
    'Content.VideoUpdated': video_1.processVideoUpdatedEvent,
    'Content.VideoDeleted': video_1.processVideoDeletedEvent,
    'Content.VideoDeletedByModerator': video_1.processVideoDeletedByModeratorEvent,
    'Content.VideoVisibilitySetByModerator': video_1.processVideoVisibilitySetByModeratorEvent,
    'Content.ChannelCreated': channel_1.processChannelCreatedEvent,
    'Content.ChannelUpdated': channel_1.processChannelUpdatedEvent,
    'Content.ChannelDeleted': channel_1.processChannelDeletedEvent,
    'Content.ChannelDeletedByModerator': channel_1.processChannelDeletedByModeratorEvent,
    'Content.ChannelVisibilitySetByModerator': channel_1.processChannelVisibilitySetByModeratorEvent,
    'Content.ChannelOwnerRemarked': channel_1.processChannelOwnerRemarkedEvent,
    'Content.ChannelAgentRemarked': channel_1.processChannelAgentRemarkedEvent,
    'Content.OpenAuctionStarted': nft_1.processOpenAuctionStartedEvent,
    'Content.EnglishAuctionStarted': nft_1.processEnglishAuctionStartedEvent,
    'Content.NftIssued': nft_1.processNftIssuedEvent,
    'Content.AuctionBidMade': nft_1.processAuctionBidMadeEvent,
    'Content.AuctionBidCanceled': nft_1.processAuctionBidCanceledEvent,
    'Content.AuctionCanceled': nft_1.processAuctionCanceledEvent,
    'Content.EnglishAuctionSettled': nft_1.processEnglishAuctionSettledEvent,
    'Content.BidMadeCompletingAuction': nft_1.processBidMadeCompletingAuctionEvent,
    'Content.OpenAuctionBidAccepted': nft_1.processOpenAuctionBidAcceptedEvent,
    'Content.OfferStarted': nft_1.processOfferStartedEvent,
    'Content.OfferAccepted': nft_1.processOfferAcceptedEvent,
    'Content.OfferCanceled': nft_1.processOfferCanceledEvent,
    'Content.NftSellOrderMade': nft_1.processNftSellOrderMadeEvent,
    'Content.NftBought': nft_1.processNftBoughtEvent,
    'Content.BuyNowCanceled': nft_1.processBuyNowCanceledEvent,
    'Content.BuyNowPriceUpdated': nft_1.processBuyNowPriceUpdatedEvent,
    'Content.NftSlingedBackToTheOriginalArtist': nft_1.processNftSlingedBackToTheOriginalArtistEvent,
    'Content.ChannelPayoutsUpdated': channel_1.processChannelPayoutsUpdatedEvent,
    'Content.ChannelRewardUpdated': channel_1.processChannelRewardUpdatedEvent,
    'Content.ChannelFundsWithdrawn': channel_1.processChannelFundsWithdrawnEvent,
    'Content.ChannelRewardClaimedAndWithdrawn': channel_1.processChannelRewardClaimedAndWithdrawnEvent,
    'Storage.StorageBucketCreated': storage_1.processStorageBucketCreatedEvent,
    'Storage.StorageBucketInvitationAccepted': storage_1.processStorageBucketInvitationAcceptedEvent,
    'Storage.StorageBucketsUpdatedForBag': storage_1.processStorageBucketsUpdatedForBagEvent,
    'Storage.StorageOperatorMetadataSet': storage_1.processStorageOperatorMetadataSetEvent,
    'Storage.StorageBucketVoucherLimitsSet': storage_1.processStorageBucketVoucherLimitsSetEvent,
    'Storage.PendingDataObjectsAccepted': storage_1.processPendingDataObjectsAcceptedEvent,
    'Storage.StorageBucketInvitationCancelled': storage_1.processStorageBucketInvitationCancelledEvent,
    'Storage.StorageBucketOperatorInvited': storage_1.processStorageBucketOperatorInvitedEvent,
    'Storage.StorageBucketOperatorRemoved': storage_1.processStorageBucketOperatorRemovedEvent,
    'Storage.StorageBucketStatusUpdated': storage_1.processStorageBucketStatusUpdatedEvent,
    'Storage.StorageBucketDeleted': storage_1.processStorageBucketDeletedEvent,
    'Storage.VoucherChanged': storage_1.processVoucherChangedEvent,
    'Storage.DynamicBagCreated': storage_1.processDynamicBagCreatedEvent,
    'Storage.DynamicBagDeleted': storage_1.processDynamicBagDeletedEvent,
    'Storage.DataObjectsUploaded': storage_1.processDataObjectsUploadedEvent,
    'Storage.DataObjectsUpdated': storage_1.processDataObjectsUpdatedEvent,
    'Storage.DataObjectsMoved': storage_1.processDataObjectsMovedEvent,
    'Storage.DataObjectsDeleted': storage_1.processDataObjectsDeletedEvent,
    'Storage.DistributionBucketCreated': storage_1.processDistributionBucketCreatedEvent,
    'Storage.DistributionBucketStatusUpdated': storage_1.processDistributionBucketStatusUpdatedEvent,
    'Storage.DistributionBucketDeleted': storage_1.processDistributionBucketDeletedEvent,
    'Storage.DistributionBucketsUpdatedForBag': storage_1.processDistributionBucketsUpdatedForBagEvent,
    'Storage.DistributionBucketModeUpdated': storage_1.processDistributionBucketModeUpdatedEvent,
    'Storage.DistributionBucketOperatorInvited': storage_1.processDistributionBucketOperatorInvitedEvent,
    'Storage.DistributionBucketInvitationCancelled': storage_1.processDistributionBucketInvitationCancelledEvent,
    'Storage.DistributionBucketInvitationAccepted': storage_1.processDistributionBucketInvitationAcceptedEvent,
    'Storage.DistributionBucketMetadataSet': storage_1.processDistributionBucketMetadataSetEvent,
    'Storage.DistributionBucketOperatorRemoved': storage_1.processDistributionBucketOperatorRemovedEvent,
    'Storage.DistributionBucketFamilyCreated': storage_1.processDistributionBucketFamilyCreatedEvent,
    'Storage.DistributionBucketFamilyMetadataSet': storage_1.processDistributionBucketFamilyMetadataSetEvent,
    'Storage.DistributionBucketFamilyDeleted': storage_1.processDistributionBucketFamilyDeletedEvent,
    'Members.MemberCreated': membership_1.processNewMember,
    'Members.MembershipBought': membership_1.processNewMember,
    'Members.MembershipGifted': membership_1.processNewMember,
    'Members.MemberInvited': membership_1.processNewMember,
    'Members.MemberAccountsUpdated': membership_1.processMemberAccountsUpdatedEvent,
    'Members.MemberProfileUpdated': membership_1.processMemberProfileUpdatedEvent,
    'Members.MemberRemarked': membership_1.processMemberRemarkedEvent,
};
const offchainState = new offchainState_1.OffchainState();
const exportBlockNumber = offchainState.getExportBlockNumber();
async function processEvent(ctx, name, block, indexInBlock, extrinsicHash, rawEvent, overlay) {
    const eventHandler = eventHandlers[name];
    const EventConstructor = events_1.eventConstructors[name];
    const event = new EventConstructor(ctx, rawEvent);
    await eventHandler({ block, overlay, event, indexInBlock, extrinsicHash });
}
async function afterDbUpdate(em) {
    await utils_1.commentCountersManager.updateVideoCommentsCounters(em);
    await utils_1.commentCountersManager.updateParentRepliesCounters(em);
    await utils_1.videoRelevanceManager.updateVideoRelevanceValue(em);
}
processor.run(new typeorm_store_1.TypeormDatabase({ isolationLevel: 'READ COMMITTED' }), async (ctx) => {
    logger_1.Logger.set(ctx.log);
    const overlay = await overlay_1.EntityManagerOverlay.create(ctx.store, afterDbUpdate);
    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.name !== '*') {
                ctx.log.info(`Processing ${item.name} event in block ${block.header.height}...`);
                await processEvent(ctx, item.name, block.header, item.event.indexInBlock, item.event.extrinsic?.hash, item.event, overlay);
                // Update database if the number of cached entities exceeded MAX_CACHED_ENTITIES
                if (overlay.totalCacheSize() > maxCachedEntities) {
                    ctx.log.info(`Max memory cache size of ${maxCachedEntities} exceeded, updating database...`);
                    await overlay.updateDatabase();
                }
            }
        }
        // Importing exported offchain state
        if (block.header.height >= exportBlockNumber && !offchainState.isImported) {
            ctx.log.info(`Export block ${exportBlockNumber} reached, importing offchain state...`);
            await overlay.updateDatabase();
            const em = overlay.getEm();
            await offchainState.import(em);
            await utils_1.commentCountersManager.updateVideoCommentsCounters(em, true);
            await utils_1.commentCountersManager.updateParentRepliesCounters(em, true);
            await utils_1.videoRelevanceManager.updateVideoRelevanceValue(em, true);
            ctx.log.info(`Offchain state successfully imported!`);
        }
    }
    ctx.log.info(`Saving database updates...`);
    await overlay.updateDatabase();
});
//# sourceMappingURL=processor.js.map