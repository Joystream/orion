import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssueRevenueShareFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { Resource } from '../../Resources'

export default async function issueRevenueShare({ api, query, lock }: FlowProps): Promise<void> {
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

  const duration = 100
  const start = (await api.getBestBlock()).toNumber() + 10
  const issueRevenueShare = new IssueRevenueShareFixture(api, query, creatorAddress, creatorMemberId, channelId, start, duration)
  await new FixtureRunner(issueRevenueShare).run()
}

