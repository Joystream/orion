import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Logger } from './logger'
import {
  processStorageBucketCreatedEvent,
  processStorageBucketInvitationAcceptedEvent,
  processStorageBucketsUpdatedForBagEvent,
  processStorageOperatorMetadataSetEvent,
  processStorageBucketVoucherLimitsSetEvent,
  processPendingDataObjectsAcceptedEvent,
  processStorageBucketInvitationCancelledEvent,
  processStorageBucketOperatorInvitedEvent,
  processStorageBucketOperatorRemovedEvent,
  processStorageBucketStatusUpdatedEvent,
  processStorageBucketDeletedEvent,
  processVoucherChangedEvent,
  processDynamicBagCreatedEvent,
  processDynamicBagDeletedEvent,
  processDataObjectsUploadedEvent,
  processDataObjectsUpdatedEvent,
  processDataObjectsMovedEvent,
  processDataObjectsDeletedEvent,
  processDistributionBucketCreatedEvent,
  processDistributionBucketStatusUpdatedEvent,
  processDistributionBucketDeletedEvent,
  processDistributionBucketsUpdatedForBagEvent,
  processDistributionBucketModeUpdatedEvent,
  processDistributionBucketOperatorInvitedEvent,
  processDistributionBucketInvitationCancelledEvent,
  processDistributionBucketInvitationAcceptedEvent,
  processDistributionBucketMetadataSetEvent,
  processDistributionBucketOperatorRemovedEvent,
  processDistributionBucketFamilyCreatedEvent,
  processDistributionBucketFamilyMetadataSetEvent,
  processDistributionBucketFamilyDeletedEvent,
} from './mappings/storage'
import {
  processChannelCreatedEvent,
  processChannelUpdatedEvent,
  processChannelDeletedEvent,
  processChannelDeletedByModeratorEvent,
  processChannelVisibilitySetByModeratorEvent,
  processChannelOwnerRemarkedEvent,
  processChannelAgentRemarkedEvent,
  processChannelPayoutsUpdatedEvent,
  processChannelRewardUpdatedEvent,
  processChannelFundsWithdrawnEvent,
  processChannelRewardClaimedAndWithdrawnEvent,
} from './mappings/content/channel'
import {
  processVideoCreatedEvent,
  processVideoUpdatedEvent,
  processVideoDeletedEvent,
  processVideoDeletedByModeratorEvent,
  processVideoVisibilitySetByModeratorEvent,
} from './mappings/content/video'
import {
  processOpenAuctionStartedEvent,
  processEnglishAuctionStartedEvent,
  processNftIssuedEvent,
  processAuctionBidMadeEvent,
  processAuctionBidCanceledEvent,
  processAuctionCanceledEvent,
  processEnglishAuctionSettledEvent,
  processBidMadeCompletingAuctionEvent,
  processOpenAuctionBidAcceptedEvent,
  processOfferStartedEvent,
  processOfferAcceptedEvent,
  processOfferCanceledEvent,
  processNftSellOrderMadeEvent,
  processNftBoughtEvent,
  processBuyNowCanceledEvent,
  processBuyNowPriceUpdatedEvent,
  processNftSlingedBackToTheOriginalArtistEvent,
} from './mappings/content/nft'
import {
  processMemberAccountsUpdatedEvent,
  processMemberProfileUpdatedEvent,
  processNewMember,
  processMemberRemarkedEvent,
} from './mappings/membership'
import { Event } from './types/support'
import { assertAssignable } from './utils/misc'
import { EntityManagerOverlay } from './utils/overlay'
import { EventNames, EventHandler, eventConstructors, EventInstance } from './utils/events'
import { commentCountersManager, videoRelevanceManager } from './mappings/utils'
import { EntityManager } from 'typeorm'

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
} as const

const archiveUrl = process.env.ARCHIVE_GATEWAY_URL || 'http://localhost:8888/graphql'
const maxCachedEntities = parseInt(process.env.MAX_CACHED_ENTITIES || '1000')

