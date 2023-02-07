import * as Types from './schema'

import gql from 'graphql-tag'
type ActorFields_ContentActorCurator_Fragment = {
  __typename: 'ContentActorCurator'
  curator?: Types.Maybe<{ id: string }>
}

type ActorFields_ContentActorLead_Fragment = { __typename: 'ContentActorLead' }

type ActorFields_ContentActorMember_Fragment = {
  __typename: 'ContentActorMember'
  member?: Types.Maybe<{ id: string }>
}

export type ActorFieldsFragment =
  | ActorFields_ContentActorCurator_Fragment
  | ActorFields_ContentActorLead_Fragment
  | ActorFields_ContentActorMember_Fragment

type AuctionTypeFields_AuctionTypeEnglish_Fragment = {
  __typename: 'AuctionTypeEnglish'
  duration: number
  extensionPeriod: number
  plannedEndAtBlock: number
  minimalBidStep: number
}

type AuctionTypeFields_AuctionTypeOpen_Fragment = {
  __typename: 'AuctionTypeOpen'
  bidLockDuration: number
}

export type AuctionTypeFieldsFragment =
  | AuctionTypeFields_AuctionTypeEnglish_Fragment
  | AuctionTypeFields_AuctionTypeOpen_Fragment

export type StateQueryV1QueryVariables = Types.Exact<{ [key: string]: never }>

