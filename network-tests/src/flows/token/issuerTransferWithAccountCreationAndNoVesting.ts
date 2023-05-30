import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssuerTransferFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { Resource } from '../../Resources'
import { PalletProjectTokenPaymentWithVesting } from '@polkadot/types/lookup'
import { DEFAULT_TRANSFER_AMOUNT } from '../../consts'

export default async function issuerTransferWithAccountCreationAndNoVestingFlow({
  api,
  query,
  lock,
}: FlowProps): Promise<void> {
  const debug = extendDebug(':issuer-transfer with account creation and no vesting')
  debug('Started')
  api.enableDebugTxLogs()

  const nextTokenId = (await api.query.projectToken.nextTokenId()).toNumber()
  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(nextTokenId).gte(1)
  expect(channelId).gte(1)

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  // create membership for first holder
  const firstHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [firstHolderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const firstHolderMemberId = buyMembershipsFixture.getCreatedMembers()[0].toNumber()

  const outputs: [number, PalletProjectTokenPaymentWithVesting][] = [
    [
      firstHolderMemberId,
      api.createType('PalletProjectTokenPaymentWithVesting', {
        amount: api.createType('u128', DEFAULT_TRANSFER_AMOUNT),
      }),
    ],
  ]
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

  const unlockFirstHolderAccess = await lock(Resource.FirstHolder)
  api.setFirstHolder(firstHolderAddress, firstHolderMemberId)
  unlockFirstHolderAccess()
}
