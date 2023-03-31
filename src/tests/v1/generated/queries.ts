import * as Types from './schema'

import gql from 'graphql-tag'
export type GetKillSwitchQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetKillSwitchQuery = { admin: { isKilled: boolean } }

export type SetKillSwitchMutationVariables = Types.Exact<{
  isKilled: Types.Scalars['Boolean']
}>

export type SetKillSwitchMutation = { setKillSwitch: { isKilled: boolean } }

export type GetBidsQueryVariables = Types.Exact<{
  where: Types.BidWhereInput
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetBidsQuery = { bids: Array<FullBidFieldsFragment> }

export type GetVideoCategoriesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoCategoriesQuery = { videoCategories: Array<VideoCategoryFieldsFragment> }

export type GetBasicChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetBasicChannelQuery = {
  channelByUniqueInput?: Types.Maybe<BasicChannelFieldsFragment>
}

export type GetFullChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetFullChannelQuery = { channelByUniqueInput?: Types.Maybe<FullChannelFieldsFragment> }

export type GetVideoCountQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetVideoCountQuery = { videosConnection: { totalCount: number } }

export type GetBasicChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetBasicChannelsQuery = { channels: Array<BasicChannelFieldsFragment> }

export type GetFullChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetFullChannelsQuery = { channels: Array<FullChannelFieldsFragment> }

export type GetBasicChannelsConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  where?: Types.Maybe<Types.ChannelWhereInput>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetBasicChannelsConnectionQuery = {
  channelsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: BasicChannelFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type FollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type FollowChannelMutation = { followChannel: { id: string; follows: number } }

export type UnfollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type UnfollowChannelMutation = { unfollowChannel: { id: string; follows: number } }

export type GetMostViewedChannelsConnectionQueryVariables = Types.Exact<{
  limit?: Types.Maybe<Types.Scalars['Int']>
  periodDays?: Types.Maybe<Types.Scalars['Int']>
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetMostViewedChannelsConnectionQuery = {
  mostViewedChannelsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: BasicChannelFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetMostFollowedChannelsConnectionQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']
  periodDays?: Types.Maybe<Types.Scalars['Int']>
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetMostFollowedChannelsConnectionQuery = {
  mostFollowedChannelsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: BasicChannelFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetTop10ChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetTop10ChannelsQuery = { top10Channels: Array<BasicChannelFieldsFragment> }

export type GetPromisingChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetPromisingChannelsQuery = { promisingChannels: Array<BasicChannelFieldsFragment> }

export type GetDiscoverChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetDiscoverChannelsQuery = { discoverChannels: Array<BasicChannelFieldsFragment> }

export type GetPopularChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetPopularChannelsQuery = { popularChannels: Array<BasicChannelFieldsFragment> }

export type GetChannelNftCollectorsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelNftCollectorsWhereInput>
  orderBy?: Types.Maybe<
    Array<Types.ChannelNftCollectorsOrderByInput> | Types.ChannelNftCollectorsOrderByInput
  >
}>

export type GetChannelNftCollectorsQuery = {
  channelNftCollectors: Array<{
    id: string
    amount: number
    member?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
}

export type ReportChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
  rationale: Types.Scalars['String']
}>

export type ReportChannelMutation = { reportChannel: { id: string; channelId: string } }

export type GetChannelPaymentEventsQueryVariables = Types.Exact<{
  ownerMemberId: Types.Scalars['ID']
  channelId: Types.Scalars['ID']
}>

export type GetChannelPaymentEventsQuery = {
  nftBoughtEvents: Array<{ inBlock: number; createdAt: any; price: string }>
  bidMadeCompletingAuctionEvents: Array<{ inBlock: number; createdAt: any; price: string }>
  englishAuctionSettledEvents: Array<{
    createdAt: any
    inBlock: number
    winningBid: { amount: string }
  }>
  openAuctionBidAcceptedEvents: Array<{
    inBlock: number
    createdAt: any
    winningBid?: Types.Maybe<{ amount: string }>
  }>
}

export type GetCommentQueryVariables = Types.Exact<{
  commentId: Types.Scalars['ID']
}>

export type GetCommentQuery = { commentByUniqueInput?: Types.Maybe<CommentFieldsFragment> }

export type GetCommentRepliesConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  parentCommentId: Types.Scalars['ID']
  orderBy?: Types.Maybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetCommentRepliesConnectionQuery = {
  commentsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: CommentFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetUserCommentsAndVideoCommentsConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  memberId?: Types.Maybe<Types.Scalars['ID']>
  videoId?: Types.Maybe<Types.Scalars['ID']>
  orderBy?: Types.Maybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetUserCommentsAndVideoCommentsConnectionQuery = {
  userComments: Array<CommentFieldsFragment>
  videoCommentsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: CommentFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetUserCommentsReactionsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']
  videoId: Types.Scalars['ID']
}>

export type GetUserCommentsReactionsQuery = {
  commentReactions: Array<{ reactionId: number; commentId: string }>
}

export type GetCommentEditsQueryVariables = Types.Exact<{
  commentId: Types.Scalars['ID']
}>

export type GetCommentEditsQuery = {
  commentTextUpdatedEvents: Array<{ id: string; createdAt: any; newText: string }>
  commentCreatedEvents: Array<{ id: string; createdAt: any; text: string }>
}

export type GetDataObjectAvailabilityQueryVariables = Types.Exact<{
  id_eq?: Types.Maybe<Types.Scalars['ID']>
  id_in?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetDataObjectAvailabilityQuery = {
  storageDataObjects: Array<{ id: string; isAccepted: boolean }>
}

export type GetVideoHeroQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoHeroQuery = {
  videoHero: {
    videoId: string
    heroTitle: string
    heroVideoCutUrl: string
    heroPosterUrl: string
    video: BasicVideoFieldsFragment
  }
}

export type GetAllCategoriesFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetAllCategoriesFeaturedVideosQuery = {
  allCategoriesFeaturedVideos: Array<{
    categoryId: string
    category: { name?: Types.Maybe<string> }
    categoryFeaturedVideos: Array<{
      videoId: string
      videoCutUrl?: Types.Maybe<string>
      video: BasicVideoFieldsFragment
    }>
  }>
}

export type GetCategoriesFeaturedVideosQueryVariables = Types.Exact<{
  categoryId: Types.Scalars['ID']
}>

export type GetCategoriesFeaturedVideosQuery = {
  categoryFeaturedVideos: Array<{
    videoId: string
    videoCutUrl?: Types.Maybe<string>
    video: FullVideoFieldsFragment
  }>
}

export type VideoCategoryFieldsFragment = {
  id: string
  name?: Types.Maybe<string>
  activeVideosCounter: number
}

export type BasicChannelFieldsFragment = {
  id: string
  title?: Types.Maybe<string>
  description?: Types.Maybe<string>
  createdAt: any
  follows: number
  rewardAccount: string
  channelStateBloatBond: string
  avatarPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
}

export type FullChannelFieldsFragment = {
  views: number
  activeVideosCounter: number
  description?: Types.Maybe<string>
  isPublic?: Types.Maybe<boolean>
  isCensored: boolean
  language?: Types.Maybe<{ id: string; iso: string }>
  ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  coverPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
} & BasicChannelFieldsFragment

export type BasicMembershipFieldsFragment = {
  id: string
  handle: string
  metadata: {
    about?: Types.Maybe<string>
    avatar?: Types.Maybe<
      { avatarObject?: Types.Maybe<StorageDataObjectFieldsFragment> } | { avatarUri: string }
    >
  }
}

export type FullMembershipFieldsFragment = {
  controllerAccount: string
  createdAt: any
  channels: Array<
    {
      description?: Types.Maybe<string>
      coverPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
    } & BasicChannelFieldsFragment
  >
} & BasicMembershipFieldsFragment

export type StorageDataObjectFieldsFragment = {
  id: string
  createdAt: any
  size: string
  isAccepted: boolean
  ipfsHash: string
  storageBag: { id: string }
  type:
    | { __typename: 'DataObjectTypeChannelAvatar' }
    | { __typename: 'DataObjectTypeChannelCoverPhoto' }
    | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
    | { __typename: 'DataObjectTypeUnknown' }
    | { __typename: 'DataObjectTypeVideoMedia' }
    | { __typename: 'DataObjectTypeVideoSubtitle' }
    | { __typename: 'DataObjectTypeVideoThumbnail' }
}

export type DistributionBucketOperatorFieldFragment = {
  id: string
  status: Types.DistributionBucketOperatorStatus
  metadata?: Types.Maybe<{
    nodeEndpoint?: Types.Maybe<string>
    nodeLocation?: Types.Maybe<{
      coordinates?: Types.Maybe<{ latitude: number; longitude: number }>
    }>
  }>
}

export type VideoMediaMetadataFieldsFragment = {
  id: string
  pixelHeight?: Types.Maybe<number>
  pixelWidth?: Types.Maybe<number>
}

export type LicenseFieldsFragment = {
  id: string
  code?: Types.Maybe<number>
  attribution?: Types.Maybe<string>
  customText?: Types.Maybe<string>
}

export type SubtitlesFieldsFragment = {
  id: string
  mimeType: string
  type: string
  assetId?: Types.Maybe<string>
  language?: Types.Maybe<{ id: string; iso: string }>
  asset?: Types.Maybe<StorageDataObjectFieldsFragment>
}

export type BasicVideoFieldsFragment = {
  id: string
  title?: Types.Maybe<string>
  views: number
  createdAt: any
  duration?: Types.Maybe<number>
  reactionsCount: number
  commentsCount: number
  channel: BasicChannelFieldsFragment
  thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
  nft?: Types.Maybe<BasicNftFieldsFragment>
}

export type FullVideoFieldsFragment = {
  id: string
  title?: Types.Maybe<string>
  description?: Types.Maybe<string>
  reactionsCount: number
  views: number
  duration?: Types.Maybe<number>
  createdAt: any
  isPublic?: Types.Maybe<boolean>
  isExplicit?: Types.Maybe<boolean>
  hasMarketing?: Types.Maybe<boolean>
  isCensored: boolean
  isCommentSectionEnabled: boolean
  commentsCount: number
  publishedBeforeJoystream?: Types.Maybe<any>
  reactions: Array<{
    id: string
    createdAt: any
    reaction: Types.VideoReactionOptions
    memberId: string
  }>
  category?: Types.Maybe<{ id: string; name?: Types.Maybe<string> }>
  language?: Types.Maybe<{ iso: string }>
  mediaMetadata?: Types.Maybe<VideoMediaMetadataFieldsFragment>
  media?: Types.Maybe<StorageDataObjectFieldsFragment>
  thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
  channel: FullChannelFieldsFragment
  license?: Types.Maybe<LicenseFieldsFragment>
  nft?: Types.Maybe<BasicNftFieldsFragment>
  subtitles: Array<SubtitlesFieldsFragment>
}

export type BasicNftFieldsFragment = {
  id: string
  createdAt: any
  creatorRoyalty?: Types.Maybe<number>
  lastSaleDate?: Types.Maybe<any>
  lastSalePrice?: Types.Maybe<string>
  isOwnedByChannel: boolean
  ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  transactionalStatusAuction?: Types.Maybe<{
    id: string
    isCompleted: boolean
    buyNowPrice?: Types.Maybe<string>
    startingPrice: string
    startsAtBlock: number
    endedAtBlock?: Types.Maybe<number>
    auctionType:
      | {
          __typename: 'AuctionTypeEnglish'
          duration: number
          extensionPeriod: number
          minimalBidStep: string
          plannedEndAtBlock: number
        }
      | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
    initialOwner?: Types.Maybe<BasicMembershipFieldsFragment>
    topBid?: Types.Maybe<BasicBidFieldsFragment>
    bids: Array<BasicBidFieldsFragment>
    whitelistedMembers: Array<BasicMembershipFieldsFragment>
  }>
  transactionalStatus?: Types.Maybe<
    | { __typename: 'TransactionalStatusBuyNow'; price: string }
    | { __typename: 'TransactionalStatusIdle'; dummy?: Types.Maybe<number> }
    | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
  >
}

export type FullNftFieldsFragment = {
  creatorChannel: BasicChannelFieldsFragment
  video: BasicVideoFieldsFragment
} & BasicNftFieldsFragment

export type BasicBidFieldsFragment = {
  amount: string
  createdAt: any
  isCanceled: boolean
  createdInBlock: number
  id: string
  bidder: BasicMembershipFieldsFragment
}

export type FullBidFieldsFragment = {
  auction: {
    isCompleted: boolean
    winningMemberId?: Types.Maybe<string>
    id: string
    auctionType: { __typename: 'AuctionTypeEnglish' } | { __typename: 'AuctionTypeOpen' }
  }
} & BasicBidFieldsFragment

export type CommentReactionsCountByReactionIdFieldsFragment = {
  id: string
  count: number
  reactionId: number
}

export type CommentFieldsFragment = {
  id: string
  createdAt: any
  isEdited: boolean
  parentCommentId?: Types.Maybe<string>
  repliesCount: number
  text: string
  status: Types.CommentStatus
  author: BasicMembershipFieldsFragment
  reactionsCountByReactionId: Array<CommentReactionsCountByReactionIdFieldsFragment>
}

export type MetaprotocolTransactionSuccessFieldsFragment = {
  commentCreated?: Types.Maybe<CommentFieldsFragment>
  commentEdited?: Types.Maybe<CommentFieldsFragment>
  commentDeleted?: Types.Maybe<CommentFieldsFragment>
  commentModerated?: Types.Maybe<CommentFieldsFragment>
}

export type GetMembershipQueryVariables = Types.Exact<{
  where: Types.MembershipWhereUniqueInput
}>

export type GetMembershipQuery = {
  membershipByUniqueInput?: Types.Maybe<FullMembershipFieldsFragment>
}

export type GetMembershipsQueryVariables = Types.Exact<{
  where: Types.MembershipWhereInput
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetMembershipsQuery = { memberships: Array<FullMembershipFieldsFragment> }

export type GetNftQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type GetNftQuery = { ownedNftByUniqueInput?: Types.Maybe<FullNftFieldsFragment> }

export type GetNftsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.OwnedNftWhereInput>
  orderBy?: Types.Maybe<Array<Types.OwnedNftOrderByInput> | Types.OwnedNftOrderByInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetNftsQuery = { ownedNfts: Array<FullNftFieldsFragment> }

export type GetNftsConnectionQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.OwnedNftWhereInput>
  orderBy?: Types.Maybe<Array<Types.OwnedNftOrderByInput> | Types.OwnedNftOrderByInput>
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
}>

export type GetNftsConnectionQuery = {
  ownedNftsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: FullNftFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetNotificationsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
  memberId: Types.Scalars['ID']
  limit: Types.Scalars['Int']
}>

export type GetNotificationsQuery = {
  auctionBidMadeEvents: Array<{
    id: string
    createdAt: any
    inBlock: number
    bidAmount: string
    video: { id: string; title?: Types.Maybe<string> }
    member: BasicMembershipFieldsFragment
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    previousTopBidder?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  nftBoughtEvents: Array<{
    id: string
    createdAt: any
    inBlock: number
    price: string
    member: BasicMembershipFieldsFragment
    video: { id: string; title?: Types.Maybe<string> }
  }>
  bidMadeCompletingAuctionEvents: Array<{
    id: string
    createdAt: any
    inBlock: number
    price: string
    member: BasicMembershipFieldsFragment
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    video: { id: string; title?: Types.Maybe<string> }
  }>
  openAuctionBidAcceptedEvents: Array<{
    id: string
    createdAt: any
    inBlock: number
    video: { id: string; title?: Types.Maybe<string> }
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    winningBid?: Types.Maybe<{ amount: string }>
    winningBidder?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  englishAuctionSettledEvents: Array<{
    id: string
    createdAt: any
    inBlock: number
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    winner: BasicMembershipFieldsFragment
    video: { id: string; title?: Types.Maybe<string> }
  }>
  commentCreatedEvents: Array<{
    id: string
    inBlock: number
    createdAt: any
    video: { id: string; title?: Types.Maybe<string> }
    comment: {
      id: string
      parentComment?: Types.Maybe<{ id: string }>
      author: BasicMembershipFieldsFragment
    }
  }>
}

export type GetNftHistoryQueryVariables = Types.Exact<{
  nftId: Types.Scalars['ID']
}>

export type GetNftHistoryQuery = {
  nftIssuedEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  openAuctionStartedEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  englishAuctionStartedEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  nftSellOrderMadeEvents: Array<{
    id: string
    createdAt: any
    price: string
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  auctionBidMadeEvents: Array<{
    id: string
    createdAt: any
    bidAmount: string
    member: BasicMembershipFieldsFragment
  }>
  bidMadeCompletingAuctionEvents: Array<{
    id: string
    createdAt: any
    price: string
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    member: BasicMembershipFieldsFragment
  }>
  nftBoughtEvents: Array<{
    id: string
    createdAt: any
    price: string
    member: BasicMembershipFieldsFragment
  }>
  englishAuctionSettledEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    winner: BasicMembershipFieldsFragment
  }>
  openAuctionBidAcceptedEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
    winningBid?: Types.Maybe<{ amount: string; bidder: BasicMembershipFieldsFragment }>
  }>
  auctionBidCanceledEvents: Array<{
    id: string
    createdAt: any
    member: BasicMembershipFieldsFragment
  }>
  auctionCanceledEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  buyNowCanceledEvents: Array<{
    id: string
    createdAt: any
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
  buyNowPriceUpdatedEvents: Array<{
    id: string
    createdAt: any
    newPrice: string
    ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  }>
}

export type GetNftActivitiesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']
  limit: Types.Scalars['Int']
}>

export type GetNftActivitiesQuery = {
  auctionBidMadeEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        bidAmount: string
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        member: BasicMembershipFieldsFragment
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        previousTopBidder?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  purchaseEnglishAuctionSettledEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        winner: BasicMembershipFieldsFragment
        winningBid: { amount: string }
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
      }
    }>
  }
  purchaseNftBoughtEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        price: string
        member: BasicMembershipFieldsFragment
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
      }
    }>
  }
  purchaseBidMadeCompletingAuctionEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        price: string
        member: BasicMembershipFieldsFragment
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
      }
    }>
  }
  purchaseOpenAuctionBidAcceptedEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        winningBid?: Types.Maybe<{ amount: string; bidder: BasicMembershipFieldsFragment }>
      }
    }>
  }
  saleEnglishAuctionSettledEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        winner: BasicMembershipFieldsFragment
        winningBid: { amount: string }
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
      }
    }>
  }
  saleNftBoughtEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        price: string
        member: BasicMembershipFieldsFragment
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
      }
    }>
  }
  saleBidMadeCompletingAuctionEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        price: string
        member: BasicMembershipFieldsFragment
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
      }
    }>
  }
  saleOpenAuctionBidAcceptedEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
        winningBid?: Types.Maybe<{ amount: string; bidder: BasicMembershipFieldsFragment }>
      }
    }>
  }
  englishAuctionStartedEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  openAuctionStartedEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  nftSellOrderMadeEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        price: string
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  auctionBidCanceledEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        member: BasicMembershipFieldsFragment
      }
    }>
  }
  buyNowCanceledEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  auctionCanceledEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  buyNowPriceUpdatedEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        newPrice: string
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
  nftIssuedEventsConnection: {
    totalCount: number
    edges: Array<{
      node: {
        id: string
        createdAt: any
        inBlock: number
        video: {
          id: string
          title?: Types.Maybe<string>
          thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
        }
        ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
      }
    }>
  }
}

