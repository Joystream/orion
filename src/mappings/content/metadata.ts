import {
  ChannelMetadata,
  ChannelModeratorRemarked,
  ChannelOwnerRemarked,
  IChannelMetadata,
  IChannelModeratorRemarked,
  IChannelOwnerRemarked,
  ILicense,
  IMakeChannelPayment,
  IMediaType,
  IModerateComment,
  IPinOrUnpinComment,
  IPublishedBeforeJoystream,
  ISubtitleMetadata,
  IVideoMetadata,
  IVideoReactionsPreference,
  MakeChannelPayment,
  ModerateComment,
  PinOrUnpinComment,
  PublishedBeforeJoystream,
  SubtitleMetadata,
  VideoMetadata,
  VideoReactionsPreference,
  IBanOrUnbanMemberFromChannel,
  BanOrUnbanMemberFromChannel,
} from '@joystream/metadata-protobuf'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import {
  integrateMeta,
  isEmptyObject,
  isSet,
  isValidLanguageCode,
} from '@joystream/metadata-protobuf/utils'
import { assertNotNull, SubstrateBlock } from '@subsquid/substrate-processor'
import {
  BannedMember,
  Channel,
  ChannelPaymentMadeEventData,
  Comment,
  CommentStatus,
  License,
  MetaprotocolTransactionResult,
  MetaprotocolTransactionResultChannelPaid,
  MetaprotocolTransactionResultCommentModerated,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionResultOK,
  PaymentContext,
  PaymentContextChannel,
  PaymentContextVideo,
  StorageDataObject,
  Video,
  VideoCategory,
  VideoMediaEncoding,
  VideoMediaMetadata,
  VideoSubtitle,
  MemberBannedFromChannelEventData,
  Membership,
  Event,
} from '../../model'
import { EntityManagerOverlay, Flat } from '../../utils/overlay'
import {
  commentCountersManager,
  genericEventFields,
  invalidMetadata,
  metaprotocolTransactionFailure,
  videoRelevanceManager,
} from '../utils'
import { AsDecoded, ASSETS_MAP, EntityAssetProps, EntityAssetsMap, MetaNumberProps } from './utils'

export async function processChannelMetadata(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  channel: Flat<Channel>,
  meta: DecodedMetadataObject<IChannelMetadata>,
  newAssetIds: bigint[]
) {
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  const assets = await Promise.all(
    newAssetIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString()))
  )

  integrateMeta(channel, meta, ['title', 'description', 'isPublic'])

  await processAssets(overlay, block, assets, channel, ChannelMetadata, meta, ASSETS_MAP.channel)

  // prepare language if needed
  if (isSet(meta.language)) {
    processLanguage(ChannelMetadata, channel, meta.language)
  }
}

export async function processVideoMetadata(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  video: Flat<Video>,
  meta: DecodedMetadataObject<IVideoMetadata>,
  newAssetIds: bigint[]
): Promise<void> {
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  const assets = await Promise.all(
    newAssetIds.map((id) => dataObjectRepository.getByIdOrFail(id.toString()))
  )

  integrateMeta(video, meta, [
    'title',
    'description',
    'duration',
    'hasMarketing',
    'isExplicit',
    'isPublic',
  ])

  await processAssets(overlay, block, assets, video, VideoMetadata, meta, ASSETS_MAP.video)

  // prepare video category if needed
  if (isSet(meta.category)) {
    const category = await overlay.getRepository(VideoCategory).getById(meta.category)
    if (!category) {
      invalidMetadata(VideoMetadata, `Category by id ${meta.category} not found!`, {
        decodedMessage: meta,
      })
    }
    video.categoryId = category?.id || null
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
    await processVideoMediaMetadata(overlay, block, indexInBlock, video.id, meta, videoSize)
  }

  // prepare license if needed
  if (isSet(meta.license)) {
    await processVideoLicense(overlay, block, indexInBlock, video, meta.license)
  }

  // prepare language if needed
  if (isSet(meta.language)) {
    processLanguage(VideoMetadata, video, meta.language)
  }

  // prepare subtitles if needed
  const subtitles = meta.clearSubtitles ? [] : meta.subtitles
  if (isSet(subtitles)) {
    await processVideoSubtitles(overlay, block, video, assets, subtitles)
  }

  if (isSet(meta.publishedBeforeJoystream)) {
    processPublishedBeforeJoystream(video, meta.publishedBeforeJoystream)
  }

  if (isSet(meta.enableComments)) {
    video.isCommentSectionEnabled = meta.enableComments
  }
}

