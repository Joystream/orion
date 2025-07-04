import {
  CreateComment,
  CreateVideoCategory,
  DeleteComment,
  EditComment,
  ICreateComment,
  ICreateVideoCategory,
  IDeleteComment,
  IEditComment,
  IReactComment,
  IReactVideo,
  ReactComment,
  ReactVideo,
} from '@joystream/metadata-protobuf'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { isSet } from '@joystream/metadata-protobuf/utils'
import { assertNotNull, SubstrateBlock } from '@subsquid/substrate-processor'
import {
  BannedMember,
  Channel,
  ChannelRecipient,
  Comment,
  CommentCreatedEventData,
  CommentPostedToVideo,
  CommentReaction,
  CommentReactionEventData,
  CommentReactionsCountByReactionId,
  CommentReply,
  CommentStatus,
  CommentTextUpdatedEventData,
  CommentTipTier,
  Event,
  MemberRecipient,
  MetaprotocolTransactionResult,
  MetaprotocolTransactionResultCommentCreated,
  MetaprotocolTransactionResultCommentDeleted,
  MetaprotocolTransactionResultCommentEdited,
  MetaprotocolTransactionResultOK,
  ReactionToComment,
  Video,
  VideoCategory,
  VideoDisliked,
  VideoLiked,
  VideoReaction,
  VideoReactionEventData,
  VideoReactionOptions,
  VideoReactionsCountByReactionType,
} from '../../model'
import { config, ConfigVariable } from '../../utils/config'
import { EntityManagerOverlay, Flat } from '../../utils/overlay'
import {
  backwardCompatibleMetaID,
  genericEventFields,
  metaprotocolTransactionFailure,
  commentCountersManager,
  relevanceQueuePublisher,
} from '../utils'
import { getAccountForMember, getChannelOwnerMemberByChannelId, memberHandleById } from './utils'
import { addNotification } from '../../utils/notification'
import { parseVideoTitle } from '../../utils/notification/helpers'
import { HAPI_TO_JOY_RATE } from '../../utils/joystreamPrice'

function parseVideoReaction(reaction: ReactVideo.Reaction): VideoReactionOptions {
  const protobufReactionToGraphqlReaction = {
    [ReactVideo.Reaction.LIKE]: VideoReactionOptions.LIKE,
    [ReactVideo.Reaction.UNLIKE]: VideoReactionOptions.UNLIKE,
  }
  return protobufReactionToGraphqlReaction[reaction]
}

function getOrCreateVideoReactionsCountByType(
  video: Flat<Video>,
  reactionType: VideoReactionOptions
): VideoReactionsCountByReactionType {
  video.reactionsCountByReactionId = video.reactionsCountByReactionId || []
  let counter = video.reactionsCountByReactionId.find((c) => c.reaction === reactionType)
  if (!counter) {
    counter = new VideoReactionsCountByReactionType({ reaction: reactionType, count: 0 })
    video.reactionsCountByReactionId.push(counter)
  }
  return counter
}

function getOrCreateCommentReactionsCountByReactionId(
  comment: Flat<Comment>,
  reactionId: number
): CommentReactionsCountByReactionId {
  comment.reactionsCountByReactionId = comment.reactionsCountByReactionId || []
  let counter = comment.reactionsCountByReactionId.find((c) => c.reactionId === reactionId)

  if (!counter) {
    counter = new CommentReactionsCountByReactionId({
      reactionId,
      count: 0,
    })
    comment.reactionsCountByReactionId.push(counter)
  }

  return counter
}

function videoReactionEntityId(idSegments: { memberId: string; videoId: string }) {
  const { memberId, videoId } = idSegments
  return `${memberId}-${videoId}`
}

function commentReactionEntityId(idSegments: {
  memberId: string
  commentId: string
  reactionId: number
}) {
  const { memberId, commentId, reactionId } = idSegments
  return `${memberId}-${commentId}-${reactionId}`
}

// Common errors
function notFoundError<T>(
  metaClass: AnyMetadataClass<T>,
  decodedMessage: DecodedMetadataObject<T>,
  entityName: string,
  entityId: string
) {
  return metaprotocolTransactionFailure(metaClass, `${entityName} by id ${entityId} not found`, {
    decodedMessage,
  })
}

function bannedFromChannelError<T>(
  metaClass: AnyMetadataClass<T>,
  decodedMessage: DecodedMetadataObject<T>,
  memberId: string,
  channelId: string
) {
  return metaprotocolTransactionFailure(
    metaClass,
    `Member ${memberId} is banned from channel ${channelId}: `,
    { decodedMessage }
  )
}

