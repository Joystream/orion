import { MemberRemarked, MembershipMetadata } from '@joystream/metadata-protobuf'
import { u8aToHex } from '@polkadot/util'
import {
  BlockchainAccount,
  Event,
  Membership,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionStatusEventData,
} from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { bytesToString, deserializeMetadata, genericEventFields, toAddress } from '../utils'
import { processMemberRemark, processMembershipMetadata } from './metadata'

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
  const { controllerAccount, handle: handleBytes, metadata: metadataBytes } = params
  const metadata = deserializeMetadata(MembershipMetadata, metadataBytes)

  const controllerAccountId = toAddress(controllerAccount)

  // Create blockchain account entity if it doesn't exist
  const blockchainAccount =
    (await overlay.getRepository(BlockchainAccount).getById(controllerAccountId)) ||
    overlay.getRepository(BlockchainAccount).new({
      id: controllerAccountId,
    })

  const member = overlay.getRepository(Membership).new({
    createdAt: new Date(block.timestamp),
    id: memberId.toString(),
    controllerAccountId: blockchainAccount.id,
    totalChannelsCreated: 0,
  })
  if (handleBytes) {
    updateMemberHandle(member as Membership, handleBytes)
  }

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
    // Create blockchain account entity if it doesn't exist
    const controllerAccountId = toAddress(newControllerAccount)
    const blockchainAccount =
      (await overlay.getRepository(BlockchainAccount).getById(controllerAccountId)) ||
      overlay.getRepository(BlockchainAccount).new({
        id: controllerAccountId,
      })
    const member = await overlay.getRepository(Membership).getByIdOrFail(memberId.toString())
    member.controllerAccountId = blockchainAccount.id
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
    updateMemberHandle(member as Membership, newHandle)
  }

  if (newMetadata) {
    const metadataUpdate = deserializeMetadata(MembershipMetadata, newMetadata)
    if (metadataUpdate) {
      await processMembershipMetadata(overlay, member.id, metadataUpdate)
    }
  }
}

function updateMemberHandle(member: Membership, newHandle: Uint8Array) {
  member.handleRaw = u8aToHex(newHandle)
  member.handle = bytesToString(newHandle)
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
