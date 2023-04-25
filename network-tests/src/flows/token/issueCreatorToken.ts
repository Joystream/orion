import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssueCreatorTokenFixture, IssueCreatorTokenParameters } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { blake2AsHex } from '@polkadot/util-crypto'

export default async function issueCreatorToken({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = (await api.query.content.nextChannelId()).toNumber() - 1
  expect(channelId).to.be.greaterThan(0).throw('Cannot find any existing channel')

  // retrieve owner info
  const channel = await api.query.content.channelById(new BN(channelId))
  const channelOwnerMemberId = channel.owner.toNumber()
  const channelOwnerMembership = await api.query.members.membershipById(channelOwnerMemberId)
  expect(channelOwnerMembership.isSome, 'Not possible to retrieve channel owner membership')
  const channelOwnerAddress = channelOwnerMembership.unwrap().controllerAccount.toString()

  // issue creator token
  const paramsMap: Map<string, IssueCreatorTokenParameters> = new Map([
    [
      channelOwnerAddress,
      [
        api.createType('PalletContentPermissionContentActor', { Member: channelOwnerMemberId }),
        api.createType('ChannelId', new BN(channelId)),
        api.createType('PalletProjectTokenTokenIssuanceParameters', {
          'initialAllocation': api.createType('BTreeMap', [
            channelOwnerMemberId,
            api.createType('PalletProjectTokenTokenAllocation', {
              'amount': new BN(100000000),
            }),
          ]),
          'symbol': blake2AsHex('test'),
          'transferPolicy': api.createType(
            'PalletProjectTokenTransferPolicyParams',
            'Permissioned'
          ),
          'patronageRate': api.createType('PatronageRate', new BN(10)),
          'revenueSplitRate': api.createType('RevenueSplitRate', new BN(10)),
        }),
      ],
    ],
  ])
  const issueCreatorTokenFixture = new IssueCreatorTokenFixture(api, query, paramsMap)

  await new FixtureRunner(issueCreatorTokenFixture).runWithQueryNodeChecks()

  debug('Done')
}
