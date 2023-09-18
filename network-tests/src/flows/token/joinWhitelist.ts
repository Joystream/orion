import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { JoinWhitelistFixture } from '../../fixtures/token'

export default async function joinWhitelistFlow({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:join whitelist')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = api.token
  const [whitelistedHolderAddress, whitelistedHolderMemberId] = api.whitelistedHolder

  const joinWhitelistFixture = new JoinWhitelistFixture(
    api,
    query,
    whitelistedHolderAddress,
    whitelistedHolderMemberId,
    tokenId
  )
  // await joinWhitelistFixture.preExecHook()
  await new FixtureRunner(joinWhitelistFixture).run()
}
