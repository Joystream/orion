import { Membership } from '../../model'
import { EventHandlerContext } from '../../utils'
import { MembershipMetadata } from '@joystream/metadata-protobuf'
import { bytesToString, deserializeMetadata, toAddress } from '../utils'
import { processMembershipMetadata } from './metadata'

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
    const member = await ec.collections.Membership.get(memberId.toString())
    member.controllerAccount = toAddress(newControllerAccount)
  }
}

export async function processMemberProfileUpdatedEvent({
  ec,
  event: {
    asV1000: [memberId, newHandle, newMetadata],
  },
}: EventHandlerContext<'Members.MemberProfileUpdated'>) {
  const member = await ec.collections.Membership.get(memberId.toString(), { metadata: true })

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
