import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import {
  FinalizeTokenSaleFixture,
  InitTokenSaleFixture,
  PurchaseTokensOnSaleFixture,
  UpdateUpcomingSaleFixture,
} from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { CREATOR_BALANCE, FIRST_HOLDER_BALANCE, SALE_ALLOCATION } from '../../consts'

export default async function saleFlow({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:sale')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel
  const tokenId = api.token

  expect(CREATOR_BALANCE > SALE_ALLOCATION.add(FIRST_HOLDER_BALANCE))

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  const [firstHolderAddress, firstHolderId] = api.firstHolder

  // sale params
  debug('issue token sale')
  const startsAt = (await api.getBestBlock()).addn(100)
  const vestingScheduleParams = {
    linearVestingDuration: api.createType('u32', 100),
    blocksBeforeCliff: api.createType('u32', 0),
    cliffAmountPercentage: api.createType('u32', 0),
  }
  const saleParams = api.createType('PalletProjectTokenTokenSaleParams', {
    unitPrice: api.createType('u128', new BN(1)),
    upperBoundQuantity: api.createType('u128', SALE_ALLOCATION),
    duration: api.createType('u32', new BN(10)),
    capPerMember: api.createType('Option<u128>', SALE_ALLOCATION.divn(10)),
    vestingScheduleParams,
    startsAt,
  })
  const initTokenSaleFixture = new InitTokenSaleFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    saleParams
  )
  await new FixtureRunner(initTokenSaleFixture).runWithQueryNodeChecks()

  debug('update upcoming token sale')
  const newStartBlock = startsAt.subn(60).toNumber()
  const newDuration = 60
  const updateUpcomingSaleFixture = new UpdateUpcomingSaleFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    newStartBlock,
    newDuration
  )
  await new FixtureRunner(updateUpcomingSaleFixture).runWithQueryNodeChecks()

  debug('purchase tokens on sale')
  const purchaseAmount = SALE_ALLOCATION.divn(100)
  await api.treasuryTransferBalance(firstHolderAddress, SALE_ALLOCATION)
  const purchaseTokensOnSaleFixture = new PurchaseTokensOnSaleFixture(
    api,
    query,
    firstHolderAddress,
    firstHolderId,
    tokenId,
    purchaseAmount
  )
  await new FixtureRunner(purchaseTokensOnSaleFixture).runWithQueryNodeChecks()

  debug('purchase tokens on sale with account creation')
  const secondHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [secondHolderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const secondHolderMemberId = buyMembershipsFixture.getCreatedMembers()[0].toNumber()

  await api.treasuryTransferBalance(secondHolderAddress, SALE_ALLOCATION)
  const purchaseTokensOnSaleFixtureWithAccountCreation = new PurchaseTokensOnSaleFixture(
    api,
    query,
    secondHolderAddress,
    secondHolderMemberId,
    tokenId,
    purchaseAmount
  )
  await new FixtureRunner(purchaseTokensOnSaleFixtureWithAccountCreation).runWithQueryNodeChecks()

  debug('finalize token sale')
  const finalizeTokenSaleFixture = new FinalizeTokenSaleFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId
  )
  await new FixtureRunner(finalizeTokenSaleFixture).runWithQueryNodeChecks()
}
