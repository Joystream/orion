import { Api } from '../../Api'
import { OrionApi } from '../../OrionApi'
import { Utils } from '../../utils'
import {
  PalletProposalsEngineProposal as Proposal,
  PalletProposalsEngineVoteKind as VoteKind,
  PalletCouncilCouncilMember as CouncilMember,
} from '@polkadot/types/lookup'
import { BaseQueryNodeFixture, FixtureRunner } from '../../Fixture'
import { ProposalVote } from './index'
import { ProposalId } from '@joystream/types/primitives'
import { VoteOnProposalsFixture } from './VoteOnProposalsFixture'
import { ProposalFieldsFragment } from '../../graphql/generated/queries'
import { assert } from 'chai'

export type DecisionStatus = 'Approved' | 'Rejected' | 'Slashed'

type ResultingProposalStatus =
  | 'ProposalStatusDormant'
  | 'ProposalStatusGracing'
  | 'ProposalStatusExecuted'
  | 'ProposalStatusExecutionFailed'
  | 'ProposalStatusSlashed'
  | 'ProposalStatusRejected'

export type DecideOnProposalStatusParams = {
  proposalId: ProposalId
  status: DecisionStatus
  expectExecutionFailure?: boolean
}

export class DecideOnProposalStatusFixture extends BaseQueryNodeFixture {
  protected params: DecideOnProposalStatusParams[]
  protected voteOnProposalsRunner?: FixtureRunner
  protected proposals: Proposal[] = []
  protected proposalsExecutionBlock: Map<number, number> = new Map()

  public constructor(api: Api, query: OrionApi, params: DecideOnProposalStatusParams[]) {
    super(api, query)
    this.params = params
  }

  public getDormantProposalsIds(): ProposalId[] {
    if (!this.executed) {
      throw new Error('Trying to get dormant proposal ids before the fixture is executed')
    }
    return this.params
      .filter((p, i) => this.getExpectedProposalStatus(i) === 'ProposalStatusDormant')
      .map((p) => p.proposalId)
  }

  protected getVotes(
    proposalId: ProposalId,
    proposal: Proposal,
    targetStatus: DecisionStatus,
    councilMembers: CouncilMember[]
  ): ProposalVote[] {
    const councilSize = councilMembers.length
    const {
      approvalQuorumPercentage,
      approvalThresholdPercentage,
      slashingQuorumPercentage,
      slashingThresholdPercentage,
    } = proposal.parameters
    const vote = (vote: VoteKind['type'], i: number): ProposalVote => ({
      asMember: councilMembers[i].membershipId,
      proposalId,
      rationale: `Vote ${vote} by member ${i}`,
      vote,
    })
    if (targetStatus === 'Approved') {
      const minVotesN = Math.ceil((councilSize * approvalQuorumPercentage.toNumber()) / 100)
      const minApproveVotesN = Math.ceil((minVotesN * approvalThresholdPercentage.toNumber()) / 100)
      return Array.from({ length: minVotesN }, (v, i) =>
        i < minApproveVotesN ? vote('Approve', i) : vote('Abstain', i)
      )
    } else if (targetStatus === 'Slashed') {
      const minVotesN = Math.ceil((councilSize * slashingQuorumPercentage.toNumber()) / 100)
      const minSlashVotesN = Math.ceil((minVotesN * slashingThresholdPercentage.toNumber()) / 100)
      return Array.from({ length: minVotesN }, (v, i) =>
        i < minSlashVotesN ? vote('Slash', i) : vote('Abstain', i)
      )
    } else {
      const otherResultMinThreshold = Math.min(
        approvalThresholdPercentage.toNumber(),
        slashingThresholdPercentage.toNumber()
      )
      const minRejectOrAbstainVotesN =
        Math.floor((councilSize * (100 - otherResultMinThreshold)) / 100) + 1
      return Array.from({ length: minRejectOrAbstainVotesN }, (v, i) => vote('Reject', i))
    }
  }

  protected async postExecutionChecks(qProposal: ProposalFieldsFragment): Promise<void> {
    // TODO: Other proposal types
  }

