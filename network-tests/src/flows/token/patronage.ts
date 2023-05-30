import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { DecreasePatronageRateFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { ClaimPatronageCreditFixture } from '../../fixtures/token/ClaimPatronageCreditFixture'

export default async function patronageFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = await api.channel
  const tokenId = await api.token

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  const claimPatronageRateFixture = new ClaimPatronageCreditFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await claimPatronageRateFixture.preExecHook()
  await new FixtureRunner(claimPatronageRateFixture).runWithQueryNodeChecks()

  const newPatronageRate = 10
  const oldRate = (
    await api.query.projectToken.tokenInfoById(tokenId)
  ).patronageInfo.rate.toNumber()
  expect(oldRate).to.be.greaterThan(newPatronageRate)
  const decreasePatronageRateFixture = new DecreasePatronageRateFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    newPatronageRate
  )
  await decreasePatronageRateFixture.preExecHook()
  await new FixtureRunner(decreasePatronageRateFixture).runWithQueryNodeChecks()
}
