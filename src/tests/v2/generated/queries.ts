import * as Types from './schema'

import gql from 'graphql-tag'
type ActorFields_ContentActorCurator_Fragment = {
  __typename: 'ContentActorCurator'
  curator: { id: string }
}

type ActorFields_ContentActorLead_Fragment = { __typename: 'ContentActorLead' }

type ActorFields_ContentActorMember_Fragment = {
  __typename: 'ContentActorMember'
  member: { id: string }
}

export type ActorFieldsFragment =
  | ActorFields_ContentActorCurator_Fragment
  | ActorFields_ContentActorLead_Fragment
  | ActorFields_ContentActorMember_Fragment

type NftOwnerFields_NftOwnerChannel_Fragment = {
  __typename: 'NftOwnerChannel'
  channel: { id: string; ownerMember?: Types.Maybe<{ id: string }> }
}

type NftOwnerFields_NftOwnerMember_Fragment = {
  __typename: 'NftOwnerMember'
  member: { id: string }
}

export type NftOwnerFieldsFragment =
  | NftOwnerFields_NftOwnerChannel_Fragment
  | NftOwnerFields_NftOwnerMember_Fragment

type TransactionalStatusFields_TransactionalStatusAuction_Fragment = {
  __typename: 'TransactionalStatusAuction'
  auction: { id: string }
}

type TransactionalStatusFields_TransactionalStatusBuyNow_Fragment = {
  __typename: 'TransactionalStatusBuyNow'
  buyNowPrice: string
}

type TransactionalStatusFields_TransactionalStatusIdle_Fragment = {
  __typename: 'TransactionalStatusIdle'
}

type TransactionalStatusFields_TransactionalStatusInitiatedOfferToMember_Fragment = {
  __typename: 'TransactionalStatusInitiatedOfferToMember'
  offerPrice?: Types.Maybe<string>
  member: { id: string }
}

export type TransactionalStatusFieldsFragment =
  | TransactionalStatusFields_TransactionalStatusAuction_Fragment
  | TransactionalStatusFields_TransactionalStatusBuyNow_Fragment
  | TransactionalStatusFields_TransactionalStatusIdle_Fragment
  | TransactionalStatusFields_TransactionalStatusInitiatedOfferToMember_Fragment

type AuctionTypeFields_AuctionTypeEnglish_Fragment = {
  __typename: 'AuctionTypeEnglish'
  duration: number
  extensionPeriod: number
  plannedEndAtBlock: number
  minimalBidStep: string
}

type AuctionTypeFields_AuctionTypeOpen_Fragment = {
  __typename: 'AuctionTypeOpen'
  bidLockDuration: number
}

export type AuctionTypeFieldsFragment =
  | AuctionTypeFields_AuctionTypeEnglish_Fragment
  | AuctionTypeFields_AuctionTypeOpen_Fragment

export type AuctionRefFieldsFragment = { id: string; nft: { id: string } }