function reactionsDisabledError<T>(
  metaClass: AnyMetadataClass<T>,
  decodedMessage: DecodedMetadataObject<T>,
  videoId: string
) {
  return metaprotocolTransactionFailure(
    metaClass,
    `Reaction feature is disabled on video ${videoId}`,
    { decodedMessage }
  )
}

function commentsDisabledError<T>(
  metaClass: AnyMetadataClass<T>,
  decodedMessage: DecodedMetadataObject<T>,
  videoId: string
) {
  return metaprotocolTransactionFailure(metaClass, `Comments are disabled on video ${videoId}`, {
    decodedMessage,
  })
}

function notCommentAuthorError<T>(
  metaClass: AnyMetadataClass<T>,
  decodedMessage: DecodedMetadataObject<T>,
  memberId: string,
  commentId: string
) {
  return metaprotocolTransactionFailure(
    metaClass,
    `Only comment author can update or remove the comment. Member ${memberId} is not the author of comment ${commentId}`,
    { decodedMessage }
  )
}

function unexpectedCommentStatusError<T>(
  metaClass: AnyMetadataClass<T>,
  decodedMessage: DecodedMetadataObject<T>,
  status: CommentStatus
) {
  return metaprotocolTransactionFailure(metaClass, `Unexpected comment status: ${status}`, {
    decodedMessage,
  })
}

async function processVideoReaction(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  video: Flat<Video>,
  reactionType: VideoReactionOptions,
  existingReaction?: Flat<VideoReaction>
) {
  const videoReactionRepository = overlay.getRepository(VideoReaction)
  const newReactionTypeCounter = getOrCreateVideoReactionsCountByType(video, reactionType)

  const videoReaction =
    existingReaction ||
    videoReactionRepository.new({
      id: videoReactionEntityId({ memberId, videoId: video.id }),
      videoId: video.id,
      reaction: reactionType,
      memberId,
      createdAt: new Date(block.timestamp),
    })

  if (existingReaction) {
    const previousReactionTypeCounter = getOrCreateVideoReactionsCountByType(
      video,
      existingReaction.reaction
    )
    // remove the reaction if member has already reacted with the same option
    if (reactionType === existingReaction.reaction) {
      // decrement reactions count
      --video.reactionsCount
      --previousReactionTypeCounter.count
      // remove reaction
      videoReactionRepository.remove(existingReaction)
      return
    }
    // otherwise...
    // increment reaction count of the new reaction type
    ++newReactionTypeCounter.count
    // decrement reaction count of previous reaction type
    --previousReactionTypeCounter.count
    // update the existing reaction's type
    videoReaction.reaction = reactionType
  } else {
    ++video.reactionsCount
    ++newReactionTypeCounter.count
    const event = overlay.getRepository(Event).new({
      ...genericEventFields(overlay, block, indexInBlock, txHash),
      // add videoreactionevent data as data
      data: new VideoReactionEventData({
        videoReaction: videoReaction.id,
      }),
    })
    if (video.channelId) {
      const channelOwnerMemberId = await getChannelOwnerMemberByChannelId(overlay, video.channelId)
      if (channelOwnerMemberId) {
        if (channelOwnerMemberId !== memberId) {
          // don't notify channel owner if he's the one who reacted
          const memberHandle = await memberHandleById(overlay, memberId)
          const channelOwnerAccount = await getAccountForMember(overlay, channelOwnerMemberId)
          const reactionData = {
            videoId: video.id,
            videoTitle: parseVideoTitle(video),
            memberId,
            memberHandle,
          }
          const reaction =
            reactionType === VideoReactionOptions.LIKE
              ? new VideoLiked(reactionData)
              : new VideoDisliked(reactionData)
          await addNotification(
            overlay,
            channelOwnerAccount,
            new ChannelRecipient({ channel: video.channelId }),
            reaction,
            event
          )
        }
      }
    }
  }
}