export type StateQueryV1Query = {
  channels: Array<{
    id: string
    createdAt: any
    title?: Types.Maybe<string>
    description?: Types.Maybe<string>
    isPublic?: Types.Maybe<boolean>
    isCensored: boolean
    createdInBlock: number
    rewardAccount: string
    channelStateBloatBond: string
    ownerMember?: Types.Maybe<{ id: string }>
    coverPhoto?: Types.Maybe<{ id: string }>
    avatarPhoto?: Types.Maybe<{ id: string }>
    language?: Types.Maybe<{ iso: string }>
    videos: Array<{ id: string }>
    bannedMembers: Array<{ id: string }>
  }>
  commentCreatedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    text: string
    comment: { id: string }
  }>
  commentTextUpdatedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    newText: string
    comment: { id: string }
  }>
  openAuctionStartedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    actor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    auction: { id: string }
  }>
  englishAuctionStartedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    actor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    auction: { id: string }
  }>
  nftIssuedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    contentActor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  auctionBidMadeEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    bidAmount: string
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    previousTopBid?: Types.Maybe<{ id: string }>
    previousTopBidder?: Types.Maybe<{ id: string }>
  }>
  auctionBidCanceledEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    member: { id: string }
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  auctionCanceledEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    contentActor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  englishAuctionSettledEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    winningBid: { id: string }
    winner: { id: string }
    video: { id: string }
  }>
  bidMadeCompletingAuctionEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    winningBid: { id: string }
    video: { id: string }
  }>
  openAuctionBidAcceptedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    contentActor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    winningBid?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  nftSellOrderMadeEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    price: string
    contentActor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  nftBoughtEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    price: string
    member: { id: string }
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  buyNowCanceledEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    contentActor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  buyNowPriceUpdatedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    newPrice: string
    contentActor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    video: { id: string }
  }>
  metaprotocolTransactionStatusEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    status:
      | { __typename: 'MetaprotocolTransactionErrored'; message: string }
      | {
          __typename: 'MetaprotocolTransactionSuccessful'
          commentCreated?: Types.Maybe<{ id: string }>
          commentEdited?: Types.Maybe<{ id: string }>
          commentDeleted?: Types.Maybe<{ id: string }>
          commentModerated?: Types.Maybe<{ id: string }>
          videoCategoryCreated?: Types.Maybe<{ id: string }>
          videoCategoryUpdated?: Types.Maybe<{ id: string }>
          videoCategoryDeleted?: Types.Maybe<{ id: string }>
        }
  }>
  memberships: Array<{
    id: string
    createdAt: any
    handle: string
    controllerAccount: string
    metadata: {
      name?: Types.Maybe<string>
      about?: Types.Maybe<string>
      avatar?: Types.Maybe<
        { __typename: 'AvatarObject' } | { __typename: 'AvatarUri'; avatarUri: string }
      >
    }
    whitelistedInAuctions: Array<{ id: string }>
    channels: Array<{ id: string }>
    memberBannedFromChannels: Array<{ id: string }>
  }>
  ownedNfts: Array<{
    id: string
    createdAt: any
    creatorRoyalty?: Types.Maybe<number>
    lastSalePrice?: Types.Maybe<string>
    lastSaleDate?: Types.Maybe<any>
    video: { id: string; channel: { id: string } }
    auctions: Array<{ id: string }>
    ownerMember?: Types.Maybe<{ id: string }>
    ownerCuratorGroup?: Types.Maybe<{ id: string }>
    transactionalStatus?: Types.Maybe<
      | { __typename: 'TransactionalStatusBuyNow'; buyNowPrice: number }
      | { __typename: 'TransactionalStatusIdle' }
      | {
          __typename: 'TransactionalStatusInitiatedOfferToMember'
          memberId: number
          offerPrice?: Types.Maybe<number>
        }
    >
    transactionalStatusAuction?: Types.Maybe<{ id: string }>
    bids: Array<{ id: string }>
  }>
  auctions: Array<{
    id: string
    startingPrice: string
    buyNowPrice?: Types.Maybe<string>
    startsAtBlock: number
    endedAtBlock?: Types.Maybe<number>
    isCanceled: boolean
    isCompleted: boolean
    nft: { id: string }
    winningMember?: Types.Maybe<{ id: string }>
    auctionType:
      | AuctionTypeFields_AuctionTypeEnglish_Fragment
      | AuctionTypeFields_AuctionTypeOpen_Fragment
    topBid?: Types.Maybe<{ id: string; isCanceled: boolean }>
    bids: Array<{ id: string }>
    whitelistedMembers: Array<{ id: string }>
  }>
  bids: Array<{
    id: string
    createdAt: any
    amount: string
    isCanceled: boolean
    createdInBlock: number
    indexInBlock: number
    auction: { id: string }
    nft: { id: string }
    bidder: { id: string }
  }>
  storageBuckets: Array<{
    id: string
    acceptingNewBags: boolean
    dataObjectsSizeLimit: string
    dataObjectCountLimit: string
    dataObjectsCount: string
    dataObjectsSize: string
    operatorStatus:
      | { __typename: 'StorageBucketOperatorStatusActive'; workerId: number }
      | { __typename: 'StorageBucketOperatorStatusInvited'; workerId: number }
      | { __typename: 'StorageBucketOperatorStatusMissing' }
    operatorMetadata?: Types.Maybe<{
      nodeEndpoint?: Types.Maybe<string>
      extra?: Types.Maybe<string>
      nodeLocation?: Types.Maybe<{ countryCode?: Types.Maybe<string>; city?: Types.Maybe<string> }>
    }>
    bags: Array<{ id: string }>
  }>
  storageBags: Array<{
    id: string
    objects: Array<{ id: string }>
    storageBuckets: Array<{ id: string }>
    distributionBuckets: Array<{ id: string }>
    owner:
      | { __typename: 'StorageBagOwnerChannel'; channelId?: Types.Maybe<number> }
      | { __typename: 'StorageBagOwnerCouncil' }
      | { __typename: 'StorageBagOwnerDAO'; daoId?: Types.Maybe<number> }
      | { __typename: 'StorageBagOwnerMember'; memberId?: Types.Maybe<number> }
      | { __typename: 'StorageBagOwnerWorkingGroup'; workingGroupId?: Types.Maybe<string> }
  }>
  storageDataObjects: Array<{
    id: string
    createdAt: any
    isAccepted: boolean
    size: string
    ipfsHash: string
    stateBloatBond: string
    unsetAt?: Types.Maybe<any>
    storageBag: { id: string }
    type:
      | { __typename: 'DataObjectTypeChannelAvatar'; channel?: Types.Maybe<{ id: string }> }
      | { __typename: 'DataObjectTypeChannelCoverPhoto'; channel?: Types.Maybe<{ id: string }> }
      | { __typename: 'DataObjectTypeUnknown' }
      | { __typename: 'DataObjectTypeVideoMedia'; video?: Types.Maybe<{ id: string }> }
      | {
          __typename: 'DataObjectTypeVideoSubtitle'
          subtitle?: Types.Maybe<{ id: string }>
          video?: Types.Maybe<{ id: string }>
        }
      | { __typename: 'DataObjectTypeVideoThumbnail'; video?: Types.Maybe<{ id: string }> }
  }>
  distributionBucketFamilies: Array<{
    id: string
    metadata?: Types.Maybe<{
      region?: Types.Maybe<string>
      description?: Types.Maybe<string>
      latencyTestTargets?: Types.Maybe<Array<string>>
      areas: Array<{
        area:
          | {
              __typename: 'GeographicalAreaContinent'
              continentCode?: Types.Maybe<Types.Continent>
            }
          | { __typename: 'GeographicalAreaCountry'; countryCode?: Types.Maybe<string> }
          | { __typename: 'GeographicalAreaSubdivistion'; subdivisionCode?: Types.Maybe<string> }
      }>
    }>
    buckets: Array<{ id: string }>
  }>
  distributionBuckets: Array<{
    id: string
    bucketIndex: number
    acceptingNewBags: boolean
    distributing: boolean
    family: { id: string }
    operators: Array<{ id: string }>
    bags: Array<{ id: string }>
  }>
  distributionBucketOperators: Array<{
    id: string
    workerId: number
    status: Types.DistributionBucketOperatorStatus
    distributionBucket: { id: string }
    metadata?: Types.Maybe<{
      nodeEndpoint?: Types.Maybe<string>
      extra?: Types.Maybe<string>
      nodeLocation?: Types.Maybe<{ countryCode?: Types.Maybe<string>; city?: Types.Maybe<string> }>
    }>
  }>
  commentReactions: Array<{
    id: string
    reactionId: number
    member: { id: string }
    comment: { id: string }
    video: { id: string }
  }>
  comments: Array<{
    id: string
    createdAt: any
    text: string
    status: Types.CommentStatus
    repliesCount: number
    reactionsCount: number
    reactionsAndRepliesCount: number
    isEdited: boolean
    author: { id: string }
    video: { id: string }
    reactions: Array<{ id: string }>
    reactionsCountByReactionId: Array<{ reactionId: number; count: number }>
    parentComment?: Types.Maybe<{ id: string }>
  }>
  videoCategories: Array<{
    id: string
    name?: Types.Maybe<string>
    description?: Types.Maybe<string>
    createdInBlock: number
    parentCategory?: Types.Maybe<{ id: string }>
    videos: Array<{ id: string }>
  }>
  videos: Array<{
    id: string
    createdAt: any
    title?: Types.Maybe<string>
    description?: Types.Maybe<string>
    duration?: Types.Maybe<number>
    hasMarketing?: Types.Maybe<boolean>
    publishedBeforeJoystream?: Types.Maybe<any>
    isPublic?: Types.Maybe<boolean>
    isCensored: boolean
    isExplicit?: Types.Maybe<boolean>
    videoStateBloatBond: string
    createdInBlock: number
    isCommentSectionEnabled: boolean
    commentsCount: number
    isReactionFeatureEnabled: boolean
    reactionsCount: number
    channel: { id: string }
    thumbnailPhoto?: Types.Maybe<{ id: string }>
    language?: Types.Maybe<{ iso: string }>
    nft?: Types.Maybe<{ id: string }>
    license?: Types.Maybe<{
      id: string
      code?: Types.Maybe<number>
      attribution?: Types.Maybe<string>
      customText?: Types.Maybe<string>
    }>
    media?: Types.Maybe<{ id: string }>
    mediaMetadata?: Types.Maybe<{
      id: string
      pixelWidth?: Types.Maybe<number>
      pixelHeight?: Types.Maybe<number>
      size?: Types.Maybe<string>
      createdInBlock: number
      encoding?: Types.Maybe<{
        id: string
        codecName?: Types.Maybe<string>
        container?: Types.Maybe<string>
        mimeMediaType?: Types.Maybe<string>
      }>
    }>
    subtitles: Array<{ id: string }>
    comments: Array<{ id: string }>
    reactions: Array<{ id: string }>
    reactionsCountByReactionId: Array<{ reaction: Types.VideoReactionOptions; count: number }>
  }>
  videoSubtitles: Array<{
    id: string
    type: string
    mimeType: string
    video: { id: string }
    language?: Types.Maybe<{ iso: string }>
    asset?: Types.Maybe<{ id: string }>
  }>
  videoReactions: Array<{
    id: string
    createdAt: any
    reaction: Types.VideoReactionOptions
    member: { id: string }
    video: { id: string }
  }>
}

