import { Api } from '../../Api'
import { OrionApi } from '../../OrionApi'
import { EventType, ProposalDetailsJsonByType, ProposalType } from '../../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types/'
import {
  ProposalCreatedEventFieldsFragment,
  ProposalFieldsFragment,
} from '../../graphql/generated/queries'
import { PalletProposalsEngineProposalParameters as ProposalParameters } from '@polkadot/types/lookup'
import { MemberId, ProposalId } from '@joystream/types/primitives'
import { FixtureRunner, StandardizedFixture } from '../../Fixture'
import { AddStakingAccountsHappyCaseFixture } from '../membership'
import { EventDetails } from '../../types'

export type ProposalCreationParams<T extends ProposalType = ProposalType> = {
  asMember: MemberId
  title: string
  description: string
  exactExecutionBlock?: number
  type: T
  details: ProposalDetailsJsonByType<T>
}

type ProposalCreatedEventDetails = EventDetails<EventType<'proposalsCodex', 'ProposalCreated'>>

export class CreateProposalsFixture extends StandardizedFixture {
  protected events: ProposalCreatedEventDetails[] = []

  protected proposalsParams: ProposalCreationParams[]
  protected stakingAccounts: string[] = []

  public constructor(api: Api, query: OrionApi, proposalsParams: ProposalCreationParams[]) {
    super(api, query)
    this.proposalsParams = proposalsParams
  }

  public getCreatedProposalsIds(): ProposalId[] {
    if (!this.events.length) {
      throw new Error('Trying to get created opening ids before they were created!')
    }
    return this.events.map((e) => e.event.data[0])
  }

  protected proposalParams(i: number): ProposalParameters {
    const proposalType = this.proposalsParams[i].type
    return this.api.proposalParametersByType(proposalType)
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return this.api.getMemberSigners(this.proposalsParams)
  }

  protected async initStakingAccounts(): Promise<void> {
    const { api, query } = this
    const stakingAccounts = (await this.api.createKeyPairs(this.proposalsParams.length)).map(
      ({ key }) => key.address
    )
    const addStakingAccountsFixture = new AddStakingAccountsHappyCaseFixture(
      api,
      query,
      this.proposalsParams.map(({ asMember }, i) => ({
        asMember,
        account: stakingAccounts[i],
        stakeAmount: this.proposalParams(i).requiredStake.unwrapOr(undefined),
      }))
    )
    await new FixtureRunner(addStakingAccountsFixture).run()

    this.stakingAccounts = stakingAccounts
  }

  public async execute(): Promise<void> {
    await this.initStakingAccounts()
    await super.execute()
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return this.proposalsParams.map(
      ({ asMember, description, title, exactExecutionBlock, details, type }, i) => {
        const proposalDetails = { [type]: details } as {
          [K in ProposalType]: ProposalDetailsJsonByType<K>
        }
        return this.api.tx.proposalsCodex.createProposal(
          {
            memberId: asMember,
            description: description,
            title: title,
            exactExecutionBlock: exactExecutionBlock,
            stakingAccountId: this.stakingAccounts[i],
          },
          proposalDetails
        )
      }
    )
  }

  protected async getEventFromResult(
    result: ISubmittableResult
  ): Promise<ProposalCreatedEventDetails> {
    return this.api.getEventDetails(result, 'proposalsCodex', 'ProposalCreated')
  }

  protected assertQueryNodeEventIsValid(
    qEvent: ProposalCreatedEventFieldsFragment,
    i: number
  ): void {}

  async runQueryNodeChecks(): Promise<void> {}
}
