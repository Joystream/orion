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

export function addNotification(
  overlay: EntityManagerOverlay,
  memberIds: (string | undefined | null)[],
  eventId: string,
) {
  const repository = overlay.getRepository(Notification)
  for (const memberId of memberIds.filter((m) => m)) {
    repository.new({ id: repository.getNewEntityId(), memberId, eventId })
  }
}

export async function sendEmailNotification(
  overlay: EntityManagerOverlay,
  memberId: string,
  event: Flat<Event>,
): Promise<void> {
  const content = emailNotificationTemplate(event.data)
  const account = await overlay.getRepository(Account).getOneByRelation('membershipId', memberId)
  const em = overlay.getEm()
  if (account) {
    const shouldSend = getMailNotificationPreference(account, event.data)
    if (shouldSend) {
      const result = await sendMail({
        from: await config.get(ConfigVariable.SendgridFromEmail, em),
        to: account.email,
        subject: 'New notification',
        content,
      })
      console.log(JSON.stringify(result))
    }
  }
}

export function getMailNotificationPreference(_account: Flat<Account>, event: EventData): boolean {
  switch (event.isTypeOf) {
    case 'CommentCreatedEventData': return false
    case 'CommentTextUpdatedEventData': return false
    case 'OpenAuctionStartedEventData': return false
    case 'EnglishAuctionStartedEventData': return false
    case 'NftIssuedEventData': return false
    case 'AuctionBidMadeEventData': return false
    case 'AuctionBidCanceledEventData': return false
    case 'AuctionCanceledEventData': return false
    case 'EnglishAuctionSettledEventData': return false
    case 'BidMadeCompletingAuctionEventData': return false
    case 'OpenAuctionBidAcceptedEventData': return false
    case 'NftSellOrderMadeEventData': return false
    case 'NftBoughtEventData': return false
    case 'BuyNowCanceledEventData': return false
    case 'BuyNowPriceUpdatedEventData': return false
    case 'MetaprotocolTransactionStatusEventData': return false
    case 'ChannelRewardClaimedEventData': return false
    case 'ChannelRewardClaimedAndWithdrawnEventData': return false
    case 'ChannelFundsWithdrawnEventData': return false
    case 'ChannelPayoutsUpdatedEventData': return false
    case 'ChannelPaymentMadeEventData': return false
    case 'MemberBannedFromChannelEventData': return false
    case 'ChannelCreatedEventData': return false
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
