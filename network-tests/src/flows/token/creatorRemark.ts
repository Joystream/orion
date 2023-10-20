import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { CreatorRemarkFixture } from '../../fixtures/token'
import { getTokenMetadata } from './issueCreatorToken'

export default async function creatorRemarkFlow({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:creator remark')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel
  const [creatorAddress, creatorMemberId] = api.creator
  let metadataToken = await getTokenMetadata(api)
  metadataToken.description = 'description changed'
  metadataToken.name = 'name changed'
  const creatorRemarkFixture = new CreatorRemarkFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    metadataToken
  )
  await new FixtureRunner(creatorRemarkFixture).runWithQueryNodeChecks()

  debug('Done')
}
