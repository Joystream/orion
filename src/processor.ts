import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { EntityManager } from 'typeorm'
import { Logger } from './logger'
import {
  processChannelAgentRemarkedEvent,
  processChannelAssetsDeletedByModeratorEvent,
  processChannelCreatedEvent,
  processChannelDeletedByModeratorEvent,
  processChannelDeletedEvent,
  processChannelFundsWithdrawnEvent,
  processChannelOwnerRemarkedEvent,
  processChannelPayoutsUpdatedEvent,
  processChannelRewardClaimedAndWithdrawnEvent,
  processChannelRewardUpdatedEvent,
  processChannelUpdatedEvent,
  processChannelVisibilitySetByModeratorEvent,
} from './mappings/content/channel'
import {
  processAuctionBidCanceledEvent,
  processAuctionBidMadeEvent,
  processAuctionCanceledEvent,
  processBidMadeCompletingAuctionEvent,
  processBuyNowCanceledEvent,
  processBuyNowPriceUpdatedEvent,
  processEnglishAuctionSettledEvent,
  processEnglishAuctionStartedEvent,
  processNftBoughtEvent,
  processNftIssuedEvent,
  processNftSellOrderMadeEvent,
  processNftSlingedBackToTheOriginalArtistEvent,
  processOfferAcceptedEvent,
  processOfferCanceledEvent,
  processOfferStartedEvent,
  processOpenAuctionBidAcceptedEvent,
  processOpenAuctionStartedEvent,
} from './mappings/content/nft'
import {
  processVideoAssetsDeletedByModeratorEvent,
  processVideoCreatedEvent,
  processVideoDeletedByModeratorEvent,
  processVideoDeletedEvent,
  processVideoUpdatedEvent,
  processVideoVisibilitySetByModeratorEvent,
} from './mappings/content/video'
import {
  processMemberAccountsUpdatedEvent,
  processMemberProfileUpdatedEvent,
  processMemberRemarkedEvent,
  processNewMember,
} from './mappings/membership'
import {
  processDataObjectsDeletedEvent,
  processDataObjectsMovedEvent,
  processDataObjectsUpdatedEvent,
  processDataObjectsUploadedEvent,
  processDistributionBucketCreatedEvent,
  processDistributionBucketDeletedEvent,
  processDistributionBucketFamilyCreatedEvent,
  processDistributionBucketFamilyDeletedEvent,
  processDistributionBucketFamilyMetadataSetEvent,
  processDistributionBucketInvitationAcceptedEvent,
  processDistributionBucketInvitationCancelledEvent,
  processDistributionBucketMetadataSetEvent,
  processDistributionBucketModeUpdatedEvent,
  processDistributionBucketOperatorInvitedEvent,
  processDistributionBucketOperatorRemovedEvent,
  processDistributionBucketStatusUpdatedEvent,
  processDistributionBucketsUpdatedForBagEvent,
  processDynamicBagCreatedEvent,
  processDynamicBagDeletedEvent,
  processPendingDataObjectsAcceptedEvent,
  processStorageBucketCreatedEvent,
  processStorageBucketDeletedEvent,
  processStorageBucketInvitationAcceptedEvent,
  processStorageBucketInvitationCancelledEvent,
  processStorageBucketOperatorInvitedEvent,
  processStorageBucketOperatorRemovedEvent,
  processStorageBucketStatusUpdatedEvent,
  processStorageBucketVoucherLimitsSetEvent,
  processStorageBucketsUpdatedForBagEvent,
  processStorageOperatorMetadataSetEvent,
  processVoucherChangedEvent,
} from './mappings/storage'
import {
  processAccountDustedByEvent,
  processAmmActivatedEvent,
  processAmmDeactivatedEvent,
  processCreatorTokenIssuedEvent,
  processCreatorTokenIssuerRemarkedEvent,
  processMemberJoinedWhitelistEvent,
  processPatronageCreditClaimedEvent,
  processPatronageRateDecreasedToEvent,
  processRevenueSplitFinalizedEvent,
  processRevenueSplitIssuedEvent,
  processRevenueSplitLeftEvent,
  processTokenAmountTransferredByIssuerEvent,
  processTokenAmountTransferredEvent,
  processTokenDeissuedEvent,
  processTokenIssuedEvent,
  processTokenSaleFinalizedEvent,
  processTokenSaleInitializedEvent,
  processTokensBoughtOnAmmEvent,
  processTokensBurnedEvent,
  processTokensPurchasedOnSaleEvent,
  processTokensSoldOnAmmEvent,
  processTransferPolicyChangedToPermissionlessEvent,
  processUpcomingTokenSaleUpdatedEvent,
  processUserParticipatedInSplitEvent,
} from './mappings/token'
import { commentCountersManager, videoRelevanceManager } from './mappings/utils'
import { Event } from './types/support'
import { EventHandler, EventInstance, EventNames, eventConstructors } from './utils/events'
import { assertAssignable } from './utils/misc'
import { OffchainState } from './utils/offchainState'
import { EntityManagerOverlay } from './utils/overlay'

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
// By adding other events separately, we sacrifice some type safety,
// but otherwise the compilation of this file takes forever.
processor.addEvent('Content.VideoUpdated', defaultEventOptions)
processor.addEvent('Content.VideoDeleted', defaultEventOptions)
processor.addEvent('Content.VideoDeletedByModerator', defaultEventOptions)
processor.addEvent('Content.VideoVisibilitySetByModerator', defaultEventOptions)
processor.addEvent('Content.ChannelCreated', defaultEventOptions)
processor.addEvent('Content.ChannelUpdated', defaultEventOptions)
processor.addEvent('Content.ChannelDeleted', defaultEventOptions)
processor.addEvent('Content.ChannelDeletedByModerator', defaultEventOptions)
processor.addEvent('Content.ChannelVisibilitySetByModerator', defaultEventOptions)
processor.addEvent('Content.ChannelOwnerRemarked', defaultEventOptions)
processor.addEvent('Content.ChannelAgentRemarked', defaultEventOptions)
processor.addEvent('Content.CreatorTokenIssued', defaultEventOptions)
processor.addEvent('Content.OpenAuctionStarted', defaultEventOptions)
processor.addEvent('Content.EnglishAuctionStarted', defaultEventOptions)
processor.addEvent('Content.NftIssued', defaultEventOptions)
processor.addEvent('Content.AuctionBidMade', defaultEventOptions)
processor.addEvent('Content.AuctionBidCanceled', defaultEventOptions)
processor.addEvent('Content.AuctionCanceled', defaultEventOptions)
processor.addEvent('Content.EnglishAuctionSettled', defaultEventOptions)
processor.addEvent('Content.BidMadeCompletingAuction', defaultEventOptions)
processor.addEvent('Content.OpenAuctionBidAccepted', defaultEventOptions)
processor.addEvent('Content.OfferStarted', defaultEventOptions)
processor.addEvent('Content.OfferAccepted', defaultEventOptions)
processor.addEvent('Content.OfferCanceled', defaultEventOptions)
processor.addEvent('Content.NftSellOrderMade', defaultEventOptions)
processor.addEvent('Content.NftBought', defaultEventOptions)
processor.addEvent('Content.BuyNowCanceled', defaultEventOptions)
processor.addEvent('Content.BuyNowPriceUpdated', defaultEventOptions)
processor.addEvent('Content.NftSlingedBackToTheOriginalArtist', defaultEventOptions)
processor.addEvent('Content.ChannelPayoutsUpdated', defaultEventOptions)
processor.addEvent('Content.ChannelRewardUpdated', defaultEventOptions)
processor.addEvent('Content.ChannelFundsWithdrawn', defaultEventOptions)
processor.addEvent('Content.ChannelRewardClaimedAndWithdrawn', defaultEventOptions)
processor.addEvent('Storage.StorageBucketCreated', defaultEventOptions)
processor.addEvent('Storage.StorageBucketInvitationAccepted', defaultEventOptions)
processor.addEvent('Storage.StorageBucketsUpdatedForBag', defaultEventOptions)
processor.addEvent('Storage.StorageOperatorMetadataSet', defaultEventOptions)
processor.addEvent('Storage.StorageBucketVoucherLimitsSet', defaultEventOptions)
processor.addEvent('Storage.PendingDataObjectsAccepted', defaultEventOptions)
processor.addEvent('Storage.StorageBucketInvitationCancelled', defaultEventOptions)
processor.addEvent('Storage.StorageBucketOperatorInvited', defaultEventOptions)
processor.addEvent('Storage.StorageBucketOperatorRemoved', defaultEventOptions)
processor.addEvent('Storage.StorageBucketStatusUpdated', defaultEventOptions)
processor.addEvent('Storage.StorageBucketDeleted', defaultEventOptions)
processor.addEvent('Storage.VoucherChanged', defaultEventOptions)
processor.addEvent('Storage.DynamicBagCreated', defaultEventOptions)
processor.addEvent('Storage.DynamicBagDeleted', defaultEventOptions)
processor.addEvent('Storage.DataObjectsUploaded', defaultEventOptions)
processor.addEvent('Storage.DataObjectsUpdated', defaultEventOptions)
processor.addEvent('Storage.DataObjectsMoved', defaultEventOptions)
processor.addEvent('Storage.DataObjectsDeleted', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketCreated', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketStatusUpdated', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketDeleted', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketsUpdatedForBag', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketModeUpdated', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketOperatorInvited', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketInvitationCancelled', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketInvitationAccepted', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketMetadataSet', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketOperatorRemoved', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketFamilyCreated', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketFamilyMetadataSet', defaultEventOptions)
processor.addEvent('Storage.DistributionBucketFamilyDeleted', defaultEventOptions)
processor.addEvent('Members.MemberCreated', defaultEventOptions)
processor.addEvent('Members.MembershipBought', defaultEventOptions)
processor.addEvent('Members.MembershipGifted', defaultEventOptions)
processor.addEvent('Members.MemberInvited', defaultEventOptions)
processor.addEvent('Members.MemberAccountsUpdated', defaultEventOptions)
processor.addEvent('Members.MemberProfileUpdated', defaultEventOptions)
processor.addEvent('Members.MemberRemarked', defaultEventOptions)
processor.addEvent('ProjectToken.TokenIssued', defaultEventOptions)
processor.addEvent('ProjectToken.TokenAmountTransferred', defaultEventOptions)
processor.addEvent('ProjectToken.TokenAmountTransferredByIssuer', defaultEventOptions)
processor.addEvent('ProjectToken.PatronageRateDecreasedTo', defaultEventOptions)
processor.addEvent('ProjectToken.PatronageCreditClaimed', defaultEventOptions)
processor.addEvent('ProjectToken.TokenDeissued', defaultEventOptions)
processor.addEvent('ProjectToken.AmmActivated', defaultEventOptions)
processor.addEvent('ProjectToken.AmmDeactivated', defaultEventOptions)
processor.addEvent('ProjectToken.TokensBoughtOnAmm', defaultEventOptions)
processor.addEvent('ProjectToken.AccountDustedBy', defaultEventOptions)
processor.addEvent('ProjectToken.TokensSoldOnAmm', defaultEventOptions)
processor.addEvent('ProjectToken.TokenSaleInitialized', defaultEventOptions)
processor.addEvent('ProjectToken.TokensPurchasedOnSale', defaultEventOptions)
processor.addEvent('ProjectToken.RevenueSplitIssued', defaultEventOptions)
processor.addEvent('ProjectToken.RevenueSplitLeft', defaultEventOptions)
processor.addEvent('ProjectToken.MemberJoinedWhitelist', defaultEventOptions)
processor.addEvent('ProjectToken.UpcomingTokenSaleUpdated', defaultEventOptions)
processor.addEvent('ProjectToken.TokensBurned', defaultEventOptions)
processor.addEvent('ProjectToken.TokenSaleFinalized', defaultEventOptions)
processor.addEvent('ProjectToken.RevenueSplitFinalized', defaultEventOptions)
processor.addEvent('ProjectToken.UserParticipatedInSplit', defaultEventOptions)
processor.addEvent('ProjectToken.TransferPolicyChangedToPermissionless', defaultEventOptions)
processor.addEvent('Content.CreatorTokenIssuerRemarked', defaultEventOptions)

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

