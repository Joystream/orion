import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { DeissueCreatorTokenFixture, IssueCreatorTokenFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { blake2AsHex } from '@polkadot/util-crypto'
import { PalletContentPermissionsContentActor } from '@polkadot/types/lookup'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { CreateChannelFixture } from '../../fixtures/content'
import { getStorageBucketsAccordingToPolicy } from '../content/createChannel'
import { assert } from 'console'
import { getTokenMetadata } from './issueCreatorToken'
import { TokenMetadata } from '@joystream/metadata-protobuf'
import { Utils } from '../../utils'

export default async function deissueCreatorTokenFlow({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:deissue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  // Send some funds to pay the state_bloat_bond and fees
  const channelOwnerBalance = new BN(100_000_000_000)
  const channelOwnerAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  await api.treasuryTransferBalance(channelOwnerAddress, channelOwnerBalance)

  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [channelOwnerAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const channelOwnerMemberId = buyMembershipsFixture.getCreatedMembers()

  // create sample ChannelOwner and Parameters
  const storageBuckets = await getStorageBucketsAccordingToPolicy(api)
  const expectedDataObjectStateBloatBond = await api.query.storage.dataObjectStateBloatBondValue()
  const expectedChannelStateBloatBond = await api.query.content.channelStateBloatBondValue()
  const channelOwner = api.createType('PalletContentChannelOwner', { Member: channelOwnerMemberId })
  const channelCreationParameters = api.createType('PalletContentChannelCreationParametersRecord', {
    expectedChannelStateBloatBond,
    expectedDataObjectStateBloatBond,
    storageBuckets,
  })
  const createChannelFixture = new CreateChannelFixture(
    api,
    query,
    channelCreationParameters,
    channelOwner,
    channelOwnerAddress
  )
  await new FixtureRunner(createChannelFixture).run()
  const channelId = createChannelFixture.getChannelId().toNumber()

  // issuer membership
  const initialAllocation = api.createType('BTreeMap<u64, PalletProjectTokenTokenAllocation>')
  const symbol = blake2AsHex('test2')
  const transferPolicy = api.createType('PalletProjectTokenTransferPolicyParams', 'Permissionless')
  assert(transferPolicy.isPermissionless)
  const revenueSplitRate = api.createType('Permill', new BN(10))
  const patronageRate = api.createType('Perquintill', new BN(15))
  const contentActor: PalletContentPermissionsContentActor = api.createType(
    'PalletContentPermissionsContentActor',
    { Member: channelOwnerMemberId }
  )

  // issue creator token
  const tokenMetadata = await getTokenMetadata(api)
  const crtParams = api.createType('PalletProjectTokenTokenIssuanceParameters', {
    initialAllocation,
    symbol,
    transferPolicy,
    patronageRate,
    revenueSplitRate,
    metadata: Utils.metadataToBytes(TokenMetadata, tokenMetadata),
  })

  const issueCreatorTokenFixture = new IssueCreatorTokenFixture(
    api,
    query,
    channelOwnerAddress,
    contentActor,
    channelId,
    crtParams,
    tokenMetadata
  )
  await new FixtureRunner(issueCreatorTokenFixture).run()

  const deissueCreatorTokenFixture = new DeissueCreatorTokenFixture(
    api,
    query,
    channelOwnerAddress,
    contentActor,
    channelId
  )
  await new FixtureRunner(deissueCreatorTokenFixture).runWithQueryNodeChecks()

  debug('Done')
}
