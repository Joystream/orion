import '../config'
import { OffchainState } from '../../src/utils/offchainState'
import { globalEm } from '../../src/utils/globalEm'

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
