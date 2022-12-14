import {
  ChannelMetadata,
  ChannelModeratorRemarked,
  ChannelOwnerRemarked,
  IChannelMetadata,
  IChannelModeratorRemarked,
  IChannelOwnerRemarked,
  ILicense,
  IMediaType,
  IModerateComment,
  IPinOrUnpinComment,
  IPublishedBeforeJoystream,
  ISubtitleMetadata,
  IVideoMetadata,
  IVideoReactionsPreference,
  ModerateComment,
  PinOrUnpinComment,
  PublishedBeforeJoystream,
  SubtitleMetadata,
  VideoMetadata,
  VideoReactionsPreference,
} from '@joystream/metadata-protobuf'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import {
  integrateMeta,
  isEmptyObject,
  isSet,
  isValidLanguageCode,
} from '@joystream/metadata-protobuf/utils'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  Channel,
  Comment,
  CommentStatus,
  License,
  MetaprotocolTransactionResult,
  MetaprotocolTransactionResultCommentModerated,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionResultOK,
  StorageDataObject,
  Video,
  VideoMediaEncoding,
  VideoMediaMetadata,
  VideoSubtitle,
} from '../../model'
import { EntitiesCollector } from '../../utils'
import { invalidMetadata, metaprotocolTransactionFailure } from '../utils'
import { AsDecoded, ASSETS_MAP, EntityAssetProps, EntityAssetsMap, MetaNumberProps } from './utils'

export async function processChannelMetadata(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  channel: Channel,
  meta: DecodedMetadataObject<IChannelMetadata>,
  newAssetIds: bigint[]
) {
  const assets = await Promise.all(
    newAssetIds.map((id) => ec.collections.StorageDataObject.getOrFail(id.toString()))
  )

  integrateMeta(channel, meta, ['title', 'description', 'isPublic'])

  processAssets(ec, block, assets, channel, ChannelMetadata, meta, ASSETS_MAP.channel)

  // prepare language if needed
  if (isSet(meta.language)) {
    processLanguage(ChannelMetadata, channel, meta.language)
  }
}

export async function processVideoMetadata(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  video: Video,
  meta: DecodedMetadataObject<IVideoMetadata>,
  newAssetIds: bigint[]
): Promise<void> {
  const assets = await Promise.all(
    newAssetIds.map((id) => ec.collections.StorageDataObject.getOrFail(id.toString()))
  )

  integrateMeta(video, meta, [
    'title',
    'description',
    'duration',
    'hasMarketing',
    'isExplicit',
    'isPublic',
  ])

  processAssets(ec, block, assets, video, VideoMetadata, meta, ASSETS_MAP.video)

  // prepare video category if needed
  if (meta.category) {
    const category = await ec.collections.VideoCategory.get(meta.category)
    if (!category) {
      invalidMetadata(VideoMetadata, `Category by id ${meta.category} not found!`, {
        decodedMessage: meta,
      })
    }
    video.category = category || null
  }

  // prepare media meta information if needed
  if (
    isSet(meta.video) ||
    isSet(meta.mediaType) ||
    isSet(meta.mediaPixelWidth) ||
    isSet(meta.mediaPixelHeight)
  ) {
    // prepare video file size if poosible
    const videoSize = extractVideoSize(assets)
    processVideoMediaMetadata(ec, block, indexInBlock, video, meta, videoSize)
  }

  // prepare license if needed
  if (isSet(meta.license)) {
    processVideoLicense(ec, block, indexInBlock, video, meta.license)
  }

  // prepare language if needed
  if (isSet(meta.language)) {
    processLanguage(VideoMetadata, video, meta.language)
  }

  // prepare subtitles if needed
  const subtitles = meta.clearSubtitles ? [] : meta.subtitles
  if (isSet(subtitles)) {
    processVideoSubtitles(ec, block, video, assets, subtitles)
  }

  if (isSet(meta.publishedBeforeJoystream)) {
    processPublishedBeforeJoystream(video, meta.publishedBeforeJoystream)
  }

  if (isSet(meta.enableComments)) {
    video.isCommentSectionEnabled = meta.enableComments
  }
}

function extractVideoSize(assets: StorageDataObject[]): bigint | undefined {
  const mediaAsset = assets.find((a) => a.type?.isTypeOf === 'DataObjectTypeVideoMedia')
  return mediaAsset ? mediaAsset.size : undefined
}

