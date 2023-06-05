import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { BurnTokensFixture } from '../../fixtures/token'

export default async function burnTokens({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = api.token

  const [firstHolderAccountId, firstHolderMemberId] = api.firstHolder

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
  await new FixtureRunner(burnTokenFixture).runWithQueryNodeChecks()
}
