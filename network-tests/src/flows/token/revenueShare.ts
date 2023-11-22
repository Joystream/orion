import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssueRevenueShareFixture, ParticipateInShareFixture } from '../../fixtures/token'
import { BN } from 'bn.js'
import { ExitRevenueShareFixture } from '../../fixtures/token/ExitRevenueShareFixture'
import { FinalizeRevenueShareFixture } from '../../fixtures/token/FinalizeRevenueShareFixture'

export default async function revenueShareFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:revenue-share')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel
  const tokenId = api.token

  const [creatorAddress, creatorMemberId] = api.creator
  const [firstHolderAddress, firstHolderMemberId] = api.firstHolder

  // retrieve owner info
  debug('Issue revenue share')
  const duration = 35
  const allocation = new BN(100000000000)
  const issueRevenueShare = new IssueRevenueShareFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    duration,
    allocation
  )
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
  await new FixtureRunner(participateInShareFixture).runWithQueryNodeChecks()

  debug('User exists revenue share')
  const exitRevenueShareFixture = new ExitRevenueShareFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderMemberId,
    tokenId
  )
  await new FixtureRunner(exitRevenueShareFixture).runWithQueryNodeChecks()

  debug('revenue share finalized')
  const finalizeRevenueShareFixture = new FinalizeRevenueShareFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await new FixtureRunner(finalizeRevenueShareFixture).runWithQueryNodeChecks()
}
