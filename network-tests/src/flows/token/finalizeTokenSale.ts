import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { FinalizeTokenSaleFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'

export default async function initTokenSale({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:init-token-sale')
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
  const finalizeTokenSaleFixture = new FinalizeTokenSaleFixture(api, query, creatorAddress, creatorMemberId, channelId)
  await new FixtureRunner(finalizeTokenSaleFixture).run()
}
