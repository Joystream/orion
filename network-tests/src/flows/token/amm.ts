import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { expect } from 'chai'
import { Resource } from '../../Resources'
import { BN } from 'bn.js'
import { ActivateAmmFixture, BuyOnAmmFixture } from '../../fixtures/token'

export default async function amm({ api, query, lock }: FlowProps): Promise<void> {
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
  debug('activate amm')
  const ammParams = api.createType('PalletProjectTokenAmmParams', {
        slope: api.createType('Permill', new BN(10)),
        intercept: api.createType('Permill', new BN(10000))
  })
  const activateAmmFixture = new ActivateAmmFixture(api, query, creatorAddress, creatorMemberId, channelId, ammParams)
  await new FixtureRunner(activateAmmFixture).run()

  debug('buy on amm')
  const amountBought = new BN(1000)
  const buyOnAmmFixture = new BuyOnAmmFixture(api, query, firstHolderAddress, firstHolderId, tokenId, amountBought)
  await new FixtureRunner(buyOnAmmFixture).run()
}