function extractVideoSize(assets: Flat<StorageDataObject>[]): bigint | undefined {
  const mediaAsset = assets.find((a) => a.type?.isTypeOf === 'DataObjectTypeVideoMedia')
  return mediaAsset ? mediaAsset.size : undefined
}

async function processVideoMediaEncoding(
  overlay: EntityManagerOverlay,
  mediaMetadata: Flat<VideoMediaMetadata>,
  metadata: DecodedMetadataObject<IMediaType>
): Promise<void> {
  const metadataRepository = overlay.getRepository(VideoMediaEncoding)
  // TODO: Make it one-to-many w/ video media?
  // Or perhaps just jsonb?
  const encoding =
    (await metadataRepository.getById(mediaMetadata.id)) ||
    metadataRepository.new({
      id: mediaMetadata.id,
    })

  // integrate media encoding-related data
  integrateMeta(encoding, metadata, ['codecName', 'container', 'mimeMediaType'])
  mediaMetadata.encodingId = encoding.id
}

async function processVideoMediaMetadata(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  videoId: string,
  metadata: DecodedMetadataObject<IVideoMetadata>,
  videoSize: bigint | undefined
): Promise<void> {
  const metadataRepository = overlay.getRepository(VideoMediaMetadata)
  const videoMediaMetadata =
    (await metadataRepository.getOneByRelation('videoId', videoId)) ||
    metadataRepository.new({
      // TODO: Re-think backward-compatibility
      id: `${block.height}-${indexInBlock}`, // videoId,
      createdInBlock: block.height,
      videoId,
    })

  // integrate media-related data
  const mediaMetadataUpdate = {
    size: isSet(videoSize) ? videoSize : undefined,
    pixelWidth: metadata.mediaPixelWidth,
    pixelHeight: metadata.mediaPixelHeight,
  }
  integrateMeta(videoMediaMetadata, mediaMetadataUpdate, ['pixelWidth', 'pixelHeight', 'size'])
  if (metadata.mediaType) {
    await processVideoMediaEncoding(overlay, videoMediaMetadata, metadata.mediaType)
  }
}

async function processVideoLicense(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  video: Flat<Video>,
  licenseMetadata: DecodedMetadataObject<ILicense>
): Promise<void> {
  const licenseRepository = overlay.getRepository(License)
  if (!isEmptyObject(licenseMetadata)) {
    // license is meant to be created/updated
    // TODO: Make it one-to-many w/ video?
    const videoLicense =
      (await licenseRepository.getById(video.licenseId || '')) ||
      licenseRepository.new({
        // TODO: Re-think backward-compatibility
        id: `${block.height}-${indexInBlock}`, // videoId,
      })
    integrateMeta(videoLicense, licenseMetadata, ['attribution', 'code', 'customText'])
    video.licenseId = videoLicense.id
  } else {
    // license is meant to be unset/removed
    if (video.licenseId) {
      licenseRepository.remove(video.licenseId)
    }
    video.licenseId = null
  }
}

async function processVideoSubtitles(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  video: Flat<Video>,
  assets: Flat<StorageDataObject>[],
  subtitlesMeta: DecodedMetadataObject<ISubtitleMetadata>[]
): Promise<void> {
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  const subtitlesRepository = overlay.getRepository(VideoSubtitle)
  const currentSubtitles = await subtitlesRepository.getManyByRelation('videoId', video.id)
  dataObjectRepository.remove(...currentSubtitles.flatMap((s) => (s.assetId ? [s.assetId] : [])))
  subtitlesRepository.remove(...currentSubtitles)
  for (const subtitleMeta of subtitlesMeta) {
    const subtitleId = `${video.id}-${subtitleMeta.type}-${subtitleMeta.language}`
    const subtitle = subtitlesRepository.new({
      id: subtitleId,
      type: subtitleMeta.type,
      videoId: video.id,
      mimeType: subtitleMeta.mimeType,
    })
    processLanguage(SubtitleMetadata, subtitle, subtitleMeta.language)
    await processAssets(
      overlay,
      block,
      assets,
      subtitle,
      SubtitleMetadata,
      subtitleMeta,
      ASSETS_MAP.subtitle
    )
  }
}

