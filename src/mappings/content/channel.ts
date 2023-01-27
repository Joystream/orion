import {
  Channel,
  Event,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionStatusEventData,
  StorageDataObject,
  DataObjectTypeChannelPayoutsPayload,
  ChannelPayoutsUpdatedEventData
} from '../../model'
import { deserializeMetadata, genericEventFields, toAddress } from '../utils'
import {
  ChannelMetadata,
  ChannelModeratorRemarked,
  ChannelOwnerRemarked,
} from '@joystream/metadata-protobuf'
import { processChannelMetadata, processModeratorRemark, processOwnerRemark } from './metadata'
import { EventHandlerContext } from '../../utils/events'
import { ContentChannelPayoutsUpdatedEvent } from '../../types/events'

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
    ? await processOwnerRemark(overlay, channel, decodedMessage)
    : new MetaprotocolTransactionResultFailed({
        errorMessage: 'Could not decode the metadata',
      })
  overlay.getRepository(Event).new({
    ...genericEventFields(block, indexInBlock, extrinsicHash),
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
    ...genericEventFields(block, indexInBlock, extrinsicHash),
    data: new MetaprotocolTransactionStatusEventData({
      result,
    }),
  })
}

export async function content_ChannelPayoutsUpdated({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: { asV2000: [updateChannelPayoutParameters, dataObjectId] }
}: EventHandlerContext<'Content.ChannelPayoutsUpdated'>): Promise<void> {
  const payloadDataObject = dataObjectId !== undefined ?
    await overlay.getRepository(StorageDataObject).getByIdOrFail(dataObjectId.toString())
    : undefined

  if (payloadDataObject) {
    payloadDataObject.type = new DataObjectTypeChannelPayoutsPayload()
  }

  const { minCashoutAllowed, maxCashoutAllowed, channelCashoutsEnabled, commitment } = updateChannelPayoutParameters

  overlay.getRepository(Event).new({
    ...genericEventFields(block, indexInBlock, extrinsicHash),
    data: new ChannelPayoutsUpdatedEventData({
      commitment: commitment && Buffer.from(commitment).toString('hex'),
      minCashoutAllowed,
      maxCashoutAllowed,
      channelCashoutsEnabled,
      payloadDataObject: payloadDataObject?.id,
    }),
  })
}

export async function content_ChannelRewardUpdated({ store, event }: EventContext & StoreContext): Promise<void> {
  // load event data
  const [, claimedAmount, channelId] = new Content.ChannelRewardUpdatedEvent(event).params

  // load channel
  const channel = await store.get(Channel, { where: { id: channelId.toString() } })

  // ensure channel exists
  if (!channel) {
    return inconsistentState('Non-existing channel reward updated', channelId)
  }

  // common event processing - second

  const rewardClaimedEvent = new ChannelRewardClaimedEvent({
    ...genericEventFields(event),

    amount: claimedAmount,
    channel,
  })

  await store.save<ChannelRewardClaimedEvent>(rewardClaimedEvent)

  channel.cumulativeRewardClaimed = channel.cumulativeRewardClaimed?.add(claimedAmount.toBn())

  // save channel
  await store.save<Channel>(channel)
}

export async function content_ChannelRewardClaimedAndWithdrawn({
  store,
  event,
}: EventContext & StoreContext): Promise<void> {
  // load event data
  const [owner, channelId, amount, accountId] = new Content.ChannelRewardClaimedAndWithdrawnEvent(event).params

  // load channel
  const channel = await store.get(Channel, { where: { id: channelId.toString() } })

  // ensure channel exists
  if (!channel) {
    return inconsistentState('Non-existing channel reward updated', channelId)
  }

  // common event processing - second

  const rewardClaimedEvent = new ChannelRewardClaimedAndWithdrawnEvent({
    ...genericEventFields(event),

    amount,
    channel,
    account: accountId.toString(),
    actor: await convertContentActor(store, owner),
  })

  await store.save<ChannelRewardClaimedAndWithdrawnEvent>(rewardClaimedEvent)

  channel.cumulativeRewardClaimed = amount

  // save channel
  await store.save<Channel>(channel)
}

export async function content_ChannelFundsWithdrawn({ store, event }: EventContext & StoreContext): Promise<void> {
  // load event data
  // load event data
  const [owner, channelId, amount, account] = new Content.ChannelFundsWithdrawnEvent(event).params

  // load channel
  const channel = await store.get(Channel, { where: { id: channelId.toString() } })

  // ensure channel exists
  if (!channel) {
    return inconsistentState('Non-existing channel reward updated', channelId)
  }

  // common event processing - second

  const rewardClaimedEvent = new ChannelFundsWithdrawnEvent({
    ...genericEventFields(event),

    amount,
    channel,
    account: account.toString(),
    actor: await convertContentActor(store, owner),
  })

  await store.save<ChannelFundsWithdrawnEvent>(rewardClaimedEvent)
}

export async function processChannelPaymentFromMember(
  store: DatabaseManager,
  event: SubstrateEvent,
  memberId: MemberId,
  message: IMakeChannelPayment,
  [payeeAccount, amount]: [AccountId32, Balance]
): Promise<ChannelPaymentMadeEvent> {
  const member = await getMemberById(store, memberId)

  // Only channel reward accounts are being checked right now as payment destination.
  // Transfers to any other destination will be ignored by the query node.
  const channel = await store.get(Channel, { where: { rewardAccount: payeeAccount.toString() } })
  if (!channel) {
    unexpectedData('Payment made to unknown channel reward account')
  }

  // Get payment context from the metadata
  const getPaymentContext = async (msg: IMakeChannelPayment) => {
    if (msg.videoId) {
      const paymentContext = new PaymentContextVideo()
      const video = await store.get(Video, {
        where: { id: msg.videoId.toString(), channel: { id: channel.id } },
        relations: ['channel'],
      })
      if (!video) {
        invalidMetadata(
          `payment context video not found in channel that was queried based on reward (or payee) account.`
        )
        return
      }

      paymentContext.videoId = video.id
      return paymentContext
    }

    const paymentContext = new PaymentContextChannel()
    paymentContext.channelId = channel.id
    return paymentContext
  }

  const paymentMadeEvent = new ChannelPaymentMadeEvent({
    ...genericEventFields(event),

    payer: member,
    payeeChannel: channel,
    paymentContext: await getPaymentContext(message),
    rationale: message.rationale || undefined,
    amount: amount,
  })

  await store.save<ChannelPaymentMadeEvent>(paymentMadeEvent)

  return paymentMadeEvent
}
