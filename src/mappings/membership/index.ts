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
  event,
}: EventHandlerContext<
  | 'Members.MemberCreated'
  | 'Members.MemberInvited'
  | 'Members.MembershipBought'
  | 'Members.MembershipGifted'
>) {
  const [memberId, params] = 'isV2001' in event && event.isV2001 ? event.asV2001 : event.asV1000
  const { controllerAccount, handle, metadata: metadataBytes } = params
  const metadata = deserializeMetadata(MembershipMetadata, metadataBytes)

  const member = overlay.getRepository(Membership).new({
    createdAt: new Date(block.timestamp),
    id: memberId.toString(),
    controllerAccount: toAddress(controllerAccount),
    handle: handle && bytesToString(handle),
    totalChannelsCreated: 0,
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
  event,
}: EventHandlerContext<'Members.MemberRemarked'>) {
  const [memberId, message, payment] = event.isV2001 ? event.asV2001 : event.asV1000
  const metadata = deserializeMetadata(MemberRemarked, message)
  const result = metadata
    ? await processMemberRemark(
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        memberId.toString(),
        metadata,
        payment && [toAddress(payment[0]), payment[1]]
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
