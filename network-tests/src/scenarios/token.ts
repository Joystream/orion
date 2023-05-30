import leadOpening from '../flows/working-groups/leadOpening'
import electCouncil from '../flows/council/elect'
import initStorage, {
  singleBucketConfig as defaultStorageConfig,
} from '../flows/storage/initStorage'
import { scenario } from '../Scenario'
import issueCreatorToken from '../flows/token/issueCreatorToken'
import createChannel from '../flows/content/createChannel'
import burnTokens from '../flows/token/burnTokens'
import patronageFlow from '../flows/token/patronage'
import revenueShareFlow from '../flows/token/revenueShare'
import ammFlow from '../flows/token/amm'
import saleFlow from '../flows/token/tokenSale'
import changeToPermissionlessFlow from '../flows/token/changeToPermissionless'
import holderTransferFlow from '../flows/token/transfer'
import dustAccountFlow from '../flows/token/dustAccount'
import issuerTransferWithAccountCreationAndNoVestingFlow from '../flows/token/issuerTransferWithAccountCreationAndNoVesting'
import issuerTransferWithAccountCreationAndVestingFlow from '../flows/token/issuerTransferWithAccountCreationAndVesting'
import issuerTransferWithExistingAccountAndVestingFlow from '../flows/token/issuerTransferWithExistingAccountAndVesting'
import issuerTransferWithExistingAccountAndNoVestingFlow from '../flows/token/issuerTransferWithExistingAccountAndNoVesting'
import deissueCreatorTokenFlow from '../flows/token/deissueToken'

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
  job('Deissue Token Flow', deissueCreatorTokenFlow).requires(requiredBasicSetup)
  const issuerTransferJob = job('Issuer Transfer With Existing Account And Vesting', issuerTransferWithExistingAccountAndVestingFlow).after(
    job('Issuer Transfer With Existing Account And No Vesting', issuerTransferWithExistingAccountAndNoVestingFlow).requires(
      job('Issuer Transfer With Existing Account And Vesting', issuerTransferWithAccountCreationAndVestingFlow).after(
        job('Issuer Transfer With Account Creation And No Vesting', issuerTransferWithAccountCreationAndNoVestingFlow).requires(issueTokenJob)
      )
    )
  )
  const changeToPermissionlessJob = job(
    'Change To Permissionless',
    changeToPermissionlessFlow
  ).requires(issuerTransferJob)
  job('Transfer', holderTransferFlow).after(changeToPermissionlessJob)
  const patronageJob = job('Patronage', patronageFlow).requires(issueTokenJob)
  const ammJob = job('Bonding Curve (Amm)', ammFlow).requires(changeToPermissionlessJob)
  const saleJob = job('Sales', saleFlow).after(changeToPermissionlessJob)
  const revenueShareJob = job('Revenue Share', revenueShareFlow)
    .after(saleJob)
    .after(patronageJob)
  const burnTokensJob = job('Burn Tokens From Holder', burnTokens).after(revenueShareJob)
  job('Dust Empty Account', dustAccountFlow).requires(burnTokensJob)
 
})
