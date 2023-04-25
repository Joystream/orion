import { base64Encode } from '@polkadot/util-crypto'
import { randomBytes } from 'crypto'

export function uniqueId(byteSize = 32) {
  return base64Encode(randomBytes(byteSize))
}
