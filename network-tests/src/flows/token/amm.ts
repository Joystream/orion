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
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'

export default async function ammFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:amm')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel
  const tokenId = api.token

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  const [firstHolderAddress, firstHolderId] = api.firstHolder

  const newHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [newHolderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const newHolderMemberId = buyMembershipsFixture.getCreatedMembers()[0]
  const bloatBond = await api.query.projectToken.bloatBond()
  await api.treasuryTransferBalance(newHolderAddress, bloatBond)

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

  debug('buy on amm with existing account')
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

  debug('buy on amm with non existing account')
  const buyOnAmmFixtureWithAccountCreation = new BuyOnAmmFixture(
    api,
    query,
    newHolderAddress,
    newHolderMemberId.toNumber(),
    tokenId,
    amountBought
  )
  await buyOnAmmFixtureWithAccountCreation.preExecHook()
  await new FixtureRunner(buyOnAmmFixtureWithAccountCreation).runWithQueryNodeChecks()

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

  const sellOnAmmFixtureFromCreatedAccount = new SellOnAmmFixture(
    api,
    query,
    newHolderAddress,
    newHolderMemberId.toNumber(),
    tokenId,
    amountSold
  )
  await sellOnAmmFixtureFromCreatedAccount.preExecHook()
  await new FixtureRunner(sellOnAmmFixtureFromCreatedAccount).runWithQueryNodeChecks()

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
