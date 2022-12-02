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
} from '../../model'
import { EventHandlerContext } from '../../utils'
import { deserializeMetadata } from '../utils'
import {
  addStaticBagIfNotExists,
  createDataObjects,
  createDistributionBucketBag,
  createStorageBucketBag,
  deleteDataObjects,
  deleteDataObjectsByIds,
  distributionBucketId,
  distributionOperatorId,
  getBagId,
  getDynamicBagId,
  getDynamicBagOwner,
  removeDistributionBucketOperator,
} from './utils'
import { encodeAddress } from '@polkadot/util-crypto'
import {
  processDistributionBucketFamilyMetadata,
  processDistributionOperatorMetadata,
  processStorageOperatorMetadata,
} from './metadata'

// STORAGE BUCKET EVENTS

export function processStorageBucketCreatedEvent({
  ec,
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
  const storageBucket = new StorageBucket({
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
  ec.collections.StorageBucket.push(storageBucket)
}

export async function processStorageOperatorMetadataSetEvent({
  ec,
  event: {
    asV1000: [bucketId, , metadataBytes],
  },
}: EventHandlerContext<'Storage.StorageOperatorMetadataSet'>): Promise<void> {
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString(), {
    operatorMetadata: true,
  })
  const meta = deserializeMetadata(StorageBucketOperatorMetadata, metadataBytes)
  if (meta) {
    processStorageOperatorMetadata(ec, storageBucket, meta)
  }
}

export async function processStorageBucketStatusUpdatedEvent({
  ec,
  event: {
    asV1000: [bucketId, acceptingNewBags],
  },
}: EventHandlerContext<'Storage.StorageBucketStatusUpdated'>): Promise<void> {
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString())
  storageBucket.acceptingNewBags = acceptingNewBags
}

export async function processStorageBucketInvitationAcceptedEvent({
  ec,
  event: {
    asV1000: [bucketId, workerId, transactorAccountId],
  },
}: EventHandlerContext<'Storage.StorageBucketInvitationAccepted'>): Promise<void> {
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusActive({
    workerId: Number(workerId),
    transactorAccountId: encodeAddress(transactorAccountId),
  })
}

export async function processStorageBucketInvitationCancelledEvent({
  ec,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.StorageBucketInvitationCancelled'>): Promise<void> {
  // Metadata should not exist, because the operator wasn't active
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusMissing()
}

export async function processStorageBucketOperatorInvitedEvent({
  ec,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.StorageBucketOperatorInvited'>): Promise<void> {
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString())
  storageBucket.operatorStatus = new StorageBucketOperatorStatusInvited({
    workerId: Number(workerId),
  })
}

export async function processStorageBucketOperatorRemovedEvent({
  ec,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.StorageBucketOperatorRemoved'>): Promise<void> {
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString(), {
    operatorMetadata: true,
  })
  storageBucket.operatorStatus = new StorageBucketOperatorStatusMissing()
  if (storageBucket.operatorMetadata) {
    ec.collections.StorageBucketOperatorMetadata.remove(storageBucket.operatorMetadata)
  }
}

export async function processStorageBucketsUpdatedForBagEvent({
  ec,
  event: {
    asV1000: [bagId, addedBuckets, removedBuckets],
  },
}: EventHandlerContext<'Storage.StorageBucketsUpdatedForBag'>): Promise<void> {
  await addStaticBagIfNotExists(ec, bagId)
  removedBuckets.forEach((bucket) => {
    const toBeRemoved = createStorageBucketBag(bucket, bagId)
    ec.collections.StorageBucketBag.remove(toBeRemoved)
  })
  addedBuckets.forEach((bucket) => {
    const toBeAdded = createStorageBucketBag(bucket, bagId)
    ec.collections.StorageBucketBag.push(toBeAdded)
  })
}

export async function processVoucherChangedEvent({
  ec,
  event: {
    asV1000: [bucketId, voucher],
  },
}: EventHandlerContext<'Storage.VoucherChanged'>): Promise<void> {
  const bucket = await ec.collections.StorageBucket.get(bucketId.toString())

  bucket.dataObjectCountLimit = voucher.objectsLimit
  bucket.dataObjectsSizeLimit = voucher.sizeLimit
  bucket.dataObjectsCount = voucher.objectsUsed
  bucket.dataObjectsSize = voucher.sizeUsed
}

export async function processStorageBucketVoucherLimitsSetEvent({
  ec,
  event: {
    asV1000: [bucketId, sizeLimit, countLimit],
  },
}: EventHandlerContext<'Storage.StorageBucketVoucherLimitsSet'>): Promise<void> {
  const bucket = await ec.collections.StorageBucket.get(bucketId.toString())
  bucket.dataObjectsSizeLimit = sizeLimit
  bucket.dataObjectCountLimit = countLimit
}

export async function processStorageBucketDeletedEvent({
  ec,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.StorageBucketDeleted'>): Promise<void> {
  const storageBucket = await ec.collections.StorageBucket.get(bucketId.toString(), {
    bags: true,
    operatorMetadata: true,
  })
  storageBucket.bags.forEach((b) => {
    ec.collections.StorageBucketBag.remove(b)
  })
  if (storageBucket.operatorMetadata) {
    ec.collections.StorageBucketOperatorMetadata.remove(storageBucket.operatorMetadata)
  }
  ec.collections.StorageBucket.remove(storageBucket)
}

// DYNAMIC BAG EVENTS

export function processDynamicBagCreatedEvent({
  ec,
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
  const bag = new StorageBag({
    id: getDynamicBagId(bagId),
    owner: getDynamicBagOwner(bagId),
  })

  ec.collections.StorageBag.push(bag)

  const storageBucketBags = storageBuckets.map((id) => createStorageBucketBag(id, bag))

  ec.collections.StorageBucketBag.push(...storageBucketBags)

  const distributionBucketBags = distributionBuckets.map((id) =>
    createDistributionBucketBag(id, bag)
  )

  ec.collections.DistributionBucketBag.push(...distributionBucketBags)

  const dataObjects = createDataObjects(
    block,
    bag,
    objectCreationList,
    expectedDataObjectStateBloatBond,
    objectIds
  )

  ec.collections.StorageDataObject.push(...dataObjects)
}

export async function processDynamicBagDeletedEvent({
  ec,
  event: { asV1000: bagId },
}: EventHandlerContext<'Storage.DynamicBagDeleted'>): Promise<void> {
  const storageBag = await ec.collections.StorageBag.get(getDynamicBagId(bagId), {
    storageBuckets: true,
    distributionBuckets: true,
    objects: true,
  })

  ec.collections.StorageBucketBag.remove(...storageBag.storageBuckets)
  ec.collections.DistributionBucketBag.remove(...storageBag.distributionBuckets)
  await deleteDataObjects(ec, storageBag.objects)
  ec.collections.StorageBag.remove(storageBag)
}

// // DATA OBJECT EVENTS

export async function processDataObjectsUploadedEvent({
  ec,
  block,
  event: {
    asV1000: [objectIds, { bagId, objectCreationList }, stateBloatBond],
  },
}: EventHandlerContext<'Storage.DataObjectsUploaded'>) {
  await addStaticBagIfNotExists(ec, bagId)
  ec.collections.StorageDataObject.push(
    ...createDataObjects(
      block,
      new StorageBag({ id: getBagId(bagId) }),
      objectCreationList,
      stateBloatBond,
      objectIds
    )
  )
}

export async function processDataObjectsUpdatedEvent({
  ec,
  block,
  event: {
    asV1000: [
      { bagId, objectCreationList, expectedDataObjectStateBloatBond: stateBloatBond },
      uploadedObjectIds,
      objectsToRemoveIds,
    ],
  },
}: EventHandlerContext<'Storage.DataObjectsUpdated'>): Promise<void> {
  await addStaticBagIfNotExists(ec, bagId)
  ec.collections.StorageDataObject.push(
    ...createDataObjects(
      block,
      new StorageBag({ id: getBagId(bagId) }),
      objectCreationList,
      stateBloatBond,
      uploadedObjectIds
    )
  )
  await deleteDataObjectsByIds(ec, objectsToRemoveIds)
}

export async function processPendingDataObjectsAcceptedEvent({
  ec,
  event: {
    asV1000: [, , , dataObjectIds],
  },
}: EventHandlerContext<'Storage.PendingDataObjectsAccepted'>): Promise<void> {
  const objects = await Promise.all(
    dataObjectIds.map((id) => ec.collections.StorageDataObject.get(id.toString()))
  )
  objects.forEach((o) => {
    o.isAccepted = true
  })
}

export async function processDataObjectsMovedEvent({
  ec,
  event: {
    asV1000: [, destBagId, dataObjectIds],
  },
}: EventHandlerContext<'Storage.DataObjectsMoved'>): Promise<void> {
  await addStaticBagIfNotExists(ec, destBagId)
  const dataObjects = await Promise.all(
    dataObjectIds.map((id) => ec.collections.StorageDataObject.get(id.toString()))
  )
  dataObjects.forEach((o) => (o.storageBag = new StorageBag({ id: getBagId(destBagId) })))
}

export async function processDataObjectsDeletedEvent({
  ec,
  event: {
    asV1000: [, , dataObjectIds],
  },
}: EventHandlerContext<'Storage.DataObjectsDeleted'>): Promise<void> {
  await deleteDataObjectsByIds(ec, dataObjectIds)
}

// DISTRIBUTION FAMILY EVENTS

export async function processDistributionBucketFamilyCreatedEvent({
  ec,
  event: { asV1000: familyId },
}: EventHandlerContext<'Storage.DistributionBucketFamilyCreated'>): Promise<void> {
  const family = new DistributionBucketFamily({
    id: familyId.toString(),
  })
  ec.collections.DistributionBucketFamily.push(family)
}

export async function processDistributionBucketFamilyMetadataSetEvent({
  ec,
  event: {
    asV1000: [familyId, metadataBytes],
  },
}: EventHandlerContext<'Storage.DistributionBucketFamilyMetadataSet'>): Promise<void> {
  const family = await ec.collections.DistributionBucketFamily.get(familyId.toString(), {
    metadata: true,
  })
  const meta = deserializeMetadata(DistributionBucketFamilyMetadata, metadataBytes)
  if (meta) {
    processDistributionBucketFamilyMetadata(ec, family, meta)
  }
}

export async function processDistributionBucketFamilyDeletedEvent({
  ec,
  event: { asV1000: familyId },
}: EventHandlerContext<'Storage.DistributionBucketFamilyDeleted'>): Promise<void> {
  const family = await ec.collections.DistributionBucketFamily.get(familyId.toString(), {
    metadata: true,
  })
  if (family.metadata) {
    ec.collections.DistributionBucketFamilyMetadata.remove(family.metadata)
  }
  ec.collections.DistributionBucketFamily.remove(family)
}

// DISTRIBUTION BUCKET EVENTS

export async function processDistributionBucketCreatedEvent({
  ec,
  event: {
    asV1000: [familyId, acceptingNewBags, bucketId],
  },
}: EventHandlerContext<'Storage.DistributionBucketCreated'>): Promise<void> {
  ec.collections.DistributionBucket.push(
    new DistributionBucket({
      id: distributionBucketId(bucketId),
      bucketIndex: Number(bucketId.distributionBucketIndex),
      acceptingNewBags,
      distributing: true, // Runtime default
      family: new DistributionBucketFamily({ id: familyId.toString() }),
    })
  )
}

export async function processDistributionBucketStatusUpdatedEvent({
  ec,
  event: {
    asV1000: [bucketId, acceptingNewBags],
  },
}: EventHandlerContext<'Storage.DistributionBucketStatusUpdated'>): Promise<void> {
  const bucket = await ec.collections.DistributionBucket.get(distributionBucketId(bucketId))
  bucket.acceptingNewBags = acceptingNewBags
}

export async function processDistributionBucketDeletedEvent({
  ec,
  event: { asV1000: bucketId },
}: EventHandlerContext<'Storage.DistributionBucketDeleted'>): Promise<void> {
  const distributionBucket = await ec.collections.DistributionBucket.get(
    distributionBucketId(bucketId),
    {
      bags: true,
      operators: {
        metadata: true,
      },
    }
  )
  // Remove relations
  distributionBucket.operators.forEach((o) => removeDistributionBucketOperator(ec, o))
  ec.collections.DistributionBucketBag.remove(...distributionBucket.bags)
  ec.collections.DistributionBucket.remove(distributionBucket)
}

export async function processDistributionBucketsUpdatedForBagEvent({
  ec,
  event: {
    asV1000: [bagId, familyId, addedBucketsIndices, removedBucketsIndices],
  },
}: EventHandlerContext<'Storage.DistributionBucketsUpdatedForBag'>): Promise<void> {
  await addStaticBagIfNotExists(ec, bagId)
  removedBucketsIndices.forEach((index) => {
    const toBeRemoved = createDistributionBucketBag(
      {
        distributionBucketFamilyId: familyId,
        distributionBucketIndex: index,
      },
      bagId
    )
    ec.collections.DistributionBucketBag.remove(toBeRemoved)
  })
  addedBucketsIndices.forEach((index) => {
    const toBeAdded = createDistributionBucketBag(
      {
        distributionBucketFamilyId: familyId,
        distributionBucketIndex: index,
      },
      bagId
    )
    ec.collections.DistributionBucketBag.push(toBeAdded)
  })
}

export async function processDistributionBucketModeUpdatedEvent({
  ec,
  event: {
    asV1000: [bucketId, distributing],
  },
}: EventHandlerContext<'Storage.DistributionBucketModeUpdated'>): Promise<void> {
  const bucket = await ec.collections.DistributionBucket.get(distributionBucketId(bucketId))
  bucket.distributing = distributing
}

export function processDistributionBucketOperatorInvitedEvent({
  ec,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.DistributionBucketOperatorInvited'>): void {
  const invitedOperator = new DistributionBucketOperator({
    id: distributionOperatorId(bucketId, workerId),
    distributionBucket: new DistributionBucket({ id: distributionBucketId(bucketId) }),
    status: DistributionBucketOperatorStatus.INVITED,
    workerId: Number(workerId),
  })

  ec.collections.DistributionBucketOperator.push(invitedOperator)
}

export async function processDistributionBucketInvitationCancelledEvent({
  ec,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.DistributionBucketInvitationCancelled'>): Promise<void> {
  // Metadata should not exist, because the operator wasn't active
  ec.collections.DistributionBucketOperator.remove(
    new DistributionBucketOperator({ id: distributionOperatorId(bucketId, workerId) })
  )
}

export async function processDistributionBucketInvitationAcceptedEvent({
  ec,
  event: {
    asV1000: [workerId, bucketId],
  },
}: EventHandlerContext<'Storage.DistributionBucketInvitationAccepted'>): Promise<void> {
  const operator = await ec.collections.DistributionBucketOperator.get(
    distributionOperatorId(bucketId, workerId)
  )
  operator.status = DistributionBucketOperatorStatus.ACTIVE
}

export async function processDistributionBucketMetadataSetEvent({
  ec,
  event: {
    asV1000: [workerId, bucketId, metadataBytes],
  },
}: EventHandlerContext<'Storage.DistributionBucketMetadataSet'>): Promise<void> {
  const operator = await ec.collections.DistributionBucketOperator.get(
    distributionOperatorId(bucketId, workerId),
    { metadata: true }
  )
  const meta = deserializeMetadata(DistributionBucketOperatorMetadata, metadataBytes)
  if (meta) {
    processDistributionOperatorMetadata(ec, operator, meta)
  }
}

export async function processDistributionBucketOperatorRemovedEvent({
  ec,
  event: {
    asV1000: [bucketId, workerId],
  },
}: EventHandlerContext<'Storage.DistributionBucketOperatorRemoved'>): Promise<void> {
  const operator = await ec.collections.DistributionBucketOperator.get(
    distributionOperatorId(bucketId, workerId),
    { metadata: true }
  )
  await removeDistributionBucketOperator(ec, operator)
}
