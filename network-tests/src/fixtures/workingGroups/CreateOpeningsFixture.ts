import { Api } from '../../Api'
import { OrionApi } from '../../OrionApi'
import { EventType, WorkingGroupModuleName } from '../../types'
import { OpeningId } from '@joystream/types/primitives'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Utils } from '../../utils'
import { ISubmittableResult } from '@polkadot/types/types/'
import { OpeningAddedEventFieldsFragment } from '../../graphql/generated/queries'
import moment from 'moment'
import BN from 'bn.js'
import { IOpeningMetadata, OpeningMetadata } from '@joystream/metadata-protobuf'
import { createType } from '@joystream/types'
import { Bytes } from '@polkadot/types'
import { BaseWorkingGroupFixture } from './BaseWorkingGroupFixture'
import { EventDetails } from '../../types'

export type OpeningParams = {
  stake: BN
  unstakingPeriod: number
  reward: BN
  metadata: IOpeningMetadata | string
  expectMetadataFailure?: boolean
}

// 'contentWorkingGroup' used just as a reference group (all working-group events are the same)
type OpeningAddedEventDetails = EventDetails<EventType<'contentWorkingGroup', 'OpeningAdded'>>

export const createDefaultOpeningParams = (
  api: Api
): Omit<OpeningParams, 'metadata'> & { metadata: IOpeningMetadata } => {
  return {
    stake: api.consts.contentWorkingGroup.minimumApplicationStake,
    unstakingPeriod: api.consts.contentWorkingGroup.minUnstakingPeriodLimit.toNumber(),
    reward: new BN(10),
    metadata: {
      shortDescription: 'Test opening',
      description: '# Test opening',
      expectedEndingTimestamp: moment().unix() + 60,
      hiringLimit: 1,
      applicationDetails: '- This is automatically created opening, do not apply!',
      applicationFormQuestions: [
        { question: 'Question 1?', type: OpeningMetadata.ApplicationFormQuestion.InputType.TEXT },
        {
          question: 'Question 2?',
          type: OpeningMetadata.ApplicationFormQuestion.InputType.TEXTAREA,
        },
      ],
    },
  }
}

export class CreateOpeningsFixture extends BaseWorkingGroupFixture {
  protected events: OpeningAddedEventDetails[] = []

  protected openingsParams: OpeningParams[]

  public constructor(
    api: Api,
    query: OrionApi,
    group: WorkingGroupModuleName,
    openingsParams?: OpeningParams[]
  ) {
    super(api, query, group)
    this.openingsParams = openingsParams || [createDefaultOpeningParams(api)]
  }

  public getCreatedOpeningIds(): OpeningId[] {
    if (!this.events.length) {
      throw new Error('Trying to get created opening ids before they were created!')
    }
    return this.events.map((e) => e.event.data[0])
  }

  protected async getSignerAccountOrAccounts(): Promise<string> {
    return await this.api.getLeadRoleKey(this.group)
  }

  protected getOpeningMetadata(params: OpeningParams): IOpeningMetadata | null {
    if (typeof params.metadata === 'string') {
      try {
        return Utils.metadataFromBytes(OpeningMetadata, createType('Bytes', params.metadata))
      } catch (e) {
        if (!params.expectMetadataFailure) {
          throw e
        }
        return null
      }
    }

    return params.metadata
  }

  protected getOpeningMetadataBytes(params: { metadata: IOpeningMetadata | string }): Bytes {
    const { metadata } = params
    return typeof metadata === 'string'
      ? createType('Bytes', metadata)
      : Utils.metadataToBytes(OpeningMetadata, metadata)
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    const extrinsics = this.openingsParams.map((params) =>
      this.api.tx[this.group].addOpening(
        this.getOpeningMetadataBytes(params),
        'Regular',
        { stakeAmount: params.stake, leavingUnstakingPeriod: params.unstakingPeriod },
        params.reward
      )
    )

    return extrinsics
  }

  protected async getEventFromResult(
    result: ISubmittableResult
  ): Promise<OpeningAddedEventDetails> {
    return this.api.getEventDetails(result, this.group, 'OpeningAdded')
  }

  protected assertQueryNodeEventIsValid(qEvent: OpeningAddedEventFieldsFragment, i: number): void {}
}
