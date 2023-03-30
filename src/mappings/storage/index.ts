import {
  DistributionBucketFamilyMetadata,
  DistributionBucketOperatorMetadata,
  StorageBucketOperatorMetadata,
} from '@joystream/metadata-protobuf'
import {
  DistributionBucket,
  DistributionBucketFamily,
  DistributionBucketOperator,
  DistributionBucketOperatorStatus,
  StorageBag,
  StorageBucket,
  StorageBucketOperatorStatusActive,
  StorageBucketOperatorStatusInvited,
  StorageBucketOperatorStatusMissing,
  StorageBucketOperatorMetadata as StorageBucketOperatorMetadataEntity,
  DistributionBucketFamilyMetadata as DistributionBucketFamilyMetadataEntity,
  StorageBucketBag,
  DistributionBucketBag,
  StorageDataObject,
} from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { deserializeMetadata, toAddress } from '../utils'
import {
  createDataObjects,
  deleteDataObjects,
  deleteDataObjectsByIds,
  distributionBucketBagData,
  distributionBucketId,
  distributionOperatorId,
  getDynamicBagId,
  getDynamicBagOwner,
  getOrCreateBag,
  removeDistributionBucketOperator,
  storageBucketBagData,
} from './utils'
import {
  processDistributionBucketFamilyMetadata,
  processDistributionOperatorMetadata,
  processStorageOperatorMetadata,
} from './metadata'

// STORAGE BUCKET EVENTS

export async function processStorageBucketCreatedEvent({
  overlay,
  event: {
    asV1000: [
      bucketId,
      invitedWorkerId,
      acceptingNewBags,
      dataObjectsSizeLimit,
      dataObjectCountLimit,
    ],
  },
}: EventHandlerContext<'Storage.StorageBucketCreated'>) {
  const storageBucket = overlay.getRepository(StorageBucket).new({
    id: bucketId.toString(),
    acceptingNewBags,
    dataObjectCountLimit,
    dataObjectsSizeLimit,
    dataObjectsCount: 0n,
    dataObjectsSize: 0n,
  })
  if (invitedWorkerId !== undefined) {
    storageBucket.operatorStatus = new StorageBucketOperatorStatusInvited({
      workerId: Number(invitedWorkerId),
    })
  } else {
    storageBucket.operatorStatus = new StorageBucketOperatorStatusMissing()
  }
}

export async function processStorageOperatorMetadataSetEvent({
  overlay,
  event: {
    asV1000: [bucketId, , metadataBytes],
  },
}: EventHandlerContext<'Storage.StorageOperatorMetadataSet'>): Promise<void> {
  const metadataUpdate = deserializeMetadata(StorageBucketOperatorMetadata, metadataBytes)
  if (metadataUpdate) {
    await processStorageOperatorMetadata(overlay, bucketId.toString(), metadataUpdate)
  }
}

export async function processStorageBucketStatusUpdatedEvent({
  overlay,
  event: {
    asV1000: [bucketId, acceptingNewBags],
  },
}: EventHandlerContext<'Storage.StorageBucketStatusUpdated'>): Promise<void> {
  const storageBucket = await overlay
    .getRepository(StorageBucket)
    .getByIdOrFail(bucketId.toString())
  storageBucket.acceptingNewBags = acceptingNewBags
}

