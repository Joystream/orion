import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { DecreasePatronageRateFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from 'src/Resources'
import { ClaimPatronageCreditFixture } from 'src/fixtures/token/ClaimPatronageCreditFixture'

export default async function burnTokens({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
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

  const claimPatronageRateFixture = new ClaimPatronageCreditFixture(api, query, creatorAddress, creatorMemberId, channelId)
  await new FixtureRunner(claimPatronageRateFixture).runWithQueryNodeChecks()

  const decreasePatronageRateFixture = new DecreasePatronageRateFixture(api, query, creatorAddress, creatorMemberId, channelId, 10)
  await new FixtureRunner(decreasePatronageRateFixture).runQueryNodeChecks()
}
