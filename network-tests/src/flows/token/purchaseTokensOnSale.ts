import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { PurchaseTokensOnSaleFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'

export default async function initTokenSale({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:update-token-sale')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = (await api.query.projectToken.nextTokenId()).toNumber() - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(tokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [firstHolderAddress, firstHolderId] = api.firstHolder
  unlockFirstHolderAccess()

  await api.treasuryTransferBalance(firstHolderAddress, new BN(1000))

  // sale params
  const purchaseTokensOnSaleFixture = new PurchaseTokensOnSaleFixture(api, query, firstHolderAddress, firstHolderId, tokenId, new BN(100))
  await new FixtureRunner(purchaseTokensOnSaleFixture).run()
}
