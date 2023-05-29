import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { DustAccountFixture } from '../../fixtures/token'
import { Resource } from '../../Resources'

export default async function dustAccountFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = (await api.query.projectToken.nextTokenId()).toNumber() - 1

  const unlockFirstHolderaccess = await lock(Resource.FirstHolder)
  const [firstHolderAddress, firstHolderMemberId] = api.firstHolder
  unlockFirstHolderaccess()

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
