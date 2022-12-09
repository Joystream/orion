"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoVisibilitySetByModeratorEvent = exports.processVideoDeletedByModeratorEvent = exports.processVideoDeletedEvent = exports.processVideoUpdatedEvent = exports.processVideoCreatedEvent = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const utils_1 = require("@joystream/metadata-protobuf/utils");
const model_1 = require("../../model");
const utils_2 = require("../utils");
const metadata_1 = require("./metadata");
const utils_3 = require("./utils");
const utils_4 = require("@joystream/js/utils");
async function processVideoCreatedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [contentActor, channelId, contentId, contentCreationParameters, newDataObjectIds], }, }) {
    const { meta, expectedVideoStateBloatBond, autoIssueNft } = contentCreationParameters;
    const videoId = contentId.toString();
    const viewsNum = await overlay.getEm().getRepository(model_1.VideoViewEvent).countBy({ videoId });
    const video = overlay.getRepository(model_1.Video).new({
        id: videoId,
        createdAt: new Date(block.timestamp),
        channelId: channelId.toString(),
        isCensored: false,
        isExcluded: false,
        createdInBlock: block.height,
        isCommentSectionEnabled: true,
        isReactionFeatureEnabled: true,
        videoStateBloatBond: expectedVideoStateBloatBond,
        commentsCount: 0,
        reactionsCount: 0,
        viewsNum,
        // First we need to dic by 1k to match postgres epoch (in seconds) then apply the further dividers
        videoRelevance: 0,
    });
    utils_2.videoRelevanceManager.scheduleRecalcForVideo(videoId);
    // fetch related channel and owner
    const channel = await overlay.getRepository(model_1.Channel).getByIdOrFail(channelId.toString());
    // update channels videoViewsNum
    channel.videoViewsNum += viewsNum;
    // deserialize & process metadata
    const appAction = meta && (0, utils_2.deserializeMetadata)(metadata_protobuf_1.AppAction, meta, { skipWarning: true });
    if (appAction) {
        const videoMetadata = appAction.rawAction
            ? (0, utils_2.deserializeMetadata)(metadata_protobuf_1.ContentMetadata, appAction.rawAction)?.videoMetadata ?? {}
            : {};
        const expectedCommitment = (0, utils_4.generateAppActionCommitment)(channel.totalVideosCreated, channel.id, metadata_protobuf_1.AppAction.ActionType.CREATE_VIDEO, metadata_protobuf_1.AppAction.CreatorType.CHANNEL, (0, utils_3.encodeAssets)(contentCreationParameters.assets), appAction.rawAction ?? undefined, appAction.metadata ?? undefined);
        await (0, utils_3.processAppActionMetadata)(overlay, video, appAction, expectedCommitment, (entity) => {
            if (entity.entryAppId && appAction.metadata) {
                const appActionMetadata = (0, utils_2.deserializeMetadata)(metadata_protobuf_1.AppActionMetadata, appAction.metadata);
                appActionMetadata?.videoId &&
                    (0, utils_1.integrateMeta)(entity, { ytVideoId: appActionMetadata.videoId }, ['ytVideoId']);
            }
            return (0, metadata_1.processVideoMetadata)(overlay, block, indexInBlock, entity, videoMetadata, newDataObjectIds);
        });
    }
    else {
        const contentMetadata = meta && (0, utils_2.deserializeMetadata)(metadata_protobuf_1.ContentMetadata, meta);
        if (contentMetadata?.videoMetadata) {
            await (0, metadata_1.processVideoMetadata)(overlay, block, indexInBlock, video, contentMetadata.videoMetadata, newDataObjectIds);
        }
    }
    channel.totalVideosCreated += 1;
    if (autoIssueNft) {
        await (0, utils_3.processNft)(overlay, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft);
    }
}
exports.processVideoCreatedEvent = processVideoCreatedEvent;
async function processVideoUpdatedEvent({ overlay, block, indexInBlock, extrinsicHash, event: { asV1000: [contentActor, contentId, contentUpdateParameters, newDataObjectIds], }, }) {
    const { newMeta, autoIssueNft } = contentUpdateParameters;
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail(contentId.toString());
    const appAction = newMeta && (0, utils_2.deserializeMetadata)(metadata_protobuf_1.AppAction, newMeta, { skipWarning: true });
    let videoMetadataUpdate;
    if (appAction) {
        const contentMetadataBytes = (0, utils_2.u8aToBytes)(appAction.rawAction);
        videoMetadataUpdate = (0, utils_2.deserializeMetadata)(metadata_protobuf_1.ContentMetadata, contentMetadataBytes.toU8a(true))?.videoMetadata;
    }
    else {
        const contentMetadata = newMeta && (0, utils_2.deserializeMetadata)(metadata_protobuf_1.ContentMetadata, newMeta);
        videoMetadataUpdate = contentMetadata?.videoMetadata;
    }
    if (videoMetadataUpdate) {
        if ('publishedBeforeJoystream' in videoMetadataUpdate) {
            delete videoMetadataUpdate.publishedBeforeJoystream;
        }
        await (0, metadata_1.processVideoMetadata)(overlay, block, indexInBlock, video, videoMetadataUpdate, newDataObjectIds);
    }
    if (autoIssueNft) {
        await (0, utils_3.processNft)(overlay, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft);
    }
}
exports.processVideoUpdatedEvent = processVideoUpdatedEvent;
async function processVideoDeletedEvent({ overlay, event: { asV1000: [, contentId], }, }) {
    await (0, utils_3.deleteVideo)(overlay, contentId);
}
exports.processVideoDeletedEvent = processVideoDeletedEvent;
async function processVideoDeletedByModeratorEvent({ overlay, event: { asV1000: [, contentId], }, }) {
    await (0, utils_3.deleteVideo)(overlay, contentId);
}
exports.processVideoDeletedByModeratorEvent = processVideoDeletedByModeratorEvent;
async function processVideoVisibilitySetByModeratorEvent({ overlay, event: { asV1000: [, videoId, isCensored], }, }) {
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail(videoId.toString());
    video.isCensored = isCensored;
}
exports.processVideoVisibilitySetByModeratorEvent = processVideoVisibilitySetByModeratorEvent;
//# sourceMappingURL=video.js.map