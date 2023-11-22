import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssuerTransferFixture } from '../../fixtures/token'
import { PalletProjectTokenPaymentWithVesting } from '@polkadot/types/lookup'
import { DEFAULT_TRANSFER_AMOUNT } from '../../consts'
import { BN } from 'bn.js'

export default async function issuerTransferWithExistingAccountAndVestingFlow({
  api,
  query,
  lock,
}: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issuer transfer with existing account and no vesting')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel

  // retrieve owner info
  const [creatorAddress, creatorMemberId] = api.creator

  // create membership for first holder
  const [firstHolderAddress, firstHolderMemberId] = api.firstHolder

  const outputs: [number, PalletProjectTokenPaymentWithVesting][] = [
    [
      firstHolderMemberId,
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

  api.setFirstHolder(firstHolderAddress, firstHolderMemberId)
}
