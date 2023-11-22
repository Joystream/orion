import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { CreateVideoFixture } from '../../fixtures/content'

export default async function createVideoFlow({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:creating video')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel
  const [creatorAddress, creatorMemberId] = api.creator
  const { numberOfStorageBuckets } = await api.query.storage.dynamicBagCreationPolicies('Channel')
  const expectedDataObjectStateBloatBond = await api.query.storage.dataObjectStateBloatBondValue()
  const videoBloatBond = await api.query.content.videoStateBloatBondValue()
  const videoParams = api.createType('PalletContentVideoCreationParametersRecord', {
    storageBucketsNumWitness: numberOfStorageBuckets,
    expectedVideoStateBloatBond: videoBloatBond,
    expectedDataObjectStateBloatBond: expectedDataObjectStateBloatBond,
  })

  const createVideoFixture = new CreateVideoFixture(
    api,
    query,
    creatorMemberId,
    creatorAddress,
    videoParams,
    channelId
  )
  await new FixtureRunner(createVideoFixture).run()
  const videoId = createVideoFixture.getVideoId().toNumber()
  api.setVideo(videoId)

  debug('Done')
}
