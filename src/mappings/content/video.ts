import { ContentMetadata } from '@joystream/metadata-protobuf'
import { Channel, Video } from '../../model'
import { EventHandlerContext } from '../../utils'
import { deserializeMetadata } from '../utils'
import { processVideoMetadata } from './metadata'
import { deleteVideo, processNft } from './utils'

export async function processVideoCreatedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, channelId, contentId, contentCreationParameters, newDataObjectIds],
  },
}: EventHandlerContext<'Content.VideoCreated'>): Promise<void> {
  const { meta, expectedVideoStateBloatBond, autoIssueNft } = contentCreationParameters

  // deserialize & process metadata
  const contentMetadata = meta && deserializeMetadata(ContentMetadata, meta)

  const video = new Video({
    id: contentId.toString(),
    createdAt: new Date(block.timestamp),
    channel: new Channel({ id: channelId.toString() }),
    isCensored: false,
    createdInBlock: block.height,
    isCommentSectionEnabled: true,
    isReactionFeatureEnabled: true,
    videoStateBloatBond: expectedVideoStateBloatBond,
    commentsCount: 0,
    reactionsCount: 0,
    viewsNum: 0,
  })
  ec.collections.Video.push(video)

  if (contentMetadata?.videoMetadata) {
    await processVideoMetadata(ec, block, video, contentMetadata.videoMetadata, newDataObjectIds)
  }

  if (autoIssueNft) {
    await processNft(ec, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft)
  }
}

export async function processVideoUpdatedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [contentActor, contentId, contentUpdateParameters, newDataObjectIds],
  },
}: EventHandlerContext<'Content.VideoUpdated'>): Promise<void> {
  const { newMeta, autoIssueNft } = contentUpdateParameters
  const video = await ec.collections.Video.get(contentId.toString(), {
    license: true,
    channel: true,
    nft: true,
    mediaMetadata: {
      encoding: true,
    },
    media: true,
    thumbnailPhoto: true,
    subtitles: {
      asset: true,
    },
  })

  const contentMetadata = newMeta && deserializeMetadata(ContentMetadata, newMeta)

  if (contentMetadata?.videoMetadata) {
    await processVideoMetadata(ec, block, video, contentMetadata.videoMetadata, newDataObjectIds)
  }

  if (autoIssueNft) {
    await processNft(ec, block, indexInBlock, extrinsicHash, video, contentActor, autoIssueNft)
  }
}

export async function processVideoDeletedEvent({
  ec,
  event: {
    asV1000: [, contentId],
  },
}: EventHandlerContext<'Content.VideoDeleted'>): Promise<void> {
  await deleteVideo(ec, contentId)
}

export async function processVideoDeletedByModeratorEvent({
  ec,
  event: {
    asV1000: [, contentId],
  },
}: EventHandlerContext<'Content.VideoDeletedByModerator'>): Promise<void> {
  await deleteVideo(ec, contentId)
}

export async function processVideoVisibilitySetByModeratorEvent({
  ec,
  event: {
    asV1000: [, videoId, isCensored],
  },
}: EventHandlerContext<'Content.VideoVisibilitySetByModerator'>): Promise<void> {
  const video = await ec.collections.Video.get(videoId.toString())
  video.isCensored = isCensored
}
