import { metaToObject } from '@joystream/metadata-protobuf/utils'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { Logger } from '../logger'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  Account,
  Event,
  EventData,
  MetaprotocolTransactionResultFailed,
  NftActivity,
  NftHistoryEntry,
  Notification,
  NotificationPreferences,
} from '../model'
import { encodeAddress } from '@polkadot/util-crypto'
import { EntityManagerOverlay } from '../utils/overlay'
import { Bytes } from '@polkadot/types/primitive'
import { createType } from '@joystream/types'
import { u8aToHex } from '@polkadot/util'
import { CommentCountersManager } from '../utils/CommentsCountersManager'
import { VideoRelevanceManager } from '../utils/VideoRelevanceManager'
import { Flat } from 'lodash'
import { emailNotificationTemplate, sendMail } from '../utils/mail'
import { ConfigVariable, config } from '../utils/config'

export const commentCountersManager = new CommentCountersManager()
export const videoRelevanceManager = new VideoRelevanceManager()
videoRelevanceManager.init(1000 * 60 * 60)

export const JOYSTREAM_SS58_PREFIX = 126

export function bytesToString(b: Uint8Array): string {
  return Buffer.from(b).toString()
}

export function deserializeMetadata<T>(
  metadataType: AnyMetadataClass<T>,
  metadataBytes: Uint8Array,
  opts = {
    skipWarning: false,
  }
): DecodedMetadataObject<T> | null {
  Logger.get().debug(
    `Trying to deserialize ${Buffer.from(metadataBytes).toString('hex')} as ${metadataType.name}...`
  )
  try {
    const message = metadataType.decode(metadataBytes)
    return metaToObject(metadataType, message)
  } catch (e) {
    if (!opts.skipWarning) {
      invalidMetadata(metadataType, 'Could not decode the input ', {
        encodedMessage: Buffer.from(metadataBytes).toString('hex'),
      })
    }
    return null
  }
}

export type InvalidMetadataExtra<T> = {
  encodedMessage?: string
  decodedMessage?: DecodedMetadataObject<T>
  [K: string]: unknown
}

export function invalidMetadata<T>(
  type: AnyMetadataClass<T>,
  message: string,
  data?: InvalidMetadataExtra<T>
): void {
  Logger.get().warn(`Invalid metadata (${type.name}): ${message}`, { ...data, type })
}

export function genericEventFields(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash?: string
): Partial<Event> {
  return {
    id: overlay.getRepository(Event).getNewEntityId(),
    inBlock: block.height,
    indexInBlock,
    timestamp: new Date(block.timestamp),
    inExtrinsic: txHash,
  }
}

export async function addNotificationForRuntimeData(
  overlay: EntityManagerOverlay,
  memberIds: (string | undefined | null)[],
  event: Flat<Event>,
): Promise<void> {
  const content = emailNotificationTemplate(event.data)
  const repository = overlay.getRepository(Notification)
  for (const memberId of memberIds.filter((m) => m)) {
    const account = await overlay.getRepository(Account).getOneByRelation('membershipId', memberId!)
    if (account) {
      const [shouldSendAppNotification, shouldSendMail] = preferencesForNotification(account.notificationPreferences, event.data)
      if (shouldSendAppNotification || shouldSendMail) {
        const notification = repository.new({ id: repository.getNewEntityId(), memberId, eventId: event.id, inAppRead: false })
        if (shouldSendMail) {
          const em = overlay.getEm()
          const result = await sendMail({
            from: await config.get(ConfigVariable.SendgridFromEmail, em),
            to: account.email,
            subject: 'New notification',
            content,
          })
          notification.mailSent = result ? result.statusCode === 202 : false
          console.log('sendMail result:', result)
        }
      }
    }
    return
  }
}