export async function processReactVideoMessage(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  message: DecodedMetadataObject<IReactVideo>
): Promise<MetaprotocolTransactionResult> {
  const { videoId, reaction } = message
  const reactionType = parseVideoReaction(reaction)

  // load video
  const video = await overlay.getRepository(Video).getById(videoId)

  // ensure video exists
  if (!video) {
    return notFoundError(ReactVideo, message, 'Video', videoId)
  }

  // ensure member is not banned from channel
  const channelId = assertNotNull(video.channelId)
  const bannedMembers = await overlay
    .getRepository(BannedMember)
    .getManyByRelation('channelId', channelId)

  if (bannedMembers.some((m) => m.memberId === memberId)) {
    return bannedFromChannelError(ReactVideo, message, memberId, channelId)
  }

  // ensure reactions are enabled
  if (!video.isReactionFeatureEnabled) {
    return reactionsDisabledError(ReactVideo, message, videoId)
  }

  // load existing reaction by member to the video (if any)
  const existingReaction = await overlay
    .getRepository(VideoReaction)
    .getById(videoReactionEntityId({ memberId, videoId }))

  await processVideoReaction(
    overlay,
    block,
    indexInBlock,
    txHash,
    memberId,
    video,
    reactionType,
    existingReaction
  )

  await relevanceQueuePublisher.pushChannel(channelId)

  return new MetaprotocolTransactionResultOK()
}

export async function processReactCommentMessage(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  message: DecodedMetadataObject<IReactComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId, reactionId } = message

  // load comment
  const comment = await overlay.getRepository(Comment).getById(commentId)

  // ensure comment exists
  if (!comment) {
    return notFoundError(ReactComment, message, 'Comment', commentId)
  }

  const video = await overlay.getRepository(Video).getByIdOrFail(assertNotNull(comment.videoId))
  const channelId = assertNotNull(video.channelId)
  const bannedMembers = await overlay
    .getRepository(BannedMember)
    .getManyByRelation('channelId', channelId)

  // ensure member is not banned from channel
  if (bannedMembers.some((m) => m.memberId === memberId)) {
    return bannedFromChannelError(ReactComment, message, memberId, channelId)
  }

  // load same reaction by member to the comment (if any)
  const existingReaction = await overlay
    .getRepository(CommentReaction)
    .getById(commentReactionEntityId({ memberId, commentId, reactionId }))

  // load comment reaction count by reaction id
  const reactionsCountByReactionId = getOrCreateCommentReactionsCountByReactionId(
    comment,
    reactionId
  )

  // remove the reaction if same reaction already exists by the member on the comment
  const commentReactionRepository = overlay.getRepository(CommentReaction)
  if (existingReaction) {
    // decrement counters
    --reactionsCountByReactionId.count
    --comment.reactionsCount
    // remove reaction
    commentReactionRepository.remove(existingReaction)
  } else {
    // new reaction
    const id = commentReactionEntityId({ memberId, commentId, reactionId })
    commentReactionRepository.new({
      id,
      commentId: comment.id,
      reactionId,
      videoId: video.id,
      memberId,
    })

    // increment counters
    ++reactionsCountByReactionId.count
    ++comment.reactionsCount

    // create Event entity
    const event = overlay.getRepository(Event).new({
      ...genericEventFields(overlay, block, indexInBlock, txHash),
      // add commentreactionevent data as data
      data: new CommentReactionEventData({
        commentReaction: id,
      }),
    })

    // add notification if comment author is not the member who reacted
    if (memberId !== comment.authorId && comment.authorId) {
      const commentAuthorAccount = await getAccountForMember(overlay, comment.authorId)

      const notificationData = {
        commentId: comment.id,
        videoId: video.id,
        videoTitle: parseVideoTitle(video),
        memberId,
        memberHandle: await memberHandleById(overlay, memberId),
      }
      await addNotification(
        overlay,
        commentAuthorAccount,
        new MemberRecipient({ membership: comment.authorId }),
        new ReactionToComment(notificationData),
        event
      )
    }
  }

  // schedule comment counters update
  commentCountersManager.scheduleRecalcForComment(comment.id)

  return new MetaprotocolTransactionResultOK()
}

async function commentTipTierParams(
  overlay: EntityManagerOverlay,
  tipAmountHapi: bigint
): Promise<Partial<Comment>> {
  const tipTiers = await config.get(ConfigVariable.CommentTipTiers, overlay.getEm())
  if (tipAmountHapi >= BigInt(tipTiers.DIAMOND) * BigInt(HAPI_TO_JOY_RATE)) {
    return {
      tipTier: CommentTipTier.DIAMOND,
      sortPriority: 1000,
    }
  }
  if (tipAmountHapi >= BigInt(tipTiers.GOLD) * BigInt(HAPI_TO_JOY_RATE)) {
    return {
      tipTier: CommentTipTier.GOLD,
      sortPriority: 100,
    }
  }
  if (tipAmountHapi >= BigInt(tipTiers.SILVER) * BigInt(HAPI_TO_JOY_RATE)) {
    return {
      tipTier: CommentTipTier.SILVER,
      sortPriority: 10,
    }
  }
  return {
    tipTier: null,
    sortPriority: 0,
  }
}