function processPublishedBeforeJoystream(
  video: Flat<Video>,
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

async function processAssets<E, M extends AnyMetadataClass<unknown>>(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  assets: Flat<StorageDataObject>[],
  entity: { [K in EntityAssetProps<E>]?: string | null | undefined },
  metadataClass: M,
  meta: { [K in MetaNumberProps<AsDecoded<M>>]?: number | null | undefined },
  entityAssetsMap: EntityAssetsMap<E, AsDecoded<M>>
): Promise<void> {
  for (const { metaProperty, entityProperty, createDataObjectType } of entityAssetsMap) {
    const newAssetIndex: number | undefined = meta[metaProperty] ?? undefined
    const currentAssetId = entity[entityProperty]
    const currentAsset = currentAssetId
      ? await overlay.getRepository(StorageDataObject).getById(currentAssetId)
      : null
    if (isSet(newAssetIndex)) {
      const newAsset = findAssetByIndex(metadataClass, assets, newAssetIndex)
      if (newAsset) {
        if (currentAsset) {
          currentAsset.unsetAt = new Date(block.timestamp)
        }
        entity[entityProperty] = newAsset.id
        newAsset.type = createDataObjectType(entity as E)
      }
    }
  }
}

function findAssetByIndex(
  metaClass: AnyMetadataClass<unknown>,
  assets: Flat<StorageDataObject>[],
  index: number
): Flat<StorageDataObject> | null {
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
  entity: Flat<Video> | Flat<Channel> | Flat<VideoSubtitle>,
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
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  channel: Flat<Channel>,
  decodedMessage: DecodedMetadataObject<IChannelOwnerRemarked>
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.pinOrUnpinComment) {
    return processPinOrUnpinCommentMessage(overlay, channel, decodedMessage.pinOrUnpinComment)
  }

  if (decodedMessage.banOrUnbanMemberFromChannel) {
    return processBanOrUnbanMemberFromChannelMessage(
      overlay,
      block,
      indexInBlock,
      txHash,
      channel,
      decodedMessage.banOrUnbanMemberFromChannel
    )
  }

  if (decodedMessage.videoReactionsPreference) {
    return processVideoReactionsPreferenceMessage(
      overlay,
      channel,
      decodedMessage.videoReactionsPreference
    )
  }

  if (decodedMessage.moderateComment) {
    return processModerateCommentMessage(overlay, channel, decodedMessage.moderateComment)
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
  overlay: EntityManagerOverlay,
  metaClass: AnyMetadataClass<T>,
  channel: Flat<Channel>,
  message: DecodedMetadataObject<T>,
  commentId: string,
  requiredStatus: CommentStatus
): Promise<{ comment: Flat<Comment>; video: Flat<Video> } | MetaprotocolTransactionResultFailed> {
  const comment = await overlay.getRepository(Comment).getById(commentId)

  if (!comment) {
    return metaprotocolTransactionFailure(metaClass, `Comment by id ${commentId} not found`, {
      decodedMessage: message,
    })
  }

  const video = await overlay.getRepository(Video).getByIdOrFail(assertNotNull(comment.videoId))

  // ensure channel owns the video
  if (video.channelId !== channel.id) {
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

  return { comment, video }
}

export async function processPinOrUnpinCommentMessage(
  overlay: EntityManagerOverlay,
  channel: Flat<Channel>,
  message: DecodedMetadataObject<IPinOrUnpinComment>
): Promise<MetaprotocolTransactionResult> {
  const { option } = message

  const commentOrFailure = await getCommentForMetaprotocolAction(
    overlay,
    PinOrUnpinComment,
    channel,
    message,
    message.commentId,
    CommentStatus.VISIBLE
  )

  if (commentOrFailure instanceof MetaprotocolTransactionResultFailed) {
    return commentOrFailure
  }

  const { comment, video } = commentOrFailure
  video.pinnedCommentId = option === PinOrUnpinComment.Option.PIN ? comment.id : null

  return new MetaprotocolTransactionResultOK()
}

export async function processBanOrUnbanMemberFromChannelMessage(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  channel: Flat<Channel>,
  message: DecodedMetadataObject<IBanOrUnbanMemberFromChannel>
): Promise<MetaprotocolTransactionResult> {
  const { memberId, option } = message

  const member = await overlay.getRepository(Membership).getById(memberId)

  if (!member) {
    return metaprotocolTransactionFailure(
      BanOrUnbanMemberFromChannel,
      `Member does not exist: ${memberId}`,
      { decodedMessage: message }
    )
  }

  // ban member from channel
  if (option === BanOrUnbanMemberFromChannel.Option.BAN) {
    overlay.getRepository(BannedMember).new({
      channelId: channel.id,
      memberId: member.id,
      id: `${channel.id}-${member.id}`,
    })
  }

  // unban member from channel
  if (option === BanOrUnbanMemberFromChannel.Option.UNBAN) {
    overlay.getRepository(BannedMember).remove(`${channel.id}-${member.id}`)
  }

  // event processing
  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, txHash),
    data: new MemberBannedFromChannelEventData({
      channel: channel.id,
      member: member.id,
      action: option === BanOrUnbanMemberFromChannel.Option.BAN,
    }),
  })

  return new MetaprotocolTransactionResultOK()
}

