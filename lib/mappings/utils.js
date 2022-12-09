"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.u8aToBytes = exports.backwardCompatibleMetaID = exports.metaprotocolTransactionFailure = exports.toAddress = exports.addNftActivity = exports.addNftHistoryEntry = exports.addNotification = exports.genericEventFields = exports.invalidMetadata = exports.deserializeMetadata = exports.bytesToString = exports.JOYSTREAM_SS58_PREFIX = exports.videoRelevanceManager = exports.commentCountersManager = void 0;
const utils_1 = require("@joystream/metadata-protobuf/utils");
const logger_1 = require("../logger");
const model_1 = require("../model");
const util_crypto_1 = require("@polkadot/util-crypto");
const types_1 = require("@joystream/types");
const util_1 = require("@polkadot/util");
const CommentsCountersManager_1 = require("../utils/CommentsCountersManager");
const VideoRelevanceManager_1 = require("../utils/VideoRelevanceManager");
exports.commentCountersManager = new CommentsCountersManager_1.CommentCountersManager();
exports.videoRelevanceManager = new VideoRelevanceManager_1.VideoRelevanceManager();
exports.videoRelevanceManager.init(1000 * 60 * 60);
exports.JOYSTREAM_SS58_PREFIX = 126;
function bytesToString(b) {
    return Buffer.from(b).toString();
}
exports.bytesToString = bytesToString;
function deserializeMetadata(metadataType, metadataBytes, opts = {
    skipWarning: false,
}) {
    logger_1.Logger.get().debug(`Trying to deserialize ${Buffer.from(metadataBytes).toString('hex')} as ${metadataType.name}...`);
    try {
        const message = metadataType.decode(metadataBytes);
        return (0, utils_1.metaToObject)(metadataType, message);
    }
    catch (e) {
        if (!opts.skipWarning) {
            invalidMetadata(metadataType, 'Could not decode the input ', {
                encodedMessage: Buffer.from(metadataBytes).toString('hex'),
            });
        }
        return null;
    }
}
exports.deserializeMetadata = deserializeMetadata;
function invalidMetadata(type, message, data) {
    logger_1.Logger.get().warn(`Invalid metadata (${type.name}): ${message}`, { ...data, type });
}
exports.invalidMetadata = invalidMetadata;
function genericEventFields(overlay, block, indexInBlock, txHash) {
    return {
        id: overlay.getRepository(model_1.Event).getNewEntityId(),
        inBlock: block.height,
        indexInBlock,
        timestamp: new Date(block.timestamp),
        inExtrinsic: txHash,
    };
}
exports.genericEventFields = genericEventFields;
function addNotification(overlay, memberIds, eventId) {
    const repository = overlay.getRepository(model_1.Notification);
    for (const memberId of memberIds.filter((m) => m)) {
        repository.new({ id: repository.getNewEntityId(), memberId, eventId });
    }
}
exports.addNotification = addNotification;
function addNftHistoryEntry(overlay, nftId, eventId) {
    const repository = overlay.getRepository(model_1.NftHistoryEntry);
    repository.new({
        id: repository.getNewEntityId(),
        nftId,
        eventId,
    });
}
exports.addNftHistoryEntry = addNftHistoryEntry;
function addNftActivity(overlay, memberIds, eventId) {
    const repository = overlay.getRepository(model_1.NftActivity);
    for (const memberId of memberIds.filter((m) => m)) {
        repository.new({
            id: repository.getNewEntityId(),
            memberId,
            eventId,
        });
    }
}
exports.addNftActivity = addNftActivity;
function toAddress(addressBytes) {
    return (0, util_crypto_1.encodeAddress)(addressBytes, exports.JOYSTREAM_SS58_PREFIX);
}
exports.toAddress = toAddress;
function metaprotocolTransactionFailure(metaClass, message, data) {
    invalidMetadata(metaClass, message, data);
    return new model_1.MetaprotocolTransactionResultFailed({
        errorMessage: message,
    });
}
exports.metaprotocolTransactionFailure = metaprotocolTransactionFailure;
function backwardCompatibleMetaID(block, indexInBlock) {
    return `METAPROTOCOL-OLYMPIA-${block.height}-${indexInBlock}`;
}
exports.backwardCompatibleMetaID = backwardCompatibleMetaID;
function u8aToBytes(array) {
    return (0, types_1.createType)('Bytes', array ? (0, util_1.u8aToHex)(array) : '');
}
exports.u8aToBytes = u8aToBytes;
//# sourceMappingURL=utils.js.map