import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { CreatorRemarkFixture } from '../../fixtures/token'
import Long from 'long'

export default async function creatorRemarkFlow({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:creator remark')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel
  const [creatorAddress, creatorMemberId] = api.creator
  const metadata = {
    name: 'Token Name',
    description: 'Token Description',
    avatarObject: 0,
    avatarUri: 'https://example.com',
    whitelistApplicationNote: 'whitelist application note',
    whitelistApplicationApplyLink: 'https://example.com',
    trailerVideoId: Long.fromNumber(1),
    benefits: [
      {
        title: 'benefit title',
        description: 'benefit description',
        emoji: '😀',
        displayOrder: 4,
      },
    ],
  }

  const creatorRemarkFixture = new CreatorRemarkFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    metadata
  )
  await new FixtureRunner(creatorRemarkFixture).runWithQueryNodeChecks()

  debug('Done')
}
