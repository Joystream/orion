import '../config'
import { OffchainState } from '../../src/utils/offchainState'
import { getEm } from '../../src/utils/orm'

async function main() {
  const offchainState = new OffchainState()
  const em = await getEm()
  await offchainState.export(em)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(-1)
  })
