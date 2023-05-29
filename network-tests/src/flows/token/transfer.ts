import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { TransferFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { u128 } from '@polkadot/types/primitive'

export default async function holderTransferFlow({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:holder transfer')
  debug('Started')
  api.enableDebugTxLogs()

  const nextTokenId = (await api.query.projectToken.nextTokenId()).toNumber()
  const tokenId = nextTokenId - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(nextTokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  const [, firstHolderMemberId] = api.firstHolder

  // tuple with first member id and amount
  const outputs: [number, u128][] = [[firstHolderMemberId, api.createType('u128', new BN(1000))]]
  const metadata = ''

  const transferFixture = new TransferFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    tokenId,
    outputs,
    metadata
  )
  await transferFixture.preExecHook()
  await new FixtureRunner(transferFixture).runWithQueryNodeChecks()
}
