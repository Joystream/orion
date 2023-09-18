import { FlowProps } from '../../Flow'
import { extendDebug } from '../../Debugger'
import { FixtureRunner } from '../../Fixture'
import { IssueCreatorTokenFixture } from '../../fixtures/token'
import { expect } from 'chai'
import { BN } from 'bn.js'
import { blake2AsHex } from '@polkadot/util-crypto'
import { PalletContentPermissionsContentActor } from '@polkadot/types/lookup'
import { BuyMembershipHappyCaseFixture } from '../../fixtures/membership'
import { CREATOR_BALANCE, FIRST_HOLDER_BALANCE } from '../../consts'

export default async function issueCreatorToken({ api, query }: FlowProps): Promise<void> {
  const debug = extendDebug('flow:issue-creatorToken')
  debug('Started')
  api.enableDebugTxLogs()

  const channelId = api.channel

  // retrieve owner info
  const channel = await api.query.content.channelById(new BN(channelId))

  // issuer membership
  const channelOwnerMemberId = channel.owner.asMember
  const channelOwnerMembership = await api.query.members.membershipById(channelOwnerMemberId)
  expect(channelOwnerMembership.isSome, 'Not possible to retrieve channel owner membership')
  const channelOwnerAddress = channelOwnerMembership.unwrap().controllerAccount.toString()

  // create membership for vested holder
  const vestedHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(api, query, [vestedHolderAddress])
  await new FixtureRunner(buyMembershipsFixture).run()
  const vestedHolderMemberId = buyMembershipsFixture.getCreatedMembers()[0]

  // whitelisted holder
  const whitelistedHolderAddress = (await api.createKeyPairs(1)).map(({ key }) => key.address)[0]
  const buyMembershipsFixtureForWhitelist = new BuyMembershipHappyCaseFixture(api, query, [
    whitelistedHolderAddress,
  ])
  await new FixtureRunner(buyMembershipsFixtureForWhitelist).run()
  const whitelistedHolderMemberId = buyMembershipsFixtureForWhitelist.getCreatedMembers()[0]

  const initialAllocation = api.createType('BTreeMap<u64, PalletProjectTokenTokenAllocation>')
  initialAllocation.set(
    channelOwnerMemberId,
    api.createType('PalletProjectTokenTokenAllocation', {
      amount: CREATOR_BALANCE,
    })
  )
  initialAllocation.set(
    vestedHolderMemberId,
    api.createType('PalletProjectTokenTokenAllocation', {
      amount: FIRST_HOLDER_BALANCE,
      vesting: api.createType('Option<VestingSchedule>', {
        linearVestingDuration: api.createType('u32', new BN(100)),
        blocksBeforeCliff: api.createType('u32', new BN(10)),
        cliffAmountPercentage: api.createType('Permill', new BN(100)),
      }),
    })
  )

  const whitelistCommit = blake2AsHex(whitelistedHolderMemberId.toU8a(), 256)
  const symbol = blake2AsHex('test')
  const transferPolicy = api.createType('PalletProjectTokenTransferPolicyParams', {
    Permissioned: whitelistCommit,
  })
  const revenueSplitRate = api.createType('Permill', new BN(10))
  const patronageRate = api.createType('Perquintill', new BN(15))
  const contentActor: PalletContentPermissionsContentActor = api.createType(
    'PalletContentPermissionsContentActor',
    { Member: channelOwnerMemberId }
  )

  // issue creator token
  const crtParams = api.createType('PalletProjectTokenTokenIssuanceParameters', {
    initialAllocation,
    symbol,
    transferPolicy,
    patronageRate,
    revenueSplitRate,
  })

  const issueCreatorTokenFixture = new IssueCreatorTokenFixture(
    api,
    query,
    channelOwnerAddress,
    contentActor,
    channelId,
    crtParams
  )
  await new FixtureRunner(issueCreatorTokenFixture).runWithQueryNodeChecks()
  const tokenId = issueCreatorTokenFixture.getTokenId()

  api.setWhitelistedHolder(whitelistedHolderAddress, whitelistedHolderMemberId.toNumber())
  api.setToken(tokenId.toNumber())

  debug('Done')
}
