import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssuerTransferFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { Resource } from '../../Resources'

export default async function burnTokens({ api, query, lock }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
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

  // create membership for first holder
  const firstHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [firstHolderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const firstHolderMemberId = buyMembershipsFixture.getCreatedMembers()[0]

  const outputs = api.createType('BTreeMap<u64, PalletProjectTokenPaymentWithVesting> ')
  outputs.set(
    api.createType('u64', firstHolderMemberId),
    api.createType('PalletProjectTokenPaymentWithVesting', {
      amount: api.createType('u128', new BN(1000000)),
    })
  )
  const metadata = ''

  const issuerTransferFixture = new IssuerTransferFixture(
    api,
    query,
    creatorAddress,
    creatorMemberId,
    channelId,
    outputs,
    metadata
  )
  await issuerTransferFixture.preExecHook()
  await new FixtureRunner(issuerTransferFixture).runWithQueryNodeChecks()

  const unlocFirstHolderAccess = await lock(Resource.FirstHolder)
  api.setFirstHolder(firstHolderAddress, firstHolderMemberId.toNumber())
  unlockCreatorAccess()
}
