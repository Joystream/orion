import {
  Channel,
  Event,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionStatusEventData,
  StorageDataObject,
  DataObjectTypeChannelPayoutsPayload,
  ChannelPayoutsUpdatedEventData,
  ChannelRewardClaimedEventData,
  ChannelRewardClaimedAndWithdrawnEventData,
  ChannelFundsWithdrawnEventData,
} from '../../model'
import { deserializeMetadata, genericEventFields, toAddress } from '../utils'
import {
  ChannelMetadata,
  ChannelModeratorRemarked,
  ChannelOwnerRemarked,
} from '@joystream/metadata-protobuf'
import { processChannelMetadata, processModeratorRemark, processOwnerRemark } from './metadata'
import { EventHandlerContext } from '../../utils/events'
import { parseContentActor } from './utils'

export async function processChannelCreatedEvent({
  overlay,
  block,
  event: {
    asV2000: [
      channelId,
      { owner, dataObjects, channelStateBloatBond },
      channelCreationParameters,
      rewardAccount,
    ],
  },
}: EventHandlerContext<'Content.ChannelCreated'>) {
  // create entity
  const channel = overlay.getRepository(Channel).new({
    id: channelId.toString(),
    isCensored: false,
    isExcluded: false,
    createdAt: new Date(block.timestamp),
    createdInBlock: block.height,
    ownerMemberId: owner.__kind === 'Member' ? owner.value.toString() : undefined,
    rewardAccount: toAddress(rewardAccount),
    channelStateBloatBond: channelStateBloatBond.amount,
    followsNum: 0,
    videoViewsNum: 0,
  })

  // deserialize & process metadata
  if (channelCreationParameters.meta !== undefined) {
    const metadata = deserializeMetadata(ChannelMetadata, channelCreationParameters.meta) || {}
    await processChannelMetadata(overlay, block, channel, metadata, dataObjects)
  }
}

export async function processChannelUpdatedEvent({
  overlay,
  block,
  event: {
    asV2000: [, channelId, channelUpdateParameters, newDataObjects],
  },
}: EventHandlerContext<'Content.ChannelUpdated'>) {
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())

  //  update metadata if it was changed
  if (channelUpdateParameters.newMeta) {
    const newMetadata = deserializeMetadata(ChannelMetadata, channelUpdateParameters.newMeta) || {}
    await processChannelMetadata(overlay, block, channel, newMetadata, newDataObjects)
  }
}

export async function processChannelDeletedEvent({
  overlay,
  event: { asV2000: channelId },
}: EventHandlerContext<'Content.ChannelDeleted'>): Promise<void> {
  overlay.getRepository(Channel).remove(channelId.toString())
}

export async function processChannelDeletedByModeratorEvent({
  overlay,
  event: {
    asV2000: [, channelId],
  },
}: EventHandlerContext<'Content.ChannelDeletedByModerator'>): Promise<void> {
  overlay.getRepository(Channel).remove(channelId.toString())
}

export async function processChannelVisibilitySetByModeratorEvent({
  overlay,
  event: {
    asV2000: [, channelId, isHidden],
  },
}: EventHandlerContext<'Content.ChannelVisibilitySetByModerator'>): Promise<void> {
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())
  channel.isCensored = isHidden
}

export async function processChannelOwnerRemarkedEvent({
  block,
  indexInBlock,
  extrinsicHash,
  overlay,
  event: {
    asV2000: [channelId, messageBytes],
  },
}: EventHandlerContext<'Content.ChannelOwnerRemarked'>): Promise<void> {
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())
  const decodedMessage = deserializeMetadata(ChannelOwnerRemarked, messageBytes)

  const result = decodedMessage
    ? await processOwnerRemark(overlay, block.height, indexInBlock, channel, decodedMessage)
    : new MetaprotocolTransactionResultFailed({
        errorMessage: 'Could not decode the metadata',
      })
  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new MetaprotocolTransactionStatusEventData({
      result,
    }),
  })
}

export async function processChannelAgentRemarkedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV2000: [, channelId, messageBytes],
  },
}: EventHandlerContext<'Content.ChannelAgentRemarked'>): Promise<void> {
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())
  const decodedMessage = deserializeMetadata(ChannelModeratorRemarked, messageBytes)

  const result = decodedMessage
    ? await processModeratorRemark(overlay, channel, decodedMessage)
    : new MetaprotocolTransactionResultFailed({
        errorMessage: 'Could not decode the metadata',
      })
  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new MetaprotocolTransactionStatusEventData({
      result,
    }),
  })
}

export async function processChannelPayoutsUpdatedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV2000: [updateChannelPayoutParameters, dataObjectId],
  },
}: EventHandlerContext<'Content.ChannelPayoutsUpdated'>): Promise<void> {
  const payloadDataObject =
    dataObjectId !== undefined
      ? await overlay.getRepository(StorageDataObject).getByIdOrFail(dataObjectId.toString())
      : undefined

  if (payloadDataObject) {
    payloadDataObject.type = new DataObjectTypeChannelPayoutsPayload()
  }

  const { minCashoutAllowed, maxCashoutAllowed, channelCashoutsEnabled, commitment } =
    updateChannelPayoutParameters

  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new ChannelPayoutsUpdatedEventData({
      commitment: commitment && `0x${Buffer.from(commitment).toString('hex')}`,
      minCashoutAllowed,
      maxCashoutAllowed,
      channelCashoutsEnabled,
      payloadDataObject: payloadDataObject?.id,
    }),
  })
}

export async function processChannelRewardUpdatedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV2000: [, claimedAmount, channelId],
  },
}: EventHandlerContext<'Content.ChannelRewardUpdated'>): Promise<void> {
  // load channel
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())

  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new ChannelRewardClaimedEventData({
      amount: claimedAmount,
      channel: channel.id,
    }),
  })

  channel.cumulativeRewardClaimed = (channel.cumulativeRewardClaimed || 0n) + claimedAmount
}

export async function processChannelRewardClaimedAndWithdrawnEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV2000: [actor, channelId, claimedAmount, destination],
  },
}: EventHandlerContext<'Content.ChannelRewardClaimedAndWithdrawn'>): Promise<void> {
  // load channel
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())

  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new ChannelRewardClaimedAndWithdrawnEventData({
      amount: claimedAmount,
      channel: channel.id,
      account: destination.__kind === 'AccountId' ? toAddress(destination.value) : undefined,
      actor: parseContentActor(actor),
    }),
  })

  channel.cumulativeRewardClaimed = (channel.cumulativeRewardClaimed || 0n) + claimedAmount
}

export async function processChannelFundsWithdrawnEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV2000: [actor, channelId, amount, destination],
  },
}: EventHandlerContext<'Content.ChannelFundsWithdrawn'>): Promise<void> {
  // load channel
  const channel = await overlay.getRepository(Channel).getByIdOrFail(channelId.toString())

  overlay.getRepository(Event).new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new ChannelFundsWithdrawnEventData({
      amount,
      channel: channel.id,
      account: destination.__kind === 'AccountId' ? toAddress(destination.value) : undefined,
      actor: parseContentActor(actor),
    }),
  })
}
