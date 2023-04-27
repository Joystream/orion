import leadOpening from '../flows/working-groups/leadOpening'
import electCouncil from '../flows/council/elect'
import initStorage, { singleBucketConfig as defaultStorageConfig } from '../flows/storage/initStorage'
import { scenario } from '../Scenario'
import issueCreatorToken from '../flows/token/issueCreatorToken'
import createChannel from '../flows/content/createChannel'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
scenario('Creator Token Test Suite', async ({ job }) => {
  const governanceSetup = job('hire leads', leadOpening(true, ['contentWorkingGroup', 'storageWorkingGroup'])).requires(
    job('electing council', electCouncil)
  )
  const storage = job('initialize storage system', initStorage(defaultStorageConfig)).after(governanceSetup)
  const requiredBasicSetup = job('create Channel', createChannel).requires(storage)

  job('Issue Creator Token', issueCreatorToken).after(requiredBasicSetup)
})
