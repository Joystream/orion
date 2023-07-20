import { OffchainState } from '../utils/offchainState'
import { globalEm } from '../utils/globalEm'

async function main() {
  const offchainState = new OffchainState()
  const em = await globalEm
  await offchainState.export(em)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(-1)
  })
