import { metaToObject } from '@joystream/metadata-protobuf/utils'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { Logger } from '../logger'

export function bytesToString(b: Uint8Array): string {
  return (
    Buffer.from(b)
      .toString()
      // eslint-disable-next-line no-control-regex
      .replace(/\u0000/g, '')
  )
}

export function perpareString(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\u0000/g, '')
}

export function deserializeMetadata<T>(
  metadataType: AnyMetadataClass<T>,
  metadataBytes: Uint8Array
): DecodedMetadataObject<T> | null {
  try {
    const message = metadataType.decode(metadataBytes)
    Object.keys(message).forEach((key) => {
      if (key in message && typeof message[key as keyof T] === 'string') {
        ;(message as Record<string, string>)[key] = perpareString(message[key as keyof T] as string)
      }
    })
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
