import {
  ChannelMetadata,
  ChannelModeratorRemarked,
  ChannelOwnerRemarked,
  IChannelMetadata,
  IChannelModeratorRemarked,
  IChannelOwnerRemarked,
  IModerateComment,
  IPinOrUnpinComment,
  IVideoReactionsPreference,
  ModerateComment,
  PinOrUnpinComment,
  VideoMetadata,
  VideoReactionsPreference,
} from '@joystream/metadata-protobuf'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { integrateMeta, isSet, isValidLanguageCode } from '@joystream/metadata-protobuf/utils'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  Channel,
  Comment,
  CommentStatus,
  MetaprotocolTransactionResult,
  MetaprotocolTransactionResultCommentModerated,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionResultOK,
  StorageDataObject,
  Video,
} from '../../model'
import { EntitiesCollector } from '../../utils'
import { invalidMetadata } from '../utils'
import { ASSET_TYPES } from './utils'

export async function processChannelMetadata(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  channel: Channel,
  meta: DecodedMetadataObject<IChannelMetadata>,
  newAssetIds: bigint[]
) {
  const assets = await Promise.all(
    newAssetIds.map((id) => ec.collections.StorageDataObject.get(id.toString()))
  )

  integrateMeta(channel, meta, ['title', 'description', 'isPublic'])

  processChannelAssets(ec, block, assets, channel, meta)

  // prepare language if needed
  if (isSet(meta.language)) {
    processChannelLanguage(channel, meta.language)
  }
}

function processChannelAssets(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  assets: StorageDataObject[],
  channel: Channel,
  meta: DecodedMetadataObject<IChannelMetadata>
) {
  ASSET_TYPES.channel.forEach(({ metaFieldName, schemaFieldName, DataObjectTypeConstructor }) => {
    const newAssetIndex = meta[metaFieldName]
    const currentAsset = channel[schemaFieldName]
    if (isSet(newAssetIndex)) {
      const asset = findAssetByIndex(ChannelMetadata, assets, newAssetIndex, metaFieldName)
      if (asset) {
        if (currentAsset) {
          currentAsset.unsetAt = new Date(block.timestamp)
          ec.collections.StorageDataObject.push(currentAsset)
        }
        const dataObjectType = new DataObjectTypeConstructor()
        dataObjectType.channel = channel.id
        asset.type = dataObjectType
        channel[schemaFieldName] = asset
      }
    }
  })
}

function findAssetByIndex<T extends ChannelMetadata | VideoMetadata>(
  metaClass: AnyMetadataClass<T>,
  assets: StorageDataObject[],
  index: number,
  name: string
): StorageDataObject | null {
  if (assets[index]) {
    return assets[index]
  }

  invalidMetadata(metaClass, `Non-existing${name ? ' ' + name : ''} asset index`, {
    numberOfAssets: assets.length,
    requestedAssetIndex: index,
    propertyName: name,
  })

  return null
}

function processChannelLanguage(channel: Channel, iso: string) {
  // ensure language string is valid
  if (!isValidLanguageCode(iso)) {
    invalidMetadata(ChannelMetadata, `Invalid language ISO-639-1 provided`, { iso })
    return
  }

  channel.language = iso
}

export async function processOwnerRemark(
  ec: EntitiesCollector,
  channel: Channel,
  decodedMessage: DecodedMetadataObject<IChannelOwnerRemarked>
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.pinOrUnpinComment) {
    return processPinOrUnpinCommentMessage(ec, channel, decodedMessage.pinOrUnpinComment)
  }

  if (decodedMessage.videoReactionsPreference) {
    return processVideoReactionsPreferenceMessage(
      ec,
      channel,
      decodedMessage.videoReactionsPreference
    )
  }

  if (decodedMessage.moderateComment) {
    return processModerateCommentMessage(ec, channel, decodedMessage.moderateComment)
  }

  return metaprotocolTransactionFailure(
    ChannelOwnerRemarked,
    'Unsupported channel owner remark action',
    {
      decodedMessage,
    }
  )
}

function metaprotocolTransactionFailure<T>(
  metaClass: AnyMetadataClass<T>,
  message: string,
  data?: Record<string, unknown>
): MetaprotocolTransactionResultFailed {
  invalidMetadata(metaClass, message, data)
  return new MetaprotocolTransactionResultFailed({
    errorMessage: message,
  })
}

