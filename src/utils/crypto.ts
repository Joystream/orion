import { base64Encode, ed25519PairFromString } from '@polkadot/util-crypto'
import { randomBytes } from 'crypto'

export function uniqueId(byteSize = 32) {
  return base64Encode(randomBytes(byteSize))
}

export function appKeypairFromString(secret: string) {
  return ed25519PairFromString(secret)
}
