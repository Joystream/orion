import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'
import {
  ActivateAmmFixture,
  BuyOnAmmFixture,
  DeactivateAmmFixture,
  SellOnAmmFixture,
} from '../../fixtures/token'

export default async function ammFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:amm')
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

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [firstHolderAddress, firstHolderId] = api.firstHolder
  unlockFirstHolderAccess()

  // amm params
  debug('activate amm')
  const ammParams = api.createType('PalletProjectTokenAmmParams', {
    slope: api.createType('Permill', new BN(1000)),
    intercept: api.createType('Permill', new BN(10000)),
  })
  const activateAmmFixture = new ActivateAmmFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    ammParams
  )
  await activateAmmFixture.preExecHook()
  await new FixtureRunner(activateAmmFixture).runWithQueryNodeChecks()

  debug('buy on amm')
  const amountBought = new BN(1000)
  const buyOnAmmFixture = new BuyOnAmmFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderId,
    tokenId,
    amountBought
  )
  await buyOnAmmFixture.preExecHook()
  await new FixtureRunner(buyOnAmmFixture).runWithQueryNodeChecks()

  debug('sell on amm')
  const amountSold = new BN(1000)
  const sellOnAmmFixture = new SellOnAmmFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderId,
    tokenId,
    amountSold
  )
  await sellOnAmmFixture.preExecHook()
  await new FixtureRunner(sellOnAmmFixture).runWithQueryNodeChecks()

  debug('deactivate amm')
  const deactivateAmmFixture = new DeactivateAmmFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await deactivateAmmFixture.preExecHook()
  await new FixtureRunner(deactivateAmmFixture).runWithQueryNodeChecks()
}