const processor = new SubstrateBatchProcessor()
  .setDataSource({ archive: archiveUrl })
  .addEvent('Content.VideoCreated', defaultEventOptions)
  .addEvent('Content.VideoUpdated', defaultEventOptions)
  .addEvent('Content.VideoDeleted', defaultEventOptions)
  .addEvent('Content.VideoDeletedByModerator', defaultEventOptions)
  .addEvent('Content.VideoVisibilitySetByModerator', defaultEventOptions)
  .addEvent('Content.ChannelCreated', defaultEventOptions)
  .addEvent('Content.ChannelUpdated', defaultEventOptions)
  .addEvent('Content.ChannelDeleted', defaultEventOptions)
  .addEvent('Content.ChannelDeletedByModerator', defaultEventOptions)
  .addEvent('Content.ChannelVisibilitySetByModerator', defaultEventOptions)
  .addEvent('Content.ChannelOwnerRemarked', defaultEventOptions)
  .addEvent('Content.ChannelAgentRemarked', defaultEventOptions)
  .addEvent('Content.OpenAuctionStarted', defaultEventOptions)
  .addEvent('Content.EnglishAuctionStarted', defaultEventOptions)
  .addEvent('Content.NftIssued', defaultEventOptions)
  .addEvent('Content.AuctionBidMade', defaultEventOptions)
  .addEvent('Content.AuctionBidCanceled', defaultEventOptions)
  .addEvent('Content.AuctionCanceled', defaultEventOptions)
  .addEvent('Content.EnglishAuctionSettled', defaultEventOptions)
  .addEvent('Content.BidMadeCompletingAuction', defaultEventOptions)
  .addEvent('Content.OpenAuctionBidAccepted', defaultEventOptions)
  .addEvent('Content.OfferStarted', defaultEventOptions)
  .addEvent('Content.OfferAccepted', defaultEventOptions)
  .addEvent('Content.OfferCanceled', defaultEventOptions)
  .addEvent('Content.NftSellOrderMade', defaultEventOptions)
  .addEvent('Content.NftBought', defaultEventOptions)
  .addEvent('Content.BuyNowCanceled', defaultEventOptions)
  .addEvent('Content.BuyNowPriceUpdated', defaultEventOptions)
  .addEvent('Content.NftSlingedBackToTheOriginalArtist', defaultEventOptions)
  .addEvent('Content.ChannelPayoutsUpdated', defaultEventOptions)
  .addEvent('Content.ChannelRewardUpdated', defaultEventOptions)
  .addEvent('Content.ChannelFundsWithdrawn', defaultEventOptions)
  .addEvent('Content.ChannelRewardClaimedAndWithdrawn', defaultEventOptions)
  .addEvent('Storage.StorageBucketCreated', defaultEventOptions)
  .addEvent('Storage.StorageBucketInvitationAccepted', defaultEventOptions)
  .addEvent('Storage.StorageBucketsUpdatedForBag', defaultEventOptions)
  .addEvent('Storage.StorageOperatorMetadataSet', defaultEventOptions)
  .addEvent('Storage.StorageBucketVoucherLimitsSet', defaultEventOptions)
  .addEvent('Storage.PendingDataObjectsAccepted', defaultEventOptions)
  .addEvent('Storage.StorageBucketInvitationCancelled', defaultEventOptions)
  .addEvent('Storage.StorageBucketOperatorInvited', defaultEventOptions)
  .addEvent('Storage.StorageBucketOperatorRemoved', defaultEventOptions)
  .addEvent('Storage.StorageBucketStatusUpdated', defaultEventOptions)
  .addEvent('Storage.StorageBucketDeleted', defaultEventOptions)
  .addEvent('Storage.VoucherChanged', defaultEventOptions)
  .addEvent('Storage.DynamicBagCreated', defaultEventOptions)
  .addEvent('Storage.DynamicBagDeleted', defaultEventOptions)
  .addEvent('Storage.DataObjectsUploaded', defaultEventOptions)
  .addEvent('Storage.DataObjectsUpdated', defaultEventOptions)
  .addEvent('Storage.DataObjectsMoved', defaultEventOptions)
  .addEvent('Storage.DataObjectsDeleted', defaultEventOptions)
  .addEvent('Storage.DistributionBucketCreated', defaultEventOptions)
  .addEvent('Storage.DistributionBucketStatusUpdated', defaultEventOptions)
  .addEvent('Storage.DistributionBucketDeleted', defaultEventOptions)
  .addEvent('Storage.DistributionBucketsUpdatedForBag', defaultEventOptions)
  .addEvent('Storage.DistributionBucketModeUpdated', defaultEventOptions)
  .addEvent('Storage.DistributionBucketOperatorInvited', defaultEventOptions)
  .addEvent('Storage.DistributionBucketInvitationCancelled', defaultEventOptions)
  .addEvent('Storage.DistributionBucketInvitationAccepted', defaultEventOptions)
  .addEvent('Storage.DistributionBucketMetadataSet', defaultEventOptions)
  .addEvent('Storage.DistributionBucketOperatorRemoved', defaultEventOptions)
  .addEvent('Storage.DistributionBucketFamilyCreated', defaultEventOptions)
  .addEvent('Storage.DistributionBucketFamilyMetadataSet', defaultEventOptions)
  .addEvent('Storage.DistributionBucketFamilyDeleted', defaultEventOptions)
  .addEvent('Members.MemberCreated', defaultEventOptions)
  .addEvent('Members.MembershipBought', defaultEventOptions)
  .addEvent('Members.MembershipGifted', defaultEventOptions)
  .addEvent('Members.MemberInvited', defaultEventOptions)
  .addEvent('Members.MemberAccountsUpdated', defaultEventOptions)
  .addEvent('Members.MemberProfileUpdated', defaultEventOptions)
  .addEvent('Members.MemberRemarked', defaultEventOptions)

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