export async function processCreateCommentMessage(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  message: DecodedMetadataObject<ICreateComment>,
  payment?: [string, bigint]
): Promise<MetaprotocolTransactionResult> {
  const { videoId, parentCommentId, body } = message

  // load video
  const video = await overlay.getRepository(Video).getById(videoId)

  // ensure video exists
  if (!video) {
    return notFoundError(CreateComment, message, 'Video', videoId)
  }

  const channelId = assertNotNull(video.channelId)
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId)
  const bannedMembers = await overlay
    .getRepository(BannedMember)
    .getManyByRelation('channelId', channelId)

  // ensure member is not banned from channel
  if (bannedMembers.some((m) => m.memberId === memberId)) {
    return bannedFromChannelError(CreateComment, message, memberId, channelId)
  }

  // ensure comment section is enabled
  if (!video.isCommentSectionEnabled) {
    return commentsDisabledError(CreateComment, message, videoId)
  }

  const parentComment = isSet(parentCommentId)
    ? await overlay.getRepository(Comment).getById(parentCommentId)
    : undefined

  // ensure parent comment exists if the id was specified
  if (isSet(parentCommentId) && !parentComment) {
    return metaprotocolTransactionFailure(
      CreateComment,
      `Parent comment by id ${parentCommentId} not found `,
      { decodedMessage: message }
    )
  }

  // ensure parent comment's video id matches with the new comment's video id
  if (parentComment && parentComment.videoId !== videoId) {
    return metaprotocolTransactionFailure(
      CreateComment,
      `Parent comment ${parentComment.id} does not exist on video ${videoId}`,
      { decodedMessage: message }
    )
  }

  let tipAmount = BigInt(0)
  if (payment) {
    const [tipDestination, tip] = payment
    if (tipDestination === channel.rewardAccount) {
      tipAmount = tip
    }
  }
  const tipTierParams = await commentTipTierParams(overlay, tipAmount)

  // add new comment
  const comment = overlay.getRepository(Comment).new({
    // TODO: Re-think backward compatibility
    id: backwardCompatibleMetaID(block, indexInBlock), // overlay.getRepository(Comment).getNewEntityId(),
    createdAt: new Date(block.timestamp),
    text: body,
    videoId: video.id,
    status: CommentStatus.VISIBLE,
    authorId: memberId,
    parentCommentId: parentComment?.id,
    repliesCount: 0,
    reactionsCount: 0,
    reactionsAndRepliesCount: 0,
    isEdited: false,
    isExcluded: false,
    tipAmount,
    ...tipTierParams,
  })

  // schedule comment counters update
  commentCountersManager.scheduleRecalcForComment(comment.parentCommentId)
  commentCountersManager.scheduleRecalcForVideo(comment.videoId)
  await relevanceQueuePublisher.pushChannel(video.channelId)

  const event = overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, txHash),
    data: new CommentCreatedEventData({
      comment: comment.id,
      text: body,
    }),
  })

  if (parentComment) {
    // Notify parent comment author (unless he's the author of the created comment)
    if (parentComment.authorId !== comment.authorId && comment.authorId) {
      const authorAccount = await getAccountForMember(overlay, parentComment.authorId)
      const notificationData = {
        commentId: comment.id,
        videoId: video.id,
        videoTitle: parseVideoTitle(video),
        memberHandle: await memberHandleById(overlay, memberId),
        memberId,
      }
      const memberRecipientId = parentComment.authorId || undefined
      await addNotification(
        overlay,
        authorAccount,
        new MemberRecipient({ membership: memberRecipientId }),
        new CommentReply(notificationData),
        event
      )
    }
  } else {
    // Notify channel owner (unless he's the author of the created comment)
    const channelOwnerMemberId = await getChannelOwnerMemberByChannelId(overlay, channelId)
    if (channelOwnerMemberId && channelOwnerMemberId !== comment.authorId) {
      const channelOwnerAccount = await getAccountForMember(overlay, channelOwnerMemberId)
      const authorId = assertNotNull(comment.authorId)
      const authorHandle = await memberHandleById(overlay, authorId)
      const notificationData = {
        videoId: video.id,
        videoTitle: parseVideoTitle(video),
        memberId: authorId,
        memberHandle: authorHandle,
        comentId: comment.id,
      }
      await addNotification(
        overlay,
        channelOwnerAccount,
        new ChannelRecipient({ channel: channelId }),
        new CommentPostedToVideo(notificationData),
        event
      )
    }
  }

  return new MetaprotocolTransactionResultCommentCreated({ commentCreated: comment.id })
}

