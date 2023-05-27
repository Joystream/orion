import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssueRevenueShareFixture, ParticipateInShareFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'
import { ExitRevenueShareFixture } from '../../fixtures/token/ExitRevenueShareFixture'
import { FinalizeRevenueShareFixture } from '../../fixtures/token/FinalizeRevenueShareFixture'
import { DirectChannelPaymentFixture } from 'src/fixtures/content'

export default async function revenueShareFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:revenue-share')
  debug('Started')
  api.enableDebugTxLogs()

  const nextTokenId = (await api.query.projectToken.nextTokenId()).toNumber()
  const tokenId = nextTokenId - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(nextTokenId).gte(1)
  expect(channelId).gte(1)

  const unlockCreatorAccess = await lock(Resource.Creator)
  const [creatorAddress, creatorMemberId] = api.creator
  unlockCreatorAccess()

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [firstHolderAddress, firstHolderMemberId] = api.firstHolder
  unlockFirstHolderAccess()

  // retrieve owner info
  debug('Issue revenue share')
  const duration = 35
  const allocation = new BN(100000000000)
  const start = (await api.getBestBlock()).toNumber() 
  const issueRevenueShare = new IssueRevenueShareFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    duration,
    allocation,
    start
  )
  await issueRevenueShare.preExecHook()
  await new FixtureRunner(issueRevenueShare).runWithQueryNodeChecks()

  debug('User participates in revenue share')
  const amount = new BN(1000)
  const participateInShareFixture = new ParticipateInShareFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderMemberId,
    tokenId,
    amount
  )
  await participateInShareFixture.preExecHook()
  await new FixtureRunner(participateInShareFixture).runWithQueryNodeChecks()

  debug('User exists revenue share')
  const exitRevenueShareFixture = new ExitRevenueShareFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderMemberId,
    tokenId
  )
  await exitRevenueShareFixture.preExecHook()
  await new FixtureRunner(exitRevenueShareFixture).runWithQueryNodeChecks()

  debug('revenue share finalized')
  const finalizeRevenueShareFixture = new FinalizeRevenueShareFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await finalizeRevenueShareFixture.preExecHook()
  await new FixtureRunner(finalizeRevenueShareFixture).runWithQueryNodeChecks()
}