async function getCommentForMetaprotocolAction<T>(
  ec: EntitiesCollector,
  metaClass: AnyMetadataClass<T>,
  channel: Channel,
  commentId: string,
  requiredStatus: CommentStatus
): Promise<Comment | MetaprotocolTransactionResultFailed> {
  let comment: Comment
  try {
    comment = await ec.collections.Comment.get(commentId, {
      video: { channel: true },
      parentComment: true,
    })
  } catch (e) {
    return metaprotocolTransactionFailure(metaClass, `Comment by id ${commentId} not found`, {
      commentId,
      remarkChannelId: channel.id,
    })
  }
  const { video } = comment

  // ensure channel owns the video
  if (video.channel.id !== channel.id) {
    return metaprotocolTransactionFailure(
      metaClass,
      `Cannot modify comment on video ${video.id} which does not belong to channel ${channel.id}`,
      {
        videoId: video.id,
        videoChannelId: video.channel.id,
        remarkChannelId: channel.id,
        commentId: comment.id,
      }
    )
  }

  // ensure comment has the expected status
  if (comment.status !== requiredStatus) {
    return metaprotocolTransactionFailure(metaClass, `Invalid comment status: ${comment.status}`, {
      commentId: comment.id,
      videoId: comment.video.id,
      channelId: channel.id,
    })
  }

  return comment
}

export async function processPinOrUnpinCommentMessage(
  ec: EntitiesCollector,
  channel: Channel,
  message: DecodedMetadataObject<IPinOrUnpinComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId, option } = message

  const commentOrFailure = await getCommentForMetaprotocolAction(
    ec,
    PinOrUnpinComment,
    channel,
    commentId,
    CommentStatus.VISIBLE
  )

  if (commentOrFailure instanceof MetaprotocolTransactionResultFailed) {
    return commentOrFailure
  }

  const comment = commentOrFailure
  const { video } = comment
  video.pinnedComment = option === PinOrUnpinComment.Option.PIN ? comment : null
  await ec.collections.Video.push(video)

  return new MetaprotocolTransactionResultOK()
}

export async function processVideoReactionsPreferenceMessage(
  ec: EntitiesCollector,
  channel: Channel,
  message: DecodedMetadataObject<IVideoReactionsPreference>
): Promise<MetaprotocolTransactionResult> {
  const { videoId, option } = message

  // load video
  let video: Video
  try {
    video = await ec.collections.Video.get(videoId, { channel: true })
  } catch (e) {
    return metaprotocolTransactionFailure(
      VideoReactionsPreference,
      `Video by id ${videoId} not found`,
      { videoId, remarkChannelId: channel.id }
    )
  }

  // ensure channel owns the video
  if (video.channel.id !== channel.id) {
    return metaprotocolTransactionFailure(
      VideoReactionsPreference,
      `Cannot change preferences on video ${video.id} which does not belong to channel ${channel.id}`,
      {
        videoId: video.id,
        videoChannelId: video.channel.id,
        remarkChannelId: channel.id,
      }
    )
  }

  video.isCommentSectionEnabled = option === VideoReactionsPreference.Option.ENABLE
  return new MetaprotocolTransactionResultOK()
}

export async function processModerateCommentMessage(
  ec: EntitiesCollector,
  channel: Channel,
  message: DecodedMetadataObject<IModerateComment>
): Promise<MetaprotocolTransactionResult> {
  const { commentId } = message

  const commentOrFailure = await getCommentForMetaprotocolAction(
    ec,
    ModerateComment,
    channel,
    commentId,
    CommentStatus.VISIBLE
  )

  if (commentOrFailure instanceof MetaprotocolTransactionResultFailed) {
    return commentOrFailure
  }

  const comment = commentOrFailure
  const { video } = comment

  // decrement video's comment count
  --video.commentsCount
  ec.collections.Video.push(video)

  // decrement parent comment's replies count
  if (comment.parentComment) {
    --comment.parentComment.repliesCount
    --comment.parentComment.reactionsAndRepliesCount

    ec.collections.Comment.push(comment.parentComment)
  }

  comment.text = ''
  comment.status = CommentStatus.MODERATED

  return new MetaprotocolTransactionResultCommentModerated({ commentModerated: comment.id })
}

export async function processModeratorRemark(
  ec: EntitiesCollector,
  channel: Channel,
  decodedMessage: DecodedMetadataObject<IChannelModeratorRemarked>
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.moderateComment) {
    return processModerateCommentMessage(ec, channel, decodedMessage.moderateComment)
  }

  return metaprotocolTransactionFailure(
    ChannelModeratorRemarked,
    'Unsupported channel moderator remark action',
    { decodedMessage }
  )
}
