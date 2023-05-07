import type {Result, Option} from './support'

export interface UpdateChannelPayoutsParametersRecord {
    commitment: (Uint8Array | undefined)
    payload: (ChannelPayoutsPayloadParametersRecord | undefined)
    minCashoutAllowed: (bigint | undefined)
    maxCashoutAllowed: (bigint | undefined)
    channelCashoutsEnabled: (boolean | undefined)
}

export interface EnglishAuctionParamsRecord {
    startingPrice: bigint
    buyNowPrice: (bigint | undefined)
    whitelist: bigint[]
    startsAt: (number | undefined)
    duration: number
    extensionPeriod: number
    minBidStep: bigint
}

export interface NftIssuanceParametersRecord {
    royalty: (number | undefined)
    nftMetadata: Uint8Array
    nonChannelOwner: (bigint | undefined)
    initTransactionalStatus: InitTransactionalStatusRecord
}

export interface OpenAuctionParamsRecord {
    startingPrice: bigint
    buyNowPrice: (bigint | undefined)
    startsAt: (number | undefined)
    whitelist: bigint[]
    bidLockDuration: number
}

export interface VideoCreationParametersRecord {
    assets: (StorageAssetsRecord | undefined)
    meta: (Uint8Array | undefined)
    autoIssueNft: (NftIssuanceParametersRecord | undefined)
    expectedVideoStateBloatBond: bigint
    expectedDataObjectStateBloatBond: bigint
    storageBucketsNumWitness: number
}

export interface VideoUpdateParametersRecord {
    assetsToUpload: (StorageAssetsRecord | undefined)
    newMeta: (Uint8Array | undefined)
    assetsToRemove: bigint[]
    autoIssueNft: (NftIssuanceParametersRecord | undefined)
    expectedDataObjectStateBloatBond: bigint
    storageBucketsNumWitness: (number | undefined)
}

export interface CreateMemberParameters {
    rootAccount: Uint8Array
    controllerAccount: Uint8Array
    handle: Uint8Array
    metadata: Uint8Array
    isFoundingMember: boolean
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
