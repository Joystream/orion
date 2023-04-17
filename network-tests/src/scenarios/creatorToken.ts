import electCouncil from '../flows/council/elect'
import { scenario } from '../Scenario'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
scenario('Creator Token Test Suite', async ({ job }) => {
  job('electing council', electCouncil)
})
