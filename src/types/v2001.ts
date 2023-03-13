import type {Result, Option} from './support'

export interface UpdateChannelPayoutsParametersRecord {
    commitment: (Uint8Array | undefined)
    payload: (ChannelPayoutsPayloadParametersRecord | undefined)
    minCashoutAllowed: (bigint | undefined)
    maxCashoutAllowed: (bigint | undefined)
    channelCashoutsEnabled: (boolean | undefined)
}

export interface InviteMembershipParameters {
    invitingMemberId: bigint
    rootAccount: Uint8Array
    controllerAccount: Uint8Array
    handle: (Uint8Array | undefined)
    metadata: Uint8Array
}

export interface ChannelPayoutsPayloadParametersRecord {
    objectCreationParams: DataObjectCreationParameters
    expectedDataSizeFee: bigint
    expectedDataObjectStateBloatBond: bigint
}

export interface DataObjectCreationParameters {
    size: bigint
    ipfsContentId: Uint8Array
}
