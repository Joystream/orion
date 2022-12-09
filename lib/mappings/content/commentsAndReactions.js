"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCreateVideoCategoryMessage = exports.processDeleteCommentMessage = exports.processEditCommentMessage = exports.processCreateCommentMessage = exports.processReactCommentMessage = exports.processReactVideoMessage = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const utils_1 = require("@joystream/metadata-protobuf/utils");
const substrate_processor_1 = require("@subsquid/substrate-processor");
const model_1 = require("../../model");
const config_1 = require("../../utils/config");
const utils_2 = require("../utils");
const utils_3 = require("./utils");
function parseVideoReaction(reaction) {
    const protobufReactionToGraphqlReaction = {
        [metadata_protobuf_1.ReactVideo.Reaction.LIKE]: model_1.VideoReactionOptions.LIKE,
        [metadata_protobuf_1.ReactVideo.Reaction.UNLIKE]: model_1.VideoReactionOptions.UNLIKE,
    };
    return protobufReactionToGraphqlReaction[reaction];
}
function getOrCreateVideoReactionsCountByType(video, reactionType) {
    video.reactionsCountByReactionId = video.reactionsCountByReactionId || [];
    let counter = video.reactionsCountByReactionId.find((c) => c.reaction === reactionType);
    if (!counter) {
        counter = new model_1.VideoReactionsCountByReactionType({ reaction: reactionType, count: 0 });
        video.reactionsCountByReactionId.push(counter);
    }
    return counter;
}
function getOrCreateCommentReactionsCountByReactionId(comment, reactionId) {
    comment.reactionsCountByReactionId = comment.reactionsCountByReactionId || [];
    let counter = comment.reactionsCountByReactionId.find((c) => c.reactionId === reactionId);
    if (!counter) {
        counter = new model_1.CommentReactionsCountByReactionId({
            reactionId,
            count: 0,
        });
        comment.reactionsCountByReactionId.push(counter);
    }
    return counter;
}
function videoReactionEntityId(idSegments) {
    const { memberId, videoId } = idSegments;
    return `${memberId}-${videoId}`;
}
function commentReactionEntityId(idSegments) {
    const { memberId, commentId, reactionId } = idSegments;
    return `${memberId}-${commentId}-${reactionId}`;
}
// Common errors
function notFoundError(metaClass, decodedMessage, entityName, entityId) {
    return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `${entityName} by id ${entityId} not found`, {
        decodedMessage,
    });
}
function bannedFromChannelError(metaClass, decodedMessage, memberId, channelId) {
    return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Member ${memberId} is banned from channel ${channelId}: `, { decodedMessage });
}
function reactionsDisabledError(metaClass, decodedMessage, videoId) {
    return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Reaction feature is disabled on video ${videoId}`, { decodedMessage });
}
function commentsDisabledError(metaClass, decodedMessage, videoId) {
    return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Comments are disabled on video ${videoId}`, {
        decodedMessage,
    });
}
function notCommentAuthorError(metaClass, decodedMessage, memberId, commentId) {
    return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Only comment author can update or remove the comment. Member ${memberId} is not the author of comment ${commentId}`, { decodedMessage });
}
function unexpectedCommentStatusError(metaClass, decodedMessage, status) {
    return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Unexpected comment status: ${status}`, {
        decodedMessage,
    });
}
function processVideoReaction(overlay, block, memberId, video, reactionType, existingReaction) {
    const videoReactionRepository = overlay.getRepository(model_1.VideoReaction);
    const newReactionTypeCounter = getOrCreateVideoReactionsCountByType(video, reactionType);
    const videoReaction = existingReaction ||
        videoReactionRepository.new({
            id: videoReactionEntityId({ memberId, videoId: video.id }),
            videoId: video.id,
            reaction: reactionType,
            memberId,
            createdAt: new Date(block.timestamp),
        });
    if (existingReaction) {
        const previousReactionTypeCounter = getOrCreateVideoReactionsCountByType(video, existingReaction.reaction);
        // remove the reaction if member has already reacted with the same option
        if (reactionType === existingReaction.reaction) {
            // decrement reactions count
            --video.reactionsCount;
            --previousReactionTypeCounter.count;
            // remove reaction
            videoReactionRepository.remove(existingReaction);
            return;
        }
        // otherwise...
        // increment reaction count of the new reaction type
        ++newReactionTypeCounter.count;
        // decrement reaction count of previous reaction type
        --previousReactionTypeCounter.count;
        // update the existing reaction's type
        videoReaction.reaction = reactionType;
    }
    else {
        ++video.reactionsCount;
        ++newReactionTypeCounter.count;
    }
}
async function processReactVideoMessage(overlay, block, memberId, message) {
    const { videoId, reaction } = message;
    const reactionType = parseVideoReaction(reaction);
    // load video
    const video = await overlay.getRepository(model_1.Video).getById(videoId);
    // ensure video exists
    if (!video) {
        return notFoundError(metadata_protobuf_1.ReactVideo, message, 'Video', videoId);
    }
    // ensure member is not banned from channel
    const channelId = (0, substrate_processor_1.assertNotNull)(video.channelId);
    const bannedMembers = await overlay
        .getRepository(model_1.BannedMember)
        .getManyByRelation('channelId', channelId);
    if (bannedMembers.some((m) => m.memberId === memberId)) {
        return bannedFromChannelError(metadata_protobuf_1.ReactVideo, message, memberId, channelId);
    }
    // ensure reactions are enabled
    if (!video.isReactionFeatureEnabled) {
        return reactionsDisabledError(metadata_protobuf_1.ReactVideo, message, videoId);
    }
    // load existing reaction by member to the video (if any)
    const existingReaction = await overlay
        .getRepository(model_1.VideoReaction)
        .getById(videoReactionEntityId({ memberId, videoId }));
    await processVideoReaction(overlay, block, memberId, video, reactionType, existingReaction);
    utils_2.videoRelevanceManager.scheduleRecalcForVideo(video.id);
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processReactVideoMessage = processReactVideoMessage;
async function processReactCommentMessage(overlay, memberId, message) {
    const { commentId, reactionId } = message;
    // load comment
    const comment = await overlay.getRepository(model_1.Comment).getById(commentId);
    // ensure comment exists
    if (!comment) {
        return notFoundError(metadata_protobuf_1.ReactComment, message, 'Comment', commentId);
    }
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail((0, substrate_processor_1.assertNotNull)(comment.videoId));
    const channelId = (0, substrate_processor_1.assertNotNull)(video.channelId);
    const bannedMembers = await overlay
        .getRepository(model_1.BannedMember)
        .getManyByRelation('channelId', channelId);
    // ensure member is not banned from channel
    if (bannedMembers.some((m) => m.memberId === memberId)) {
        return bannedFromChannelError(metadata_protobuf_1.ReactComment, message, memberId, channelId);
    }
    // load same reaction by member to the comment (if any)
    const existingReaction = await overlay
        .getRepository(model_1.CommentReaction)
        .getById(commentReactionEntityId({ memberId, commentId, reactionId }));
    // load comment reaction count by reaction id
    const reactionsCountByReactionId = getOrCreateCommentReactionsCountByReactionId(comment, reactionId);
    // remove the reaction if same reaction already exists by the member on the comment
    const commentReactionRepository = overlay.getRepository(model_1.CommentReaction);
    if (existingReaction) {
        // decrement counters
        --reactionsCountByReactionId.count;
        --comment.reactionsCount;
        // remove reaction
        commentReactionRepository.remove(existingReaction);
    }
    else {
        // new reaction
        commentReactionRepository.new({
            id: commentReactionEntityId({ memberId, commentId, reactionId }),
            commentId: comment.id,
            reactionId,
            videoId: video.id,
            memberId,
        });
        // increment counters
        ++reactionsCountByReactionId.count;
        ++comment.reactionsCount;
    }
    // schedule comment counters update
    utils_2.commentCountersManager.scheduleRecalcForComment(comment.id);
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processReactCommentMessage = processReactCommentMessage;
async function processCreateCommentMessage(overlay, block, indexInBlock, txHash, memberId, message) {
    const { videoId, parentCommentId, body } = message;
    // load video
    const video = await overlay.getRepository(model_1.Video).getById(videoId);
    // ensure video exists
    if (!video) {
        return notFoundError(metadata_protobuf_1.CreateComment, message, 'Video', videoId);
    }
    const channelId = (0, substrate_processor_1.assertNotNull)(video.channelId);
    const bannedMembers = await overlay
        .getRepository(model_1.BannedMember)
        .getManyByRelation('channelId', channelId);
    // ensure member is not banned from channel
    if (bannedMembers.some((m) => m.memberId === memberId)) {
        return bannedFromChannelError(metadata_protobuf_1.CreateComment, message, memberId, channelId);
    }
    // ensure comment section is enabled
    if (!video.isCommentSectionEnabled) {
        return commentsDisabledError(metadata_protobuf_1.CreateComment, message, videoId);
    }
    const parentComment = (0, utils_1.isSet)(parentCommentId)
        ? await overlay.getRepository(model_1.Comment).getById(parentCommentId)
        : undefined;
    // ensure parent comment exists if the id was specified
    if ((0, utils_1.isSet)(parentCommentId) && !parentComment) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.CreateComment, `Parent comment by id ${parentCommentId} not found `, { decodedMessage: message });
    }
    // ensure parent comment's video id matches with the new comment's video id
    if (parentComment && parentComment.videoId !== videoId) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.CreateComment, `Parent comment ${parentComment.id} does not exist on video ${videoId}`, { decodedMessage: message });
    }
    // add new comment
    const comment = overlay.getRepository(model_1.Comment).new({
        // TODO: Re-think backward compatibility
        id: (0, utils_2.backwardCompatibleMetaID)(block, indexInBlock),
        createdAt: new Date(block.timestamp),
        text: body,
        videoId: video.id,
        status: model_1.CommentStatus.VISIBLE,
        authorId: memberId,
        parentCommentId: parentComment?.id,
        repliesCount: 0,
        reactionsCount: 0,
        reactionsAndRepliesCount: 0,
        isEdited: false,
        isExcluded: false,
    });
    // schedule comment counters update
    utils_2.commentCountersManager.scheduleRecalcForComment(comment.parentCommentId);
    utils_2.commentCountersManager.scheduleRecalcForVideo(comment.videoId);
    utils_2.videoRelevanceManager.scheduleRecalcForVideo(comment.videoId);
    // add CommentCreated event
    const event = overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, txHash),
        data: new model_1.CommentCreatedEventData({
            comment: comment.id,
            text: body,
        }),
    });
    if (parentComment) {
        // Notify parent comment author (unless he's the author of the created comment)
        if (parentComment.authorId !== comment.authorId) {
            (0, utils_2.addNotification)(overlay, [parentComment.authorId], event.id);
        }
    }
    else {
        // Notify channel owner (unless he's the author of the created comment)
        const channelOwnerMemberId = await (0, utils_3.getChannelOwnerMemberByChannelId)(overlay, channelId);
        if (channelOwnerMemberId !== comment.authorId) {
            (0, utils_2.addNotification)(overlay, [channelOwnerMemberId], event.id);
        }
    }
    return new model_1.MetaprotocolTransactionResultCommentCreated({ commentCreated: comment.id });
}
exports.processCreateCommentMessage = processCreateCommentMessage;
async function processEditCommentMessage(overlay, block, indexInBlock, txHash, memberId, message) {
    const { commentId, newBody } = message;
    // load comment
    const comment = await overlay.getRepository(model_1.Comment).getById(commentId);
    // ensure comment exists
    if (!comment) {
        return notFoundError(metadata_protobuf_1.EditComment, message, 'Comment', commentId);
    }
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail((0, substrate_processor_1.assertNotNull)(comment.videoId));
    const channelId = (0, substrate_processor_1.assertNotNull)(video.channelId);
    const bannedMembers = await overlay
        .getRepository(model_1.BannedMember)
        .getManyByRelation('channelId', channelId);
    // ensure member is not banned from channel
    if (bannedMembers.some((m) => m.memberId === memberId)) {
        return bannedFromChannelError(metadata_protobuf_1.EditComment, message, memberId, channelId);
    }
    // ensure video's comment section is enabled
    if (!video.isCommentSectionEnabled) {
        return commentsDisabledError(metadata_protobuf_1.EditComment, message, video.id);
    }
    // ensure comment is being edited by the author
    if (comment.authorId !== memberId) {
        return notCommentAuthorError(metadata_protobuf_1.EditComment, message, memberId, commentId);
    }
    // ensure comment is not deleted or moderated
    if (comment.status !== model_1.CommentStatus.VISIBLE) {
        return unexpectedCommentStatusError(metadata_protobuf_1.EditComment, message, comment.status);
    }
    // add an event
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, txHash),
        data: new model_1.CommentTextUpdatedEventData({
            comment: commentId,
            newText: newBody,
        }),
    });
    // update the comment
    comment.text = newBody;
    comment.isEdited = true;
    return new model_1.MetaprotocolTransactionResultCommentEdited({
        commentEdited: comment.id,
    });
}
exports.processEditCommentMessage = processEditCommentMessage;
async function processDeleteCommentMessage(overlay, memberId, message) {
    const { commentId } = message;
    // load comment
    const commentRepository = overlay.getRepository(model_1.Comment);
    const comment = await commentRepository.getById(commentId);
    // ensure comment exists
    if (!comment) {
        return notFoundError(metadata_protobuf_1.DeleteComment, message, 'Comment', commentId);
    }
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail((0, substrate_processor_1.assertNotNull)(comment.videoId));
    const channelId = (0, substrate_processor_1.assertNotNull)(video.channelId);
    const bannedMembers = await overlay
        .getRepository(model_1.BannedMember)
        .getManyByRelation('channelId', channelId);
    // ensure member is not banned from channel
    if (bannedMembers.some((m) => m.memberId === memberId)) {
        return bannedFromChannelError(metadata_protobuf_1.DeleteComment, message, memberId, channelId);
    }
    // ensure video's comment section is enabled
    if (!video.isCommentSectionEnabled) {
        return commentsDisabledError(metadata_protobuf_1.DeleteComment, message, video.id);
    }
    // ensure comment is being removed by the author
    if (comment.authorId !== memberId) {
        notCommentAuthorError(metadata_protobuf_1.DeleteComment, message, memberId, comment.id);
    }
    // ensure comment is not already removed/moderated
    if (comment.status !== model_1.CommentStatus.VISIBLE) {
        unexpectedCommentStatusError(metadata_protobuf_1.DeleteComment, message, comment.status);
    }
    // schedule comment counters update
    utils_2.commentCountersManager.scheduleRecalcForComment(comment.parentCommentId);
    utils_2.commentCountersManager.scheduleRecalcForVideo(comment.videoId);
    utils_2.videoRelevanceManager.scheduleRecalcForVideo(comment.videoId);
    // update the comment
    comment.text = '';
    comment.status = model_1.CommentStatus.DELETED;
    return new model_1.MetaprotocolTransactionResultCommentDeleted({
        commentDeleted: comment.id,
    });
}
exports.processDeleteCommentMessage = processDeleteCommentMessage;
async function processCreateVideoCategoryMessage(overlay, block, indexInBlock, message) {
    const { parentCategoryId, name, description } = message;
    const parentCategory = (0, utils_1.isSet)(parentCategoryId)
        ? await overlay.getRepository(model_1.VideoCategory).getById(parentCategoryId)
        : undefined;
    // ensure parent category exists if specified
    if (parentCategoryId && !parentCategory) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.CreateVideoCategory, `Parent category by id ${parentCategoryId} not found`, { decodedMessage: message });
    }
    // create new video category
    overlay.getRepository(model_1.VideoCategory).new({
        // TODO: Re-think backward-compatibility
        id: `${block.height}-${indexInBlock}`,
        name: name || null,
        description: description || null,
        parentCategoryId,
        createdInBlock: block.height,
        isSupported: await config_1.config.get(config_1.ConfigVariable.SupportNewCategories, overlay.getEm()),
    });
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processCreateVideoCategoryMessage = processCreateVideoCategoryMessage;
//# sourceMappingURL=commentsAndReactions.js.map