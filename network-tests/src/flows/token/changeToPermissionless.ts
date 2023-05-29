import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { ChangeToPermissionlessFixture } from '../../fixtures/token/ChangeToPermissionlessFixture'

export default async function changeToPermissionlessFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:change to Permissionless')
  debug('Started')
  api.enableDebugTxLogs()

  const nextTokenId = (await api.query.projectToken.nextTokenId()).toNumber()
  const tokenId = nextTokenId - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(nextTokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const unlockCreatorAccess = await lock(Resource.Creator)
  const [creatorAddress, creatorMemberId] = api.creator
  unlockCreatorAccess()

  const changeToPerissionlessFixture = new ChangeToPermissionlessFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await changeToPerissionlessFixture.preExecHook()
  await new FixtureRunner(changeToPerissionlessFixture).runWithQueryNodeChecks()
}
