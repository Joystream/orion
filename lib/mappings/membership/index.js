"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMemberRemarkedEvent = exports.processMemberProfileUpdatedEvent = exports.processMemberAccountsUpdatedEvent = exports.processNewMember = void 0;
const model_1 = require("../../model");
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const utils_1 = require("../utils");
const metadata_1 = require("./metadata");
async function processNewMember({ overlay, block, event, }) {
    const [memberId, params] = 'isV2001' in event && event.isV2001 ? event.asV2001 : event.asV1000;
    const { controllerAccount, handle, metadata: metadataBytes } = params;
    const metadata = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.MembershipMetadata, metadataBytes);
    const member = overlay.getRepository(model_1.Membership).new({
        createdAt: new Date(block.timestamp),
        id: memberId.toString(),
        controllerAccount: (0, utils_1.toAddress)(controllerAccount),
        handle: handle && (0, utils_1.bytesToString)(handle),
        totalChannelsCreated: 0,
    });
    if (metadata) {
        await (0, metadata_1.processMembershipMetadata)(overlay, member.id, metadata);
    }
}
exports.processNewMember = processNewMember;
async function processMemberAccountsUpdatedEvent({ overlay, event: { asV1000: [memberId, , newControllerAccount], }, }) {
    if (newControllerAccount) {
        const member = await overlay.getRepository(model_1.Membership).getByIdOrFail(memberId.toString());
        member.controllerAccount = (0, utils_1.toAddress)(newControllerAccount);
    }
}
exports.processMemberAccountsUpdatedEvent = processMemberAccountsUpdatedEvent;
async function processMemberProfileUpdatedEvent({ overlay, event: { asV1000: [memberId, newHandle, newMetadata], }, }) {
    const member = await overlay.getRepository(model_1.Membership).getByIdOrFail(memberId.toString());
    if (newHandle) {
        member.handle = newHandle.toString();
    }
    if (newMetadata) {
        const metadataUpdate = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.MembershipMetadata, newMetadata);
        if (metadataUpdate) {
            await (0, metadata_1.processMembershipMetadata)(overlay, member.id, metadataUpdate);
        }
    }
}
exports.processMemberProfileUpdatedEvent = processMemberProfileUpdatedEvent;
async function processMemberRemarkedEvent({ overlay, block, indexInBlock, extrinsicHash, event, }) {
    const [memberId, message, payment] = event.isV2001 ? event.asV2001 : event.asV1000;
    const metadata = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.MemberRemarked, message);
    const result = metadata
        ? await (0, metadata_1.processMemberRemark)(overlay, block, indexInBlock, extrinsicHash, memberId.toString(), metadata, payment && [(0, utils_1.toAddress)(payment[0]), payment[1]])
        : new model_1.MetaprotocolTransactionResultFailed({
            errorMessage: 'Could not decode the metadata',
        });
    const eventRepository = overlay.getRepository(model_1.Event);
    eventRepository.new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.MetaprotocolTransactionStatusEventData({
            result,
        }),
    });
}
exports.processMemberRemarkedEvent = processMemberRemarkedEvent;
//# sourceMappingURL=index.js.map