function processVideoMediaEncoding(
  ec: EntitiesCollector,
  mediaMetadata: VideoMediaMetadata,
  metadata: DecodedMetadataObject<IMediaType>
): void {
  if (!mediaMetadata.encoding) {
    // TODO: Make it one-to-many w/ video media?
    // Or perhaps just jsonb?
    mediaMetadata.encoding = new VideoMediaEncoding({
      id: mediaMetadata.id,
    })
  }
  // integrate media encoding-related data
  integrateMeta(mediaMetadata.encoding, metadata, ['codecName', 'container', 'mimeMediaType'])
  ec.collections.VideoMediaEncoding.push(mediaMetadata.encoding)
}

function processVideoMediaMetadata(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  video: Video,
  metadata: DecodedMetadataObject<IVideoMetadata>,
  videoSize: bigint | undefined
): void {
  if (!video.mediaMetadata) {
    video.mediaMetadata = new VideoMediaMetadata({
      // TODO: Re-think backward-compatibility
      id: `${block.height}-${indexInBlock}`, // video.id,
      createdInBlock: block.height,
      video,
    })
  }
  ec.collections.VideoMediaMetadata.push(video.mediaMetadata)

  // integrate media-related data
  const mediaMetadataUpdate = {
    size: isSet(videoSize) ? videoSize : undefined,
    pixelWidth: metadata.mediaPixelWidth,
    pixelHeight: metadata.mediaPixelHeight,
  }
  integrateMeta(video.mediaMetadata, mediaMetadataUpdate, ['pixelWidth', 'pixelHeight', 'size'])
  if (metadata.mediaType) {
    processVideoMediaEncoding(ec, video.mediaMetadata, metadata.mediaType)
  }
}

function processVideoLicense(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  video: Video,
  licenseMetadata: DecodedMetadataObject<ILicense>
): void {
  if (!isEmptyObject(licenseMetadata)) {
    // license is meant to be created/updated
    // TODO: Make it one-to-many w/ video?
    video.license =
      video.license ||
      new License({
        // TODO: Re-think backward-compatibility
        id: `${block.height}-${indexInBlock}`, // video.id,
      })
    integrateMeta(video.license, licenseMetadata, ['attribution', 'code', 'customText'])
    ec.collections.License.push(video.license)
  } else {
    // license is meant to be unset/removed
    if (video.license) {
      ec.collections.License.remove(video.license)
    }
    video.license = null
  }
}

function processVideoSubtitles(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  video: Video,
  assets: StorageDataObject[],
  subtitlesMeta: DecodedMetadataObject<ISubtitleMetadata>[]
): void {
  if (video.subtitles) {
    ec.collections.StorageDataObject.remove(
      ...video.subtitles.flatMap((s) => (s.asset ? [s.asset] : []))
    )
    ec.collections.VideoSubtitle.remove(...video.subtitles)
  }
  video.subtitles = []
  for (const subtitleMeta of subtitlesMeta) {
    const subtitleId = `${video.id}-${subtitleMeta.type}-${subtitleMeta.language}`
    const subtitle = new VideoSubtitle({
      id: subtitleId,
      type: subtitleMeta.type,
      video,
      mimeType: subtitleMeta.mimeType,
    })
    processLanguage(SubtitleMetadata, subtitle, subtitleMeta.language)
    ec.collections.VideoSubtitle.push(subtitle)
    processAssets(ec, block, assets, subtitle, SubtitleMetadata, subtitleMeta, ASSETS_MAP.subtitle)
  }
}

function processPublishedBeforeJoystream(
  video: Video,
  metadata: DecodedMetadataObject<IPublishedBeforeJoystream>
): void {
  if (!metadata.isPublished) {
    // Property is beeing unset
    video.publishedBeforeJoystream = null
    return
  }

  // try to parse timestamp from publish date
  const timestamp = isSet(metadata.date) ? Date.parse(metadata.date) : NaN

  // ensure date is valid
  if (isNaN(timestamp)) {
    invalidMetadata(PublishedBeforeJoystream, `Invalid date provided`, {
      decodedMessage: metadata,
    })
    return
  }

  // set new date
  video.publishedBeforeJoystream = new Date(timestamp)
}

