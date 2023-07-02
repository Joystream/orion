import { metaToObject } from '@joystream/metadata-protobuf/utils'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { Logger } from '../logger'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  Account,
  Event,
  MetaprotocolTransactionResultFailed,
  NftActivity,
  NftHistoryEntry,
  RuntimeNotification,
  NotificationType,
  RuntimeNotificationProcessed,
} from '../model'
import { encodeAddress } from '@polkadot/util-crypto'
import { EntityManagerOverlay } from '../utils/overlay'
import { Bytes } from '@polkadot/types/primitive'
import { createType } from '@joystream/types'
import { u8aToHex } from '@polkadot/util'
import { CommentCountersManager } from '../utils/CommentsCountersManager'
import { VideoRelevanceManager } from '../utils/VideoRelevanceManager'
import { Flat } from 'lodash'
import { ConfigVariable, config } from '../utils/config'
import { MailNotifier } from '../utils/mail'
import { preferencesForNotification } from '../utils/notifications'

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
  type: NotificationType
): Promise<void> {

  const mailNotifier = new MailNotifier()
  mailNotifier.setSender(await config.get(ConfigVariable.SendgridFromEmail, overlay.getEm()))
  mailNotifier.setSubject(event.data.toString())
  mailNotifier.setContentUsingTemplate('test')

  for (const memberId of memberIds.filter((m) => m)) {
    const account = await overlay.getRepository(Account).getOneByRelation('membershipId', memberId!)
    if (account) {
      const [shouldSendAppNotification, shouldSendMail] = await preferencesForNotification(
        overlay.getEm(),
        account.id,
        event.data
      )
      if (shouldSendAppNotification || shouldSendMail) {
        const repository = overlay.getRepository(RuntimeNotification)
        const notificationId = repository.getNewEntityId()
        const notificationAlreadyProcessedInThePast = await overlay.getRepository(RuntimeNotificationProcessed).getOneBy({ notificationId })
        repository.new({
          id: notificationId,
          accountId: account.id,
          eventId: event.id,
          type,
        })
        if (!notificationAlreadyProcessedInThePast) {
          const notificationProcessed = overlay.getRepository(RuntimeNotificationProcessed).new({
            notificationId,
            inAppRead: false,
            mailSent: false,
          })
          if (shouldSendMail) {
            mailNotifier.setReciever(account.email)
            const statusCode = await mailNotifier.send()
            notificationProcessed.mailSent = statusCode === 200  // https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/responses
          }
        }
      }
    }
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