// [app notification, email notification] preference
export function preferencesForNotification(np: NotificationPreferences, notificationType: EventData): [boolean, boolean] {
  switch (notificationType.isTypeOf) {
    case 'CommentCreatedEventData': return [np.commentCreatedInAppNotificationEnabled, np.commentCreatedMailNotificationEnabled]
    case 'CommentTextUpdatedEventData': return [np.commentCreatedInAppNotificationEnabled, np.commentCreatedMailNotificationEnabled]
    case 'OpenAuctionStartedEventData': return [np.openAuctionStartedInAppNotificationEnabled, np.openAuctionStartedMailNotificationEnabled]
    case 'EnglishAuctionStartedEventData': return [np.englishAuctionStartedInAppNotificationEnabled, np.englishAuctionStartedMailNotificationEnabled]
    case 'NftIssuedEventData': return [np.nftIssuedInAppNotificationEnabled, np.nftBoughtMailNotificationEnabled]
    case 'AuctionBidMadeEventData': return [np.auctionBidMadeInAppNotificationEnabled, np.auctionBidMadeMailNotificationEnabled]
    case 'AuctionBidCanceledEventData': return [np.auctionCanceledInAppNotificationEnabled, np.auctionBidCanceledMailNotificationEnabled]
    case 'AuctionCanceledEventData': return [np.auctionCanceledInAppNotificationEnabled, np.auctionCanceledMailNotificationEnabled]
    case 'EnglishAuctionSettledEventData': return [np.englishAuctionSettledInAppNotificationEnabled, np.englishAuctionSettledMailNotificationEnabled]
    case 'BidMadeCompletingAuctionEventData': return [np.bidMadeCompletingAuctionInAppNotificationEnabled, np.bidMadeCompletingAuctionMailNotificationEnabled]
    case 'OpenAuctionBidAcceptedEventData': return [np.openAuctionBidAcceptedInAppNotificationEnabled, np.openAuctionBidAcceptedMailNotificationEnabled]
    case 'NftSellOrderMadeEventData': return [np.nftSellOrderMadeInAppNotificationEnabled, np.nftSellOrderMadeMailNotificationEnabled]
    case 'NftBoughtEventData': return [np.nftBoughtInAppNotificationEnabled, np.nftBoughtMailNotificationEnabled]
    case 'BuyNowCanceledEventData': return [np.buyNowCanceledInAppNotificationEnabled, np.buyNowCanceledMailNotificationEnabled]
    case 'BuyNowPriceUpdatedEventData': return [np.buyNowPriceUpdatedInAppNotificationEnabled, np.buyNowPriceUpdatedMailNotificationEnabled]
    case 'MetaprotocolTransactionStatusEventData': return [np.metaprotocolTransactionStatusInAppNotificationEnabled, np.metaprotocolTransactionStatusMailNotificationEnabled]
    case 'ChannelRewardClaimedEventData': return [np.channelRewardClaimedInAppNotificationEnabled, np.channelRewardClaimedMailNotificationEnabled]
    case 'ChannelRewardClaimedAndWithdrawnEventData': return [np.channelRewardClaimedAndWithdrawnInAppNotificationEnabled, np.channelRewardClaimedAndWithdrawnMailNotificationEnabled]
    case 'ChannelFundsWithdrawnEventData': return [np.channelFundsWithdrawnInAppNotificationEnabled, np.channelFundsWithdrawnMailNotificationEnabled]
    case 'ChannelPayoutsUpdatedEventData': return [np.channelPayoutsUpdatedInAppNotificationEnabled, np.channelPayoutsUpdatedMailNotificationEnabled]
    case 'ChannelPaymentMadeEventData': return [np.channelPaymentMadeInAppNotificationEnabled, np.channelPaymentMadeMailNotificationEnabled]
    case 'MemberBannedFromChannelEventData': return [np.memberBannedFromChannelInAppNotificationEnabled, np.memberBannedFromChannelMailNotificationEnabled]
    default: return [false, false]
  }
}

export function addNftHistoryEntry(overlay: EntityManagerOverlay, nftId: string, eventId: string) {
  const repository = overlay.getRepository(NftHistoryEntry)
  repository.new({
    id: repository.getNewEntityId(),
    nftId,
    eventId,
  })
}

export function addNftActivity(
  overlay: EntityManagerOverlay,
  memberIds: (string | null | undefined)[],
  eventId: string
) {
  const repository = overlay.getRepository(NftActivity)
  for (const memberId of memberIds.filter((m) => m)) {
    repository.new({
      id: repository.getNewEntityId(),
      memberId,
      eventId,
    })
  }
}

export function toAddress(addressBytes: Uint8Array) {
  return encodeAddress(addressBytes, JOYSTREAM_SS58_PREFIX)
}

export function metaprotocolTransactionFailure<T>(
  metaClass: AnyMetadataClass<T>,
  message: string,
  data?: InvalidMetadataExtra<T>
): MetaprotocolTransactionResultFailed {
  invalidMetadata(metaClass, message, data)
  return new MetaprotocolTransactionResultFailed({
    errorMessage: message,
  })
}

export function backwardCompatibleMetaID(block: SubstrateBlock, indexInBlock: number) {
  return `METAPROTOCOL-OLYMPIA-${block.height}-${indexInBlock}`
}

export function u8aToBytes(array?: Uint8Array | null): Bytes {
  return createType('Bytes', array ? u8aToHex(array) : '')
}
