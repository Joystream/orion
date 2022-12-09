"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDistributionBucketOperatorRemovedEvent = exports.processDistributionBucketMetadataSetEvent = exports.processDistributionBucketInvitationAcceptedEvent = exports.processDistributionBucketInvitationCancelledEvent = exports.processDistributionBucketOperatorInvitedEvent = exports.processDistributionBucketModeUpdatedEvent = exports.processDistributionBucketsUpdatedForBagEvent = exports.processDistributionBucketDeletedEvent = exports.processDistributionBucketStatusUpdatedEvent = exports.processDistributionBucketCreatedEvent = exports.processDistributionBucketFamilyDeletedEvent = exports.processDistributionBucketFamilyMetadataSetEvent = exports.processDistributionBucketFamilyCreatedEvent = exports.processDataObjectsDeletedEvent = exports.processDataObjectsMovedEvent = exports.processPendingDataObjectsAcceptedEvent = exports.processDataObjectsUpdatedEvent = exports.processDataObjectsUploadedEvent = exports.processDynamicBagDeletedEvent = exports.processDynamicBagCreatedEvent = exports.processStorageBucketDeletedEvent = exports.processStorageBucketVoucherLimitsSetEvent = exports.processVoucherChangedEvent = exports.processStorageBucketsUpdatedForBagEvent = exports.processStorageBucketOperatorRemovedEvent = exports.processStorageBucketOperatorInvitedEvent = exports.processStorageBucketInvitationCancelledEvent = exports.processStorageBucketInvitationAcceptedEvent = exports.processStorageBucketStatusUpdatedEvent = exports.processStorageOperatorMetadataSetEvent = exports.processStorageBucketCreatedEvent = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const model_1 = require("../../model");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const metadata_1 = require("./metadata");
// STORAGE BUCKET EVENTS
async function processStorageBucketCreatedEvent({ overlay, event: { asV1000: [bucketId, invitedWorkerId, acceptingNewBags, dataObjectsSizeLimit, dataObjectCountLimit,], }, }) {
    const storageBucket = overlay.getRepository(model_1.StorageBucket).new({
        id: bucketId.toString(),
        acceptingNewBags,
        dataObjectCountLimit,
        dataObjectsSizeLimit,
        dataObjectsCount: 0n,
        dataObjectsSize: 0n,
    });
    if (invitedWorkerId !== undefined) {
        storageBucket.operatorStatus = new model_1.StorageBucketOperatorStatusInvited({
            workerId: Number(invitedWorkerId),
        });
    }
    else {
        storageBucket.operatorStatus = new model_1.StorageBucketOperatorStatusMissing();
    }
}
exports.processStorageBucketCreatedEvent = processStorageBucketCreatedEvent;
async function processStorageOperatorMetadataSetEvent({ overlay, event: { asV1000: [bucketId, , metadataBytes], }, }) {
    const metadataUpdate = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.StorageBucketOperatorMetadata, metadataBytes);
    if (metadataUpdate) {
        await (0, metadata_1.processStorageOperatorMetadata)(overlay, bucketId.toString(), metadataUpdate);
    }
}
exports.processStorageOperatorMetadataSetEvent = processStorageOperatorMetadataSetEvent;
async function processStorageBucketStatusUpdatedEvent({ overlay, event: { asV1000: [bucketId, acceptingNewBags], }, }) {
    const storageBucket = await overlay
        .getRepository(model_1.StorageBucket)
        .getByIdOrFail(bucketId.toString());
    storageBucket.acceptingNewBags = acceptingNewBags;
}
exports.processStorageBucketStatusUpdatedEvent = processStorageBucketStatusUpdatedEvent;
async function processStorageBucketInvitationAcceptedEvent({ overlay, event: { asV1000: [bucketId, workerId, transactorAccountId], }, }) {
    const storageBucket = await overlay
        .getRepository(model_1.StorageBucket)
        .getByIdOrFail(bucketId.toString());
    storageBucket.operatorStatus = new model_1.StorageBucketOperatorStatusActive({
        workerId: Number(workerId),
        transactorAccountId: (0, utils_1.toAddress)(transactorAccountId),
    });
}
exports.processStorageBucketInvitationAcceptedEvent = processStorageBucketInvitationAcceptedEvent;
async function processStorageBucketInvitationCancelledEvent({ overlay, event: { asV1000: bucketId }, }) {
    // Metadata should not exist, because the operator wasn't active
    const storageBucket = await overlay
        .getRepository(model_1.StorageBucket)
        .getByIdOrFail(bucketId.toString());
    storageBucket.operatorStatus = new model_1.StorageBucketOperatorStatusMissing();
}
exports.processStorageBucketInvitationCancelledEvent = processStorageBucketInvitationCancelledEvent;
async function processStorageBucketOperatorInvitedEvent({ overlay, event: { asV1000: [bucketId, workerId], }, }) {
    const storageBucket = await overlay
        .getRepository(model_1.StorageBucket)
        .getByIdOrFail(bucketId.toString());
    storageBucket.operatorStatus = new model_1.StorageBucketOperatorStatusInvited({
        workerId: Number(workerId),
    });
}
exports.processStorageBucketOperatorInvitedEvent = processStorageBucketOperatorInvitedEvent;
async function processStorageBucketOperatorRemovedEvent({ overlay, event: { asV1000: bucketId }, }) {
    const storageBucket = await overlay
        .getRepository(model_1.StorageBucket)
        .getByIdOrFail(bucketId.toString());
    storageBucket.operatorStatus = new model_1.StorageBucketOperatorStatusMissing();
    overlay.getRepository(model_1.StorageBucketOperatorMetadata).remove(storageBucket.id);
}
exports.processStorageBucketOperatorRemovedEvent = processStorageBucketOperatorRemovedEvent;
async function processStorageBucketsUpdatedForBagEvent({ overlay, event: { asV1000: [bagId, addedBuckets, removedBuckets], }, }) {
    await (0, utils_2.getOrCreateBag)(overlay, bagId);
    overlay
        .getRepository(model_1.StorageBucketBag)
        .remove(...removedBuckets.map((bucketId) => (0, utils_2.storageBucketBagData)(bucketId, bagId)));
    addedBuckets.forEach((bucketId) => overlay.getRepository(model_1.StorageBucketBag).new((0, utils_2.storageBucketBagData)(bucketId, bagId)));
}
exports.processStorageBucketsUpdatedForBagEvent = processStorageBucketsUpdatedForBagEvent;
async function processVoucherChangedEvent({ overlay, event: { asV1000: [bucketId, voucher], }, }) {
    const bucket = await overlay.getRepository(model_1.StorageBucket).getByIdOrFail(bucketId.toString());
    bucket.dataObjectCountLimit = voucher.objectsLimit;
    bucket.dataObjectsSizeLimit = voucher.sizeLimit;
    bucket.dataObjectsCount = voucher.objectsUsed;
    bucket.dataObjectsSize = voucher.sizeUsed;
}
exports.processVoucherChangedEvent = processVoucherChangedEvent;
async function processStorageBucketVoucherLimitsSetEvent({ overlay, event: { asV1000: [bucketId, sizeLimit, countLimit], }, }) {
    const bucket = await overlay.getRepository(model_1.StorageBucket).getByIdOrFail(bucketId.toString());
    bucket.dataObjectsSizeLimit = sizeLimit;
    bucket.dataObjectCountLimit = countLimit;
}
exports.processStorageBucketVoucherLimitsSetEvent = processStorageBucketVoucherLimitsSetEvent;
async function processStorageBucketDeletedEvent({ overlay, event: { asV1000: bucketId }, }) {
    // There should be already no bags assigned - enforced by the runtime
    overlay.getRepository(model_1.StorageBucketOperatorMetadata).remove(bucketId.toString());
    overlay.getRepository(model_1.StorageBucket).remove(bucketId.toString());
}
exports.processStorageBucketDeletedEvent = processStorageBucketDeletedEvent;
// DYNAMIC BAG EVENTS
async function processDynamicBagCreatedEvent({ overlay, block, event: { asV1000: [{ bagId, storageBuckets, distributionBuckets, objectCreationList, expectedDataObjectStateBloatBond, }, objectIds,], }, }) {
    const bag = overlay.getRepository(model_1.StorageBag).new({
        id: (0, utils_2.getDynamicBagId)(bagId),
        owner: (0, utils_2.getDynamicBagOwner)(bagId),
    });
    storageBuckets.map((id) => overlay.getRepository(model_1.StorageBucketBag).new((0, utils_2.storageBucketBagData)(id, bag.id)));
    distributionBuckets.map((id) => overlay.getRepository(model_1.DistributionBucketBag).new((0, utils_2.distributionBucketBagData)(id, bag.id)));
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    (0, utils_2.createDataObjects)(dataObjectRepository, block, bag.id, objectCreationList, expectedDataObjectStateBloatBond, objectIds);
}
exports.processDynamicBagCreatedEvent = processDynamicBagCreatedEvent;
async function processDynamicBagDeletedEvent({ overlay, event: { asV1000: bagId }, }) {
    const dynBagId = (0, utils_2.getDynamicBagId)(bagId);
    const bagStorageBucketRelations = await overlay
        .getRepository(model_1.StorageBucketBag)
        .getManyByRelation('bagId', dynBagId);
    const bagDistributionBucketRelations = await overlay
        .getRepository(model_1.DistributionBucketBag)
        .getManyByRelation('bagId', dynBagId);
    const objects = await overlay
        .getRepository(model_1.StorageDataObject)
        .getManyByRelation('storageBagId', dynBagId);
    overlay.getRepository(model_1.StorageBucketBag).remove(...bagStorageBucketRelations);
    overlay.getRepository(model_1.DistributionBucketBag).remove(...bagDistributionBucketRelations);
    await (0, utils_2.deleteDataObjects)(overlay, objects);
    overlay.getRepository(model_1.StorageBag).remove(dynBagId);
}
exports.processDynamicBagDeletedEvent = processDynamicBagDeletedEvent;
// // DATA OBJECT EVENTS
async function processDataObjectsUploadedEvent({ overlay, block, event: { asV1000: [objectIds, { bagId, objectCreationList }, stateBloatBond], }, }) {
    const bag = await (0, utils_2.getOrCreateBag)(overlay, bagId);
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    (0, utils_2.createDataObjects)(dataObjectRepository, block, bag.id, objectCreationList, stateBloatBond, objectIds);
}
exports.processDataObjectsUploadedEvent = processDataObjectsUploadedEvent;
async function processDataObjectsUpdatedEvent({ overlay, block, event: { asV1000: [{ bagId, objectCreationList, expectedDataObjectStateBloatBond: stateBloatBond }, uploadedObjectIds, objectsToRemoveIds,], }, }) {
    const bag = await (0, utils_2.getOrCreateBag)(overlay, bagId);
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    (0, utils_2.createDataObjects)(dataObjectRepository, block, bag.id, objectCreationList, stateBloatBond, uploadedObjectIds);
    await (0, utils_2.deleteDataObjectsByIds)(overlay, objectsToRemoveIds);
}
exports.processDataObjectsUpdatedEvent = processDataObjectsUpdatedEvent;
async function processPendingDataObjectsAcceptedEvent({ overlay, event: { asV1000: [, , , dataObjectIds], }, }) {
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    const objects = await Promise.all(dataObjectIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString())));
    objects.forEach((o) => (o.isAccepted = true));
}
exports.processPendingDataObjectsAcceptedEvent = processPendingDataObjectsAcceptedEvent;
async function processDataObjectsMovedEvent({ overlay, event: { asV1000: [, destBagId, dataObjectIds], }, }) {
    const destBag = await (0, utils_2.getOrCreateBag)(overlay, destBagId);
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    const dataObjects = await Promise.all(dataObjectIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString())));
    dataObjects.forEach((o) => {
        o.storageBagId = destBag.id;
    });
}
exports.processDataObjectsMovedEvent = processDataObjectsMovedEvent;
async function processDataObjectsDeletedEvent({ overlay, event: { asV1000: [, , dataObjectIds], }, }) {
    await (0, utils_2.deleteDataObjectsByIds)(overlay, dataObjectIds);
}
exports.processDataObjectsDeletedEvent = processDataObjectsDeletedEvent;
// DISTRIBUTION FAMILY EVENTS
async function processDistributionBucketFamilyCreatedEvent({ overlay, event: { asV1000: familyId }, }) {
    const familyRepository = overlay.getRepository(model_1.DistributionBucketFamily);
    familyRepository.new({ id: familyId.toString() });
}
exports.processDistributionBucketFamilyCreatedEvent = processDistributionBucketFamilyCreatedEvent;
async function processDistributionBucketFamilyMetadataSetEvent({ overlay, event: { asV1000: [familyId, metadataBytes], }, }) {
    const metadataUpdate = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.DistributionBucketFamilyMetadata, metadataBytes);
    if (metadataUpdate) {
        await (0, metadata_1.processDistributionBucketFamilyMetadata)(overlay, familyId.toString(), metadataUpdate);
    }
}
exports.processDistributionBucketFamilyMetadataSetEvent = processDistributionBucketFamilyMetadataSetEvent;
async function processDistributionBucketFamilyDeletedEvent({ overlay, event: { asV1000: familyId }, }) {
    overlay.getRepository(model_1.DistributionBucketFamilyMetadata).remove(familyId.toString());
    overlay.getRepository(model_1.DistributionBucketFamily).remove(familyId.toString());
}
exports.processDistributionBucketFamilyDeletedEvent = processDistributionBucketFamilyDeletedEvent;
// DISTRIBUTION BUCKET EVENTS
async function processDistributionBucketCreatedEvent({ overlay, event: { asV1000: [familyId, acceptingNewBags, bucketId], }, }) {
    overlay.getRepository(model_1.DistributionBucket).new({
        id: (0, utils_2.distributionBucketId)(bucketId),
        bucketIndex: Number(bucketId.distributionBucketIndex),
        acceptingNewBags,
        distributing: true,
        familyId: familyId.toString(),
    });
}
exports.processDistributionBucketCreatedEvent = processDistributionBucketCreatedEvent;
async function processDistributionBucketStatusUpdatedEvent({ overlay, event: { asV1000: [bucketId, acceptingNewBags], }, }) {
    const bucket = await overlay
        .getRepository(model_1.DistributionBucket)
        .getByIdOrFail((0, utils_2.distributionBucketId)(bucketId));
    bucket.acceptingNewBags = acceptingNewBags;
}
exports.processDistributionBucketStatusUpdatedEvent = processDistributionBucketStatusUpdatedEvent;
async function processDistributionBucketDeletedEvent({ overlay, event: { asV1000: bucketId }, }) {
    // Operators and bags need to be empty (enforced by runtime)
    overlay.getRepository(model_1.DistributionBucket).remove((0, utils_2.distributionBucketId)(bucketId));
}
exports.processDistributionBucketDeletedEvent = processDistributionBucketDeletedEvent;
async function processDistributionBucketsUpdatedForBagEvent({ overlay, event: { asV1000: [bagId, familyId, addedBucketsIndices, removedBucketsIndices], }, }) {
    await (0, utils_2.getOrCreateBag)(overlay, bagId);
    overlay.getRepository(model_1.DistributionBucketBag).remove(...removedBucketsIndices.map((index) => (0, utils_2.distributionBucketBagData)({
        distributionBucketFamilyId: familyId,
        distributionBucketIndex: index,
    }, bagId)));
    addedBucketsIndices.forEach((index) => overlay.getRepository(model_1.DistributionBucketBag).new((0, utils_2.distributionBucketBagData)({
        distributionBucketFamilyId: familyId,
        distributionBucketIndex: index,
    }, bagId)));
}
exports.processDistributionBucketsUpdatedForBagEvent = processDistributionBucketsUpdatedForBagEvent;
async function processDistributionBucketModeUpdatedEvent({ overlay, event: { asV1000: [bucketId, distributing], }, }) {
    const bucket = await overlay
        .getRepository(model_1.DistributionBucket)
        .getByIdOrFail((0, utils_2.distributionBucketId)(bucketId));
    bucket.distributing = distributing;
}
exports.processDistributionBucketModeUpdatedEvent = processDistributionBucketModeUpdatedEvent;
function processDistributionBucketOperatorInvitedEvent({ overlay, event: { asV1000: [bucketId, workerId], }, }) {
    const operatorRepository = overlay.getRepository(model_1.DistributionBucketOperator);
    operatorRepository.new({
        id: (0, utils_2.distributionOperatorId)(bucketId, workerId),
        distributionBucketId: (0, utils_2.distributionBucketId)(bucketId),
        status: model_1.DistributionBucketOperatorStatus.INVITED,
        workerId: Number(workerId),
    });
}
exports.processDistributionBucketOperatorInvitedEvent = processDistributionBucketOperatorInvitedEvent;
async function processDistributionBucketInvitationCancelledEvent({ overlay, event: { asV1000: [bucketId, workerId], }, }) {
    // Metadata should not exist, because the operator wasn't active
    overlay
        .getRepository(model_1.DistributionBucketOperator)
        .remove((0, utils_2.distributionOperatorId)(bucketId, workerId));
}
exports.processDistributionBucketInvitationCancelledEvent = processDistributionBucketInvitationCancelledEvent;
async function processDistributionBucketInvitationAcceptedEvent({ overlay, event: { asV1000: [workerId, bucketId], }, }) {
    const operator = await overlay
        .getRepository(model_1.DistributionBucketOperator)
        .getByIdOrFail((0, utils_2.distributionOperatorId)(bucketId, workerId));
    operator.status = model_1.DistributionBucketOperatorStatus.ACTIVE;
}
exports.processDistributionBucketInvitationAcceptedEvent = processDistributionBucketInvitationAcceptedEvent;
async function processDistributionBucketMetadataSetEvent({ overlay, event: { asV1000: [workerId, bucketId, metadataBytes], }, }) {
    const metadataUpdate = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.DistributionBucketOperatorMetadata, metadataBytes);
    if (metadataUpdate) {
        await (0, metadata_1.processDistributionOperatorMetadata)(overlay, (0, utils_2.distributionOperatorId)(bucketId, workerId), metadataUpdate);
    }
}
exports.processDistributionBucketMetadataSetEvent = processDistributionBucketMetadataSetEvent;
async function processDistributionBucketOperatorRemovedEvent({ overlay, event: { asV1000: [bucketId, workerId], }, }) {
    await (0, utils_2.removeDistributionBucketOperator)(overlay, (0, utils_2.distributionOperatorId)(bucketId, workerId));
}
exports.processDistributionBucketOperatorRemovedEvent = processDistributionBucketOperatorRemovedEvent;
//# sourceMappingURL=index.js.map