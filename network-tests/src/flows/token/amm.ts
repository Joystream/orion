import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
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
    slope: api.createType('u128', new BN(1000000)),
    intercept: api.createType('u128', new BN(0)),
  })
  const activateAmmFixture = new ActivateAmmFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    ammParams
  )
  await new FixtureRunner(activateAmmFixture).runWithQueryNodeChecks()

  debug('buy on amm with existing account')
  const amountBought = new BN(10)
  const buyOnAmmFixture = new BuyOnAmmFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderId,
    tokenId,
    amountBought
  )
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
  await new FixtureRunner(buyOnAmmFixtureWithAccountCreation).runWithQueryNodeChecks()

  debug('sell on amm')
  const amountSold = new BN(1)
  const sellOnAmmFixture = new SellOnAmmFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderId,
    tokenId,
    amountSold
  )
  await new FixtureRunner(sellOnAmmFixture).runWithQueryNodeChecks()

  const sellOnAmmFixtureFromCreatedAccount = new SellOnAmmFixture(
    api,
    query,
    newHolderAddress,
    newHolderMemberId.toNumber(),
    tokenId,
    amountSold
  )
  await new FixtureRunner(sellOnAmmFixtureFromCreatedAccount).runWithQueryNodeChecks()

  debug('deactivate amm')
  const deactivateAmmFixture = new DeactivateAmmFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await new FixtureRunner(deactivateAmmFixture).runWithQueryNodeChecks()
}
