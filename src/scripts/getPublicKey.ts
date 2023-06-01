import { argv } from 'process'
import { appKeypairFromString } from '../utils/crypto'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'

async function main() {
  await cryptoWaitReady()
  const string = argv[2]
  const appKeypair = appKeypairFromString(string)
  console.log(u8aToHex(appKeypair.publicKey))
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(-1)
  })
