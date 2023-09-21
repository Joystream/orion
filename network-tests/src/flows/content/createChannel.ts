import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { CreateChannelFixture } from '../../fixtures/content'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { BTreeSet, u64 } from '@polkadot/types-codec'
import { BN } from 'bn.js'
import { Api } from '../../Api'
import _ from 'lodash'

export async function getStorageBucketsAccordingToPolicy(api: Api): Promise<BTreeSet<u64>> {
  const { numberOfStorageBuckets } = await api.query.storage.dynamicBagCreationPolicies('Channel')
  const storageBuckets = api.createType('BTreeSet<u64>')
  for (let i = 0; numberOfStorageBuckets.toBn().gtn(i); ++i) {
    storageBuckets.add(api.createType('u64', 0))
  }
  return storageBuckets
}

async function distributionBucketsForNewChannel(api: Api) {
  const numberOfFamilies = await api.query.storage.distributionBucketFamilyNumber()
  let families = []
  for (let i = 0; numberOfFamilies.toBn().gtn(i); ++i) {
    let bucketsPerFamily = []
    const numberOfBuckets = (
      await api.query.storage.distributionBucketFamilyById(i)
    ).nextDistributionBucketIndex.toNumber()
    for (let j = 0; numberOfBuckets > j; ++j) {
      bucketsPerFamily.push({
        id: `${i}:${j}`,
        bucketIndex: j,
      })
    }
    families.push({
      id: i.toString(),
      buckets: bucketsPerFamily,
    })
  }

  return families
}

export async function selectDistributionBucketsForNewChannel(
  api: Api
): Promise<{ distributionBucketFamilyId: number; distributionBucketIndex: number }[]> {
  const { families: distributionBucketFamiliesPolicy } =
    await api.query.storage.dynamicBagCreationPolicies('Channel')

  const families = await distributionBucketsForNewChannel(api)
  const distributionBucketIds = []

  for (const { id, buckets } of families || []) {
    const bucketsCountPolicy = [...distributionBucketFamiliesPolicy]
      .find(([familyId]) => familyId.toString() === id)?.[1]
      .toNumber()

    if (!bucketsCountPolicy) {
      continue
    }

    if (bucketsCountPolicy > buckets.length) {
      throw new Error('Not enough buckets in the policy')
    }

    distributionBucketIds.push(
      ..._.sampleSize(buckets, bucketsCountPolicy).map(({ bucketIndex }) => {
        return {
          distributionBucketFamilyId: Number(id),
          distributionBucketIndex: bucketIndex,
        }
      })
    )
  }
  return distributionBucketIds
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
  const distributionBuckets = await selectDistributionBucketsForNewChannel(api)
  const expectedDataObjectStateBloatBond = await api.query.storage.dataObjectStateBloatBondValue()
  const expectedChannelStateBloatBond = await api.query.content.channelStateBloatBondValue()
  const channelOwner = api.createType('PalletContentChannelOwner', { Member: channelOwnerMemberId })
  const channelCreationParameters = api.createType('PalletContentChannelCreationParametersRecord', {
    expectedChannelStateBloatBond,
    expectedDataObjectStateBloatBond,
    storageBuckets,
    distributionBuckets,
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
