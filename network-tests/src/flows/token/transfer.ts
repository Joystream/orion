import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { TransferFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { Resource } from '../../Resources'

export default async function burnTokens({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const tokenId = (await api.query.projectToken.nextTokenId()).toNumber() - 1
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(tokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const unlockCreatorAccess = await lock(Resource.Creator)
  const [creatorAddress,] = api.creator
  unlockCreatorAccess()

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  const [, firstHolderMemberId] = api.firstHolder
  unlockFirstHolderAccess()

  const outputs = api.createType('BTreeMap<u64, PalletProjectTokenPaymentWithVesting> ')
  outputs.set(api.createType('u64', firstHolderMemberId), api.createType('PalletProjectTokenPaymentWithVesting', {
    amount: api.createType('u128', new BN(1000))
  }))
  const metadata = ''

  const issuerTransferFixture = new TransferFixture(api, query, creatorAddress, firstHolderMemberId, tokenId, outputs, metadata)
  await new FixtureRunner(issuerTransferFixture).run()
}