  protected getExpectedProposalStatus(i: number): ResultingProposalStatus {
    const params = this.params[i]
    const proposal = this.proposals[i]
    if (params.status === 'Approved') {
      if (
        proposal.parameters.constitutionality.toNumber() >
        proposal.nrOfCouncilConfirmations.toNumber() + 1
      ) {
        return 'ProposalStatusDormant'
      } else if (
        proposal.parameters.gracePeriod.toNumber() ||
        proposal.exactExecutionBlock.isSome
      ) {
        return 'ProposalStatusGracing'
      } else {
        return params.expectExecutionFailure
          ? 'ProposalStatusExecutionFailed'
          : 'ProposalStatusExecuted'
      }
    } else if (params.status === 'Slashed') {
      return 'ProposalStatusSlashed'
    } else {
      return 'ProposalStatusRejected'
    }
  }

  protected assertProposalStatusesAreValid(qProposals: ProposalFieldsFragment[]): void {
    this.params.forEach((params, i) => {
      const qProposal = qProposals.find((p) => p.id === params.proposalId.toString())
      Utils.assert(qProposal, 'Query node: Proposal not found')
      Utils.assert(
        qProposal.status.__typename === this.getExpectedProposalStatus(i),
        `Exepected ${qProposal.status.__typename} to equal ${this.getExpectedProposalStatus(i)}`
      )
      if (
        qProposal.status.__typename === 'ProposalStatusExecuted' ||
        qProposal.status.__typename === 'ProposalStatusExecutionFailed'
      ) {
        Utils.assert(
          qProposal.status.proposalExecutedEvent?.id,
          'Missing proposalExecutedEvent reference'
        )
        assert.equal(
          qProposal.status.proposalExecutedEvent?.executionStatus.__typename,
          qProposal.status.__typename
        )
        assert.equal(qProposal.isFinalized, true)
      } else if (
        qProposal.status.__typename === 'ProposalStatusDormant' ||
        qProposal.status.__typename === 'ProposalStatusGracing'
      ) {
        Utils.assert(
          qProposal.status.proposalStatusUpdatedEvent?.id,
          'Missing proposalStatusUpdatedEvent reference'
        )
        assert.equal(
          qProposal.status.proposalStatusUpdatedEvent?.newStatus.__typename,
          qProposal.status.__typename
        )
        assert.equal(qProposal.isFinalized, false)
        assert.include(
          qProposal.proposalStatusUpdates.map((u) => u.id),
          qProposal.status.proposalStatusUpdatedEvent?.id
        )
      } else {
        Utils.assert(
          qProposal.status.proposalDecisionMadeEvent?.id,
          'Missing proposalDecisionMadeEvent reference'
        )
        assert.equal(
          qProposal.status.proposalDecisionMadeEvent?.decisionStatus.__typename,
          qProposal.status.__typename
        )
        assert.equal(qProposal.isFinalized, true)
      }
    })
  }

  protected assertProposalExecutedAsExpected(qProposal: ProposalFieldsFragment, i: number): void {
    const params = this.params[i]
    const proposal = this.proposals[i]

    assert.equal(
      qProposal.status.__typename,
      params.expectExecutionFailure ? 'ProposalStatusExecutionFailed' : 'ProposalStatusExecuted'
    )
    assert.equal(qProposal.isFinalized, true)
    if (proposal.exactExecutionBlock.isSome) {
      assert.equal(qProposal.statusSetAtBlock, proposal.exactExecutionBlock.unwrap().toNumber())
    } else if (proposal.parameters.gracePeriod.toNumber()) {
      const gracePriodStartedAt = qProposal.proposalStatusUpdates.find(
        (u) => u.newStatus.__typename === 'ProposalStatusGracing'
      )?.inBlock
      assert.equal(
        qProposal.statusSetAtBlock,
        (gracePriodStartedAt || 0) + proposal.parameters.gracePeriod.toNumber()
      )
    }
  }