export const ActorFields = gql`
  fragment ActorFields on ContentActor {
    __typename
    ... on ContentActorCurator {
      curator {
        id
      }
    }
    ... on ContentActorMember {
      member {
        id
      }
    }
  }
`
export const AuctionTypeFields = gql`
  fragment AuctionTypeFields on AuctionType {
    __typename
    ... on AuctionTypeEnglish {
      duration
      extensionPeriod
      plannedEndAtBlock
      minimalBidStep
    }
    ... on AuctionTypeOpen {
      bidLockDuration
    }
  }
`
export const StateQueryV1 = gql`
  query StateQueryV1 {
    channels(limit: 9999) {
      id
      createdAt
      ownerMember {
        id
      }
      title
      description
      coverPhoto {
        id
      }
      avatarPhoto {
        id
      }
      isPublic
      isCensored
      language {
        iso
      }
      videos {
        id
      }
      createdInBlock
      rewardAccount
      channelStateBloatBond
      bannedMembers {
        id
      }
    }
    commentCreatedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      comment {
        id
      }
      text
    }
    commentTextUpdatedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      comment {
        id
      }
      newText
    }
    openAuctionStartedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      actor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      auction {
        id
      }
    }
    englishAuctionStartedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      actor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      auction {
        id
      }
    }
    nftIssuedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      contentActor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
    }
    auctionBidMadeEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      bidAmount
      previousTopBid {
        id
      }
      previousTopBidder {
        id
      }
    }
    auctionBidCanceledEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      member {
        id
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
    }
    auctionCanceledEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      contentActor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
    }
    englishAuctionSettledEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      winningBid {
        id
      }
      winner {
        id
      }
      video {
        id
      }
    }
    bidMadeCompletingAuctionEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      winningBid {
        id
      }
      video {
        id
      }
    }
    openAuctionBidAcceptedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      contentActor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      winningBid {
        id
      }
      video {
        id
      }
    }
    nftSellOrderMadeEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      contentActor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
      price
    }
    nftBoughtEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      member {
        id
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
      price
    }
    buyNowCanceledEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      contentActor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
    }
    buyNowPriceUpdatedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      contentActor {
        ...ActorFields
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      video {
        id
      }
      newPrice
    }
    metaprotocolTransactionStatusEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      status {
        __typename
        ... on MetaprotocolTransactionSuccessful {
          commentCreated {
            id
          }
          commentEdited {
            id
          }
          commentDeleted {
            id
          }
          commentModerated {
            id
          }
          videoCategoryCreated {
            id
          }
          videoCategoryUpdated {
            id
          }
          videoCategoryDeleted {
            id
          }
        }
        ... on MetaprotocolTransactionErrored {
          message
        }
      }
    }
    memberships(limit: 9999) {
      id
      createdAt
      handle
      metadata {
        name
        avatar {
          __typename
          ... on AvatarUri {
            avatarUri
          }
        }
        about
      }
      controllerAccount
      whitelistedInAuctions {
        id
      }
      channels {
        id
      }
      memberBannedFromChannels {
        id
      }
    }
    ownedNfts(limit: 9999) {
      id
      createdAt
      video {
        id
        channel {
          id
        }
      }
      auctions {
        id
      }
      ownerMember {
        id
      }
      ownerCuratorGroup {
        id
      }
      transactionalStatus {
        __typename
        ... on TransactionalStatusInitiatedOfferToMember {
          memberId
          offerPrice: price
        }
        ... on TransactionalStatusBuyNow {
          buyNowPrice: price
        }
      }
      transactionalStatusAuction {
        id
      }
      creatorRoyalty
      lastSalePrice
      lastSaleDate
      bids {
        id
      }
    }
    auctions(limit: 9999) {
      id
      nft {
        id
      }
      winningMember {
        id
      }
      startingPrice
      buyNowPrice
      auctionType {
        ...AuctionTypeFields
      }
      topBid {
        id
        isCanceled
      }
      bids {
        id
      }
      startsAtBlock
      endedAtBlock
      isCanceled
      isCompleted
      whitelistedMembers {
        id
      }
    }
    bids(limit: 9999) {
      id
      createdAt
      auction {
        id
      }
      nft {
        id
      }
      bidder {
        id
      }
      amount
      isCanceled
      createdInBlock
      indexInBlock
    }
    storageBuckets(limit: 9999) {
      id
      operatorStatus {
        __typename
        ... on StorageBucketOperatorStatusInvited {
          workerId
        }
        ... on StorageBucketOperatorStatusActive {
          workerId
        }
      }
      operatorMetadata {
        nodeEndpoint
        nodeLocation {
          countryCode
          city
        }
        extra
      }
      acceptingNewBags
      bags {
        id
      }
      dataObjectsSizeLimit
      dataObjectCountLimit
      dataObjectsCount
      dataObjectsSize
    }
    storageBags(limit: 9999) {
      id
      objects {
        id
      }
      storageBuckets {
        id
      }
      distributionBuckets {
        id
      }
      owner {
        __typename
        ... on StorageBagOwnerWorkingGroup {
          workingGroupId
        }
        ... on StorageBagOwnerMember {
          memberId
        }
        ... on StorageBagOwnerChannel {
          channelId
        }
        ... on StorageBagOwnerDAO {
          daoId
        }
      }
    }
    storageDataObjects(limit: 9999) {
      id
      createdAt
      isAccepted
      size
      storageBag {
        id
      }
      ipfsHash
      type {
        __typename
        ... on DataObjectTypeChannelAvatar {
          channel {
            id
          }
        }
        ... on DataObjectTypeChannelCoverPhoto {
          channel {
            id
          }
        }
        ... on DataObjectTypeVideoMedia {
          video {
            id
          }
        }
        ... on DataObjectTypeVideoThumbnail {
          video {
            id
          }
        }
        ... on DataObjectTypeVideoSubtitle {
          subtitle {
            id
          }
          video {
            id
          }
        }
      }
      stateBloatBond
      unsetAt
    }
    distributionBucketFamilies(limit: 9999) {
      id
      metadata {
        region
        description
        areas {
          area {
            __typename
            ... on GeographicalAreaContinent {
              continentCode: code
            }
            ... on GeographicalAreaCountry {
              countryCode: code
            }
            ... on GeographicalAreaSubdivistion {
              subdivisionCode: code
            }
          }
        }
        latencyTestTargets
      }
      buckets {
        id
      }
    }
    distributionBuckets(limit: 9999) {
      id
      family {
        id
      }
      bucketIndex
      operators {
        id
      }
      acceptingNewBags
      distributing
      bags {
        id
      }
    }
    distributionBucketOperators(limit: 9999) {
      id
      distributionBucket {
        id
      }
      workerId
      status
      metadata {
        nodeEndpoint
        nodeLocation {
          countryCode
          city
        }
        extra
      }
    }
    commentReactions(limit: 9999) {
      id
      reactionId
      member {
        id
      }
      comment {
        id
      }
      video {
        id
      }
    }
    comments(limit: 9999) {
      id
      createdAt
      author {
        id
      }
      text
      video {
        id
      }
      status
      reactions {
        id
      }
      reactionsCountByReactionId {
        reactionId
        count
      }
      parentComment {
        id
      }
      repliesCount
      reactionsCount
      reactionsAndRepliesCount
      isEdited
    }
    videoCategories(limit: 9999, where: { name_contains: "" }) {
      id
      name
      description
      parentCategory {
        id
      }
      videos {
        id
      }
      createdInBlock
    }
    videos(limit: 9999) {
      id
      createdAt
      channel {
        id
      }
      title
      description
      duration
      thumbnailPhoto {
        id
      }
      language {
        iso
      }
      hasMarketing
      publishedBeforeJoystream
      isPublic
      isCensored
      nft {
        id
      }
      isExplicit
      license {
        id
        code
        attribution
        customText
      }
      media {
        id
      }
      videoStateBloatBond
      mediaMetadata {
        id
        encoding {
          id
          codecName
          container
          mimeMediaType
        }
        pixelWidth
        pixelHeight
        size
        createdInBlock
      }
      createdInBlock
      subtitles {
        id
      }
      isCommentSectionEnabled
      comments {
        id
      }
      commentsCount
      isReactionFeatureEnabled
      reactions {
        id
      }
      reactionsCountByReactionId {
        reaction
        count
      }
      reactionsCount
    }
    videoSubtitles(limit: 9999) {
      id
      video {
        id
      }
      type
      language {
        iso
      }
      mimeType
      asset {
        id
      }
    }
    videoReactions(limit: 9999) {
      id
      createdAt
      reaction
      member {
        id
      }
      video {
        id
      }
    }
  }
  ${ActorFields}
  ${AuctionTypeFields}
`
