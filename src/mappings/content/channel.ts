import { Channel, Event, Membership, MetaprotocolTransactionStatusEventData } from '../../model'
import { deserializeMetadata, genericEventFields, toAddress } from '../utils'
import {
  ChannelMetadata,
  ChannelModeratorRemarked,
  ChannelOwnerRemarked,
} from '@joystream/metadata-protobuf'
import { processChannelMetadata, processModeratorRemark, processOwnerRemark } from './metadata'
import { EventHandlerContext } from '../../utils'

export async function processChannelCreatedEvent({
  ec,
  block,
  event: {
    asV1000: [
      channelId,
      { owner, dataObjects, channelStateBloatBond },
      channelCreationParameters,
      rewardAccount,
    ],
  },
}: EventHandlerContext<'Content.ChannelCreated'>) {
  // create entity
  const channel = new Channel({
    id: channelId.toString(),
    isCensored: false,
    createdAt: new Date(block.timestamp),
    createdInBlock: block.height,
    ownerMember:
      owner.__kind === 'Member' ? new Membership({ id: owner.value.toString() }) : undefined,
    rewardAccount: toAddress(rewardAccount),
    channelStateBloatBond: channelStateBloatBond.amount,
    followsNum: 0,
    videoViewsNum: 0,
  })

  // deserialize & process metadata
  if (channelCreationParameters.meta !== undefined) {
    const metadata = deserializeMetadata(ChannelMetadata, channelCreationParameters.meta) || {}
    await processChannelMetadata(ec, block, channel, metadata, dataObjects)
  }

  ec.collections.Channel.push(channel)
}

export async function processChannelUpdatedEvent({
  ec,
  block,
  event: {
    asV1000: [, channelId, channelUpdateParameters, newDataObjects],
  },
}: EventHandlerContext<'Content.ChannelUpdated'>) {
  const channel = await ec.collections.Channel.get(channelId.toString(), {
    avatarPhoto: true,
    coverPhoto: true,
  })

  //  update metadata if it was changed
  if (channelUpdateParameters.newMeta) {
    const newMetadata = deserializeMetadata(ChannelMetadata, channelUpdateParameters.newMeta) || {}
    await processChannelMetadata(ec, block, channel, newMetadata, newDataObjects)
  }
}

export async function processChannelDeletedEvent({
  ec,
  event: { asV1000: channelId },
}: EventHandlerContext<'Content.ChannelDeleted'>): Promise<void> {
  ec.collections.Channel.remove(new Channel({ id: channelId.toString() }))
}

export async function processChannelDeletedByModeratorEvent({
  ec,
  event: {
    asV1000: [, channelId],
  },
}: EventHandlerContext<'Content.ChannelDeletedByModerator'>): Promise<void> {
  ec.collections.Channel.remove(new Channel({ id: channelId.toString() }))
}

export async function processChannelVisibilitySetByModeratorEvent({
  ec,
  event: {
    asV1000: [, channelId, isHidden],
  },
}: EventHandlerContext<'Content.ChannelVisibilitySetByModerator'>): Promise<void> {
  const channel = await ec.collections.Channel.get(channelId.toString())
  channel.isCensored = isHidden
}

export async function processChannelOwnerRemarkedEvent({
  block,
  indexInBlock,
  extrinsicHash,
  ec,
  event: {
    asV1000: [channelId, messageBytes],
  },
}: EventHandlerContext<'Content.ChannelOwnerRemarked'>): Promise<void> {
  const channel = await ec.collections.Channel.get(channelId.toString())
  const decodedMessage = deserializeMetadata(ChannelOwnerRemarked, messageBytes)

  if (decodedMessage) {
    const result = await processOwnerRemark(ec, channel, decodedMessage)
    ec.collections.Event.push(
      new Event({
        ...genericEventFields(block, indexInBlock, extrinsicHash),
        data: new MetaprotocolTransactionStatusEventData({
          result,
        }),
      })
    )
  }
}

export async function processChannelAgentRemarkedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [, channelId, messageBytes],
  },
}: EventHandlerContext<'Content.ChannelAgentRemarked'>): Promise<void> {
  const channel = await ec.collections.Channel.get(channelId.toString())
  const decodedMessage = deserializeMetadata(ChannelModeratorRemarked, messageBytes)

  if (decodedMessage) {
    const result = await processModeratorRemark(ec, channel, decodedMessage)
    ec.collections.Event.push(
      new Event({
        ...genericEventFields(block, indexInBlock, extrinsicHash),
        data: new MetaprotocolTransactionStatusEventData({
          result,
        }),
      })
    )
  }
}