function processAssets<E, M extends AnyMetadataClass<unknown>>(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  assets: StorageDataObject[],
  entity: { [K in EntityAssetProps<E>]?: StorageDataObject | null | undefined },
  metadataClass: M,
  meta: { [K in MetaNumberProps<AsDecoded<M>>]?: number | null | undefined },
  entityAssetsMap: EntityAssetsMap<E, AsDecoded<M>>
): void {
  for (const { metaProperty, entityProperty, createDataObjectType } of entityAssetsMap) {
    const newAssetIndex: number | undefined = meta[metaProperty] ?? undefined
    const currentAsset = entity[entityProperty]
    if (isSet(newAssetIndex)) {
      const newAsset = findAssetByIndex(metadataClass, assets, newAssetIndex)
      if (newAsset) {
        if (currentAsset) {
          currentAsset.unsetAt = new Date(block.timestamp)
        }
        entity[entityProperty] = newAsset
        newAsset.type = createDataObjectType(entity as E)
      }
    }
  }
}

function findAssetByIndex(
  metaClass: AnyMetadataClass<unknown>,
  assets: StorageDataObject[],
  index: number
): StorageDataObject | null {
  if (assets[index]) {
    return assets[index]
  }

  invalidMetadata<unknown>(metaClass, `Non-existing asset index`, {
    numberOfAssets: assets.length,
    requestedAssetIndex: index,
  })

  return null
}

function processLanguage(
  metaClass: AnyMetadataClass<unknown>,
  entity: Video | Channel | VideoSubtitle,
  iso: string
) {
  // ensure language string is valid
  if (!isValidLanguageCode(iso)) {
    invalidMetadata<unknown>(metaClass, `Invalid language ISO-639-1 provided`, { iso })
    return
  }

  entity.language = iso
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

async function getCommentForMetaprotocolAction<T>(
  ec: EntitiesCollector,
  metaClass: AnyMetadataClass<T>,
  channel: Channel,
  message: DecodedMetadataObject<T>,
  commentId: string,
  requiredStatus: CommentStatus
): Promise<Comment | MetaprotocolTransactionResultFailed> {
  const comment = await ec.collections.Comment.get(commentId, {
    video: { channel: true },
    parentComment: true,
  })

  if (!comment) {
    return metaprotocolTransactionFailure(metaClass, `Comment by id ${commentId} not found`, {
      decodedMessage: message,
    })
  }

  const { video } = comment

  // ensure channel owns the video
  if (video.channel.id !== channel.id) {
    return metaprotocolTransactionFailure(
      metaClass,
      `Cannot modify comment on video ${video.id} which does not belong to channel ${channel.id}`,
      {
        decodedMessage: message,
      }
    )
  }

  // ensure comment has the expected status
  if (comment.status !== requiredStatus) {
    return metaprotocolTransactionFailure(metaClass, `Invalid comment status: ${comment.status}`, {
      decodedMessage: message,
    })
  }

  return comment
}

export async function processPinOrUnpinCommentMessage(
  ec: EntitiesCollector,
  channel: Channel,
  message: DecodedMetadataObject<IPinOrUnpinComment>
): Promise<MetaprotocolTransactionResult> {
  const { option } = message

  const commentOrFailure = await getCommentForMetaprotocolAction(
    ec,
    PinOrUnpinComment,
    channel,
    message,
    message.commentId,
    CommentStatus.VISIBLE
  )

  if (commentOrFailure instanceof MetaprotocolTransactionResultFailed) {
    return commentOrFailure
  }

  const comment = commentOrFailure
  const { video } = comment
  video.pinnedComment = option === PinOrUnpinComment.Option.PIN ? comment : null

  return new MetaprotocolTransactionResultOK()
}

export async function processVideoReactionsPreferenceMessage(
  ec: EntitiesCollector,
  channel: Channel,
  message: DecodedMetadataObject<IVideoReactionsPreference>
): Promise<MetaprotocolTransactionResult> {
  const { videoId, option } = message

  // load video
  const video = await ec.collections.Video.get(videoId, { channel: true })

  if (!video) {
    return metaprotocolTransactionFailure(
      VideoReactionsPreference,
      `Video by id ${videoId} not found`,
      { decodedMessage: message }
    )
  }

  // ensure channel owns the video
  if (video.channel.id !== channel.id) {
    return metaprotocolTransactionFailure(
      VideoReactionsPreference,
      `Cannot change preferences on video ${video.id} which does not belong to channel ${channel.id}`,
      {
        decodedMessage: message,
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
  const commentOrFailure = await getCommentForMetaprotocolAction(
    ec,
    ModerateComment,
    channel,
    message,
    message.commentId,
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