export async function processVideoReactionsPreferenceMessage(
  overlay: EntityManagerOverlay,
  channel: Flat<Channel>,
  message: DecodedMetadataObject<IVideoReactionsPreference>
): Promise<MetaprotocolTransactionResult> {
  const { videoId, option } = message

  // load video
  const video = await overlay.getRepository(Video).getById(videoId)

  if (!video) {
    return metaprotocolTransactionFailure(
      VideoReactionsPreference,
      `Video by id ${videoId} not found`,
      { decodedMessage: message }
    )
  }

  // ensure channel owns the video
  if (video.channelId !== channel.id) {
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
  overlay: EntityManagerOverlay,
  channel: Flat<Channel>,
  message: DecodedMetadataObject<IModerateComment>
): Promise<MetaprotocolTransactionResult> {
  const commentOrFailure = await getCommentForMetaprotocolAction(
    overlay,
    ModerateComment,
    channel,
    message,
    message.commentId,
    CommentStatus.VISIBLE
  )

  if (commentOrFailure instanceof MetaprotocolTransactionResultFailed) {
    return commentOrFailure
  }

  const { comment } = commentOrFailure

  // schedule comment counters updates
  commentCountersManager.scheduleRecalcForComment(comment.parentCommentId)
  commentCountersManager.scheduleRecalcForVideo(comment.videoId)
  videoRelevanceManager.scheduleRecalcForVideo(comment.videoId)

  comment.text = ''
  comment.status = CommentStatus.MODERATED

  return new MetaprotocolTransactionResultCommentModerated({ commentModerated: comment.id })
}

export async function processModeratorRemark(
  overlay: EntityManagerOverlay,
  channel: Flat<Channel>,
  decodedMessage: DecodedMetadataObject<IChannelModeratorRemarked>
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.moderateComment) {
    return processModerateCommentMessage(overlay, channel, decodedMessage.moderateComment)
  }

  return metaprotocolTransactionFailure(
    ChannelModeratorRemarked,
    'Unsupported channel moderator remark action',
    { decodedMessage }
  )
}

export async function processChannelPaymentFromMember(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  message: DecodedMetadataObject<IMakeChannelPayment>,
  memberId: string,
  [payeeAccount, amount]: [string, bigint]
): Promise<MetaprotocolTransactionResult> {
  const member = await overlay.getRepository(Membership).getByIdOrFail(memberId)

  // Only channel reward accounts are being checked right now as payment destination.
  // Transfers to any other destination will be ignored by the query node.
  const channel = await overlay.getRepository(Channel).getOneBy({ rewardAccount: payeeAccount })

  if (!channel) {
    return metaprotocolTransactionFailure(
      MakeChannelPayment,
      `Payment made to unknown channel reward account: ${payeeAccount}`,
      { payeeAccount }
    )
  }

  let paymentContext: PaymentContext | undefined
  if (message.videoId) {
    const video = await overlay.getRepository(Video).getById(message.videoId.toString())
    if (video && video.channelId === channel.id) {
      paymentContext = new PaymentContextVideo({ video: video.id })
    } else {
      invalidMetadata(
        MakeChannelPayment,
        `payment context video not found in channel that was queried based on reward (or payee) account.`,
        { channelId: channel.id, videoChannelId: video?.channelId }
      )
    }
  } else {
    paymentContext = new PaymentContextChannel()
    paymentContext.channel = channel.id
  }

  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, txHash),
    data: new ChannelPaymentMadeEventData({
      payer: member.id,
      payeeChannel: channel.id,
      paymentContext,
      rationale: message.rationale || undefined,
      amount,
    }),
  })

  return new MetaprotocolTransactionResultChannelPaid({
    channelPaid: channel.id,
  })
}
