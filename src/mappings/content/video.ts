import { ContentMetadata } from '@joystream/metadata-protobuf'
import { Video } from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { deserializeMetadata } from '../utils'
import { processVideoMetadata } from './metadata'
import { deleteVideo, processNft } from './utils'

export async function processVideoCreatedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV2000: [contentActor, channelId, contentId, contentCreationParameters, newDataObjectIds],
  },
}: EventHandlerContext<'Content.VideoCreated'>): Promise<void> {
  const { meta, expectedVideoStateBloatBond, autoIssueNft } = contentCreationParameters

  // deserialize & process metadata
  const contentMetadata = meta && deserializeMetadata(ContentMetadata, meta)

  const video = overlay.getRepository(Video).new({
    id: contentId.toString(),
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
    viewsNum: 0,
  })

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
    asV2000: [contentActor, contentId, contentUpdateParameters, newDataObjectIds],
  },
}: EventHandlerContext<'Content.VideoUpdated'>): Promise<void> {
  const { newMeta, autoIssueNft } = contentUpdateParameters
  const video = await overlay.getRepository(Video).getByIdOrFail(contentId.toString())

  const contentMetadata = newMeta && deserializeMetadata(ContentMetadata, newMeta)

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

  if (autoIssueNft) {
    await processNft(overlay, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft)
  }
}

export async function processVideoDeletedEvent({
  overlay,
  event: {
    asV2000: [, contentId],
  },
}: EventHandlerContext<'Content.VideoDeleted'>): Promise<void> {
  await deleteVideo(overlay, contentId)
}

export async function processVideoDeletedByModeratorEvent({
  overlay,
  event: {
    asV2000: [, contentId],
  },
}: EventHandlerContext<'Content.VideoDeletedByModerator'>): Promise<void> {
  await deleteVideo(overlay, contentId)
}

export async function processVideoVisibilitySetByModeratorEvent({
  overlay,
  event: {
    asV2000: [, videoId, isCensored],
  },
}: EventHandlerContext<'Content.VideoVisibilitySetByModerator'>): Promise<void> {
  const video = await overlay.getRepository(Video).getByIdOrFail(videoId.toString())
  video.isCensored = isCensored
}
