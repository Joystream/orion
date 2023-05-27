import { StandardizedFixture } from '../../Fixture'
import { IMakeChannelPayment, IMemberRemarked, MemberRemarked } from '@joystream/metadata-protobuf'
import { MemberId } from '@joystream/types/primitives'
import { AnyQueryNodeEvent, EventDetails, EventType } from '../../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types/'
import BN from 'bn.js'
import { Utils } from '../../utils'
import { OrionApi } from '../../OrionApi'
import { Api } from '../../Api'

type MemberRemarkedEventDetails = EventDetails<EventType<'members', 'MemberRemarked'>>

export type ChannelPaymentParams = {
  asMember: MemberId
  msg: IMakeChannelPayment
  payment: [string, BN]
}

export class DirectChannelPaymentFixture extends StandardizedFixture {
  protected paymentParams: ChannelPaymentParams[]

  public constructor(api: Api, query: OrionApi, paymentParams: ChannelPaymentParams[]) {
    super(api, query)
    this.paymentParams = paymentParams
  }

  protected async getEventFromResult(
    result: ISubmittableResult
  ): Promise<MemberRemarkedEventDetails> {
    return this.api.getEventDetails(result, 'members', 'MemberRemarked')
  }

  protected async getSignerAccountOrAccounts(): Promise<string[]> {
    return await Promise.all(
      this.paymentParams.map(async ({ asMember }) =>
        (await this.api.query.members.membershipById(asMember))
          .unwrap()
          .controllerAccount.toString()
      )
    )
  }

  protected async getExtrinsics(): Promise<SubmittableExtrinsic<'promise'>[]> {
    return this.paymentParams.map((params) => {
      const msg: IMemberRemarked = {
        makeChannelPayment: params.msg,
      }
      return this.api.tx.members.memberRemark(
        params.asMember,
        Utils.metadataToBytes(MemberRemarked, msg),
        params.payment
      )
    })
  }

  protected assertQueryNodeEventIsValid(qEvent: AnyQueryNodeEvent, i: number): void {}

  async runQueryNodeChecks(): Promise<void> {}
}
