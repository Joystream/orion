import {
  Event,
  Membership,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionStatusEventData,
} from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { MemberRemarked, MembershipMetadata } from '@joystream/metadata-protobuf'
import { bytesToString, deserializeMetadata, genericEventFields, toAddress } from '../utils'
import { processMemberRemark, processMembershipMetadata } from './metadata'

export function processNewMember({
  ec,
  block,
  event: {
    asV1000: [memberId, params],
  },
}: EventHandlerContext<
  | 'Members.MemberCreated'
  | 'Members.MemberInvited'
  | 'Members.MembershipBought'
  | 'Members.MembershipGifted'
>) {
  const { controllerAccount, handle, metadata: metadataBytes } = params
  const metadata = deserializeMetadata(MembershipMetadata, metadataBytes)

  const member = new Membership({
    createdAt: new Date(block.timestamp),
    id: memberId.toString(),
    controllerAccount: toAddress(controllerAccount),
    handle: handle && bytesToString(handle),
  })

  if (metadata) {
    processMembershipMetadata(ec, member, metadata)
  }

  ec.collections.Membership.push(member)
}

export async function processMemberAccountsUpdatedEvent({
  ec,
  event: {
    asV1000: [memberId, , newControllerAccount],
  },
}: EventHandlerContext<'Members.MemberAccountsUpdated'>) {
  if (newControllerAccount) {
    const member = await ec.collections.Membership.getOrFail(memberId.toString())
    member.controllerAccount = toAddress(newControllerAccount)
  }
}

export async function processMemberProfileUpdatedEvent({
  ec,
  event: {
    asV1000: [memberId, newHandle, newMetadata],
  },
}: EventHandlerContext<'Members.MemberProfileUpdated'>) {
  const member = await ec.collections.Membership.getOrFail(memberId.toString(), { metadata: true })

  if (newHandle) {
    member.handle = newHandle.toString()
  }

  if (newMetadata) {
    const metadata = deserializeMetadata(MembershipMetadata, newMetadata)
    if (metadata) {
      processMembershipMetadata(ec, member, metadata)
    }
  }
}

export async function processMemberRemarkedEvent({
  ec,
  block,
  indexInBlock,
  extrinsicHash,
  event: {
    asV1000: [memberId, message],
  },
}: EventHandlerContext<'Members.MemberRemarked'>) {
  const metadata = deserializeMetadata(MemberRemarked, message)
  const result = metadata
    ? await processMemberRemark(
        ec,
        block,
        indexInBlock,
        extrinsicHash,
        memberId.toString(),
        metadata
      )
    : new MetaprotocolTransactionResultFailed({
        errorMessage: 'Could not decode the metadata',
      })
  ec.collections.Event.push(
    new Event({
      ...genericEventFields(block, indexInBlock, extrinsicHash),
      data: new MetaprotocolTransactionStatusEventData({
        result,
      }),
    })
  )
}
