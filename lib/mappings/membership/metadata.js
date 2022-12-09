"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMemberRemark = exports.processMembershipMetadata = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const model_1 = require("../../model");
const utils_1 = require("@joystream/metadata-protobuf/utils");
const utils_2 = require("../utils");
const commentsAndReactions_1 = require("../content/commentsAndReactions");
const app_1 = require("../content/app");
const metadata_1 = require("../content/metadata");
async function processMembershipMetadata(overlay, memberId, metadataUpdate) {
    const metadataRepository = overlay.getRepository(model_1.MemberMetadata);
    const memberMetadata = (await metadataRepository.getById(memberId)) ||
        metadataRepository.new({ id: memberId, memberId });
    if ((0, utils_1.isSet)(metadataUpdate.avatarUri)) {
        memberMetadata.avatar = metadataUpdate.avatarUri
            ? new model_1.AvatarUri({ avatarUri: metadataUpdate.avatarUri })
            : null;
    }
    if ((0, utils_1.isSet)(metadataUpdate.name)) {
        // On empty string, set to `null`
        memberMetadata.name = metadataUpdate.name || null;
    }
    if ((0, utils_1.isSet)(metadataUpdate.about)) {
        // On empty string, set to `null`
        memberMetadata.about = metadataUpdate.about || null;
    }
}
exports.processMembershipMetadata = processMembershipMetadata;
async function processMemberRemark(overlay, block, indexInBlock, txHash, memberId, decodedMessage, payment) {
    if (decodedMessage.createApp) {
        return (0, app_1.processCreateAppMessage)(overlay, block.height, indexInBlock, decodedMessage.createApp, memberId);
    }
    if (decodedMessage.updateApp) {
        return (0, app_1.processUpdateAppMessage)(overlay, decodedMessage.updateApp, memberId);
    }
    if (decodedMessage.reactVideo) {
        return (0, commentsAndReactions_1.processReactVideoMessage)(overlay, block, memberId, decodedMessage.reactVideo);
    }
    if (decodedMessage.reactComment) {
        return (0, commentsAndReactions_1.processReactCommentMessage)(overlay, memberId, decodedMessage.reactComment);
    }
    if (decodedMessage.createComment) {
        return (0, commentsAndReactions_1.processCreateCommentMessage)(overlay, block, indexInBlock, txHash, memberId, decodedMessage.createComment);
    }
    if (decodedMessage.editComment) {
        return (0, commentsAndReactions_1.processEditCommentMessage)(overlay, block, indexInBlock, txHash, memberId, decodedMessage.editComment);
    }
    if (decodedMessage.deleteComment) {
        return (0, commentsAndReactions_1.processDeleteCommentMessage)(overlay, memberId, decodedMessage.deleteComment);
    }
    // Though the payments can be sent along with any arbitrary metadata message type,
    // however they will only be processed if the message type is 'makeChannelPayment'
    if (decodedMessage.makeChannelPayment) {
        if (!payment) {
            return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.MemberRemarked, `payment info should be set when sending remark with 'makeChannelPayment' message type`, { decodedMessage });
        }
        return (0, metadata_1.processChannelPaymentFromMember)(overlay, block, indexInBlock, txHash, decodedMessage.makeChannelPayment, memberId, payment);
    }
    if (decodedMessage.createVideoCategory) {
        return (0, commentsAndReactions_1.processCreateVideoCategoryMessage)(overlay, block, indexInBlock, decodedMessage.createVideoCategory);
    }
    // unknown message type
    return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.MemberRemarked, 'Unsupported remark action', {
        decodedMessage,
    });
}
exports.processMemberRemark = processMemberRemark;
//# sourceMappingURL=metadata.js.map