export type BidRefFieldsFragment = {
  id: string
  amount: string
  bidder: { id: string }
  previousTopBid?: Types.Maybe<{ id: string; bidder: { id: string } }>
  auction: AuctionRefFieldsFragment
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment = {
  __typename: 'MetaprotocolTransactionResultChannelPaid'
  channelPaid?: Types.Maybe<{ id: string }>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentCreated'
  commentCreated?: Types.Maybe<{ id: string }>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentDeleted'
  commentDeleted?: Types.Maybe<{ id: string }>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentEdited'
  commentEdited?: Types.Maybe<{ id: string }>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentModerated'
  commentModerated?: Types.Maybe<{ id: string }>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment = {
  __typename: 'MetaprotocolTransactionResultFailed'
  errorMessage: string
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment = {
  __typename: 'MetaprotocolTransactionResultOK'
}

export type MetaprotocolTransactionResultFieldsFragment =
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment

export type EventFieldsFragment = {
  id: string
  inBlock: number
  inExtrinsic?: Types.Maybe<string>
  indexInBlock: number
  createdAt: any
  data:
    | {
        member: { id: string }
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
        bid: BidRefFieldsFragment
      }
    | {
        bid: BidRefFieldsFragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        contentActor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
        auction: AuctionRefFieldsFragment
      }
    | {
        winningBid: BidRefFieldsFragment
        previousNftOwner:
          | NftOwnerFields_NftOwnerChannel_Fragment
          | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        nft: { id: string }
        contentActor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        newPrice: string
        nft: { id: string }
        contentActor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
      }
    | { text: string; comment: { id: string } }
    | { newText: string; comment: { id: string } }
    | {
        winningBid: BidRefFieldsFragment
        previousNftOwner:
          | NftOwnerFields_NftOwnerChannel_Fragment
          | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        actor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
        auction: { id: string }
      }
    | {
        result:
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment
          | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment
      }
    | {
        price: string
        nft: { id: string }
        member: { id: string }
        previousNftOwner:
          | NftOwnerFields_NftOwnerChannel_Fragment
          | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        contentActor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
        nft: { id: string }
      }
    | {
        price: string
        nft: { id: string }
        contentActor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        contentActor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        winningBid: BidRefFieldsFragment
        previousNftOwner:
          | NftOwnerFields_NftOwnerChannel_Fragment
          | NftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        actor:
          | ActorFields_ContentActorCurator_Fragment
          | ActorFields_ContentActorLead_Fragment
          | ActorFields_ContentActorMember_Fragment
        nftOwner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
        auction: AuctionRefFieldsFragment
      }
}

export type StateQueryV2QueryVariables = Types.Exact<{ [key: string]: never }>

export type StateQueryV2Query = {
  channels: Array<{
    id: string
    createdAt: any
    title?: Types.Maybe<string>
    description?: Types.Maybe<string>
    isPublic?: Types.Maybe<boolean>
    isCensored: boolean
    language?: Types.Maybe<string>
    createdInBlock: number
    rewardAccount: string
    channelStateBloatBond: string
    ownerMember?: Types.Maybe<{ id: string }>
    coverPhoto?: Types.Maybe<{ id: string }>
    avatarPhoto?: Types.Maybe<{ id: string }>
    videos: Array<{ id: string }>
    bannedMembers: Array<{ member: { id: string } }>
  }>
  commentCreatedEvents: Array<EventFieldsFragment>
  commentTextUpdatedEvents: Array<EventFieldsFragment>
  openAuctionStartedEvents: Array<EventFieldsFragment>
  englishAuctionStartedEvents: Array<EventFieldsFragment>
  nftIssuedEvents: Array<EventFieldsFragment>
  auctionBidMadeEvents: Array<EventFieldsFragment>
  auctionBidCanceledEvents: Array<EventFieldsFragment>
  auctionCanceledEvents: Array<EventFieldsFragment>
  englishAuctionSettledEvents: Array<EventFieldsFragment>
  bidMadeCompletingAuctionEvents: Array<EventFieldsFragment>
  openAuctionBidAcceptedEvents: Array<EventFieldsFragment>
  nftSellOrderMadeEvents: Array<EventFieldsFragment>
  nftBoughtEvents: Array<EventFieldsFragment>
  buyNowCanceledEvents: Array<EventFieldsFragment>
  buyNowPriceUpdatedEvents: Array<EventFieldsFragment>
  metaprotocolTransactionStatusEvents: Array<EventFieldsFragment>
  memberships: Array<{
    id: string
    createdAt: any
    handle: string
    controllerAccount: string
    metadata?: Types.Maybe<{
      name?: Types.Maybe<string>
      about?: Types.Maybe<string>
      avatar?: Types.Maybe<
        { __typename: 'AvatarObject' } | { __typename: 'AvatarUri'; avatarUri: string }
      >
    }>
    whitelistedInAuctions: Array<{ auction: { id: string } }>
    channels: Array<{ id: string }>
    memberBannedFromChannels: Array<{ channel: { id: string } }>
  }>
  ownedNfts: Array<{
    id: string
    createdAt: any
    creatorRoyalty?: Types.Maybe<number>
    lastSalePrice?: Types.Maybe<string>
    lastSaleDate?: Types.Maybe<any>
    video: { id: string; channel: { id: string } }
    auctions: Array<{ id: string }>
    owner: NftOwnerFields_NftOwnerChannel_Fragment | NftOwnerFields_NftOwnerMember_Fragment
    transactionalStatus?: Types.Maybe<
      | TransactionalStatusFields_TransactionalStatusAuction_Fragment
      | TransactionalStatusFields_TransactionalStatusBuyNow_Fragment
      | TransactionalStatusFields_TransactionalStatusIdle_Fragment
      | TransactionalStatusFields_TransactionalStatusInitiatedOfferToMember_Fragment
    >
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
    topBid?: Types.Maybe<{ id: string }>
    bids: Array<{ id: string }>
    whitelistedMembers: Array<{ member: { id: string } }>
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
    bags: Array<{ bag: { id: string } }>
  }>
  storageBags: Array<{
    id: string
    objects: Array<{ id: string }>
    storageBuckets: Array<{ storageBucket: { id: string } }>
    distributionBuckets: Array<{ distributionBucket: { id: string } }>
    owner:
      | { __typename: 'StorageBagOwnerChannel'; channelId: string }
      | { __typename: 'StorageBagOwnerCouncil' }
      | { __typename: 'StorageBagOwnerDAO'; daoId?: Types.Maybe<number> }
      | { __typename: 'StorageBagOwnerMember'; memberId: string }
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
    type?: Types.Maybe<
      | { __typename: 'DataObjectTypeChannelAvatar'; channel: { id: string } }
      | { __typename: 'DataObjectTypeChannelCoverPhoto'; channel: { id: string } }
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia'; video: { id: string } }
      | {
          __typename: 'DataObjectTypeVideoSubtitle'
          subtitle: { id: string }
          video: { id: string }
        }
      | { __typename: 'DataObjectTypeVideoThumbnail'; video: { id: string } }
    >
  }>
  distributionBucketFamilies: Array<{
    id: string
    metadata?: Types.Maybe<{
      region?: Types.Maybe<string>
      description?: Types.Maybe<string>
      latencyTestTargets?: Types.Maybe<Array<Types.Maybe<string>>>
      areas?: Types.Maybe<
        Array<
          | {
              __typename: 'GeographicalAreaContinent'
              continentCode?: Types.Maybe<Types.Continent>
            }
          | { __typename: 'GeographicalAreaCountry'; countryCode?: Types.Maybe<string> }
          | { __typename: 'GeographicalAreaSubdivistion'; subdivisionCode?: Types.Maybe<string> }
        >
      >
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
    bags: Array<{ bag: { id: string } }>
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
    reactionsCountByReactionId?: Types.Maybe<Array<{ reactionId: number; count: number }>>
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
    language?: Types.Maybe<string>
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
    reactionsCountByReactionId?: Types.Maybe<
      Array<{ reaction: Types.VideoReactionOptions; count: number }>
    >
  }>
  videoSubtitles: Array<{
    id: string
    type: string
    language?: Types.Maybe<string>
    mimeType: string
    video: { id: string }
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

export const TransactionalStatusFields = gql`
  fragment TransactionalStatusFields on TransactionalStatus {
    __typename
    ... on TransactionalStatusInitiatedOfferToMember {
      member {
        id
      }
      offerPrice: price
    }
    ... on TransactionalStatusBuyNow {
      buyNowPrice: price
    }
    ... on TransactionalStatusAuction {
      auction {
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
export const NftOwnerFields = gql`
  fragment NftOwnerFields on NftOwner {
    __typename
    ... on NftOwnerMember {
      member {
        id
      }
    }
    ... on NftOwnerChannel {
      channel {
        id
        ownerMember {
          id
        }
      }
    }
  }
`
export const AuctionRefFields = gql`
  fragment AuctionRefFields on Auction {
    id
    nft {
      id
    }
  }
`
export const BidRefFields = gql`
  fragment BidRefFields on Bid {
    id
    amount
    bidder {
      id
    }
    previousTopBid {
      id
      bidder {
        id
      }
    }
    auction {
      ...AuctionRefFields
    }
  }
  ${AuctionRefFields}
`
export const MetaprotocolTransactionResultFields = gql`
  fragment MetaprotocolTransactionResultFields on MetaprotocolTransactionResult {
    __typename
    ... on MetaprotocolTransactionResultFailed {
      errorMessage
    }
    ... on MetaprotocolTransactionResultCommentCreated {
      commentCreated {
        id
      }
    }
    ... on MetaprotocolTransactionResultCommentEdited {
      commentEdited {
        id
      }
    }
    ... on MetaprotocolTransactionResultChannelPaid {
      channelPaid {
        id
      }
    }
    ... on MetaprotocolTransactionResultCommentModerated {
      commentModerated {
        id
      }
    }
    ... on MetaprotocolTransactionResultCommentDeleted {
      commentDeleted {
        id
      }
    }
  }
`
export const EventFields = gql`
  fragment EventFields on Event {
    id
    inBlock
    inExtrinsic
    indexInBlock
    createdAt: timestamp
    data {
      ... on CommentCreatedEventData {
        comment {
          id
        }
        text
      }
      ... on CommentTextUpdatedEventData {
        comment {
          id
        }
        newText
      }
      ... on OpenAuctionStartedEventData {
        actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
        auction {
          ...AuctionRefFields
        }
      }
      ... on EnglishAuctionStartedEventData {
        actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
        auction {
          id
        }
      }
      ... on NftIssuedEventData {
        contentActor: actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
        nft {
          id
        }
      }
      ... on AuctionBidMadeEventData {
        bid {
          ...BidRefFields
        }
        nftOwner {
          ...NftOwnerFields
        }
      }
      ... on AuctionBidCanceledEventData {
        member {
          id
        }
        nftOwner {
          ...NftOwnerFields
        }
        bid {
          ...BidRefFields
        }
      }
      ... on AuctionCanceledEventData {
        contentActor: actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
        auction {
          ...AuctionRefFields
        }
      }
      ... on EnglishAuctionSettledEventData {
        winningBid {
          ...BidRefFields
        }
        previousNftOwner {
          ...NftOwnerFields
        }
      }
      ... on BidMadeCompletingAuctionEventData {
        winningBid {
          ...BidRefFields
        }
        previousNftOwner {
          ...NftOwnerFields
        }
      }
      ... on OpenAuctionBidAcceptedEventData {
        contentActor: actor {
          ...ActorFields
        }
        winningBid {
          ...BidRefFields
        }
        previousNftOwner {
          ...NftOwnerFields
        }
      }
      ... on NftSellOrderMadeEventData {
        nft {
          id
        }
        contentActor: actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
        price
      }
      ... on NftBoughtEventData {
        nft {
          id
        }
        member: buyer {
          id
        }
        previousNftOwner {
          ...NftOwnerFields
        }
        price
      }
      ... on BuyNowCanceledEventData {
        nft {
          id
        }
        contentActor: actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
      }
      ... on BuyNowPriceUpdatedEventData {
        nft {
          id
        }
        contentActor: actor {
          ...ActorFields
        }
        nftOwner {
          ...NftOwnerFields
        }
        newPrice
      }
      ... on MetaprotocolTransactionStatusEventData {
        result {
          ...MetaprotocolTransactionResultFields
        }
      }
    }
  }
  ${ActorFields}
  ${NftOwnerFields}
  ${AuctionRefFields}
  ${BidRefFields}
  ${MetaprotocolTransactionResultFields}
`
export const StateQueryV2 = gql`
  query StateQueryV2 {
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
      language
      videos {
        id
      }
      createdInBlock
      rewardAccount
      channelStateBloatBond
      bannedMembers {
        member {
          id
        }
      }
    }
    commentCreatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "CommentCreatedEventData" } }
    ) {
      ...EventFields
    }
    commentTextUpdatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "CommentTextUpdatedEventData" } }
    ) {
      ...EventFields
    }
    openAuctionStartedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "OpenAuctionStartedEventData" } }
    ) {
      ...EventFields
    }
    englishAuctionStartedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "EnglishAuctionStartedEventData" } }
    ) {
      ...EventFields
    }
    nftIssuedEvents: events(limit: 9999, where: { data: { isTypeOf_eq: "NftIssuedEventData" } }) {
      ...EventFields
    }
    auctionBidMadeEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "AuctionBidMadeEventData" } }
    ) {
      ...EventFields
    }
    auctionBidCanceledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "AuctionBidCanceledEventData" } }
    ) {
      ...EventFields
    }
    auctionCanceledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "AuctionCanceledEventData" } }
    ) {
      ...EventFields
    }
    englishAuctionSettledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "EnglishAuctionSettledEventData" } }
    ) {
      ...EventFields
    }
    bidMadeCompletingAuctionEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "BidMadeCompletingAuctionEventData" } }
    ) {
      ...EventFields
    }
    openAuctionBidAcceptedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "OpenAuctionBidAcceptedEventData" } }
    ) {
      ...EventFields
    }
    nftSellOrderMadeEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "NftSellOrderMadeEventData" } }
    ) {
      ...EventFields
    }
    nftBoughtEvents: events(limit: 9999, where: { data: { isTypeOf_eq: "NftBoughtEventData" } }) {
      ...EventFields
    }
    buyNowCanceledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "BuyNowCanceledEventData" } }
    ) {
      ...EventFields
    }
    buyNowPriceUpdatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "BuyNowPriceUpdatedEventData" } }
    ) {
      ...EventFields
    }
    metaprotocolTransactionStatusEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "MetaprotocolTransactionStatusEventData" } }
    ) {
      ...EventFields
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
        auction {
          id
        }
      }
      channels {
        id
      }
      memberBannedFromChannels: bannedFromChannels {
        channel {
          id
        }
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
      owner {
        ...NftOwnerFields
      }
      transactionalStatus {
        ...TransactionalStatusFields
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
      }
      bids {
        id
      }
      startsAtBlock
      endedAtBlock
      isCanceled
      isCompleted
      whitelistedMembers {
        member {
          id
        }
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
        bag {
          id
        }
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
        storageBucket {
          id
        }
      }
      distributionBuckets {
        distributionBucket {
          id
        }
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
          __typename
          ... on GeographicalAreaContinent {
            continentCode
          }
          ... on GeographicalAreaCountry {
            countryCode
          }
          ... on GeographicalAreaSubdivistion {
            subdivisionCode
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
        bag {
          id
        }
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
    videoCategories(limit: 9999) {
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
      language
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
      language
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
  ${EventFields}
  ${NftOwnerFields}
  ${TransactionalStatusFields}
  ${AuctionTypeFields}
`