assertAssignable<{ [K in Exclude<Item['name'], '*'>]: unknown }>(eventConstructors)

const eventHandlers: { [E in EventNames]: EventHandler<E> } = {
  'Content.VideoCreated': processVideoCreatedEvent,
  'Content.VideoUpdated': processVideoUpdatedEvent,
  'Content.VideoDeleted': processVideoDeletedEvent,
  'Content.VideoDeletedByModerator': processVideoDeletedByModeratorEvent,
  'Content.VideoVisibilitySetByModerator': processVideoVisibilitySetByModeratorEvent,
  'Content.ChannelCreated': processChannelCreatedEvent,
  'Content.ChannelUpdated': processChannelUpdatedEvent,
  'Content.ChannelDeleted': processChannelDeletedEvent,
  'Content.ChannelDeletedByModerator': processChannelDeletedByModeratorEvent,
  'Content.ChannelVisibilitySetByModerator': processChannelVisibilitySetByModeratorEvent,
  'Content.ChannelOwnerRemarked': processChannelOwnerRemarkedEvent,
  'Content.ChannelAgentRemarked': processChannelAgentRemarkedEvent,
  'Content.OpenAuctionStarted': processOpenAuctionStartedEvent,
  'Content.EnglishAuctionStarted': processEnglishAuctionStartedEvent,
  'Content.NftIssued': processNftIssuedEvent,
  'Content.AuctionBidMade': processAuctionBidMadeEvent,
  'Content.AuctionBidCanceled': processAuctionBidCanceledEvent,
  'Content.AuctionCanceled': processAuctionCanceledEvent,
  'Content.EnglishAuctionSettled': processEnglishAuctionSettledEvent,
  'Content.BidMadeCompletingAuction': processBidMadeCompletingAuctionEvent,
  'Content.OpenAuctionBidAccepted': processOpenAuctionBidAcceptedEvent,
  'Content.OfferStarted': processOfferStartedEvent,
  'Content.OfferAccepted': processOfferAcceptedEvent,
  'Content.OfferCanceled': processOfferCanceledEvent,
  'Content.NftSellOrderMade': processNftSellOrderMadeEvent,
  'Content.NftBought': processNftBoughtEvent,
  'Content.BuyNowCanceled': processBuyNowCanceledEvent,
  'Content.BuyNowPriceUpdated': processBuyNowPriceUpdatedEvent,
  'Content.NftSlingedBackToTheOriginalArtist': processNftSlingedBackToTheOriginalArtistEvent,
  'Content.ChannelPayoutsUpdated': processChannelPayoutsUpdatedEvent,
  'Content.ChannelRewardUpdated': processChannelRewardUpdatedEvent,
  'Content.ChannelFundsWithdrawn': processChannelFundsWithdrawnEvent,
  'Content.ChannelRewardClaimedAndWithdrawn': processChannelRewardClaimedAndWithdrawnEvent,
  'Storage.StorageBucketCreated': processStorageBucketCreatedEvent,
  'Storage.StorageBucketInvitationAccepted': processStorageBucketInvitationAcceptedEvent,
  'Storage.StorageBucketsUpdatedForBag': processStorageBucketsUpdatedForBagEvent,
  'Storage.StorageOperatorMetadataSet': processStorageOperatorMetadataSetEvent,
  'Storage.StorageBucketVoucherLimitsSet': processStorageBucketVoucherLimitsSetEvent,
  'Storage.PendingDataObjectsAccepted': processPendingDataObjectsAcceptedEvent,
  'Storage.StorageBucketInvitationCancelled': processStorageBucketInvitationCancelledEvent,
  'Storage.StorageBucketOperatorInvited': processStorageBucketOperatorInvitedEvent,
  'Storage.StorageBucketOperatorRemoved': processStorageBucketOperatorRemovedEvent,
  'Storage.StorageBucketStatusUpdated': processStorageBucketStatusUpdatedEvent,
  'Storage.StorageBucketDeleted': processStorageBucketDeletedEvent,
  'Storage.VoucherChanged': processVoucherChangedEvent,
  'Storage.DynamicBagCreated': processDynamicBagCreatedEvent,
  'Storage.DynamicBagDeleted': processDynamicBagDeletedEvent,
  'Storage.DataObjectsUploaded': processDataObjectsUploadedEvent,
  'Storage.DataObjectsUpdated': processDataObjectsUpdatedEvent,
  'Storage.DataObjectsMoved': processDataObjectsMovedEvent,
  'Storage.DataObjectsDeleted': processDataObjectsDeletedEvent,
  'Storage.DistributionBucketCreated': processDistributionBucketCreatedEvent,
  'Storage.DistributionBucketStatusUpdated': processDistributionBucketStatusUpdatedEvent,
  'Storage.DistributionBucketDeleted': processDistributionBucketDeletedEvent,
  'Storage.DistributionBucketsUpdatedForBag': processDistributionBucketsUpdatedForBagEvent,
  'Storage.DistributionBucketModeUpdated': processDistributionBucketModeUpdatedEvent,
  'Storage.DistributionBucketOperatorInvited': processDistributionBucketOperatorInvitedEvent,
  'Storage.DistributionBucketInvitationCancelled':
    processDistributionBucketInvitationCancelledEvent,
  'Storage.DistributionBucketInvitationAccepted': processDistributionBucketInvitationAcceptedEvent,
  'Storage.DistributionBucketMetadataSet': processDistributionBucketMetadataSetEvent,
  'Storage.DistributionBucketOperatorRemoved': processDistributionBucketOperatorRemovedEvent,
  'Storage.DistributionBucketFamilyCreated': processDistributionBucketFamilyCreatedEvent,
  'Storage.DistributionBucketFamilyMetadataSet': processDistributionBucketFamilyMetadataSetEvent,
  'Storage.DistributionBucketFamilyDeleted': processDistributionBucketFamilyDeletedEvent,
  'Members.MemberCreated': processNewMember,
  'Members.MembershipBought': processNewMember,
  'Members.MembershipGifted': processNewMember,
  'Members.MemberInvited': processNewMember,
  'Members.MemberAccountsUpdated': processMemberAccountsUpdatedEvent,
  'Members.MemberProfileUpdated': processMemberProfileUpdatedEvent,
  'Members.MemberRemarked': processMemberRemarkedEvent,
}

