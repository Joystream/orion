import leadOpening from '../flows/working-groups/leadOpening'
import electCouncil from '../flows/council/elect'
import { scenario } from '../Scenario'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
scenario('Creator Token Test Suite', async ({ job }) => {
  job('hire leads', leadOpening(true, ['contentWorkingGroup'])).requires(
    job('electing council', electCouncil)
  )
})
