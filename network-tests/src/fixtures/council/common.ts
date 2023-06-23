import { assert } from 'chai'
import { Api } from '../../Api'
import { OrionApi } from '../../OrionApi'
import { AddStakingAccountsHappyCaseFixture, BuyMembershipHappyCaseFixture } from '../membership'
import { FixtureRunner } from '../../Fixture'
import { MemberId } from '@joystream/types/primitives'
import { Balance } from '@polkadot/types/interfaces'

interface IFailToElectResources {
  candidatesMemberIds: MemberId[]
  candidatesStakingAccounts: string[]
  candidatesMemberAccounts: string[]
  councilCandidateStake: Balance
  councilMemberIds: MemberId[]
}

export async function prepareFailToElectResources(
  api: Api,
  query: OrionApi
): Promise<IFailToElectResources> {
  const { councilSize, minNumberOfExtraCandidates } = api.consts.council
  const numberOfCandidates = councilSize.add(minNumberOfExtraCandidates).toNumber()

  // prepare memberships
  const candidatesMemberAccounts = (await api.createKeyPairs(numberOfCandidates)).map(
    ({ key }) => key.address
  )
  const buyMembershipsFixture = new BuyMembershipHappyCaseFixture(
    api,
    query,
    candidatesMemberAccounts
  )
  await new FixtureRunner(buyMembershipsFixture).run()
  const candidatesMemberIds = buyMembershipsFixture.getCreatedMembers()

  // prepare staking accounts
  const councilCandidateStake = api.consts.council.minCandidateStake

  const candidatesStakingAccounts = (await api.createKeyPairs(numberOfCandidates)).map(
    ({ key }) => key.address
  )
  const addStakingAccountsFixture = new AddStakingAccountsHappyCaseFixture(
    api,
    query,
    candidatesStakingAccounts.map((account, i) => ({
      asMember: candidatesMemberIds[i],
      account,
      stakeAmount: councilCandidateStake,
    }))
  )
  await new FixtureRunner(addStakingAccountsFixture).run()

  // retrieve currently elected council's members
  const councilMembers = await api.query.council.councilMembers()
  const councilMemberIds = councilMembers.map((item) => item.membershipId)

  return {
    candidatesMemberIds,
    candidatesStakingAccounts,
    candidatesMemberAccounts,
    councilCandidateStake,
    councilMemberIds,
  }
}
