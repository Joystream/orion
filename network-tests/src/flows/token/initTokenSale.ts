import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { InitTokenSaleFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'

export default async function initTokenSale({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:init-token-sale')
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


  // sale params
  const saleParams = api.createType('PalletProjectTokenTokenSaleParams', {
    unitPrice: api.createType('u128', new BN(1)),
    upperBoundQuantity: api.createType('u128', new BN(1000000000)),
    duration: api.createType('u32', new BN(10)),
    capPerMember: api.createType('Option<u128>', new BN(1000000)),
  })
  const initTokenSaleFixture = new InitTokenSaleFixture(api, query, creatorAddress, creatorMemberId, channelId, saleParams)
  await new FixtureRunner(initTokenSaleFixture).run()
}