assertAssignable<{ [K in Exclude<Item['name'], '*'>]: unknown }>(eventConstructors)

const eventHandlers: { [E in EventNames]: EventHandler<E> } = {
  'Content.VideoCreated': processVideoCreatedEvent,
  'Content.VideoUpdated': processVideoUpdatedEvent,
  'Content.VideoDeleted': processVideoDeletedEvent,
  'Content.VideoDeletedByModerator': processVideoDeletedByModeratorEvent,
  'Content.VideoAssetsDeletedByModerator': processVideoAssetsDeletedByModeratorEvent,
  'Content.VideoVisibilitySetByModerator': processVideoVisibilitySetByModeratorEvent,
  'Content.ChannelCreated': processChannelCreatedEvent,
  'Content.ChannelUpdated': processChannelUpdatedEvent,
  'Content.ChannelDeleted': processChannelDeletedEvent,
  'Content.ChannelDeletedByModerator': processChannelDeletedByModeratorEvent,
  'Content.ChannelAssetsDeletedByModerator': processChannelAssetsDeletedByModeratorEvent,
  'Content.ChannelVisibilitySetByModerator': processChannelVisibilitySetByModeratorEvent,
  'Content.ChannelOwnerRemarked': processChannelOwnerRemarkedEvent,
  'Content.ChannelAgentRemarked': processChannelAgentRemarkedEvent,
  'Content.CreatorTokenIssued': processCreatorTokenIssuedEvent,
  'Content.CreatorTokenIssuerRemarked': processCreatorTokenIssuerRemarkedEvent,
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
  'ProjectToken.TokenIssued': processTokenIssuedEvent,
  'ProjectToken.TokenDeissued': processTokenDeissuedEvent,
  'ProjectToken.AccountDustedBy': processAccountDustedByEvent,
  'ProjectToken.AmmActivated': processAmmActivatedEvent,
  'ProjectToken.AmmDeactivated': processAmmDeactivatedEvent,
  'ProjectToken.TokensBoughtOnAmm': processTokensBoughtOnAmmEvent,
  'ProjectToken.TokensSoldOnAmm': processTokensSoldOnAmmEvent,
  'ProjectToken.PatronageRateDecreasedTo': processPatronageRateDecreasedToEvent,
  'ProjectToken.PatronageCreditClaimed': processPatronageCreditClaimedEvent,
  'ProjectToken.TokenSaleInitialized': processTokenSaleInitializedEvent,
  'ProjectToken.TokensPurchasedOnSale': processTokensPurchasedOnSaleEvent,
  'ProjectToken.TokenAmountTransferred': processTokenAmountTransferredEvent,
  'ProjectToken.TokenAmountTransferredByIssuer': processTokenAmountTransferredByIssuerEvent,
  'ProjectToken.TokensBurned': processTokensBurnedEvent,
  'ProjectToken.TokenSaleFinalized': processTokenSaleFinalizedEvent,
  'ProjectToken.RevenueSplitIssued': processRevenueSplitIssuedEvent,
  'ProjectToken.MemberJoinedWhitelist': processMemberJoinedWhitelistEvent,
  'ProjectToken.UpcomingTokenSaleUpdated': processUpcomingTokenSaleUpdatedEvent,
  'ProjectToken.RevenueSplitLeft': processRevenueSplitLeftEvent,
  'ProjectToken.RevenueSplitFinalized': processRevenueSplitFinalizedEvent,
  'ProjectToken.UserParticipatedInSplit': processUserParticipatedInSplitEvent,
  'ProjectToken.TransferPolicyChangedToPermissionless':
    processTransferPolicyChangedToPermissionlessEvent,
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
}

