import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { DustAccountFixture, IssuerTransferFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { BuyMembershipHappyCaseFixture } from 'src/fixtures/membership'
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
  const [creatorAddress, creatorMemberId] = api.creator
  unlockCreatorAccess()

  // create membership for first holder
  const holderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [holderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const holderMemberId = buyMembershipsFixture.getCreatedMembers()[0]

  // create crt account
  const actor = api.createType('PalletContentPermissionsContentActor', { Member: creatorMemberId})
  const outputs = api.createType('BTreeMap<u64, PalletProjectTokenPaymentWithVesting> ')
  outputs.set(api.createType('u64', holderMemberId), api.createType('PalletProjectTokenPaymentWithVesting', {
    amount: api.createType('u128', new BN(0))
  }))
  const metadata = ''
  const issuerTransferFixture = new IssuerTransferFixture(api, query, creatorAddress, actor, channelId, outputs, metadata)
  await new FixtureRunner(issuerTransferFixture).run()

  // dust created account
  const dustAccountFixture = new DustAccountFixture(api, query, creatorAddress, tokenId, holderMemberId.toNumber())
  await new FixtureRunner(dustAccountFixture).run()
}
