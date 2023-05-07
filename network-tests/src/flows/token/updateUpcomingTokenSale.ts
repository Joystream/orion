import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { UpdateUpcomingSaleFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'

export default async function initTokenSale({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:update-token-sale')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = (await api.query.projectToken.nextTokenId()).toNumber() - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(tokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const unlockCreatorAccess = await lock(Resource.Creator)
  const [creatorAddress, creatorMemberId] = api.creator
  unlockCreatorAccess()

  // sale params
  const newStartBlock = (await api.getBestBlock()).toNumber() + 1
  const newDuration = 10
  const updateUpcomingSaleFixture = new UpdateUpcomingSaleFixture(api, query, creatorAddress, creatorMemberId, channelId, newStartBlock, newDuration)
  await new FixtureRunner(updateUpcomingSaleFixture).run()
}