const offchainState = new OffchainState()
let exportBlockNumber: number

processor.run(new TypeormDatabase({ isolationLevel: 'READ COMMITTED' }), async (ctx) => {
  Logger.set(ctx.log)

  // Get the export block number from the offchain state
  if (!exportBlockNumber) {
    exportBlockNumber = await offchainState.getExportBlockNumber()
  }

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

    if (
      !videoRelevanceManager.isVideoRelevanceEnabled &&
      block.header.height >= exportBlockNumber
    ) {
      videoRelevanceManager.turnOnVideoRelevanceManager()
    }

    // Importing exported offchain state
    if (block.header.height >= exportBlockNumber && !offchainState.isImported) {
      ctx.log.info(`Export block ${exportBlockNumber} reached, importing offchain state...`)
      // there is no need to recalc video relevance before orion is synced
      await overlay.updateDatabase()
      const em = overlay.getEm()
      await offchainState.import(overlay)
      await commentCountersManager.updateVideoCommentsCounters(em, true)
      await commentCountersManager.updateParentRepliesCounters(em, true)
      await videoRelevanceManager.updateVideoRelevanceValue(em, true)
      ctx.log.info(`Offchain state successfully imported!`)
    }
  }

  ctx.log.info(`Saving database updates...`)
  await overlay.updateDatabase()
})
