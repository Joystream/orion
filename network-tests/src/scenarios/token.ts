import leadOpening from '../flows/working-groups/leadOpening'
import electCouncil from '../flows/council/elect'
import initStorage, {
  singleBucketConfig as defaultStorageConfig,
} from '../flows/storage/initStorage'
import { scenario } from '../Scenario'
import issueCreatorToken from '../flows/token/issueCreatorToken'
import createChannel from '../flows/content/createChannel'
import createVideoFlow from '../flows/content/createVideo'
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
import joinWhitelistFlow from '../flows/token/joinWhitelist'
import creatorRemarkFlow from '../flows/token/creatorRemark'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
scenario('Creator Token Test Suite', async ({ job }) => {
  const governanceSetup = job(
    'hire leads',
    leadOpening(true, ['contentWorkingGroup', 'storageWorkingGroup'])
  ).requires(job('electing council', electCouncil))
  const storage = job('initialize storage system', initStorage(defaultStorageConfig)).after(
    governanceSetup
  )
  const requiredBasicSetup = job('create Video', createVideoFlow).requires(
    job('create Channel', createChannel).requires(storage)
  )

  job('Deissue Token Flow', deissueCreatorTokenFlow).requires(requiredBasicSetup)
  const issueTokenJob = job('Issue Creator Token', issueCreatorToken).after(requiredBasicSetup)
  job('Creator Remark', creatorRemarkFlow).after(issueTokenJob)
  job('Join Whitelist', joinWhitelistFlow).requires(issueTokenJob)
  const issuerTransferJob = job(
    'Issuer Transfer With Account Creation And No Vesting',
    issuerTransferWithAccountCreationAndNoVestingFlow
  ).requires(issueTokenJob)
  // const issuerTransferJob = job(
  //   'Issuer Transfer With Existing Account And Vesting',
  //   issuerTransferWithExistingAccountAndVestingFlow
  // ).after(
  //   job(
  //     'Issuer Transfer With Existing Account And No Vesting',
  //     issuerTransferWithExistingAccountAndNoVestingFlow
  //   ).requires(
  //     job(
  //       'Issuer Transfer With Existing Account And Vesting',
  //       issuerTransferWithAccountCreationAndVestingFlow
  //     ).after(
  //       job(
  //         'Issuer Transfer With Account Creation And No Vesting',
  //         issuerTransferWithAccountCreationAndNoVestingFlow
  //       ).requires(issueTokenJob)
  //     )
  //   )
  // )
  const changeToPermissionlessJob = job(
    'Change To Permissionless',
    changeToPermissionlessFlow
  ).requires(issuerTransferJob)
  // job('Transfer', holderTransferFlow).after(changeToPermissionlessJob)
  // const patronageJob = job('Patronage', patronageFlow).requires(issuerTransferJob)
  // const ammJob = job('Bonding Curve (Amm)', ammFlow)
  //   .requires(changeToPermissionlessJob)
  //   .requires(patronageJob)
  // const saleJob = job('Sales', saleFlow).requires(ammJob)
  const saleJob = job('Sales', saleFlow).requires(changeToPermissionlessJob)
  // const revenueShareJob = job('Revenue Share', revenueShareFlow).after(saleJob)
  // const burnTokensJob = job('Burn Tokens From Holder', burnTokens).after(revenueShareJob)
  // job('Dust Empty Account', dustAccountFlow).requires(burnTokensJob)
})