export async function processStorageBucketInvitationAcceptedEvent({
  overlay,
  event: {
    asV1000: [bucketId, workerId, transactorAccountId],
  },
}: EventHandlerContext<'Storage.StorageBucketInvitationAccepted'>): Promise<void> {
  const storageBucket = await overlay
    .getRepository(StorageBucket)
    .getByIdOrFail(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusActive({
    workerId: Number(workerId),
    transactorAccountId: toAddress(transactorAccountId),
  })
}

export async function processStorageBucketInvitationCancelledEvent({
  overlay,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.StorageBucketInvitationCancelled'>): Promise<void> {
  // Metadata should not exist, because the operator wasn't active
  const storageBucket = await overlay
    .getRepository(StorageBucket)
    .getByIdOrFail(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusMissing()
}

export async function processStorageBucketOperatorInvitedEvent({
  overlay,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.StorageBucketOperatorInvited'>): Promise<void> {
  const storageBucket = await overlay
    .getRepository(StorageBucket)
    .getByIdOrFail(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusInvited({
    workerId: Number(workerId),
  })
}

export async function processStorageBucketOperatorRemovedEvent({
  overlay,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.StorageBucketOperatorRemoved'>): Promise<void> {
  const storageBucket = await overlay
    .getRepository(StorageBucket)
    .getByIdOrFail(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusMissing()
  overlay.getRepository(StorageBucketOperatorMetadataEntity).remove(storageBucket.id)
}

export async function processStorageBucketsUpdatedForBagEvent({
  overlay,
  event: {
    asV1000: [bagId, addedBuckets, removedBuckets],
  },
}: EventHandlerContext<'Storage.StorageBucketsUpdatedForBag'>): Promise<void> {
  await getOrCreateBag(overlay, bagId)
  overlay
    .getRepository(StorageBucketBag)
    .remove(...removedBuckets.map((bucketId) => storageBucketBagData(bucketId, bagId)))
  addedBuckets.forEach((bucketId) =>
    overlay.getRepository(StorageBucketBag).new(storageBucketBagData(bucketId, bagId))
  )
}

export async function processVoucherChangedEvent({
  overlay,
  event: {
    asV1000: [bucketId, voucher],
  },
}: EventHandlerContext<'Storage.VoucherChanged'>): Promise<void> {
  const bucket = await overlay.getRepository(StorageBucket).getByIdOrFail(bucketId.toString())

  bucket.dataObjectCountLimit = voucher.objectsLimit
  bucket.dataObjectsSizeLimit = voucher.sizeLimit
  bucket.dataObjectsCount = voucher.objectsUsed
  bucket.dataObjectsSize = voucher.sizeUsed
}

export async function processStorageBucketVoucherLimitsSetEvent({
  overlay,
  event: {
    asV1000: [bucketId, sizeLimit, countLimit],
  },
}: EventHandlerContext<'Storage.StorageBucketVoucherLimitsSet'>): Promise<void> {
  const bucket = await overlay.getRepository(StorageBucket).getByIdOrFail(bucketId.toString())
  bucket.dataObjectsSizeLimit = sizeLimit
  bucket.dataObjectCountLimit = countLimit
}

export async function processStorageBucketDeletedEvent({
  overlay,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.StorageBucketDeleted'>): Promise<void> {
  // There should be already no bags assigned - enforced by the runtime
  overlay.getRepository(StorageBucketOperatorMetadataEntity).remove(bucketId.toString())
  overlay.getRepository(StorageBucket).remove(bucketId.toString())
}

// DYNAMIC BAG EVENTS

export async function processDynamicBagCreatedEvent({
  overlay,
  block,
  event: {
    asV1000: [
      {
        bagId,
        storageBuckets,
        distributionBuckets,
        objectCreationList,
        expectedDataObjectStateBloatBond,
      },
      objectIds,
    ],
  },
}: EventHandlerContext<'Storage.DynamicBagCreated'>) {
  const bag = overlay.getRepository(StorageBag).new({
    id: getDynamicBagId(bagId),
    owner: getDynamicBagOwner(bagId),
  })

  storageBuckets.map((id) =>
    overlay.getRepository(StorageBucketBag).new(storageBucketBagData(id, bag.id))
  )
  distributionBuckets.map((id) =>
    overlay.getRepository(DistributionBucketBag).new(distributionBucketBagData(id, bag.id))
  )
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  createDataObjects(
    dataObjectRepository,
    block,
    bag.id,
    objectCreationList,
    expectedDataObjectStateBloatBond,
    objectIds
  )
}

export async function processDynamicBagDeletedEvent({
  overlay,
  event: { asV1000: bagId },
}: EventHandlerContext<'Storage.DynamicBagDeleted'>): Promise<void> {
  const dynBagId = getDynamicBagId(bagId)
  const bagStorageBucketRelations = await overlay
    .getRepository(StorageBucketBag)
    .getManyByRelation('bagId', dynBagId)
  const bagDistributionBucketRelations = await overlay
    .getRepository(DistributionBucketBag)
    .getManyByRelation('bagId', dynBagId)
  const objects = await overlay
    .getRepository(StorageDataObject)
    .getManyByRelation('storageBagId', dynBagId)
  overlay.getRepository(StorageBucketBag).remove(...bagStorageBucketRelations)
  overlay.getRepository(DistributionBucketBag).remove(...bagDistributionBucketRelations)
  await deleteDataObjects(overlay, objects)
  overlay.getRepository(StorageBag).remove(dynBagId)
}

// // DATA OBJECT EVENTS

export async function processDataObjectsUploadedEvent({
  overlay,
  block,
  event: {
    asV1000: [objectIds, { bagId, objectCreationList }, stateBloatBond],
  },
}: EventHandlerContext<'Storage.DataObjectsUploaded'>) {
  const bag = await getOrCreateBag(overlay, bagId)
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  createDataObjects(
    dataObjectRepository,
    block,
    bag.id,
    objectCreationList,
    stateBloatBond,
    objectIds
  )
}

export async function processDataObjectsUpdatedEvent({
  overlay,
  block,
  event: {
    asV1000: [
      { bagId, objectCreationList, expectedDataObjectStateBloatBond: stateBloatBond },
      uploadedObjectIds,
      objectsToRemoveIds,
    ],
  },
}: EventHandlerContext<'Storage.DataObjectsUpdated'>): Promise<void> {
  const bag = await getOrCreateBag(overlay, bagId)
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  createDataObjects(
    dataObjectRepository,
    block,
    bag.id,
    objectCreationList,
    stateBloatBond,
    uploadedObjectIds
  )
  await deleteDataObjectsByIds(overlay, objectsToRemoveIds)
}

export async function processPendingDataObjectsAcceptedEvent({
  overlay,
  event: {
    asV1000: [, , , dataObjectIds],
  },
}: EventHandlerContext<'Storage.PendingDataObjectsAccepted'>): Promise<void> {
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  const objects = await Promise.all(
    dataObjectIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString()))
  )
  objects.forEach((o) => (o.isAccepted = true))
}

export async function processDataObjectsMovedEvent({
  overlay,
  event: {
    asV1000: [, destBagId, dataObjectIds],
  },
}: EventHandlerContext<'Storage.DataObjectsMoved'>): Promise<void> {
  const destBag = await getOrCreateBag(overlay, destBagId)
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  const dataObjects = await Promise.all(
    dataObjectIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString()))
  )
  dataObjects.forEach((o) => {
    o.storageBagId = destBag.id
  })
}

export async function processDataObjectsDeletedEvent({
  overlay,
  event: {
    asV1000: [, , dataObjectIds],
  },
}: EventHandlerContext<'Storage.DataObjectsDeleted'>): Promise<void> {
  await deleteDataObjectsByIds(overlay, dataObjectIds)
}

// DISTRIBUTION FAMILY EVENTS

export async function processDistributionBucketFamilyCreatedEvent({
  overlay,
  event: { asV1000: familyId },
}: EventHandlerContext<'Storage.DistributionBucketFamilyCreated'>): Promise<void> {
  const familyRepository = overlay.getRepository(DistributionBucketFamily)
  familyRepository.new({ id: familyId.toString() })
}

export async function processDistributionBucketFamilyMetadataSetEvent({
  overlay,
  event: {
    asV1000: [familyId, metadataBytes],
  },
}: EventHandlerContext<'Storage.DistributionBucketFamilyMetadataSet'>): Promise<void> {
  const metadataUpdate = deserializeMetadata(DistributionBucketFamilyMetadata, metadataBytes)
  if (metadataUpdate) {
    await processDistributionBucketFamilyMetadata(overlay, familyId.toString(), metadataUpdate)
  }
}

export async function processDistributionBucketFamilyDeletedEvent({
  overlay,
  event: { asV1000: familyId },
}: EventHandlerContext<'Storage.DistributionBucketFamilyDeleted'>): Promise<void> {
  overlay.getRepository(DistributionBucketFamilyMetadataEntity).remove(familyId.toString())
  overlay.getRepository(DistributionBucketFamily).remove(familyId.toString())
}

// DISTRIBUTION BUCKET EVENTS

export async function processDistributionBucketCreatedEvent({
  overlay,
  event: {
    asV1000: [familyId, acceptingNewBags, bucketId],
  },
}: EventHandlerContext<'Storage.DistributionBucketCreated'>): Promise<void> {
  overlay.getRepository(DistributionBucket).new({
    id: distributionBucketId(bucketId),
    bucketIndex: Number(bucketId.distributionBucketIndex),
    acceptingNewBags,
    distributing: true, // Runtime default
    familyId: familyId.toString(),
  })
}

export async function processDistributionBucketStatusUpdatedEvent({
  overlay,
  event: {
    asV1000: [bucketId, acceptingNewBags],
  },
}: EventHandlerContext<'Storage.DistributionBucketStatusUpdated'>): Promise<void> {
  const bucket = await overlay
    .getRepository(DistributionBucket)
    .getByIdOrFail(distributionBucketId(bucketId))
  bucket.acceptingNewBags = acceptingNewBags
}

export async function processDistributionBucketDeletedEvent({
  overlay,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.DistributionBucketDeleted'>): Promise<void> {
  // Operators and bags need to be empty (enforced by runtime)
  overlay.getRepository(DistributionBucket).remove(distributionBucketId(bucketId))
}

export async function processDistributionBucketsUpdatedForBagEvent({
  overlay,
  event: {
    asV1000: [bagId, familyId, addedBucketsIndices, removedBucketsIndices],
  },
}: EventHandlerContext<'Storage.DistributionBucketsUpdatedForBag'>): Promise<void> {
  await getOrCreateBag(overlay, bagId)
  overlay.getRepository(DistributionBucketBag).remove(
    ...removedBucketsIndices.map((index) =>
      distributionBucketBagData(
        {
          distributionBucketFamilyId: familyId,
          distributionBucketIndex: index,
        },
        bagId
      )
    )
  )
  addedBucketsIndices.forEach((index) =>
    overlay.getRepository(DistributionBucketBag).new(
      distributionBucketBagData(
        {
          distributionBucketFamilyId: familyId,
          distributionBucketIndex: index,
        },
        bagId
      )
    )
  )
}

export async function processDistributionBucketModeUpdatedEvent({
  overlay,
  event: {
    asV1000: [bucketId, distributing],
  },
}: EventHandlerContext<'Storage.DistributionBucketModeUpdated'>): Promise<void> {
  const bucket = await overlay
    .getRepository(DistributionBucket)
    .getByIdOrFail(distributionBucketId(bucketId))
  bucket.distributing = distributing
}

export function processDistributionBucketOperatorInvitedEvent({
  overlay,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.DistributionBucketOperatorInvited'>): void {
  const operatorRepository = overlay.getRepository(DistributionBucketOperator)
  operatorRepository.new({
    id: distributionOperatorId(bucketId, workerId),
    distributionBucketId: distributionBucketId(bucketId),
    status: DistributionBucketOperatorStatus.INVITED,
    workerId: Number(workerId),
  })
}

export async function processDistributionBucketInvitationCancelledEvent({
  overlay,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.DistributionBucketInvitationCancelled'>): Promise<void> {
  // Metadata should not exist, because the operator wasn't active
  overlay
    .getRepository(DistributionBucketOperator)
    .remove(distributionOperatorId(bucketId, workerId))
}

export async function processDistributionBucketInvitationAcceptedEvent({
  overlay,
  event: {
    asV1000: [workerId, bucketId],
  },
}: EventHandlerContext<'Storage.DistributionBucketInvitationAccepted'>): Promise<void> {
  const operator = await overlay
    .getRepository(DistributionBucketOperator)
    .getByIdOrFail(distributionOperatorId(bucketId, workerId))
  operator.status = DistributionBucketOperatorStatus.ACTIVE
}

export async function processDistributionBucketMetadataSetEvent({
  overlay,
  event: {
    asV1000: [workerId, bucketId, metadataBytes],
  },
}: EventHandlerContext<'Storage.DistributionBucketMetadataSet'>): Promise<void> {
  const metadataUpdate = deserializeMetadata(DistributionBucketOperatorMetadata, metadataBytes)
  if (metadataUpdate) {
    await processDistributionOperatorMetadata(
      overlay,
      distributionOperatorId(bucketId, workerId),
      metadataUpdate
    )
  }
}

export async function processDistributionBucketOperatorRemovedEvent({
  overlay,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.DistributionBucketOperatorRemoved'>): Promise<void> {
  await removeDistributionBucketOperator(overlay, distributionOperatorId(bucketId, workerId))
}
