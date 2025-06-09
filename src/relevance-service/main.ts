import { config, ConfigVariable } from '../utils/config'
import { globalEm } from '../utils/globalEm'
import { RelevanceQueueConsumer } from './RelevanceQueue'
import { RelevanceService } from './RelevanceService'

async function main() {
  const em = await globalEm
  const relevanceQueue = await RelevanceQueueConsumer.init({
    onRestartSignal: () => {
      // Let the docker handle the restart
      process.exit(0)
    },
  })
  const serviceConfig = await config.get(ConfigVariable.RelevanceServiceConfig, em)
  const weights = await config.get(ConfigVariable.RelevanceWeights, em)
  const service = new RelevanceService(em, relevanceQueue, serviceConfig, weights)
  await service.run()
}

main().catch(console.error)
