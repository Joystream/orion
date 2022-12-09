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
import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  Comment,
  CommentCreatedEventData,
  CommentReaction,
  CommentReactionsCountByReactionId,
  CommentStatus,
  CommentTextUpdatedEventData,
  Event,
  Membership,
  MetaprotocolTransactionResult,
  MetaprotocolTransactionResultCommentCreated,
  MetaprotocolTransactionResultCommentDeleted,
  MetaprotocolTransactionResultCommentEdited,
  MetaprotocolTransactionResultOK,
  Video,
  VideoCategory,
  VideoReaction,
  VideoReactionOptions,
  VideoReactionsCountByReactionType,
} from '../../model'
import { EntitiesCollector, ModelNames } from '../../utils'
import { genericEventFields, metaprotocolTransactionFailure } from '../utils'

function parseVideoReaction(reaction: ReactVideo.Reaction): VideoReactionOptions {
  const protobufReactionToGraphqlReaction = {
    [ReactVideo.Reaction.LIKE]: VideoReactionOptions.LIKE,
    [ReactVideo.Reaction.UNLIKE]: VideoReactionOptions.UNLIKE,
  }
  return protobufReactionToGraphqlReaction[reaction]
}

function getOrCreateVideoReactionsCountByType(
  video: Video,
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
  comment: Comment,
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
  entityName: ModelNames,
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

function processVideoReaction(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  memberId: string,
  video: Video,
  reactionType: VideoReactionOptions,
  existingReaction?: VideoReaction
) {
  const newReactionTypeCounter = getOrCreateVideoReactionsCountByType(video, reactionType)

  const videoReaction =
    existingReaction ||
    new VideoReaction({
      id: videoReactionEntityId({ memberId, videoId: video.id }),
      video,
      reaction: reactionType,
      member: new Membership({ id: memberId }),
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
      ec.collections.VideoReaction.remove(existingReaction)
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
    video.reactions = (video.reactions || []).concat(videoReaction)
  }

  ec.collections.VideoReaction.push(videoReaction)
}

export async function processReactVideoMessage(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  memberId: string,
  message: DecodedMetadataObject<IReactVideo>
): Promise<MetaprotocolTransactionResult> {
  const { videoId, reaction } = message
  const reactionType = parseVideoReaction(reaction)

  // load video
  const video = await ec.collections.Video.get(videoId, { channel: { bannedMembers: true } })

  // ensure video exists
  if (!video) {
    return notFoundError(ReactVideo, message, 'Video', videoId)
  }

  // ensure member is not banned from channel
  if ((video.channel.bannedMembers || []).some((m) => m.id === memberId)) {
    return bannedFromChannelError(ReactVideo, message, memberId, video.channel.id)
  }

  // ensure reactions are enabled
  if (!video.isReactionFeatureEnabled) {
    return reactionsDisabledError(ReactVideo, message, videoId)
  }

  // load existing reaction by member to the video (if any)
  const existingReaction = await ec.collections.VideoReaction.get(
    videoReactionEntityId({ memberId, videoId })
  )

  processVideoReaction(ec, block, memberId, video, reactionType, existingReaction)

  return new MetaprotocolTransactionResultOK()
}

export async function processReactCommentMessage(
  ec: EntitiesCollector,
  memberId: string,
  message: DecodedMetadataObject<IReactComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId, reactionId } = message

  // load comment
  const comment = await ec.collections.Comment.get(commentId, {
    video: { channel: { bannedMembers: true } },
  })

  // ensure comment exists
  if (!comment) {
    return notFoundError(ReactComment, message, 'Comment', commentId)
  }

  const { video } = comment

  // ensure member is not banned from channel
  if ((video.channel.bannedMembers || []).some((m) => m.id === memberId)) {
    return bannedFromChannelError(ReactComment, message, memberId, video.channel.id)
  }

  // load same reaction by member to the comment (if any)
  const existingReaction = await ec.collections.CommentReaction.get(
    commentReactionEntityId({ memberId, commentId, reactionId })
  )

  // load comment reaction count by reaction id
  const reactionsCountByReactionId = getOrCreateCommentReactionsCountByReactionId(
    comment,
    reactionId
  )

  // remove the reaction if same reaction already exists by the member on the comment
  if (existingReaction) {
    // decrement counters
    --reactionsCountByReactionId.count
    --comment.reactionsAndRepliesCount
    --comment.reactionsCount
    // remove reaction
    ec.collections.CommentReaction.remove(existingReaction)
  } else {
    // new reaction
    const newReaction = new CommentReaction({
      id: commentReactionEntityId({ memberId, commentId, reactionId }),
      comment,
      reactionId,
      video,
      member: new Membership({ id: memberId }),
    })

    // increment counters
    ++reactionsCountByReactionId.count
    ++comment.reactionsAndRepliesCount
    ++comment.reactionsCount
    // add reaction
    comment.reactions = (comment.reactions || []).concat(newReaction)
    ec.collections.CommentReaction.push(newReaction)
  }

  return new MetaprotocolTransactionResultOK()
}

export async function processCreateCommentMessage(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  message: DecodedMetadataObject<ICreateComment>
): Promise<MetaprotocolTransactionResult> {
  const { videoId, parentCommentId, body } = message

  // load video
  const video = await ec.collections.Video.get(videoId, { channel: { bannedMembers: true } })

  // ensure video exists
  if (!video) {
    return notFoundError(CreateComment, message, 'Video', videoId)
  }

  // ensure member is not banned from channel
  if ((video.channel.bannedMembers || []).some((m) => m.id === memberId)) {
    return bannedFromChannelError(CreateComment, message, memberId, video.channel.id)
  }

  // ensure comment section is enabled
  if (!video.isCommentSectionEnabled) {
    return commentsDisabledError(CreateComment, message, videoId)
  }

  const parentComment = isSet(parentCommentId)
    ? await ec.collections.Comment.get(parentCommentId, { video: true })
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
  if (parentComment && parentComment.video.id !== videoId) {
    return metaprotocolTransactionFailure(
      CreateComment,
      `Parent comment ${parentComment.id} does not exist on video ${videoId}`,
      { decodedMessage: message }
    )
  }

  // increment video's comment count
  ++video.commentsCount

  // increment parent comment's replies count
  if (parentComment) {
    ++parentComment.repliesCount
    ++parentComment.reactionsAndRepliesCount
  }

  // add new comment
  const comment = new Comment({
    // TODO: Backward compatibility: METAPROTOCOL-${network}-${block.height}-${indexInBlock}
    id: ec.collections.Comment.getNextId(),
    createdAt: new Date(block.timestamp),
    text: body,
    video,
    status: CommentStatus.VISIBLE,
    author: new Membership({ id: memberId }),
    parentComment,
    repliesCount: 0,
    reactionsCount: 0,
    reactionsAndRepliesCount: 0,
    isEdited: false,
  })
  video.comments = (video.comments || []).concat(comment)
  ec.collections.Comment.push(comment)

  // add CommentCreated event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, txHash),
      data: new CommentCreatedEventData({
        comment: comment.id,
        text: body,
      }),
    })
  )

  return new MetaprotocolTransactionResultCommentCreated({ commentCreated: comment.id })
}

