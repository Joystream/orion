import {
  Event,
  Membership,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionStatusEventData,
} from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { MemberRemarked, MembershipMetadata } from '@joystream/metadata-protobuf'
import { bytesToString, deserializeMetadata, genericEventFields, toAddress } from '../utils'
import { processMembershipMetadata, processMemberRemark } from './metadata'

export async function processNewMember({
  overlay,
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

  const member = overlay.getRepository(Membership).new({
    createdAt: new Date(block.timestamp),
    id: memberId.toString(),
    controllerAccount: toAddress(controllerAccount),
    handle: handle && bytesToString(handle),
  })

  if (metadata) {
    await processMembershipMetadata(overlay, member.id, metadata)
  }
}

export async function processMemberAccountsUpdatedEvent({
  overlay,
  event: {
    asV1000: [memberId, , newControllerAccount],
  },
}: EventHandlerContext<'Members.MemberAccountsUpdated'>) {
  if (newControllerAccount) {
    const member = await overlay.getRepository(Membership).getByIdOrFail(memberId.toString())
    member.controllerAccount = toAddress(newControllerAccount)
  }
}

export async function processMemberProfileUpdatedEvent({
  overlay,
  event: {
    asV1000: [memberId, newHandle, newMetadata],
  },
}: EventHandlerContext<'Members.MemberProfileUpdated'>) {
  const member = await overlay.getRepository(Membership).getByIdOrFail(memberId.toString())

  if (newHandle) {
    member.handle = newHandle.toString()
  }

  if (newMetadata) {
    const metadataUpdate = deserializeMetadata(MembershipMetadata, newMetadata)
    if (metadataUpdate) {
      await processMembershipMetadata(overlay, member.id, metadataUpdate)
    }
  }
}

export async function processMemberRemarkedEvent({
  overlay,
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
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        memberId.toString(),
        metadata
      )
    : new MetaprotocolTransactionResultFailed({
        errorMessage: 'Could not decode the metadata',
      })
  const eventRepository = overlay.getRepository(Event)
  eventRepository.new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new MetaprotocolTransactionStatusEventData({
      result,
    }),
  })
}