export type GetQueryNodeStateSubscriptionVariables = Types.Exact<{ [key: string]: never }>

export type GetQueryNodeStateSubscription = { stateSubscription: { lastCompleteBlock: number } }

export type GetDistributionBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetDistributionBucketsWithBagsQuery = {
  distributionBuckets: Array<{
    id: string
    bags: Array<{ id: string }>
    operators: Array<DistributionBucketOperatorFieldFragment>
  }>
}

export type GetStorageBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetStorageBucketsWithBagsQuery = {
  storageBuckets: Array<{
    id: string
    operatorMetadata?: Types.Maybe<{ nodeEndpoint?: Types.Maybe<string> }>
    bags: Array<{ id: string }>
  }>
}

export type GetBasicDistributionBucketsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetBasicDistributionBucketsQuery = {
  distributionBuckets: Array<{ id: string; bucketIndex: number; family: { id: string } }>
}

export type GetBasicStorageBucketsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetBasicStorageBucketsQuery = { storageBuckets: Array<{ id: string }> }

export type GetMetaprotocolTransactionStatusEventsQueryVariables = Types.Exact<{
  transactionHash: Types.Scalars['String']
}>

export type GetMetaprotocolTransactionStatusEventsQuery = {
  metaprotocolTransactionStatusEvents: Array<{
    inExtrinsic?: Types.Maybe<string>
    inBlock: number
    status:
      | { __typename: 'MetaprotocolTransactionErrored'; message: string }
      | ({
          __typename: 'MetaprotocolTransactionSuccessful'
        } & MetaprotocolTransactionSuccessFieldsFragment)
  }>
}

