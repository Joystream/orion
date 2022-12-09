"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDataObjectsByIds = exports.deleteDataObjects = exports.getOrCreateBag = exports.removeDistributionBucketOperator = exports.unsetAssetRelations = exports.createDataObjects = exports.distributionBucketBagData = exports.storageBucketBagData = exports.distributionOperatorId = exports.distributionBucketId = exports.getStaticBagOwner = exports.getDynamicBagOwner = exports.getBagId = exports.getStaticBagId = exports.getDynamicBagId = void 0;
const model_1 = require("../../model");
const utils_1 = require("../utils");
const misc_1 = require("../../utils/misc");
const utils_2 = require("../content/utils");
function getDynamicBagId(bagId) {
    if (bagId.__kind === 'Channel') {
        return `dynamic:channel:${bagId.value.toString()}`;
    }
    if (bagId.__kind === 'Member') {
        return `dynamic:member:${bagId.value.toString()}`;
    }
    (0, misc_1.criticalError)(`Unexpected dynamic bag type`, { bagId });
}
exports.getDynamicBagId = getDynamicBagId;
function getStaticBagId(bagId) {
    if (bagId.__kind === 'Council') {
        return `static:council`;
    }
    if (bagId.__kind === 'WorkingGroup') {
        return `static:wg:${bagId.value.__kind.toLowerCase()}`;
    }
    (0, misc_1.criticalError)(`Unexpected static bag type`, { bagId });
}
exports.getStaticBagId = getStaticBagId;
function getBagId(bagId) {
    return bagId.__kind === 'Static' ? getStaticBagId(bagId.value) : getDynamicBagId(bagId.value);
}
exports.getBagId = getBagId;
function getDynamicBagOwner(bagId) {
    if (bagId.__kind === 'Channel') {
        return new model_1.StorageBagOwnerChannel({ channelId: bagId.value.toString() });
    }
    if (bagId.__kind === 'Member') {
        return new model_1.StorageBagOwnerMember({ memberId: bagId.value.toString() });
    }
    (0, misc_1.criticalError)(`Unexpected dynamic bag type`, { bagId });
}
exports.getDynamicBagOwner = getDynamicBagOwner;
function getStaticBagOwner(bagId) {
    if (bagId.__kind === 'Council') {
        return new model_1.StorageBagOwnerCouncil();
    }
    else if (bagId.__kind === 'WorkingGroup') {
        return new model_1.StorageBagOwnerWorkingGroup({ workingGroupId: bagId.value.__kind.toLowerCase() });
    }
    (0, misc_1.criticalError)(`Unexpected static bag type`, { bagId });
}
exports.getStaticBagOwner = getStaticBagOwner;
function distributionBucketId({ distributionBucketFamilyId: familyId, distributionBucketIndex: bucketIndex, }) {
    return `${familyId.toString()}:${bucketIndex.toString()}`;
}
exports.distributionBucketId = distributionBucketId;
function distributionOperatorId(bucketId, workerId) {
    return `${distributionBucketId(bucketId)}-${workerId.toString()}`;
}
exports.distributionOperatorId = distributionOperatorId;
function storageBucketBagData(bucketId, bagId) {
    bagId = typeof bagId === 'string' ? bagId : getBagId(bagId);
    return {
        id: `${bucketId.toString()}-${bagId}`,
        storageBucketId: bucketId.toString(),
        bagId,
    };
}
exports.storageBucketBagData = storageBucketBagData;
function distributionBucketBagData(bucketId, bagId) {
    bucketId = typeof bucketId === 'string' ? bucketId : distributionBucketId(bucketId);
    bagId = typeof bagId === 'string' ? bagId : getBagId(bagId);
    return {
        id: `${bucketId}-${bagId}`,
        distributionBucketId: bucketId,
        bagId,
    };
}
exports.distributionBucketBagData = distributionBucketBagData;
function createDataObjects(dataObjectRepository, block, storageBagId, objectCreationList, stateBloatBond, objectIds) {
    const dataObjects = objectCreationList.map((objectParams, i) => {
        const objectId = objectIds[i];
        const object = dataObjectRepository.new({
            id: objectId.toString(),
            createdAt: new Date(block.timestamp),
            isAccepted: false,
            ipfsHash: (0, utils_1.bytesToString)(objectParams.ipfsContentId),
            size: objectParams.size,
            stateBloatBond,
            storageBagId,
            // Note: It may be a little confusing to populate this with objectId,
            // but this is required for the Orion's GraphQL server to be able to resolve
            // this field to an actual asset url via the AssetsResolver
            resolvedUrls: [objectId.toString()],
        });
        return object;
    });
    return dataObjects;
}
exports.createDataObjects = createDataObjects;
async function unsetAssetRelations(overlay, dataObject) {
    for (const { DataObjectTypeConstructor, entityProperty } of Object.values(utils_2.ASSETS_MAP.channel)) {
        if (dataObject.type instanceof DataObjectTypeConstructor) {
            const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(dataObject.type.channel);
            channel[entityProperty] = null;
        }
    }
    for (const { DataObjectTypeConstructor, entityProperty } of Object.values(utils_2.ASSETS_MAP.video)) {
        if (dataObject.type instanceof DataObjectTypeConstructor) {
            const video = await overlay.getRepository(model_1.Video).getByIdOrFail(dataObject.type.video);
            video[entityProperty] = null;
        }
    }
    for (const { DataObjectTypeConstructor, entityProperty } of Object.values(utils_2.ASSETS_MAP.subtitle)) {
        if (dataObject.type instanceof DataObjectTypeConstructor) {
            const subtitle = await overlay
                .getRepository(model_1.VideoSubtitle)
                .getByIdOrFail(dataObject.type.subtitle);
            subtitle[entityProperty] = null;
        }
    }
}
exports.unsetAssetRelations = unsetAssetRelations;
async function removeDistributionBucketOperator(overlay, operatorId) {
    overlay.getRepository(model_1.DistributionBucketOperator).remove(operatorId);
    overlay.getRepository(model_1.DistributionBucketOperatorMetadata).remove(operatorId);
}
exports.removeDistributionBucketOperator = removeDistributionBucketOperator;
async function getOrCreateBag(overlay, bagId) {
    const bagRepository = overlay.getRepository(model_1.StorageBag);
    const bag = await bagRepository.getById(getBagId(bagId));
    if (bag) {
        return bag;
    }
    if (bagId.__kind === 'Dynamic') {
        (0, misc_1.criticalError)(`Missing dynamic bag`, { id: bagId.value });
    }
    const newBag = bagRepository.new({
        id: getBagId(bagId),
        owner: getStaticBagOwner(bagId.value),
    });
    return newBag;
}
exports.getOrCreateBag = getOrCreateBag;
async function deleteDataObjects(overlay, objects) {
    overlay.getRepository(model_1.StorageDataObject).remove(...objects);
    await Promise.all(objects.map((o) => unsetAssetRelations(overlay, o)));
}
exports.deleteDataObjects = deleteDataObjects;
async function deleteDataObjectsByIds(overlay, ids) {
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    const objects = await Promise.all(ids.map((id) => dataObjectRepository.getByIdOrFail(id.toString())));
    await deleteDataObjects(overlay, objects);
}
exports.deleteDataObjectsByIds = deleteDataObjectsByIds;
//# sourceMappingURL=utils.js.map