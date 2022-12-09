"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processChannelPaymentFromMember = exports.processModeratorRemark = exports.processModerateCommentMessage = exports.processVideoReactionsPreferenceMessage = exports.processBanOrUnbanMemberFromChannelMessage = exports.processPinOrUnpinCommentMessage = exports.processOwnerRemark = exports.processVideoMetadata = exports.processChannelMetadata = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const utils_1 = require("@joystream/metadata-protobuf/utils");
const substrate_processor_1 = require("@subsquid/substrate-processor");
const model_1 = require("../../model");
const utils_2 = require("../utils");
const utils_3 = require("./utils");
async function processChannelMetadata(overlay, block, channel, meta, newAssetIds) {
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    const assets = await Promise.all(newAssetIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString())));
    (0, utils_1.integrateMeta)(channel, meta, ['title', 'description', 'isPublic']);
    await processAssets(overlay, block, assets, channel, metadata_protobuf_1.ChannelMetadata, meta, utils_3.ASSETS_MAP.channel);
    // prepare language if needed
    if ((0, utils_1.isSet)(meta.language)) {
        processLanguage(metadata_protobuf_1.ChannelMetadata, channel, meta.language);
    }
}
exports.processChannelMetadata = processChannelMetadata;
async function processVideoMetadata(overlay, block, indexInBlock, video, meta, newAssetIds) {
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    const assets = await Promise.all(newAssetIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString())));
    (0, utils_1.integrateMeta)(video, meta, [
        'title',
        'description',
        'duration',
        'hasMarketing',
        'isExplicit',
        'isPublic',
    ]);
    await processAssets(overlay, block, assets, video, metadata_protobuf_1.VideoMetadata, meta, utils_3.ASSETS_MAP.video);
    // prepare video category if needed
    if ((0, utils_1.isSet)(meta.category)) {
        const category = await overlay.getRepository(model_1.VideoCategory).getById(meta.category);
        if (!category) {
            (0, utils_2.invalidMetadata)(metadata_protobuf_1.VideoMetadata, `Category by id ${meta.category} not found!`, {
                decodedMessage: meta,
            });
        }
        video.categoryId = category?.id || null;
    }
    // prepare media meta information if needed
    if ((0, utils_1.isSet)(meta.video) ||
        (0, utils_1.isSet)(meta.mediaType) ||
        (0, utils_1.isSet)(meta.mediaPixelWidth) ||
        (0, utils_1.isSet)(meta.mediaPixelHeight)) {
        // prepare video file size if poosible
        const videoSize = extractVideoSize(assets);
        await processVideoMediaMetadata(overlay, block, indexInBlock, video.id, meta, videoSize);
    }
    // prepare license if needed
    if ((0, utils_1.isSet)(meta.license)) {
        await processVideoLicense(overlay, block, indexInBlock, video, meta.license);
    }
    // prepare language if needed
    if ((0, utils_1.isSet)(meta.language)) {
        processLanguage(metadata_protobuf_1.VideoMetadata, video, meta.language);
    }
    // prepare subtitles if needed
    const subtitles = meta.clearSubtitles ? [] : meta.subtitles;
    if ((0, utils_1.isSet)(subtitles)) {
        await processVideoSubtitles(overlay, block, video, assets, subtitles);
    }
    if ((0, utils_1.isSet)(meta.publishedBeforeJoystream)) {
        processPublishedBeforeJoystream(video, meta.publishedBeforeJoystream);
    }
    if ((0, utils_1.isSet)(meta.enableComments)) {
        video.isCommentSectionEnabled = meta.enableComments;
    }
}
exports.processVideoMetadata = processVideoMetadata;
function extractVideoSize(assets) {
    const mediaAsset = assets.find((a) => a.type?.isTypeOf === 'DataObjectTypeVideoMedia');
    return mediaAsset ? mediaAsset.size : undefined;
}
async function processVideoMediaEncoding(overlay, mediaMetadata, metadata) {
    const metadataRepository = overlay.getRepository(model_1.VideoMediaEncoding);
    // TODO: Make it one-to-many w/ video media?
    // Or perhaps just jsonb?
    const encoding = (await metadataRepository.getById(mediaMetadata.id)) ||
        metadataRepository.new({
            id: mediaMetadata.id,
        });
    // integrate media encoding-related data
    (0, utils_1.integrateMeta)(encoding, metadata, ['codecName', 'container', 'mimeMediaType']);
    mediaMetadata.encodingId = encoding.id;
}
async function processVideoMediaMetadata(overlay, block, indexInBlock, videoId, metadata, videoSize) {
    const metadataRepository = overlay.getRepository(model_1.VideoMediaMetadata);
    const videoMediaMetadata = (await metadataRepository.getOneByRelation('videoId', videoId)) ||
        metadataRepository.new({
            // TODO: Re-think backward-compatibility
            id: `${block.height}-${indexInBlock}`,
            createdInBlock: block.height,
            videoId,
        });
    // integrate media-related data
    const mediaMetadataUpdate = {
        size: (0, utils_1.isSet)(videoSize) ? videoSize : undefined,
        pixelWidth: metadata.mediaPixelWidth,
        pixelHeight: metadata.mediaPixelHeight,
    };
    (0, utils_1.integrateMeta)(videoMediaMetadata, mediaMetadataUpdate, ['pixelWidth', 'pixelHeight', 'size']);
    if (metadata.mediaType) {
        await processVideoMediaEncoding(overlay, videoMediaMetadata, metadata.mediaType);
    }
}
async function processVideoLicense(overlay, block, indexInBlock, video, licenseMetadata) {
    const licenseRepository = overlay.getRepository(model_1.License);
    if (!(0, utils_1.isEmptyObject)(licenseMetadata)) {
        // license is meant to be created/updated
        // TODO: Make it one-to-many w/ video?
        const videoLicense = (await licenseRepository.getById(video.licenseId || '')) ||
            licenseRepository.new({
                // TODO: Re-think backward-compatibility
                id: `${block.height}-${indexInBlock}`, // videoId,
            });
        (0, utils_1.integrateMeta)(videoLicense, licenseMetadata, ['attribution', 'code', 'customText']);
        video.licenseId = videoLicense.id;
    }
    else {
        // license is meant to be unset/removed
        if (video.licenseId) {
            licenseRepository.remove(video.licenseId);
        }
        video.licenseId = null;
    }
}
async function processVideoSubtitles(overlay, block, video, assets, subtitlesMeta) {
    const dataObjectRepository = overlay.getRepository(model_1.StorageDataObject);
    const subtitlesRepository = overlay.getRepository(model_1.VideoSubtitle);
    const currentSubtitles = await subtitlesRepository.getManyByRelation('videoId', video.id);
    dataObjectRepository.remove(...currentSubtitles.flatMap((s) => (s.assetId ? [s.assetId] : [])));
    subtitlesRepository.remove(...currentSubtitles);
    for (const subtitleMeta of subtitlesMeta) {
        const subtitleId = `${video.id}-${subtitleMeta.type}-${subtitleMeta.language}`;
        const subtitle = subtitlesRepository.new({
            id: subtitleId,
            type: subtitleMeta.type,
            videoId: video.id,
            mimeType: subtitleMeta.mimeType,
        });
        processLanguage(metadata_protobuf_1.SubtitleMetadata, subtitle, subtitleMeta.language);
        await processAssets(overlay, block, assets, subtitle, metadata_protobuf_1.SubtitleMetadata, subtitleMeta, utils_3.ASSETS_MAP.subtitle);
    }
}
function processPublishedBeforeJoystream(video, metadata) {
    if (!metadata.isPublished) {
        // Property is beeing unset
        video.publishedBeforeJoystream = null;
        return;
    }
    // try to parse timestamp from publish date
    const timestamp = (0, utils_1.isSet)(metadata.date) ? Date.parse(metadata.date) : NaN;
    // ensure date is valid
    if (isNaN(timestamp)) {
        (0, utils_2.invalidMetadata)(metadata_protobuf_1.PublishedBeforeJoystream, `Invalid date provided`, {
            decodedMessage: metadata,
        });
        return;
    }
    // set new date
    video.publishedBeforeJoystream = new Date(timestamp);
}
async function processAssets(overlay, block, assets, entity, metadataClass, meta, entityAssetsMap) {
    for (const { metaProperty, entityProperty, createDataObjectType } of entityAssetsMap) {
        const newAssetIndex = meta[metaProperty] ?? undefined;
        const currentAssetId = entity[entityProperty];
        const currentAsset = currentAssetId
            ? await overlay.getRepository(model_1.StorageDataObject).getById(currentAssetId)
            : null;
        if ((0, utils_1.isSet)(newAssetIndex)) {
            const newAsset = findAssetByIndex(metadataClass, assets, newAssetIndex);
            if (newAsset) {
                if (currentAsset) {
                    currentAsset.unsetAt = new Date(block.timestamp);
                }
                entity[entityProperty] = newAsset.id;
                newAsset.type = createDataObjectType(entity);
            }
        }
    }
}
function findAssetByIndex(metaClass, assets, index) {
    if (assets[index]) {
        return assets[index];
    }
    (0, utils_2.invalidMetadata)(metaClass, `Non-existing asset index`, {
        numberOfAssets: assets.length,
        requestedAssetIndex: index,
    });
    return null;
}
function processLanguage(metaClass, entity, iso) {
    // ensure language string is valid
    if (!(0, utils_1.isValidLanguageCode)(iso)) {
        (0, utils_2.invalidMetadata)(metaClass, `Invalid language ISO-639-1 provided`, { iso });
        return;
    }
    entity.language = iso;
}
async function processOwnerRemark(overlay, block, indexInBlock, txHash, channel, decodedMessage) {
    if (decodedMessage.pinOrUnpinComment) {
        return processPinOrUnpinCommentMessage(overlay, channel, decodedMessage.pinOrUnpinComment);
    }
    if (decodedMessage.banOrUnbanMemberFromChannel) {
        return processBanOrUnbanMemberFromChannelMessage(overlay, block, indexInBlock, txHash, channel, decodedMessage.banOrUnbanMemberFromChannel);
    }
    if (decodedMessage.videoReactionsPreference) {
        return processVideoReactionsPreferenceMessage(overlay, channel, decodedMessage.videoReactionsPreference);
    }
    if (decodedMessage.moderateComment) {
        return processModerateCommentMessage(overlay, channel, decodedMessage.moderateComment);
    }
    return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.ChannelOwnerRemarked, 'Unsupported channel owner remark action', {
        decodedMessage,
    });
}
exports.processOwnerRemark = processOwnerRemark;
async function getCommentForMetaprotocolAction(overlay, metaClass, channel, message, commentId, requiredStatus) {
    const comment = await overlay.getRepository(model_1.Comment).getById(commentId);
    if (!comment) {
        return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Comment by id ${commentId} not found`, {
            decodedMessage: message,
        });
    }
    const video = await overlay.getRepository(model_1.Video).getByIdOrFail((0, substrate_processor_1.assertNotNull)(comment.videoId));
    // ensure channel owns the video
    if (video.channelId !== channel.id) {
        return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Cannot modify comment on video ${video.id} which does not belong to channel ${channel.id}`, {
            decodedMessage: message,
        });
    }
    // ensure comment has the expected status
    if (comment.status !== requiredStatus) {
        return (0, utils_2.metaprotocolTransactionFailure)(metaClass, `Invalid comment status: ${comment.status}`, {
            decodedMessage: message,
        });
    }
    return { comment, video };
}
async function processPinOrUnpinCommentMessage(overlay, channel, message) {
    const { option } = message;
    const commentOrFailure = await getCommentForMetaprotocolAction(overlay, metadata_protobuf_1.PinOrUnpinComment, channel, message, message.commentId, model_1.CommentStatus.VISIBLE);
    if (commentOrFailure instanceof model_1.MetaprotocolTransactionResultFailed) {
        return commentOrFailure;
    }
    const { comment, video } = commentOrFailure;
    video.pinnedCommentId = option === metadata_protobuf_1.PinOrUnpinComment.Option.PIN ? comment.id : null;
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processPinOrUnpinCommentMessage = processPinOrUnpinCommentMessage;
async function processBanOrUnbanMemberFromChannelMessage(overlay, block, indexInBlock, txHash, channel, message) {
    const { memberId, option } = message;
    const member = await overlay.getRepository(model_1.Membership).getById(memberId);
    if (!member) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.BanOrUnbanMemberFromChannel, `Member does not exist: ${memberId}`, { decodedMessage: message });
    }
    // ban member from channel
    if (option === metadata_protobuf_1.BanOrUnbanMemberFromChannel.Option.BAN) {
        overlay.getRepository(model_1.BannedMember).new({
            channelId: channel.id,
            memberId: member.id,
            id: `${channel.id}-${member.id}`,
        });
    }
    // unban member from channel
    if (option === metadata_protobuf_1.BanOrUnbanMemberFromChannel.Option.UNBAN) {
        overlay.getRepository(model_1.BannedMember).remove(`${channel.id}-${member.id}`);
    }
    // event processing
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, txHash),
        data: new model_1.MemberBannedFromChannelEventData({
            channel: channel.id,
            member: member.id,
            action: option === metadata_protobuf_1.BanOrUnbanMemberFromChannel.Option.BAN,
        }),
    });
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processBanOrUnbanMemberFromChannelMessage = processBanOrUnbanMemberFromChannelMessage;
async function processVideoReactionsPreferenceMessage(overlay, channel, message) {
    const { videoId, option } = message;
    // load video
    const video = await overlay.getRepository(model_1.Video).getById(videoId);
    if (!video) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.VideoReactionsPreference, `Video by id ${videoId} not found`, { decodedMessage: message });
    }
    // ensure channel owns the video
    if (video.channelId !== channel.id) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.VideoReactionsPreference, `Cannot change preferences on video ${video.id} which does not belong to channel ${channel.id}`, {
            decodedMessage: message,
        });
    }
    video.isCommentSectionEnabled = option === metadata_protobuf_1.VideoReactionsPreference.Option.ENABLE;
    return new model_1.MetaprotocolTransactionResultOK();
}
exports.processVideoReactionsPreferenceMessage = processVideoReactionsPreferenceMessage;
async function processModerateCommentMessage(overlay, channel, message) {
    const commentOrFailure = await getCommentForMetaprotocolAction(overlay, metadata_protobuf_1.ModerateComment, channel, message, message.commentId, model_1.CommentStatus.VISIBLE);
    if (commentOrFailure instanceof model_1.MetaprotocolTransactionResultFailed) {
        return commentOrFailure;
    }
    const { comment } = commentOrFailure;
    // schedule comment counters updates
    utils_2.commentCountersManager.scheduleRecalcForComment(comment.parentCommentId);
    utils_2.commentCountersManager.scheduleRecalcForVideo(comment.videoId);
    utils_2.videoRelevanceManager.scheduleRecalcForVideo(comment.videoId);
    comment.text = '';
    comment.status = model_1.CommentStatus.MODERATED;
    return new model_1.MetaprotocolTransactionResultCommentModerated({ commentModerated: comment.id });
}
exports.processModerateCommentMessage = processModerateCommentMessage;
async function processModeratorRemark(overlay, channel, decodedMessage) {
    if (decodedMessage.moderateComment) {
        return processModerateCommentMessage(overlay, channel, decodedMessage.moderateComment);
    }
    return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.ChannelModeratorRemarked, 'Unsupported channel moderator remark action', { decodedMessage });
}
exports.processModeratorRemark = processModeratorRemark;
async function processChannelPaymentFromMember(overlay, block, indexInBlock, txHash, message, memberId, [payeeAccount, amount]) {
    const member = await overlay.getRepository(model_1.Membership).getByIdOrFail(memberId);
    // Only channel reward accounts are being checked right now as payment destination.
    // Transfers to any other destination will be ignored by the query node.
    const channel = await overlay.getRepository(model_1.Channel).getOneBy({ rewardAccount: payeeAccount });
    if (!channel) {
        return (0, utils_2.metaprotocolTransactionFailure)(metadata_protobuf_1.MakeChannelPayment, `Payment made to unknown channel reward account: ${payeeAccount}`, { payeeAccount });
    }
    let paymentContext;
    if (message.videoId) {
        const video = await overlay.getRepository(model_1.Video).getById(message.videoId.toString());
        if (video && video.channelId === channel.id) {
            paymentContext = new model_1.PaymentContextVideo({ video: video.id });
        }
        else {
            (0, utils_2.invalidMetadata)(metadata_protobuf_1.MakeChannelPayment, `payment context video not found in channel that was queried based on reward (or payee) account.`, { channelId: channel.id, videoChannelId: video?.channelId });
        }
    }
    else {
        paymentContext = new model_1.PaymentContextChannel();
        paymentContext.channel = channel.id;
    }
    overlay.getRepository(model_1.Event).new({
        ...(0, utils_2.genericEventFields)(overlay, block, indexInBlock, txHash),
        data: new model_1.ChannelPaymentMadeEventData({
            payer: member.id,
            payeeChannel: channel.id,
            paymentContext,
            rationale: message.rationale || undefined,
            amount,
        }),
    });
    return new model_1.MetaprotocolTransactionResultChannelPaid({
        channelPaid: channel.id,
    });
}
exports.processChannelPaymentFromMember = processChannelPaymentFromMember;
//# sourceMappingURL=metadata.js.map