export async function processEditCommentMessage(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  message: DecodedMetadataObject<IEditComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId, newBody } = message

  // load comment
  const comment = await overlay.getRepository(Comment).getById(commentId)

  // ensure comment exists
  if (!comment) {
    return notFoundError(EditComment, message, 'Comment', commentId)
  }

  const video = await overlay.getRepository(Video).getByIdOrFail(assertNotNull(comment.videoId))
  const channelId = assertNotNull(video.channelId)
  const bannedMembers = await overlay
    .getRepository(BannedMember)
    .getManyByRelation('channelId', channelId)

  // ensure member is not banned from channel
  if (bannedMembers.some((m) => m.memberId === memberId)) {
    return bannedFromChannelError(EditComment, message, memberId, channelId)
  }

  // ensure video's comment section is enabled
  if (!video.isCommentSectionEnabled) {
    return commentsDisabledError(EditComment, message, video.id)
  }

  // ensure comment is being edited by the author
  if (comment.authorId !== memberId) {
    return notCommentAuthorError(EditComment, message, memberId, commentId)
  }

  // ensure comment is not deleted or moderated
  if (comment.status !== CommentStatus.VISIBLE) {
    return unexpectedCommentStatusError(EditComment, message, comment.status)
  }

  // add an event
  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, txHash),
    data: new CommentTextUpdatedEventData({
      comment: commentId,
      newText: newBody,
    }),
  })

  // update the comment
  comment.text = newBody
  comment.isEdited = true

  return new MetaprotocolTransactionResultCommentEdited({
    commentEdited: comment.id,
  })
}

export async function processDeleteCommentMessage(
  overlay: EntityManagerOverlay,
  memberId: string,
  message: DecodedMetadataObject<IDeleteComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId } = message

  // load comment
  const commentRepository = overlay.getRepository(Comment)
  const comment = await commentRepository.getById(commentId)

  // ensure comment exists
  if (!comment) {
    return notFoundError(DeleteComment, message, 'Comment', commentId)
  }

  const video = await overlay.getRepository(Video).getByIdOrFail(assertNotNull(comment.videoId))
  const channelId = assertNotNull(video.channelId)
  const bannedMembers = await overlay
    .getRepository(BannedMember)
    .getManyByRelation('channelId', channelId)

  // ensure member is not banned from channel
  if (bannedMembers.some((m) => m.memberId === memberId)) {
    return bannedFromChannelError(DeleteComment, message, memberId, channelId)
  }

  // ensure video's comment section is enabled
  if (!video.isCommentSectionEnabled) {
    return commentsDisabledError(DeleteComment, message, video.id)
  }

  // ensure comment is being removed by the author
  if (comment.authorId !== memberId) {
    notCommentAuthorError(DeleteComment, message, memberId, comment.id)
  }

  // ensure comment is not already removed/moderated
  if (comment.status !== CommentStatus.VISIBLE) {
    unexpectedCommentStatusError(DeleteComment, message, comment.status)
  }

  // schedule comment counters update
  commentCountersManager.scheduleRecalcForComment(comment.parentCommentId)
  commentCountersManager.scheduleRecalcForVideo(comment.videoId)
  await relevanceQueuePublisher.pushChannel(video.channelId)

  // update the comment
  comment.text = ''
  comment.status = CommentStatus.DELETED

  return new MetaprotocolTransactionResultCommentDeleted({
    commentDeleted: comment.id,
  })
}

export async function processCreateVideoCategoryMessage(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  message: DecodedMetadataObject<ICreateVideoCategory>
): Promise<MetaprotocolTransactionResult> {
  const { parentCategoryId, name, description } = message

  const parentCategory = isSet(parentCategoryId)
    ? await overlay.getRepository(VideoCategory).getById(parentCategoryId)
    : undefined

  // ensure parent category exists if specified
  if (parentCategoryId && !parentCategory) {
    return metaprotocolTransactionFailure(
      CreateVideoCategory,
      `Parent category by id ${parentCategoryId} not found`,
      { decodedMessage: message }
    )
  }

  // create new video category
  overlay.getRepository(VideoCategory).new({
    // TODO: Re-think backward-compatibility
    id: `${block.height}-${indexInBlock}`, // overlay.getRepository(VideoCategory).getNewEntityId(),
    name: name || null,
    description: description || null,
    parentCategoryId,
    createdInBlock: block.height,
    isSupported: await config.get(ConfigVariable.SupportNewCategories, overlay.getEm()),
  })

  return new MetaprotocolTransactionResultOK()
}
