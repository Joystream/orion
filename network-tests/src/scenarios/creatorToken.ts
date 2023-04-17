import electCouncil from '../flows/council/elect'
import failToElectCouncil from '../flows/council/failToElect'
import { scenario } from '../Scenario'
import failToElectWithBlacklist from '../flows/council/electWithBlacklist'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
scenario('Creator Token Test Suite', async ({ job }) => {
  const councilJob = job('electing council', electCouncil)
})
