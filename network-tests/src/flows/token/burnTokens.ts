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

  const nextTokenId = (await api.query.projectToken.nextTokenId()).toNumber()
  const tokenId = nextTokenId - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(nextTokenId).gte(1) // make sure token has been issued
  expect(channelId).gte(1) // make sure channel has been created


  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [firstHolderAccountId, firstHolderMemberId] = api.firstHolder
  unlockFirstHolderAccess()

  const burnTokenFixture = new BurnTokensFixture(
    api,
    query,
    firstHolderAccountId,
    tokenId,
    firstHolderMemberId,
    new BN(1000)
  )
  await burnTokenFixture.preExecHook()
  await new FixtureRunner(burnTokenFixture).runWithQueryNodeChecks()
}
