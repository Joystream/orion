import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { BurnTokensFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { Resource } from '../../Resources'

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
  const [creatorAddress, ] = api.creator
  unlockCreatorAccess()

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [,fromMember ] = api.firstHolder
  unlockFirstHolderAccess()

  const burnTokenFixture = new BurnTokensFixture(api, query, creatorAddress, tokenId, fromMember, new BN(1000))
  await burnTokenFixture.preExecHook()
  await new FixtureRunner(burnTokenFixture).runWithQueryNodeChecks()
}