async function processEvent<EventName extends EventNames>(
  ctx: Ctx,
  name: EventName,
  block: SubstrateBlock,
  indexInBlock: number,
  extrinsicHash: string | undefined,
  rawEvent: Event,
  overlay: EntityManagerOverlay
) {
  const eventHandler: EventHandler<EventName> = eventHandlers[name]
  const EventConstructor = eventConstructors[name]
  const event = new EventConstructor(ctx, rawEvent) as EventInstance<EventName>
  await eventHandler({ block, overlay, event, indexInBlock, extrinsicHash })
}

async function afterDbUpdate(em: EntityManager) {
  await commentCountersManager.updateVideoCommentsCounters(em)
  await commentCountersManager.updateParentRepliesCounters(em)
  await videoRelevanceManager.updateVideoRelevanceValue(em)
}

processor.run(new TypeormDatabase({ isolationLevel: 'READ COMMITTED' }), async (ctx) => {
  Logger.set(ctx.log)

  const overlay = await EntityManagerOverlay.create(ctx.store, afterDbUpdate)

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name !== '*') {
        ctx.log.info(`Processing ${item.name} event in block ${block.header.height}...`)
        await processEvent(
          ctx,
          item.name,
          block.header,
          item.event.indexInBlock,
          item.event.extrinsic?.hash,
          item.event,
          overlay
        )
        // Update database if the number of cached entities exceeded MAX_CACHED_ENTITIES
        if (overlay.totalCacheSize() > maxCachedEntities) {
          ctx.log.info(
            `Max memory cache size of ${maxCachedEntities} exceeded, updating database...`
          )
          await overlay.updateDatabase()
        }
      }
    }
  }

  ctx.log.info(`Saving database updates...`)
  await overlay.updateDatabase()
})
