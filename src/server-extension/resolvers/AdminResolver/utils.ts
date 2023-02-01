import { stringToHex, u8aToHex } from '@polkadot/util'

// TODO: preferably this would be imported from @joystream/js -> https://github.com/Joystream/joystream/pull/4586
export const generateAppActionCommitment = (
  creatorId: string,
  assets: Uint8Array,
  rawAction: Uint8Array,
  rawAppActionMetadata: Uint8Array
): string => {
  const rawCommitment = [
    creatorId,
    u8aToHex(assets),
    u8aToHex(rawAction),
    u8aToHex(rawAppActionMetadata),
  ]
  return stringToHex(JSON.stringify(rawCommitment))
}
