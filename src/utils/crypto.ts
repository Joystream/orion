import { base64Encode, blake2AsU8a, randomAsU8a } from '@polkadot/util-crypto'
import { u8aConcat, nToU8a } from '@polkadot/util'

export function uniqueId(byteSize: 8 | 16 | 32 | 64 = 32) {
  return base64Encode(
    blake2AsU8a(
      u8aConcat(randomAsU8a(byteSize), nToU8a(Date.now())),
      (byteSize * 8) as 64 | 128 | 256 | 512
    )
  )
}
