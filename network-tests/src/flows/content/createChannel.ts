import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { CreateChannelFixture, ChannelCreationParameters } from '../../fixtures/content'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { createType } from '@polkadot/types'


export default async function createChannel({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:elect-council')
  debug('Started')
  api.enableDebugTxLogs()

  const channelOwnerAddress = (await api.createKeyPairs(1)).map(
    ({ key }) => key.address
  )

  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(
    api,
    query,
    channelOwnerAddress,
  )
  await new FixtureRunner(buyMembershipsFixture).run()
  const channelOwnerMemberId = buyMembershipsFixture.getCreatedMembers()


  // create sample ChannelOwner and Parameters
  const expectedChannelStateBloatBond = await api.query.content.channelStateBloatBondValue()
  const parameters: Map<string, ChannelCreationParameters> = new Map(
    [[
      channelOwnerAddress.toString(),
      [
        api.createType('PalletContentChannelOwner', { Member: channelOwnerMemberId }),
        api.createType('PalletContentChannelCreationParametersRecord', {
          'collaborators': [],
          'storageBuckets': [],
          'distributionBuckets': [],
          'expectedChannelStateBloatBond': expectedChannelStateBloatBond,
          'expectedDataObjectStateBloatBond': 0,
        })
      ]
    ]]
  )
  const createChannelFixture = new CreateChannelFixture(api, query, parameters)
  await new FixtureRunner(createChannelFixture).run()

  debug('Done')
}
