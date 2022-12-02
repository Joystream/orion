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
} from './mappings/content/channel'
import {
  processMemberAccountsUpdatedEvent,
  processMemberProfileUpdatedEvent,
  processNewMember,
} from './mappings/membership'
import { Event } from './types/support'
import {
  assertAssignable,
  EventNames,
  EventHandler,
  eventConstructors,
  EventInstance,
  EntitiesCollector,
} from './utils'

const defaultEventOptions = {
  data: {
    event: {
      args: true,
      indexInBlock: true,
    },
  },
} as const

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: 'http://localhost:8888/graphql',
  })
  .addEvent('Content.ChannelCreated', defaultEventOptions)
  .addEvent('Content.ChannelUpdated', defaultEventOptions)
  .addEvent('Content.ChannelDeleted', defaultEventOptions)
  .addEvent('Content.ChannelDeletedByModerator', defaultEventOptions)
  .addEvent('Content.ChannelVisibilitySetByModerator', defaultEventOptions)
  .addEvent('Content.ChannelOwnerRemarked', defaultEventOptions)
  .addEvent('Content.ChannelAgentRemarked', defaultEventOptions)
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

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

assertAssignable<{ [K in Exclude<Item['name'], '*'>]: unknown }>(eventConstructors)

const eventHandlers: { [E in EventNames]: EventHandler<E> } = {
  'Content.ChannelCreated': processChannelCreatedEvent,
  'Content.ChannelUpdated': processChannelUpdatedEvent,
  'Content.ChannelDeleted': processChannelDeletedEvent,
  'Content.ChannelDeletedByModerator': processChannelDeletedByModeratorEvent,
  'Content.ChannelVisibilitySetByModerator': processChannelVisibilitySetByModeratorEvent,
  'Content.ChannelOwnerRemarked': processChannelOwnerRemarkedEvent,
  'Content.ChannelAgentRemarked': processChannelAgentRemarkedEvent,
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
}

async function processEvent<EventName extends EventNames>(
  ctx: Ctx,
  name: EventName,
  block: SubstrateBlock,
  indexInBlock: number,
  rawEvent: Event,
  ec: EntitiesCollector
) {
  const eventHandler: EventHandler<EventName> = eventHandlers[name]
  const EventConstructor = eventConstructors[name]
  const event = new EventConstructor(ctx, rawEvent) as EventInstance<EventName>
  await eventHandler({ block, ec, event, indexInBlock })
}

processor.run(new TypeormDatabase({ isolationLevel: 'READ COMMITTED' }), async (ctx) => {
  Logger.set(ctx.log)

  const ec = new EntitiesCollector(ctx.store)

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name !== '*') {
        ctx.log.info(`Processing ${item.name} event in block ${block.header.height}...`)
        await processEvent(ctx, item.name, block.header, item.event.indexInBlock, item.event, ec)
      }
    }
  }

  ctx.log.info(`Saving database updates...`)
  await ec.updateDatabase()
})
