import { metaToObject } from '@joystream/metadata-protobuf/utils'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { Logger } from '../logger'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Event } from '../model'
import { encodeAddress } from '@polkadot/util-crypto'

export const JOYSTREAM_SS58_PREFIX = 126

export function bytesToString(b: Uint8Array): string {
  return Buffer.from(b).toString()
}

export function deserializeMetadata<T>(
  metadataType: AnyMetadataClass<T>,
  metadataBytes: Uint8Array
): DecodedMetadataObject<T> | null {
  try {
    const message = metadataType.decode(metadataBytes)
    return metaToObject(metadataType, message)
  } catch (e) {
    invalidMetadata(metadataType, 'Could not decode the input ', {
      encoded: Buffer.from(metadataBytes).toString('hex'),
    })
    return null
  }
}

export function invalidMetadata<T>(
  type: AnyMetadataClass<T>,
  message: string,
  data?: Record<string, unknown>
): void {
  Logger.get().warn(`Invalid metadata (${type.name}): ${message}`, { ...data, type })
}

export function genericEventFields(
  block: SubstrateBlock,
  indexInBlock: number,
  txHash?: string
): Partial<Event> {
  return {
    id: `${block.height}-${indexInBlock}`,
    inBlock: block.height,
    indexInBlock,
    timestamp: new Date(block.timestamp),
    inExtrinsic: txHash,
  }
}

export function toAddress(addressBytes: Uint8Array) {
  return encodeAddress(addressBytes, JOYSTREAM_SS58_PREFIX)
}