  public async execute(): Promise<void> {
    const { api, query } = this
    this.proposals = await this.api.query.proposalsEngine.proposals.multi<Proposal>(
      this.params.map((p) => p.proposalId)
    )
    const councilMembers = await this.api.query.council.councilMembers()
    Utils.assert(councilMembers.length, 'Council must be elected in order to cast proposal votes')
    let votes: ProposalVote[] = []
    this.params.forEach(({ proposalId, status }, i) => {
      const proposal = this.proposals[i]
      votes = votes.concat(this.getVotes(proposalId, proposal, status, councilMembers))
    })
    this.debug(
      'Casting votes:',
      votes.map((v) => ({ proposalId: v.proposalId.toString(), vote: v.vote.toString() }))
    )
    const voteOnProposalsFixture = new VoteOnProposalsFixture(api, query, votes)
    this.voteOnProposalsRunner = new FixtureRunner(voteOnProposalsFixture)
    await this.voteOnProposalsRunner.run()
    const gracingBlock = (await this.api.getBestBlock()).toNumber() + 1
    this.params.forEach(({ proposalId, status }, i) => {
      if (status === 'Approved') {
        const proposal = this.proposals[i]
        const executionBlock = proposal.exactExecutionBlock.isSome
          ? proposal.exactExecutionBlock.unwrap().toNumber()
          : gracingBlock + proposal.parameters.gracePeriod.toNumber()
        this.proposalsExecutionBlock.set(proposalId.toNumber(), executionBlock)
      }
    })
  }

  public getExecutionBlock(proposalId: number) {
    return this.proposalsExecutionBlock.get(proposalId)
  }

  public async runQueryNodeChecks(): Promise<void> {
    // await super.runQueryNodeChecks()
    Utils.assert(this.voteOnProposalsRunner)
    // await this.voteOnProposalsRunner.runQueryNodeChecks()

    // const qProposals = await this.query.tryQueryWithTimeout(
    //   () => this.query.getProposalsByIds(this.params.map((p) => p.proposalId)),
    //   (res) => this.assertProposalStatusesAreValid(res)
    // )

    await Promise.all(
      this.proposals.map(async (proposal, i) => {
        const executionBlock = this.proposalsExecutionBlock.get(
          this.params[i].proposalId.toNumber()
        )!
        await this.api.untilBlock(executionBlock)
        // let qProposal = qProposals[i]
        if (this.getExpectedProposalStatus(i) === 'ProposalStatusGracing') {
          // const proposalExecutionBlock = proposal.exactExecutionBlock.isSome
          //   ? proposal.exactExecutionBlock.unwrap().toNumber()
          //   : qProposal.statusSetAtBlock + proposal.parameters.gracePeriod.toNumber()
          // ;[qProposal] = await this.query.tryQueryWithTimeout(
          //   () => this.query.getProposalsByIds([this.params[i].proposalId]),
          //   ([p]) => this.assertProposalExecutedAsExpected(p, i)
          // )
          // await this.postExecutionChecks(qProposal)
        }
      })
    )
  }

  public async getExecutionEvents(section: string, method: string) {
    // const qProposals = await this.query.tryQueryWithTimeout(
    //   () => this.query.getProposalsByIds(this.params.map((p) => p.proposalId)),
    //   (res) => this.assertProposalStatusesAreValid(res)
    // )
    // const executionBlocks = await Promise.all(
    //   this.proposals.map(async (proposal, i) => {
    //     const qProposal = qProposals[i]
    //     if (this.getExpectedProposalStatus(i) === 'ProposalStatusExecuted') {
    //       const proposalExecutionBlock = proposal.exactExecutionBlock.isSome
    //         ? proposal.exactExecutionBlock.unwrap().toNumber()
    //         : qProposal.statusSetAtBlock + proposal.parameters.gracePeriod.toNumber()
    //       return proposalExecutionBlock
    //     } else {
    //       return undefined
    //     }
    //   })
    // )

    const events = await Promise.all(
      Array.from(this.proposalsExecutionBlock).map(async ([, proposalExecutionBlock]) => {
        if (proposalExecutionBlock) {
          // search within the execution block for the appropriate event
          const blockHash = await this.api.getBlockHash(proposalExecutionBlock)
          const blockEvents = await this.api.query.system.events.at(blockHash)
          const blockEvent = blockEvents.filter((blockEvent) => {
            return blockEvent.event.section === section && blockEvent.event.method === method
          })
          return blockEvent!
        } else {
          return undefined
        }
      })
    )

    return events.map((dispatchEvent) => {
      if (dispatchEvent) {
        return dispatchEvent.map((e) => e.event)
      } else {
        return undefined
      }
    })
  }
}
