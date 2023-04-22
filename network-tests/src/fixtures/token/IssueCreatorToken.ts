import { StandardizedFixture } from "src/Fixture";
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableResult } from '@polkadot/api'
import { QueryNodeApi } from '../../QueryNodeApi'
import { Api } from '../../Api'
import { PalletContentPermissionsContentActor, PalletProjectTokenTokenIssuanceParameters } from '@polkadot/types/lookup'
import { u64 } from '@polkadot/types'

type TokenIssuedEventDetails = EventDetails<EventType<'projectToken', 'TokenIssued'>>

export type IssueCreatorTokenParameters = [PalletContentPermissionsContentActor, u64, PalletProjectTokenTokenIssuanceParameters];

export class IssueCreatorTokenFixture extends StandardizedFixture {
  protected params: Map<string, IssueCreatorTokenParameters>

  public constructor(api: Api, query: QueryNodeApi, params: Map<string, IssueCreatorTokenParameters>) {
    super(api, query)
    this.params = params
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return Array.from(this.params.keys())
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return Array.from(this.params.values()).map(([actor, channelId, params]) =>
      this.api.tx.content.issueCreatorToken(actor, channelId, params)
    )
  }

  protected async getEventFromResult(
    result: SubmittableResult
  ): Promise<TokenIssuedEventDetails> {
    return this.api.getEventDetails(result, 'projectToken', 'TokenIssued')
  }

  public assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {

  }
}
