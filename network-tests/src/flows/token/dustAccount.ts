import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { DustAccountFixture } from '../../fixtures/token'
import { Resource } from '../../Resources'

export default async function dustAccountFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = api.token

  const [firstHolderAddress, firstHolderMemberId] = api.firstHolder

  // dust created account
  const dustAccountFixture = new DustAccountFixture(
    api,
    query,
    firstHolderAddress,
    tokenId,
    firstHolderMemberId
  )
  await new FixtureRunner(dustAccountFixture).run()
}
