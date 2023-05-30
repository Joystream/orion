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

  const tokenId = api.token

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [firstHolderAccountId, firstHolderMemberId] = api.firstHolder
  unlockFirstHolderAccess()

  const firstHolderTokenBalance = (
    await api.query.projectToken.accountInfoByTokenAndMember(tokenId, firstHolderMemberId)
  ).amount.toBn()
  const burnTokenFixture = new BurnTokensFixture(
    api,
    query,
    firstHolderAccountId,
    tokenId,
    firstHolderMemberId,
    firstHolderTokenBalance
  )
  await burnTokenFixture.preExecHook()
  await new FixtureRunner(burnTokenFixture).runWithQueryNodeChecks()
}
