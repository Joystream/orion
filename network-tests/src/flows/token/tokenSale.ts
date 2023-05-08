import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { FinalizeTokenSaleFixture, InitTokenSaleFixture, PurchaseTokensOnSaleFixture, UpdateUpcomingSaleFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'

export default async function tokenSale({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:token-sale')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = (await api.query.projectToken.nextTokenId()).toNumber() - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(tokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const unlockCreatorAccess = await lock(Resource.Creator)
  const [creatorAddress, creatorMemberId] = api.creator
  unlockCreatorAccess()

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [firstHolderAddress, firstHolderId] = api.firstHolder
  unlockFirstHolderAccess()

  // sale params
  debug('issue token sale')
  const saleParams = api.createType('PalletProjectTokenTokenSaleParams', {
    unitPrice: api.createType('u128', new BN(1)),
    upperBoundQuantity: api.createType('u128', new BN(1000000000)),
    duration: api.createType('u32', new BN(10)),
    capPerMember: api.createType('Option<u128>', new BN(1000000)),
  })
  const initTokenSaleFixture = new InitTokenSaleFixture(api, query, creatorAddress, creatorMemberId, channelId, saleParams)
  await new FixtureRunner(initTokenSaleFixture).run()

  debug('update upcoming token sale')
  const newStartBlock = (await api.getBestBlock()).toNumber() + 1
  const newDuration = 10
  const updateUpcomingSaleFixture = new UpdateUpcomingSaleFixture(api, query, creatorAddress, creatorMemberId, channelId, newStartBlock, newDuration)
  await new FixtureRunner(updateUpcomingSaleFixture).run()

  debug('purchase tokens on sale')
  await api.treasuryTransferBalance(firstHolderAddress, new BN(1000))
  const purchaseTokensOnSaleFixture = new PurchaseTokensOnSaleFixture(api, query, firstHolderAddress, firstHolderId, tokenId, new BN(100))
  await new FixtureRunner(purchaseTokensOnSaleFixture).run()

  debug('finalize token sale')
  const finalizeTokenSaleFixture = new FinalizeTokenSaleFixture(api, query, creatorAddress, creatorMemberId, channelId)
  await new FixtureRunner(finalizeTokenSaleFixture).run()
}