export async function processEditCommentMessage(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  message: DecodedMetadataObject<IEditComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId, newBody } = message

  // load comment
  const comment = await ec.collections.Comment.get(commentId, {
    author: true,
    video: {
      channel: {
        bannedMembers: true,
      },
    },
  })

  // ensure comment exists
  if (!comment) {
    return notFoundError(EditComment, message, 'Comment', commentId)
  }

  const { video } = comment

  // ensure member is not banned from channel
  if ((video.channel.bannedMembers || []).some((m) => m.id === memberId)) {
    return bannedFromChannelError(EditComment, message, memberId, video.channel.id)
  }

  // ensure video's comment section is enabled
  if (!video.isCommentSectionEnabled) {
    return commentsDisabledError(EditComment, message, video.id)
  }

  // ensure comment is being edited by the author
  if (comment.author.id !== memberId) {
    return notCommentAuthorError(EditComment, message, memberId, commentId)
  }

  // ensure comment is not deleted or moderated
  if (comment.status !== CommentStatus.VISIBLE) {
    return unexpectedCommentStatusError(EditComment, message, comment.status)
  }

  // add an event
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, txHash),
      data: new CommentTextUpdatedEventData({
        comment: commentId,
        newText: newBody,
      }),
    })
  )

  // update the comment
  comment.text = newBody
  comment.isEdited = true

  return new MetaprotocolTransactionResultCommentEdited({
    commentEdited: comment.id,
  })
}

export async function processDeleteCommentMessage(
  ec: EntitiesCollector,
  memberId: string,
  message: DecodedMetadataObject<IDeleteComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId } = message

  // load comment
  const comment = await ec.collections.Comment.get(commentId, {
    author: true,
    parentComment: true,
    video: {
      channel: {
        bannedMembers: true,
      },
    },
  })

  // ensure comment exists
  if (!comment) {
    return notFoundError(DeleteComment, message, 'Comment', commentId)
  }
  const { video, parentComment } = comment

  // ensure member is not banned from channel
  if ((video.channel.bannedMembers || []).some((m) => m.id === memberId)) {
    return bannedFromChannelError(DeleteComment, message, memberId, video.channel.id)
  }

  // ensure video's comment section is enabled
  if (!video.isCommentSectionEnabled) {
    return commentsDisabledError(DeleteComment, message, video.id)
  }

  // ensure comment is being removed by the author
  if (comment.author.id !== memberId) {
    notCommentAuthorError(DeleteComment, message, memberId, comment.id)
  }

  // ensure comment is not already removed/moderated
  if (comment.status !== CommentStatus.VISIBLE) {
    unexpectedCommentStatusError(DeleteComment, message, comment.status)
  }

  // decrement video's comment count
  --video.commentsCount

  // decrement parent comment's replies count
  if (parentComment) {
    --parentComment.repliesCount
    --parentComment.reactionsAndRepliesCount
    ec.collections.Comment.push(parentComment)
  }

  // update the comment
  comment.text = ''
  comment.status = CommentStatus.DELETED

  return new MetaprotocolTransactionResultCommentDeleted({
    commentDeleted: comment.id,
  })
}

export async function processCreateVideoCategoryMessage(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  message: DecodedMetadataObject<ICreateVideoCategory>
): Promise<MetaprotocolTransactionResult> {
  const { parentCategoryId, name, description } = message

  const parentCategory = isSet(parentCategoryId)
    ? await ec.collections.VideoCategory.get(parentCategoryId)
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
  const videoCategory = new VideoCategory({
    // TODO: Backward-compatibility: `${block.height}-${indexInBlock}`
    id: ec.collections.VideoCategory.getNextId(),
    name: name || null,
    description: description || null,
    parentCategory,
    createdInBlock: block.height,
  })
  ec.collections.VideoCategory.push(videoCategory)

  return new MetaprotocolTransactionResultOK()
}
