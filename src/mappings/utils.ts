import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { metaToObject } from '@joystream/metadata-protobuf/utils'
import { createType } from '@joystream/types'
import { Bytes } from '@polkadot/types/primitive'
import { u8aToHex } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Logger } from '../logger'
import { Event, MetaprotocolTransactionResultFailed, NftActivity, NftHistoryEntry } from '../model'
import { CommentCountersManager } from '../utils/CommentsCountersManager'
import { EntityManagerOverlay } from '../utils/overlay'
import { OrionVideoLanguageManager } from '../utils/OrionVideoLanguageManager'
import { RelevanceQueuePublisher } from '../relevance-service/RelevanceQueue'

export const orionVideoLanguageManager = new OrionVideoLanguageManager()
export const commentCountersManager = new CommentCountersManager()
export const relevanceQueuePublisher = new RelevanceQueuePublisher({
  autoInitialize: false,
  defaultPushOptions: {
    deferred: true,
    skipIfUninitialized: true,
  },
})
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