export type GetBasicVideoQueryVariables = Types.Exact<{
  where: Types.VideoWhereUniqueInput
}>

export type GetBasicVideoQuery = { videoByUniqueInput?: Types.Maybe<BasicVideoFieldsFragment> }

export type GetFullVideoQueryVariables = Types.Exact<{
  where: Types.VideoWhereUniqueInput
}>

export type GetFullVideoQuery = { videoByUniqueInput?: Types.Maybe<FullVideoFieldsFragment> }

export type GetBasicVideosConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  orderBy?: Types.Maybe<Array<Types.VideoOrderByInput> | Types.VideoOrderByInput>
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetBasicVideosConnectionQuery = {
  videosConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: BasicVideoFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetFullVideosConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  orderBy?: Types.Maybe<Array<Types.VideoOrderByInput> | Types.VideoOrderByInput>
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetFullVideosConnectionQuery = {
  videosConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: FullVideoFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetBasicVideosQueryVariables = Types.Exact<{
  offset?: Types.Maybe<Types.Scalars['Int']>
  limit?: Types.Maybe<Types.Scalars['Int']>
  where?: Types.Maybe<Types.VideoWhereInput>
  orderBy?: Types.Maybe<Array<Types.VideoOrderByInput> | Types.VideoOrderByInput>
}>

export type GetBasicVideosQuery = { videos: Array<BasicVideoFieldsFragment> }

export type GetFullVideosQueryVariables = Types.Exact<{
  offset?: Types.Maybe<Types.Scalars['Int']>
  limit?: Types.Maybe<Types.Scalars['Int']>
  where?: Types.Maybe<Types.VideoWhereInput>
  orderBy?: Types.Maybe<Array<Types.VideoOrderByInput> | Types.VideoOrderByInput>
}>

export type GetFullVideosQuery = { videos: Array<FullVideoFieldsFragment> }

export type GetMostViewedVideosConnectionQueryVariables = Types.Exact<{
  limit?: Types.Maybe<Types.Scalars['Int']>
  periodDays?: Types.Maybe<Types.Scalars['Int']>
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  orderBy?: Types.Maybe<Array<Types.VideoOrderByInput> | Types.VideoOrderByInput>
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetMostViewedVideosConnectionQuery = {
  mostViewedVideosConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: BasicVideoFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetTop10VideosThisWeekQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetTop10VideosThisWeekQuery = { top10VideosThisWeek: Array<BasicVideoFieldsFragment> }

export type GetTop10VideosThisMonthQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetTop10VideosThisMonthQuery = { top10VideosThisMonth: Array<BasicVideoFieldsFragment> }

export type AddVideoViewMutationVariables = Types.Exact<{
  videoId: Types.Scalars['ID']
  channelId: Types.Scalars['ID']
  categoryId?: Types.Maybe<Types.Scalars['ID']>
}>

export type AddVideoViewMutation = { addVideoView: { id: string; views: number } }

export type ReportVideoMutationVariables = Types.Exact<{
  videoId: Types.Scalars['ID']
  rationale: Types.Scalars['String']
}>

export type ReportVideoMutation = { reportVideo: { id: string; videoId: string } }

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
  minimalBidStep: string
}

type AuctionTypeFields_AuctionTypeOpen_Fragment = {
  __typename: 'AuctionTypeOpen'
  bidLockDuration: number
}

export type AuctionTypeFieldsFragment =
  | AuctionTypeFields_AuctionTypeEnglish_Fragment
  | AuctionTypeFields_AuctionTypeOpen_Fragment

export type BidFieldsFragment = {
  id: string
  createdAt: any
  amount: string
  isCanceled: boolean
  createdInBlock: number
  indexInBlock: number
  auction: { id: string }
  nft: { id: string }
  bidder: { id: string }
}

export type VideoMediaEncodingFieldsFragment = {
  id: string
  codecName?: Types.Maybe<string>
  container?: Types.Maybe<string>
  mimeMediaType?: Types.Maybe<string>
}

export type StateQueryV1QueryVariables = Types.Exact<{ [key: string]: never }>

export type StateQueryV1Query = {
  apps: Array<{
    id: string
    name: string
    websiteUrl?: Types.Maybe<string>
    useUri?: Types.Maybe<string>
    smallIcon?: Types.Maybe<string>
    mediumIcon?: Types.Maybe<string>
    bigIcon?: Types.Maybe<string>
    oneLiner?: Types.Maybe<string>
    description?: Types.Maybe<string>
    termsOfService?: Types.Maybe<string>
    platforms?: Types.Maybe<Array<string>>
    category?: Types.Maybe<string>
    authKey?: Types.Maybe<string>
  }>
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
    cumulativeRewardClaimed?: Types.Maybe<string>
    totalVideosCreated: number
    ownerMember?: Types.Maybe<{ id: string }>
    coverPhoto?: Types.Maybe<{ id: string }>
    avatarPhoto?: Types.Maybe<{ id: string }>
    language?: Types.Maybe<{ iso: string }>
    videos: Array<{ id: string }>
    bannedMembers: Array<{ id: string }>
    entryApp?: Types.Maybe<{ id: string }>
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
  channelRewardClaimedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    amount: string
    channel: { id: string }
  }>
  channelRewardClaimedAndWithdrawnEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    amount: string
    account?: Types.Maybe<string>
    channel: { id: string }
    actor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
  }>
  channelFundsWithdrawnEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    amount: string
    account?: Types.Maybe<string>
    channel: { id: string }
    actor:
      | ActorFields_ContentActorCurator_Fragment
      | ActorFields_ContentActorLead_Fragment
      | ActorFields_ContentActorMember_Fragment
  }>
  channelPayoutsUpdatedEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    commitment?: Types.Maybe<string>
    minCashoutAllowed?: Types.Maybe<string>
    maxCashoutAllowed?: Types.Maybe<string>
    channelCashoutsEnabled?: Types.Maybe<boolean>
    payloadDataObject?: Types.Maybe<{ id: string }>
  }>
  channelPaymentMadeEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    amount: string
    rationale?: Types.Maybe<string>
    payer: { id: string }
    payeeChannel?: Types.Maybe<{ id: string }>
    paymentContext?: Types.Maybe<
      | { __typename: 'PaymentContextChannel'; channel?: Types.Maybe<{ id: string }> }
      | { __typename: 'PaymentContextVideo'; video?: Types.Maybe<{ id: string }> }
    >
  }>
  memberBannedFromChannelEvents: Array<{
    id: string
    inBlock: number
    inExtrinsic?: Types.Maybe<string>
    indexInBlock: number
    createdAt: any
    action: boolean
    channel: { id: string }
    member: { id: string }
  }>
  memberships: Array<{
    id: string
    createdAt: any
    handle: string
    controllerAccount: string
    totalChannelsCreated: number
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
      | { __typename: 'TransactionalStatusBuyNow'; price: string }
      | { __typename: 'TransactionalStatusIdle' }
      | {
          __typename: 'TransactionalStatusInitiatedOfferToMember'
          memberId: number
          offerPrice?: Types.Maybe<string>
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
  bids: Array<BidFieldsFragment>
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
      encoding?: Types.Maybe<VideoMediaEncodingFieldsFragment>
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

export const VideoCategoryFields = gql`
  fragment VideoCategoryFields on VideoCategory {
    id
    name
    activeVideosCounter
  }
`
export const StorageDataObjectFields = gql`
  fragment StorageDataObjectFields on StorageDataObject {
    id
    createdAt
    size
    isAccepted
    ipfsHash
    storageBag {
      id
    }
    type {
      __typename
    }
  }
`
export const BasicMembershipFields = gql`
  fragment BasicMembershipFields on Membership {
    id
    handle
    metadata {
      avatar {
        ... on AvatarObject {
          avatarObject {
            ...StorageDataObjectFields
          }
        }
        ... on AvatarUri {
          avatarUri
        }
      }
      about
    }
  }
  ${StorageDataObjectFields}
`
export const BasicChannelFields = gql`
  fragment BasicChannelFields on Channel {
    id
    title
    description
    createdAt
    follows
    rewardAccount
    channelStateBloatBond
    avatarPhoto {
      ...StorageDataObjectFields
    }
  }
  ${StorageDataObjectFields}
`
export const FullMembershipFields = gql`
  fragment FullMembershipFields on Membership {
    ...BasicMembershipFields
    controllerAccount
    createdAt
    channels {
      ...BasicChannelFields
      description
      coverPhoto {
        ...StorageDataObjectFields
      }
    }
  }
  ${BasicMembershipFields}
  ${BasicChannelFields}
  ${StorageDataObjectFields}
`
export const DistributionBucketOperatorField = gql`
  fragment DistributionBucketOperatorField on DistributionBucketOperator {
    id
    metadata {
      nodeEndpoint
      nodeLocation {
        coordinates {
          latitude
          longitude
        }
      }
    }
    status
  }
`
export const VideoMediaMetadataFields = gql`
  fragment VideoMediaMetadataFields on VideoMediaMetadata {
    id
    pixelHeight
    pixelWidth
  }
`
export const FullChannelFields = gql`
  fragment FullChannelFields on Channel {
    ...BasicChannelFields
    views
    activeVideosCounter
    description
    isPublic
    isCensored
    language {
      id
      iso
    }
    ownerMember {
      ...BasicMembershipFields
    }
    coverPhoto {
      ...StorageDataObjectFields
    }
  }
  ${BasicChannelFields}
  ${BasicMembershipFields}
  ${StorageDataObjectFields}
`
export const LicenseFields = gql`
  fragment LicenseFields on License {
    id
    code
    attribution
    customText
  }
`
export const BasicBidFields = gql`
  fragment BasicBidFields on Bid {
    bidder {
      ...BasicMembershipFields
    }
    amount
    createdAt
    isCanceled
    createdInBlock
    id
  }
  ${BasicMembershipFields}
`
export const BasicNftFields = gql`
  fragment BasicNftFields on OwnedNft {
    id
    createdAt
    creatorRoyalty
    lastSaleDate
    lastSalePrice
    isOwnedByChannel
    ownerMember {
      ...BasicMembershipFields
    }
    transactionalStatusAuction {
      id
      auctionType {
        __typename
        ... on AuctionTypeEnglish {
          duration
          extensionPeriod
          minimalBidStep
          plannedEndAtBlock
        }
        ... on AuctionTypeOpen {
          bidLockDuration
        }
      }
      isCompleted
      initialOwner {
        ...BasicMembershipFields
      }
      buyNowPrice
      startingPrice
      startsAtBlock
      endedAtBlock
      topBid {
        ...BasicBidFields
      }
      bids {
        ...BasicBidFields
      }
      whitelistedMembers {
        ...BasicMembershipFields
      }
    }
    transactionalStatus {
      __typename
      ... on TransactionalStatusIdle {
        dummy
      }
      ... on TransactionalStatusBuyNow {
        price
      }
    }
  }
  ${BasicMembershipFields}
  ${BasicBidFields}
`
export const SubtitlesFields = gql`
  fragment SubtitlesFields on VideoSubtitle {
    id
    language {
      id
      iso
    }
    asset {
      ...StorageDataObjectFields
    }
    mimeType
    type
    assetId
  }
  ${StorageDataObjectFields}
`
export const FullVideoFields = gql`
  fragment FullVideoFields on Video {
    id
    title
    description
    reactionsCount
    reactions {
      id
      createdAt
      reaction
      memberId
    }
    category {
      id
      name
    }
    views
    duration
    createdAt
    isPublic
    isExplicit
    hasMarketing
    isCensored
    isCommentSectionEnabled
    commentsCount
    language {
      iso
    }
    publishedBeforeJoystream
    mediaMetadata {
      ...VideoMediaMetadataFields
    }
    media {
      ...StorageDataObjectFields
    }
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
    channel {
      ...FullChannelFields
    }
    license {
      ...LicenseFields
    }
    nft {
      ...BasicNftFields
    }
    subtitles {
      ...SubtitlesFields
    }
  }
  ${VideoMediaMetadataFields}
  ${StorageDataObjectFields}
  ${FullChannelFields}
  ${LicenseFields}
  ${BasicNftFields}
  ${SubtitlesFields}
`
export const BasicVideoFields = gql`
  fragment BasicVideoFields on Video {
    id
    title
    views
    createdAt
    duration
    reactionsCount
    commentsCount
    channel {
      ...BasicChannelFields
    }
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
    nft {
      ...BasicNftFields
    }
  }
  ${BasicChannelFields}
  ${StorageDataObjectFields}
  ${BasicNftFields}
`
export const FullNftFields = gql`
  fragment FullNftFields on OwnedNft {
    ...BasicNftFields
    creatorChannel {
      ...BasicChannelFields
    }
    video {
      ...BasicVideoFields
    }
  }
  ${BasicNftFields}
  ${BasicChannelFields}
  ${BasicVideoFields}
`
export const FullBidFields = gql`
  fragment FullBidFields on Bid {
    ...BasicBidFields
    auction {
      auctionType {
        __typename
      }
      isCompleted
      winningMemberId
      id
    }
  }
  ${BasicBidFields}
`
export const CommentReactionsCountByReactionIdFields = gql`
  fragment CommentReactionsCountByReactionIdFields on CommentReactionsCountByReactionId {
    id
    count
    reactionId
  }
`
export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    author {
      ...BasicMembershipFields
    }
    createdAt
    isEdited
    reactionsCountByReactionId {
      ...CommentReactionsCountByReactionIdFields
    }
    parentCommentId
    repliesCount
    text
    status
  }
  ${BasicMembershipFields}
  ${CommentReactionsCountByReactionIdFields}
`
export const MetaprotocolTransactionSuccessFields = gql`
  fragment MetaprotocolTransactionSuccessFields on MetaprotocolTransactionSuccessful {
    commentCreated {
      ...CommentFields
    }
    commentEdited {
      ...CommentFields
    }
    commentDeleted {
      ...CommentFields
    }
    commentModerated {
      ...CommentFields
    }
  }
  ${CommentFields}
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
export const BidFields = gql`
  fragment BidFields on Bid {
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
`
export const VideoMediaEncodingFields = gql`
  fragment VideoMediaEncodingFields on VideoMediaEncoding {
    id
    codecName
    container
    mimeMediaType
  }
`
export const GetKillSwitch = gql`
  query GetKillSwitch {
    admin {
      isKilled
    }
  }
`
export const SetKillSwitch = gql`
  mutation SetKillSwitch($isKilled: Boolean!) {
    setKillSwitch(isKilled: $isKilled) {
      isKilled
    }
  }
`
export const GetBids = gql`
  query GetBids($where: BidWhereInput!, $limit: Int) {
    bids(where: $where, limit: $limit, orderBy: [createdAt_ASC]) {
      ...FullBidFields
    }
  }
  ${FullBidFields}
`
export const GetVideoCategories = gql`
  query GetVideoCategories {
    videoCategories(where: { name_startsWith: "" }) {
      ...VideoCategoryFields
    }
  }
  ${VideoCategoryFields}
`
export const GetBasicChannel = gql`
  query GetBasicChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFields}
`
export const GetFullChannel = gql`
  query GetFullChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...FullChannelFields
    }
  }
  ${FullChannelFields}
`
export const GetVideoCount = gql`
  query GetVideoCount($where: VideoWhereInput) {
    videosConnection(first: 0, where: $where) {
      totalCount
    }
  }
`
export const GetBasicChannels = gql`
  query GetBasicChannels(
    $where: ChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFields}
`
export const GetFullChannels = gql`
  query GetFullChannels(
    $where: ChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...FullChannelFields
    }
  }
  ${FullChannelFields}
`
export const GetBasicChannelsConnection = gql`
  query GetBasicChannelsConnection(
    $first: Int
    $after: String
    $where: ChannelWhereInput
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channelsConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...BasicChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicChannelFields}
`
export const FollowChannel = gql`
  mutation FollowChannel($channelId: ID!) {
    followChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export const UnfollowChannel = gql`
  mutation UnfollowChannel($channelId: ID!) {
    unfollowChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export const GetMostViewedChannelsConnection = gql`
  query GetMostViewedChannelsConnection(
    $limit: Int = 50
    $periodDays: Int
    $first: Int
    $after: String
    $where: ChannelWhereInput
  ) {
    mostViewedChannelsConnection(
      limit: $limit
      first: $first
      after: $after
      periodDays: $periodDays
      where: $where
    ) {
      edges {
        cursor
        node {
          ...BasicChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicChannelFields}
`
export const GetMostFollowedChannelsConnection = gql`
  query GetMostFollowedChannelsConnection(
    $limit: Int!
    $periodDays: Int
    $first: Int
    $after: String
    $where: ChannelWhereInput
  ) {
    mostFollowedChannelsConnection(
      limit: $limit
      first: $first
      after: $after
      periodDays: $periodDays
      where: $where
    ) {
      edges {
        cursor
        node {
          ...BasicChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicChannelFields}
`
export const GetTop10Channels = gql`
  query GetTop10Channels($where: ChannelWhereInput) {
    top10Channels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFields}
`
export const GetPromisingChannels = gql`
  query GetPromisingChannels($where: ChannelWhereInput) {
    promisingChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFields}
`
export const GetDiscoverChannels = gql`
  query GetDiscoverChannels($where: ChannelWhereInput) {
    discoverChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFields}
`
export const GetPopularChannels = gql`
  query GetPopularChannels($where: ChannelWhereInput) {
    popularChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFields}
`
export const GetChannelNftCollectors = gql`
  query GetChannelNftCollectors(
    $where: ChannelNftCollectorsWhereInput
    $orderBy: [ChannelNftCollectorsOrderByInput!] = [amount_DESC]
  ) {
    channelNftCollectors(where: $where, orderBy: $orderBy) {
      id
      member {
        ...BasicMembershipFields
      }
      amount
    }
  }
  ${BasicMembershipFields}
`
export const ReportChannel = gql`
  mutation ReportChannel($channelId: ID!, $rationale: String!) {
    reportChannel(channelId: $channelId, rationale: $rationale) {
      id
      channelId
    }
  }
`
export const GetChannelPaymentEvents = gql`
  query GetChannelPaymentEvents($ownerMemberId: ID!, $channelId: ID!) {
    nftBoughtEvents(where: { ownerMember: { id_eq: $ownerMemberId } }) {
      inBlock
      createdAt
      price
    }
    bidMadeCompletingAuctionEvents(where: { ownerMember: { id_eq: $ownerMemberId } }) {
      inBlock
      createdAt
      price
    }
    englishAuctionSettledEvents(where: { ownerMember: { id_eq: $ownerMemberId } }) {
      createdAt
      inBlock
      winningBid {
        amount
      }
    }
    openAuctionBidAcceptedEvents(where: { ownerMember: { id_eq: $ownerMemberId } }) {
      inBlock
      createdAt
      winningBid {
        amount
      }
    }
  }
`
export const GetComment = gql`
  query GetComment($commentId: ID!) {
    commentByUniqueInput(where: { id: $commentId }) {
      ...CommentFields
    }
  }
  ${CommentFields}
`
export const GetCommentRepliesConnection = gql`
  query GetCommentRepliesConnection(
    $first: Int
    $after: String
    $parentCommentId: ID!
    $orderBy: [CommentOrderByInput!] = [createdAt_ASC]
  ) {
    commentsConnection(
      first: $first
      after: $after
      where: { parentComment: { id_eq: $parentCommentId }, status_eq: VISIBLE }
      orderBy: $orderBy
    ) {
      edges {
        cursor
        node {
          ...CommentFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${CommentFields}
`
export const GetUserCommentsAndVideoCommentsConnection = gql`
  query GetUserCommentsAndVideoCommentsConnection(
    $first: Int
    $after: String
    $memberId: ID
    $videoId: ID
    $orderBy: [CommentOrderByInput!] = [createdAt_DESC]
  ) {
    userComments: comments(
      where: {
        parentComment: { id_eq: null }
        video: { id_eq: $videoId }
        author: { id_eq: $memberId }
        OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }]
      }
      orderBy: [createdAt_DESC]
    ) {
      ...CommentFields
    }
    videoCommentsConnection: commentsConnection(
      first: $first
      after: $after
      where: {
        video: { id_eq: $videoId }
        parentComment: { id_eq: null }
        OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }]
      }
      orderBy: $orderBy
    ) {
      edges {
        cursor
        node {
          ...CommentFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${CommentFields}
`
export const GetUserCommentsReactions = gql`
  query GetUserCommentsReactions($memberId: ID!, $videoId: ID!) {
    commentReactions(
      where: { member: { id_eq: $memberId }, video: { id_eq: $videoId } }
      limit: 1000
    ) {
      reactionId
      commentId
    }
  }
`
export const GetCommentEdits = gql`
  query GetCommentEdits($commentId: ID!) {
    commentTextUpdatedEvents(where: { comment: { id_eq: $commentId } }) {
      id
      createdAt
      newText
    }
    commentCreatedEvents(where: { comment: { id_eq: $commentId } }) {
      id
      createdAt
      text
    }
  }
`
export const GetDataObjectAvailability = gql`
  query GetDataObjectAvailability($id_eq: ID, $id_in: [ID!], $limit: Int) {
    storageDataObjects(where: { id_eq: $id_eq, id_in: $id_in }, limit: $limit) {
      id
      isAccepted
    }
  }
`
export const GetVideoHero = gql`
  query GetVideoHero {
    videoHero {
      videoId
      heroTitle
      heroVideoCutUrl
      heroPosterUrl
      video {
        ...BasicVideoFields
      }
    }
  }
  ${BasicVideoFields}
`
export const GetAllCategoriesFeaturedVideos = gql`
  query GetAllCategoriesFeaturedVideos {
    allCategoriesFeaturedVideos(videosLimit: 3) {
      categoryId
      category {
        name
      }
      categoryFeaturedVideos {
        videoId
        videoCutUrl
        video {
          ...BasicVideoFields
        }
      }
    }
  }
  ${BasicVideoFields}
`
export const GetCategoriesFeaturedVideos = gql`
  query GetCategoriesFeaturedVideos($categoryId: ID!) {
    categoryFeaturedVideos(categoryId: $categoryId) {
      videoId
      videoCutUrl
      video {
        ...FullVideoFields
      }
    }
  }
  ${FullVideoFields}
`
export const GetMembership = gql`
  query GetMembership($where: MembershipWhereUniqueInput!) {
    membershipByUniqueInput(where: $where) {
      ...FullMembershipFields
    }
  }
  ${FullMembershipFields}
`
export const GetMemberships = gql`
  query GetMemberships($where: MembershipWhereInput!, $limit: Int) {
    memberships(where: $where, limit: $limit, orderBy: [createdAt_ASC]) {
      ...FullMembershipFields
    }
  }
  ${FullMembershipFields}
`
export const GetNft = gql`
  query GetNft($id: ID!) {
    ownedNftByUniqueInput(where: { id: $id }) {
      ...FullNftFields
    }
  }
  ${FullNftFields}
`
export const GetNfts = gql`
  query GetNfts(
    $where: OwnedNftWhereInput
    $orderBy: [OwnedNftOrderByInput!] = [createdAt_DESC]
    $limit: Int
  ) {
    ownedNfts(where: $where, limit: $limit, orderBy: $orderBy) {
      ...FullNftFields
    }
  }
  ${FullNftFields}
`
export const GetNftsConnection = gql`
  query GetNftsConnection(
    $where: OwnedNftWhereInput
    $orderBy: [OwnedNftOrderByInput!] = [createdAt_DESC]
    $first: Int
    $after: String
  ) {
    ownedNftsConnection(where: $where, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        cursor
        node {
          ...FullNftFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${FullNftFields}
`
export const GetNotifications = gql`
  query GetNotifications($channelId: ID!, $memberId: ID!, $limit: Int!) {
    auctionBidMadeEvents(
      limit: $limit
      where: {
        OR: [{ ownerMember: { id_eq: $memberId } }, { previousTopBidder: { id_eq: $memberId } }]
      }
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      video {
        id
        title
      }
      member {
        ...BasicMembershipFields
      }
      ownerMember {
        ...BasicMembershipFields
      }
      previousTopBidder {
        ...BasicMembershipFields
      }
      bidAmount
    }
    nftBoughtEvents(
      where: { ownerMember: { id_eq: $memberId } }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      member {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
      price
    }
    bidMadeCompletingAuctionEvents(
      where: { OR: [{ ownerMember: { id_eq: $memberId } }, { bidders_some: { id_eq: $memberId } }] }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      member {
        ...BasicMembershipFields
      }
      ownerMember {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
      price
    }
    openAuctionBidAcceptedEvents(
      where: {
        OR: [{ winningBidder: { id_eq: $memberId } }, { bidders_some: { id_eq: $memberId } }]
      }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      video {
        id
        title
      }
      ownerMember {
        ...BasicMembershipFields
      }
      winningBid {
        amount
      }
      winningBidder {
        ...BasicMembershipFields
      }
    }
    englishAuctionSettledEvents(
      where: {
        OR: [
          { ownerMember: { id_eq: $memberId } }
          { winner: { id_eq: $memberId } }
          { bidders_some: { id_eq: $memberId } }
        ]
      }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      ownerMember {
        ...BasicMembershipFields
      }
      winner {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
    }
    commentCreatedEvents(
      where: {
        OR: [
          { videoChannel: { id_eq: $channelId }, parentCommentAuthor: { id_eq: null } }
          { parentCommentAuthor: { id_eq: $memberId } }
        ]
      }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      inBlock
      createdAt
      video {
        id
        title
      }
      comment {
        id
        parentComment {
          id
        }
        author {
          ...BasicMembershipFields
        }
      }
    }
  }
  ${BasicMembershipFields}
`
export const GetNftHistory = gql`
  query GetNftHistory($nftId: ID!) {
    nftIssuedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    openAuctionStartedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    englishAuctionStartedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    nftSellOrderMadeEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      price
    }
    auctionBidMadeEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      member {
        ...BasicMembershipFields
      }
      bidAmount
    }
    bidMadeCompletingAuctionEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      member {
        ...BasicMembershipFields
      }
      price
    }
    nftBoughtEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      member {
        ...BasicMembershipFields
      }
      price
    }
    englishAuctionSettledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      winner {
        ...BasicMembershipFields
      }
    }
    openAuctionBidAcceptedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      winningBid {
        amount
        bidder {
          ...BasicMembershipFields
        }
      }
    }
    auctionBidCanceledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      member {
        ...BasicMembershipFields
      }
    }
    auctionCanceledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    buyNowCanceledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    buyNowPriceUpdatedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      newPrice
    }
  }
  ${BasicMembershipFields}
`
export const GetNftActivities = gql`
  query GetNftActivities($memberId: ID!, $limit: Int!) {
    auctionBidMadeEventsConnection(
      first: $limit
      where: { OR: [{ member: { id_eq: $memberId } }, { previousTopBidder: { id_eq: $memberId } }] }
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          previousTopBidder {
            ...BasicMembershipFields
          }
          bidAmount
        }
      }
      totalCount
    }
    purchaseEnglishAuctionSettledEventsConnection: englishAuctionSettledEventsConnection(
      where: { winner: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          ownerMember {
            ...BasicMembershipFields
          }
          winner {
            ...BasicMembershipFields
          }
          winningBid {
            amount
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
        }
      }
      totalCount
    }
    purchaseNftBoughtEventsConnection: nftBoughtEventsConnection(
      where: { member: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    purchaseBidMadeCompletingAuctionEventsConnection: bidMadeCompletingAuctionEventsConnection(
      where: { member: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    purchaseOpenAuctionBidAcceptedEventsConnection: openAuctionBidAcceptedEventsConnection(
      where: { winningBidder: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
          winningBid {
            amount
            bidder {
              ...BasicMembershipFields
            }
          }
        }
      }
      totalCount
    }
    saleEnglishAuctionSettledEventsConnection: englishAuctionSettledEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          ownerMember {
            ...BasicMembershipFields
          }
          winner {
            ...BasicMembershipFields
          }
          winningBid {
            amount
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
        }
      }
      totalCount
    }
    saleNftBoughtEventsConnection: nftBoughtEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    saleBidMadeCompletingAuctionEventsConnection: bidMadeCompletingAuctionEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    saleOpenAuctionBidAcceptedEventsConnection: openAuctionBidAcceptedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
          winningBid {
            amount
            bidder {
              ...BasicMembershipFields
            }
          }
        }
      }
      totalCount
    }
    englishAuctionStartedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    openAuctionStartedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    nftSellOrderMadeEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          price
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    auctionBidCanceledEventsConnection(
      where: { member: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          member {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    buyNowCanceledEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    auctionCanceledEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    buyNowPriceUpdatedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          newPrice
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    nftIssuedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
  }
  ${StorageDataObjectFields}
  ${BasicMembershipFields}
`
export const GetQueryNodeState = gql`
  subscription GetQueryNodeState {
    stateSubscription {
      lastCompleteBlock
    }
  }
`
export const GetDistributionBucketsWithBags = gql`
  query GetDistributionBucketsWithBags {
    distributionBuckets(limit: 500, where: { distributing_eq: true }) {
      id
      bags {
        id
      }
      operators {
        ...DistributionBucketOperatorField
      }
    }
  }
  ${DistributionBucketOperatorField}
`
export const GetStorageBucketsWithBags = gql`
  query GetStorageBucketsWithBags {
    storageBuckets(
      limit: 500
      where: {
        operatorStatus_json: { isTypeOf_eq: "StorageBucketOperatorStatusActive" }
        operatorMetadata: { nodeEndpoint_contains: "http" }
      }
    ) {
      id
      operatorMetadata {
        nodeEndpoint
      }
      bags {
        id
      }
    }
  }
`
export const GetBasicDistributionBuckets = gql`
  query GetBasicDistributionBuckets {
    distributionBuckets(limit: 500, where: { acceptingNewBags_eq: true }) {
      id
      bucketIndex
      family {
        id
      }
    }
  }
`
export const GetBasicStorageBuckets = gql`
  query GetBasicStorageBuckets {
    storageBuckets(limit: 500, where: { acceptingNewBags_eq: true }) {
      id
    }
  }
`
export const GetMetaprotocolTransactionStatusEvents = gql`
  query GetMetaprotocolTransactionStatusEvents($transactionHash: String!) {
    metaprotocolTransactionStatusEvents(where: { inExtrinsic_eq: $transactionHash }) {
      inExtrinsic
      inBlock
      status {
        __typename
        ... on MetaprotocolTransactionErrored {
          message
        }
        ... on MetaprotocolTransactionSuccessful {
          ...MetaprotocolTransactionSuccessFields
        }
      }
    }
  }
  ${MetaprotocolTransactionSuccessFields}
`
export const GetBasicVideo = gql`
  query GetBasicVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFields}
`
export const GetFullVideo = gql`
  query GetFullVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...FullVideoFields
    }
  }
  ${FullVideoFields}
`
export const GetBasicVideosConnection = gql`
  query GetBasicVideosConnection(
    $first: Int
    $after: String
    $orderBy: [VideoOrderByInput!] = [createdAt_DESC]
    $where: VideoWhereInput
  ) {
    videosConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...BasicVideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicVideoFields}
`
export const GetFullVideosConnection = gql`
  query GetFullVideosConnection(
    $first: Int
    $after: String
    $orderBy: [VideoOrderByInput!] = [createdAt_DESC]
    $where: VideoWhereInput
  ) {
    videosConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...FullVideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${FullVideoFields}
`
export const GetBasicVideos = gql`
  query GetBasicVideos(
    $offset: Int
    $limit: Int
    $where: VideoWhereInput
    $orderBy: [VideoOrderByInput!] = [createdAt_DESC]
  ) {
    videos(offset: $offset, limit: $limit, where: $where, orderBy: $orderBy) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFields}
`
export const GetFullVideos = gql`
  query GetFullVideos(
    $offset: Int
    $limit: Int
    $where: VideoWhereInput
    $orderBy: [VideoOrderByInput!] = [createdAt_DESC]
  ) {
    videos(offset: $offset, limit: $limit, where: $where, orderBy: $orderBy) {
      ...FullVideoFields
    }
  }
  ${FullVideoFields}
`
export const GetMostViewedVideosConnection = gql`
  query GetMostViewedVideosConnection(
    $limit: Int = 50
    $periodDays: Int
    $first: Int
    $after: String
    $orderBy: [VideoOrderByInput!] = [createdAt_DESC]
    $where: VideoWhereInput
  ) {
    mostViewedVideosConnection(
      limit: $limit
      first: $first
      after: $after
      periodDays: $periodDays
      orderBy: $orderBy
      where: $where
    ) {
      edges {
        cursor
        node {
          ...BasicVideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicVideoFields}
`
export const GetTop10VideosThisWeek = gql`
  query GetTop10VideosThisWeek($where: VideoWhereInput) {
    top10VideosThisWeek(where: $where) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFields}
`
export const GetTop10VideosThisMonth = gql`
  query GetTop10VideosThisMonth($where: VideoWhereInput) {
    top10VideosThisMonth(where: $where) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFields}
`
export const AddVideoView = gql`
  mutation AddVideoView($videoId: ID!, $channelId: ID!, $categoryId: ID) {
    addVideoView(videoId: $videoId, channelId: $channelId, categoryId: $categoryId) {
      id
      views
    }
  }
`
export const ReportVideo = gql`
  mutation ReportVideo($videoId: ID!, $rationale: String!) {
    reportVideo(videoId: $videoId, rationale: $rationale) {
      id
      videoId
    }
  }
`
export const StateQueryV1 = gql`
  query StateQueryV1 {
    apps(limit: 9999) {
      id
      name
      websiteUrl
      useUri
      smallIcon
      mediumIcon
      bigIcon
      oneLiner
      description
      termsOfService
      platforms
      category
      authKey
    }
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
      cumulativeRewardClaimed
      entryApp {
        id
      }
      totalVideosCreated
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
    channelRewardClaimedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      channel {
        id
      }
      amount
    }
    channelRewardClaimedAndWithdrawnEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      channel {
        id
      }
      amount
      account
      actor {
        ...ActorFields
      }
    }
    channelFundsWithdrawnEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      channel {
        id
      }
      amount
      account
      actor {
        ...ActorFields
      }
    }
    channelPayoutsUpdatedEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      commitment
      payloadDataObject {
        id
      }
      minCashoutAllowed
      maxCashoutAllowed
      channelCashoutsEnabled
    }
    channelPaymentMadeEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      payer {
        id
      }
      amount
      payeeChannel {
        id
      }
      paymentContext {
        __typename
        ... on PaymentContextVideo {
          video {
            id
          }
        }
        ... on PaymentContextChannel {
          channel {
            id
          }
        }
      }
      rationale
    }
    memberBannedFromChannelEvents(limit: 9999) {
      id
      inBlock
      inExtrinsic
      indexInBlock
      createdAt
      channel {
        id
      }
      member {
        id
      }
      action
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
      totalChannelsCreated
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
          price
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
      ...BidFields
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
          ...VideoMediaEncodingFields
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
  ${BidFields}
  ${VideoMediaEncodingFields}
`
