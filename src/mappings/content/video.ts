import {
  AppAction,
  AppActionMetadata,
  ContentMetadata,
  IVideoMetadata,
} from '@joystream/metadata-protobuf'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { integrateMeta } from '@joystream/metadata-protobuf/utils'
import { Channel, Video, VideoViewEvent } from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { deserializeMetadata, u8aToBytes } from '../utils'
import { processVideoMetadata } from './metadata'
import { deleteVideo, encodeAssets, processAppActionMetadata, processNft } from './utils'
import { generateAppActionCommitment } from '@joystream/js/utils'

export async function processVideoCreatedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, channelId, contentId, contentCreationParameters, newDataObjectIds],
  },
}: EventHandlerContext<'Content.VideoCreated'>): Promise<void> {
  const { meta, expectedVideoStateBloatBond, autoIssueNft } = contentCreationParameters

  const videoId = contentId.toString()
  const viewsNum = await overlay.getEm().getRepository(VideoViewEvent).countBy({ videoId })
  const video = overlay.getRepository(Video).new({
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
    videoRelevance: +(
      (30 - (Date.now() - new Date(block.timestamp).getTime()) / (1000 * 60 * 60 * 24)) *
      0.4
    ).toFixed(2),
  })

  // fetch related channel and owner
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())

  // update channels videoViewsNum
  channel.videoViewsNum += viewsNum

  // deserialize & process metadata
  const appAction = meta && deserializeMetadata(AppAction, meta, { skipWarning: true })

  if (appAction) {
    const videoMetadata = appAction.rawAction
      ? deserializeMetadata(ContentMetadata, appAction.rawAction)?.videoMetadata ?? {}
      : {}

    const expectedCommitment = generateAppActionCommitment(
      channel.totalVideosCreated,
      channel.id,
      AppAction.ActionType.CREATE_VIDEO,
      AppAction.CreatorType.CHANNEL,
      encodeAssets(contentCreationParameters.assets),
      appAction.rawAction ?? undefined,
      appAction.metadata ?? undefined
    )
    await processAppActionMetadata(overlay, video, appAction, expectedCommitment, (entity) => {
      if (entity.entryAppId && appAction.metadata) {
        const appActionMetadata = deserializeMetadata(AppActionMetadata, appAction.metadata)

        appActionMetadata?.videoId &&
          integrateMeta(entity, { ytVideoId: appActionMetadata.videoId }, ['ytVideoId'])
      }
      return processVideoMetadata(
        overlay,
        block,
        indexInBlock,
        entity,
        videoMetadata,
        newDataObjectIds
      )
    })
  } else {
    const contentMetadata = meta && deserializeMetadata(ContentMetadata, meta)
    if (contentMetadata?.videoMetadata) {
      await processVideoMetadata(
        overlay,
        block,
        indexInBlock,
        video,
        contentMetadata.videoMetadata,
        newDataObjectIds
      )
    }
  }

  channel.totalVideosCreated += 1

  if (autoIssueNft) {
    await processNft(overlay, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft)
  }
}

export async function processVideoUpdatedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, contentId, contentUpdateParameters, newDataObjectIds],
  },
}: EventHandlerContext<'Content.VideoUpdated'>): Promise<void> {
  const { newMeta, autoIssueNft } = contentUpdateParameters
  const video = await overlay.getRepository(Video).getByIdOrFail(contentId.toString())

  const appAction = newMeta && deserializeMetadata(AppAction, newMeta, { skipWarning: true })

  let videoMetadataUpdate: DecodedMetadataObject<IVideoMetadata> | null | undefined
  if (appAction) {
    const contentMetadataBytes = u8aToBytes(appAction.rawAction)
    videoMetadataUpdate = deserializeMetadata(
      ContentMetadata,
      contentMetadataBytes.toU8a(true)
    )?.videoMetadata
  } else {
    const contentMetadata = newMeta && deserializeMetadata(ContentMetadata, newMeta)
    videoMetadataUpdate = contentMetadata?.videoMetadata
  }

  if (videoMetadataUpdate) {
    await processVideoMetadata(
      overlay,
      block,
      indexInBlock,
      video,
      videoMetadataUpdate,
      newDataObjectIds
    )
  }

  if (autoIssueNft) {
    await processNft(overlay, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft)
  }
}

export async function processVideoDeletedEvent({
  overlay,
  event: {
    asV1000: [, contentId],
  },
}: EventHandlerContext<'Content.VideoDeleted'>): Promise<void> {
  await deleteVideo(overlay, contentId)
}

export async function processVideoDeletedByModeratorEvent({
  overlay,
  event: {
    asV1000: [, contentId],
  },
}: EventHandlerContext<'Content.VideoDeletedByModerator'>): Promise<void> {
  await deleteVideo(overlay, contentId)
}

export async function processVideoVisibilitySetByModeratorEvent({
  overlay,
  event: {
    asV1000: [, videoId, isCensored],
  },
}: EventHandlerContext<'Content.VideoVisibilitySetByModerator'>): Promise<void> {
  const video = await overlay.getRepository(Video).getByIdOrFail(videoId.toString())
  video.isCensored = isCensored
}
