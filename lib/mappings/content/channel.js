"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processChannelFundsWithdrawnEvent = exports.processChannelRewardClaimedAndWithdrawnEvent = exports.processChannelRewardUpdatedEvent = exports.processChannelPayoutsUpdatedEvent = exports.processChannelAgentRemarkedEvent = exports.processChannelOwnerRemarkedEvent = exports.processChannelVisibilitySetByModeratorEvent = exports.processChannelDeletedByModeratorEvent = exports.processChannelDeletedEvent = exports.processChannelUpdatedEvent = exports.processChannelCreatedEvent = void 0;
const model_1 = require("../../model");
const utils_1 = require("../utils");
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const metadata_1 = require("./metadata");
const utils_2 = require("./utils");
const utils_3 = require("@joystream/js/utils");
async function processChannelCreatedEvent({ overlay, block, event: { asV1000: [channelId, { owner, dataObjects, channelStateBloatBond }, channelCreationParameters, rewardAccount,], }, }) {
    const followsNum = await overlay
        .getEm()
        .getRepository(model_1.ChannelFollow)
        .countBy({ channelId: channelId.toString() });
    // create entity
    const channel = overlay.getRepository(model_1.Channel).new({
        id: channelId.toString(),
        isCensored: false,
        isExcluded: false,
        createdAt: new Date(block.timestamp),
        createdInBlock: block.height,
        ownerMemberId: owner.__kind === 'Member' ? owner.value.toString() : undefined,
        rewardAccount: (0, utils_1.toAddress)(rewardAccount),
        channelStateBloatBond: channelStateBloatBond.amount,
        followsNum,
        videoViewsNum: 0,
        totalVideosCreated: 0,
    });
    const ownerMember = channel.ownerMemberId
        ? await overlay.getRepository(model_1.Membership).getByIdOrFail(channel.ownerMemberId)
        : undefined;
    // deserialize & process metadata
    if (channelCreationParameters.meta !== undefined) {
        const appAction = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.AppAction, channelCreationParameters.meta, {
            skipWarning: true,
        });
        if (appAction) {
            const channelMetadata = appAction.rawAction
                ? (0, utils_1.deserializeMetadata)(metadata_protobuf_1.ChannelMetadata, appAction.rawAction) ?? {}
                : {};
            const creatorType = channel.ownerMemberId
                ? metadata_protobuf_1.AppAction.CreatorType.MEMBER
                : metadata_protobuf_1.AppAction.CreatorType.CURATOR_GROUP;
            const creatorId = channel.ownerMemberId ?? ''; // curator groups not supported yet
            const expectedCommitment = (0, utils_3.generateAppActionCommitment)(ownerMember?.totalChannelsCreated ?? -1, creatorId, metadata_protobuf_1.AppAction.ActionType.CREATE_CHANNEL, creatorType, (0, utils_2.encodeAssets)(channelCreationParameters.assets), appAction.rawAction ?? undefined, appAction.metadata ?? undefined);
            await (0, utils_2.processAppActionMetadata)(overlay, channel, appAction, expectedCommitment, (entity) => (0, metadata_1.processChannelMetadata)(overlay, block, entity, channelMetadata, dataObjects));
        }
        else {
            const metadata = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.ChannelMetadata, channelCreationParameters.meta) ?? {};
            await (0, metadata_1.processChannelMetadata)(overlay, block, channel, metadata, dataObjects);
        }
    }
    if (ownerMember) {
        ownerMember.totalChannelsCreated += 1;
    }
}
exports.processChannelCreatedEvent = processChannelCreatedEvent;
async function processChannelUpdatedEvent({ overlay, block, event: { asV1000: [, channelId, channelUpdateParameters, newDataObjects], }, }) {
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    //  update metadata if it was changed
    if (channelUpdateParameters.newMeta) {
        const appAction = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.AppAction, channelUpdateParameters.newMeta, {
            skipWarning: true,
        });
        let channelMetadataUpdate;
        if (appAction) {
            const channelMetadataBytes = (0, utils_1.u8aToBytes)(appAction.rawAction);
            channelMetadataUpdate = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.ChannelMetadata, channelMetadataBytes.toU8a(true));
        }
        else {
            channelMetadataUpdate = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.ChannelMetadata, channelUpdateParameters.newMeta);
        }
        await (0, metadata_1.processChannelMetadata)(overlay, block, channel, channelMetadataUpdate ?? {}, newDataObjects);
    }
}
exports.processChannelUpdatedEvent = processChannelUpdatedEvent;
async function processChannelDeletedEvent({ overlay, event: { asV1000: [, channelId], }, }) {
    await (0, utils_2.deleteChannel)(overlay, channelId);
}
exports.processChannelDeletedEvent = processChannelDeletedEvent;
async function processChannelDeletedByModeratorEvent({ overlay, event: { asV1000: [, channelId], }, }) {
    await (0, utils_2.deleteChannel)(overlay, channelId);
}
exports.processChannelDeletedByModeratorEvent = processChannelDeletedByModeratorEvent;
async function processChannelVisibilitySetByModeratorEvent({ overlay, event: { asV1000: [, channelId, isHidden], }, }) {
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    channel.isCensored = isHidden;
}
exports.processChannelVisibilitySetByModeratorEvent = processChannelVisibilitySetByModeratorEvent;
async function processChannelOwnerRemarkedEvent({ block, indexInBlock, extrinsicHash, overlay, event: { asV1000: [channelId, messageBytes], }, }) {
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    const decodedMessage = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.ChannelOwnerRemarked, messageBytes);
    const result = decodedMessage
        ? await (0, metadata_1.processOwnerRemark)(overlay, block, indexInBlock, extrinsicHash, channel, decodedMessage)
        : new model_1.MetaprotocolTransactionResultFailed({
            errorMessage: 'Could not decode the metadata',
        });
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.MetaprotocolTransactionStatusEventData({
            result,
        }),
    });
}
exports.processChannelOwnerRemarkedEvent = processChannelOwnerRemarkedEvent;
async function processChannelAgentRemarkedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [, channelId, messageBytes], }, }) {
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    const decodedMessage = (0, utils_1.deserializeMetadata)(metadata_protobuf_1.ChannelModeratorRemarked, messageBytes);
    const result = decodedMessage
        ? await (0, metadata_1.processModeratorRemark)(overlay, channel, decodedMessage)
        : new model_1.MetaprotocolTransactionResultFailed({
            errorMessage: 'Could not decode the metadata',
        });
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.MetaprotocolTransactionStatusEventData({
            result,
        }),
    });
}
exports.processChannelAgentRemarkedEvent = processChannelAgentRemarkedEvent;
async function processChannelPayoutsUpdatedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { 
// Was impossible to emit before v2001
asV2001: [updateChannelPayoutParameters, dataObjectId], }, }) {
    const payloadDataObject = dataObjectId !== undefined
        ? await overlay.getRepository(model_1.StorageDataObject).getByIdOrFail(dataObjectId.toString())
        : undefined;
    if (payloadDataObject) {
        payloadDataObject.type = new model_1.DataObjectTypeChannelPayoutsPayload();
    }
    const { minCashoutAllowed, maxCashoutAllowed, channelCashoutsEnabled, commitment } = updateChannelPayoutParameters;
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.ChannelPayoutsUpdatedEventData({
            commitment: commitment && `0x${Buffer.from(commitment).toString('hex')}`,
            minCashoutAllowed,
            maxCashoutAllowed,
            channelCashoutsEnabled,
            payloadDataObject: payloadDataObject?.id,
        }),
    });
}
exports.processChannelPayoutsUpdatedEvent = processChannelPayoutsUpdatedEvent;
async function processChannelRewardUpdatedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { 
// Was impossible to emit before v2001
asV2001: [, claimedAmount, channelId], }, }) {
    // load channel
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.ChannelRewardClaimedEventData({
            amount: claimedAmount,
            channel: channel.id,
        }),
    });
    channel.cumulativeRewardClaimed = (channel.cumulativeRewardClaimed || 0n) + claimedAmount;
}
exports.processChannelRewardUpdatedEvent = processChannelRewardUpdatedEvent;
async function processChannelRewardClaimedAndWithdrawnEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [actor, channelId, claimedAmount, destination], }, }) {
    // load channel
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.ChannelRewardClaimedAndWithdrawnEventData({
            amount: claimedAmount,
            channel: channel.id,
            account: destination.__kind === 'AccountId' ? (0, utils_1.toAddress)(destination.value) : undefined,
            actor: (0, utils_2.parseContentActor)(actor),
        }),
    });
    channel.cumulativeRewardClaimed = (channel.cumulativeRewardClaimed || 0n) + claimedAmount;
}
exports.processChannelRewardClaimedAndWithdrawnEvent = processChannelRewardClaimedAndWithdrawnEvent;
async function processChannelFundsWithdrawnEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [actor, channelId, amount, destination], }, }) {
    // load channel
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_1.genericEventFields)(overlay, block, indexInBlock, extrinsicHash),
        data: new model_1.ChannelFundsWithdrawnEventData({
            amount,
            channel: channel.id,
            account: destination.__kind === 'AccountId' ? (0, utils_1.toAddress)(destination.value) : undefined,
            actor: (0, utils_2.parseContentActor)(actor),
        }),
    });
}
exports.processChannelFundsWithdrawnEvent = processChannelFundsWithdrawnEvent;
//# sourceMappingURL=channel.js.map