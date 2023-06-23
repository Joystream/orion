import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { CreateChannelFixture } from '../../fixtures/content'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { BTreeSet, u64 } from '@polkadot/types-codec'
import { BN } from 'bn.js'
import { Api } from '../../Api'

export async function getStorageBucketsAccordingToPolicy(api: Api): Promise<BTreeSet<u64>> {
  const { numberOfStorageBuckets } = await api.query.storage.dynamicBagCreationPolicies('Channel')
  const storageBuckets = api.createType('BTreeSet<u64>')
  for (let i = 0; numberOfStorageBuckets.toBn().gtn(i); ++i) {
    storageBuckets.add(api.createType('u64', 0))
  }
  return storageBuckets
}

export default async function createChannel({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:elect-council')
  debug('Started')
  api.enableDebugTxLogs()

  // Send some funds to pay the state_bloat_bond and fees
  const channelOwnerBalance = new BN(100_000_000_000)
  const channelOwnerAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  await api.treasuryTransferBalance(channelOwnerAddress, channelOwnerBalance)

  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [channelOwnerAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const [channelOwnerMemberId] = buyMembershipsFixture.getCreatedMembers()

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
  api.setChannel(channelId)

  api.setCreator(channelOwnerAddress, channelOwnerMemberId.toNumber())

  debug('Done')
}
