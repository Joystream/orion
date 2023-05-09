import type {Result, Option} from './support'

export interface InviteMembershipParameters {
    invitingMemberId: bigint
    rootAccount: Uint8Array
    controllerAccount: Uint8Array
    handle: (Uint8Array | undefined)
    metadata: Uint8Array
}
