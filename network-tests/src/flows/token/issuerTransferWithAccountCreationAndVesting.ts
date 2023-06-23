import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssuerTransferFixture } from '../../fixtures/token'
import { Resource } from '../../Resources'
import { PalletProjectTokenPaymentWithVesting } from '@polkadot/types/lookup'
import { DEFAULT_TRANSFER_AMOUNT } from '../../consts'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { BN } from 'bn.js'

export default async function issuerTransferWithAccountCreationAndVestingFlow({
  api,
  query,
}: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issuer transfer with account creation and vesting')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  // create membership for vested holder
  const vestedHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [vestedHolderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const vestedHolderMemberId = buyMembershipsFixture.getCreatedMembers()[0]

  const outputs: [number, PalletProjectTokenPaymentWithVesting][] = [
    [
      vestedHolderMemberId.toNumber(),
      api.createType('PalletProjectTokenPaymentWithVesting', {
        amount: api.createType('u128', DEFAULT_TRANSFER_AMOUNT),
        vesting: api.createType('Option<VestingSchedule>', {
          linearVestingDuration: api.createType('u32', new BN(100)),
          blocksBeforeCliff: api.createType('u32', new BN(10)),
          cliffAmountPercentage: api.createType('Permill', new BN(100)),
        }),
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
  await new FixtureRunner(issuerTransferFixture).runWithQueryNodeChecks()
}
