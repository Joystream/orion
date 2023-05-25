import leadOpening from '../flows/working-groups/leadOpening'
import electCouncil from '../flows/council/elect'
import initStorage, {
  singleBucketConfig as defaultStorageConfig,
} from '../flows/storage/initStorage'
import { scenario } from '../Scenario'
import issueCreatorToken from '../flows/token/issueCreatorToken'
import createChannel from '../flows/content/createChannel'
import burnTokens from '../flows/token/burnTokens'
import issuerTransfer from '../flows/token/issuerTransfer'
import patronageFlow from '../flows/token/patronage'
import revenueShareFlow from '../flows/token/revenueShare'
import ammFlow from '../flows/token/amm'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
scenario('Creator Token Test Suite', async ({ job }) => {
  const governanceSetup = job(
    'hire leads',
    leadOpening(true, ['contentWorkingGroup', 'storageWorkingGroup'])
  ).requires(job('electing council', electCouncil))
  const storage = job('initialize storage system', initStorage(defaultStorageConfig)).after(
    governanceSetup
  )
  const requiredBasicSetup = job('create Channel', createChannel).requires(storage)

  const issueTokenJob = job('Issue Creator Token', issueCreatorToken).after(requiredBasicSetup)
  const issuerTransferJob = job('Issuer Transfer', issuerTransfer).requires(issueTokenJob)
  // job('Burn Tokens From Holder', burnTokens).requires(issuerTransferJob)
  // const patronageJob = job('Patronage', patronageFlow).requires(issueTokenJob)
  const revenueShareJob = job('Revenue Share', revenueShareFlow).requires(issuerTransferJob)
  const ammJob = job('Bonding Curve (Amm)', ammFlow).requires(revenueShareJob)
})
