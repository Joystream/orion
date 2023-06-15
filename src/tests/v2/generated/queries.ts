import * as Types from './schema'

import gql from 'graphql-tag'
export type GetKillSwitchQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetKillSwitchQuery = { getKillSwitch: { isKilled: boolean } }

export type SetKillSwitchMutationVariables = Types.Exact<{
  isKilled: Types.Scalars['Boolean']
}>

export type SetKillSwitchMutation = { setKillSwitch: { isKilled: boolean } }

export type GetBidsQueryVariables = Types.Exact<{
  where: Types.BidWhereInput
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetBidsQuery = { bids: Array<FullBidFieldsFragment> }

export type GetExtendedVideoCategoriesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetExtendedVideoCategoriesQuery = {
  extendedVideoCategories: Array<ExtendedVideoCategoryFieldsFragment>
}

export type GetFullChannelQueryVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetFullChannelQuery = { channelById?: Types.Maybe<FullChannelFieldsFragment> }

export type GetVideoCountQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetVideoCountQuery = { videosConnection: { totalCount: number } }

export type GetExtendedBasicChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetExtendedBasicChannelsQuery = {
  extendedChannels: Array<ExtendedBasicChannelFieldsFragment>
}

export type GetExtendedFullChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetExtendedFullChannelsQuery = {
  extendedChannels: Array<ExtendedFullChannelFieldsFragment>
}

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
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export type FollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']
}>

export type FollowChannelMutation = {
  followChannel: { channelId: string; follows: number; cancelToken: string }
}

export type UnfollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']
  token: Types.Scalars['String']
}>

export type UnfollowChannelMutation = { unfollowChannel: { channelId: string; follows: number } }

export type GetTop10ChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
}>

export type GetTop10ChannelsQuery = {
  extendedChannels: Array<{ channel: BasicChannelFieldsFragment }>
}

export type GetPromisingChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
}>

export type GetPromisingChannelsQuery = {
  mostRecentChannels: Array<{ channel: BasicChannelFieldsFragment }>
}

export type GetDiscoverChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
}>

export type GetDiscoverChannelsQuery = {
  mostRecentChannels: Array<{ channel: BasicChannelFieldsFragment }>
}

export type GetPopularChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
}>

export type GetPopularChannelsQuery = {
  extendedChannels: Array<{ channel: BasicChannelFieldsFragment }>
}

export type GetChannelNftCollectorsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['String']
  orderBy?: Types.Maybe<Types.ChannelNftCollectorsOrderByInput>
}>

export type GetChannelNftCollectorsQuery = {
  channelNftCollectors: Array<{ amount: number; member: BasicMembershipFieldsFragment }>
}

export type GetPayloadDataObjectIdByCommitmentQueryVariables = Types.Exact<{
  commitment: Types.Scalars['String']
}>

export type GetPayloadDataObjectIdByCommitmentQuery = {
  events: Array<{
    data: { payloadDataObject?: Types.Maybe<{ id: string; storageBag: { id: string } }> }
  }>
}

export type GetTopSellingChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ExtendedChannelWhereInput>
  limit: Types.Scalars['Int']
  periodDays: Types.Scalars['Int']
}>

export type GetTopSellingChannelsQuery = {
  topSellingChannels?: Types.Maybe<
    Array<Types.Maybe<{ amount: string; channel: BasicChannelFieldsFragment }>>
  >
}

export type ReportChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']
  rationale: Types.Scalars['String']
}>

export type ReportChannelMutation = { reportChannel: { id: string; channelId: string } }

export type GetChannelPaymentEventsQueryVariables = Types.Exact<{
  ownerMemberId: Types.Scalars['String']
  channelId: Types.Scalars['String']
}>

export type GetChannelPaymentEventsQuery = {
  events: Array<{
    inBlock: number
    timestamp: any
    data:
      | { __typename: 'AuctionBidCanceledEventData' }
      | { __typename: 'AuctionBidMadeEventData' }
      | { __typename: 'AuctionCanceledEventData' }
      | { __typename: 'BidMadeCompletingAuctionEventData'; winningBid: { amount: string } }
      | { __typename: 'BuyNowCanceledEventData' }
      | { __typename: 'BuyNowPriceUpdatedEventData' }
      | { __typename: 'ChannelFundsWithdrawnEventData' }
      | { __typename: 'ChannelPaymentMadeEventData' }
      | { __typename: 'ChannelPayoutsUpdatedEventData' }
      | { __typename: 'ChannelRewardClaimedAndWithdrawnEventData' }
      | { __typename: 'ChannelRewardClaimedEventData' }
      | { __typename: 'CommentCreatedEventData' }
      | { __typename: 'CommentTextUpdatedEventData' }
      | { __typename: 'EnglishAuctionSettledEventData'; winningBid: { amount: string } }
      | { __typename: 'EnglishAuctionStartedEventData' }
      | { __typename: 'MemberBannedFromChannelEventData' }
      | { __typename: 'MetaprotocolTransactionStatusEventData' }
      | { __typename: 'NftBoughtEventData'; price: string }
      | { __typename: 'NftIssuedEventData' }
      | { __typename: 'NftSellOrderMadeEventData' }
      | { __typename: 'OpenAuctionBidAcceptedEventData'; winningBid: { amount: string } }
      | { __typename: 'OpenAuctionStartedEventData' }
  }>
}

export type GetCommentQueryVariables = Types.Exact<{
  commentId: Types.Scalars['String']
}>

export type GetCommentQuery = { commentById?: Types.Maybe<CommentFieldsFragment> }

export type GetCommentRepliesConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  parentCommentId: Types.Scalars['String']
  orderBy?: Types.Maybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetCommentRepliesConnectionQuery = {
  commentsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: CommentFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export type GetUserCommentsAndVideoCommentsConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  memberId?: Types.Maybe<Types.Scalars['String']>
  videoId?: Types.Maybe<Types.Scalars['String']>
  orderBy?: Types.Maybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetUserCommentsAndVideoCommentsConnectionQuery = {
  userComments: Array<CommentFieldsFragment>
  videoCommentsConnection: {
    totalCount: number
    edges: Array<{ cursor: string; node: CommentFieldsFragment }>
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export type GetUserCommentsReactionsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  videoId: Types.Scalars['String']
}>

export type GetUserCommentsReactionsQuery = {
  commentReactions: Array<{ reactionId: number; comment: { id: string } }>
}

export type GetCommentEditsQueryVariables = Types.Exact<{
  commentId: Types.Scalars['String']
}>

export type GetCommentEditsQuery = {
  events: Array<{ id: string; timestamp: any; data: { text: string } | { newText: string } }>
}

export type GetDataObjectAvailabilityQueryVariables = Types.Exact<{
  id_eq?: Types.Maybe<Types.Scalars['String']>
  id_in?: Types.Maybe<Array<Types.Scalars['String']> | Types.Scalars['String']>
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetDataObjectAvailabilityQuery = {
  storageDataObjects: Array<{ id: string; isAccepted: boolean }>
}

export type GetVideoHeroQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoHeroQuery = {
  videoHero?: Types.Maybe<{
    heroTitle: string
    heroVideoCutUrl: string
    heroPosterUrl: string
    video: BasicVideoFieldsFragment
  }>
}

export type GetAllCategoriesFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetAllCategoriesFeaturedVideosQuery = {
  videoCategories: Array<{
    id: string
    name?: Types.Maybe<string>
    featuredVideos: Array<{ videoCutUrl?: Types.Maybe<string>; video: BasicVideoFieldsFragment }>
  }>
}

export type GetCategoriesFeaturedVideosQueryVariables = Types.Exact<{
  categoryId: Types.Scalars['String']
}>

export type GetCategoriesFeaturedVideosQuery = {
  videoCategoryById?: Types.Maybe<{
    featuredVideos: Array<{ videoCutUrl?: Types.Maybe<string>; video: FullVideoFieldsFragment }>
  }>
}

export type ExtendedVideoCategoryFieldsFragment = {
  activeVideosCount: number
  category: { id: string; name?: Types.Maybe<string> }
}

export type BasicChannelFieldsFragment = {
  id: string
  title?: Types.Maybe<string>
  description?: Types.Maybe<string>
  createdAt: any
  followsNum: number
  rewardAccount: string
  channelStateBloatBond: string
  avatarPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
}

export type FullChannelFieldsFragment = {
  videoViewsNum: number
  description?: Types.Maybe<string>
  isPublic?: Types.Maybe<boolean>
  isCensored: boolean
  cumulativeRewardClaimed?: Types.Maybe<string>
  language?: Types.Maybe<string>
  ownerMember?: Types.Maybe<BasicMembershipFieldsFragment>
  coverPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
} & BasicChannelFieldsFragment

export type ExtendedFullChannelFieldsFragment = {
  activeVideosCount: number
  channel: FullChannelFieldsFragment
}

export type ExtendedBasicChannelFieldsFragment = {
  activeVideosCount: number
  channel: BasicChannelFieldsFragment
}

export type BasicMembershipFieldsFragment = {
  id: string
  handle: string
  metadata?: Types.Maybe<{
    about?: Types.Maybe<string>
    avatar?: Types.Maybe<{ avatarObject: StorageDataObjectFieldsFragment } | { avatarUri: string }>
  }>
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
  type?: Types.Maybe<
    | { __typename: 'DataObjectTypeChannelAvatar' }
    | { __typename: 'DataObjectTypeChannelCoverPhoto' }
    | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
    | { __typename: 'DataObjectTypeVideoMedia' }
    | { __typename: 'DataObjectTypeVideoSubtitle' }
    | { __typename: 'DataObjectTypeVideoThumbnail' }
  >
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
  language?: Types.Maybe<string>
  mimeType: string
  type: string
  asset?: Types.Maybe<StorageDataObjectFieldsFragment>
}

export type BasicVideoFieldsFragment = {
  id: string
  title?: Types.Maybe<string>
  viewsNum: number
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
  viewsNum: number
  duration?: Types.Maybe<number>
  createdAt: any
  isPublic?: Types.Maybe<boolean>
  isExplicit?: Types.Maybe<boolean>
  hasMarketing?: Types.Maybe<boolean>
  isCensored: boolean
  isCommentSectionEnabled: boolean
  commentsCount: number
  language?: Types.Maybe<string>
  publishedBeforeJoystream?: Types.Maybe<any>
  reactions: Array<{
    id: string
    createdAt: any
    reaction: Types.VideoReactionOptions
    member: { id: string }
  }>
  category?: Types.Maybe<{ id: string; name?: Types.Maybe<string> }>
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
  owner: { channel: BasicChannelFieldsFragment } | { member: BasicMembershipFieldsFragment }
  transactionalStatus?: Types.Maybe<
    | {
        __typename: 'TransactionalStatusAuction'
        auction: {
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
          topBid?: Types.Maybe<BasicBidFieldsFragment>
          bids: Array<BasicBidFieldsFragment>
          whitelistedMembers: Array<{ member: BasicMembershipFieldsFragment }>
        }
      }
    | { __typename: 'TransactionalStatusBuyNow'; price: string }
    | { __typename: 'TransactionalStatusIdle' }
    | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
  >
}

export type FullNftFieldsFragment = {
  video: { channel: BasicChannelFieldsFragment } & BasicVideoFieldsFragment
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
    id: string
    auctionType: { __typename: 'AuctionTypeEnglish' } | { __typename: 'AuctionTypeOpen' }
    winningMember?: Types.Maybe<{ id: string }>
  }
} & BasicBidFieldsFragment

export type CommentReactionsCountByReactionIdFieldsFragment = { count: number; reactionId: number }

export type CommentFieldsFragment = {
  id: string
  createdAt: any
  isEdited: boolean
  repliesCount: number
  text: string
  status: Types.CommentStatus
  author: BasicMembershipFieldsFragment
  reactionsCountByReactionId?: Types.Maybe<Array<CommentReactionsCountByReactionIdFieldsFragment>>
  parentComment?: Types.Maybe<{ id: string }>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment = {
  __typename: 'MetaprotocolTransactionResultChannelPaid'
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentCreated'
  commentCreated?: Types.Maybe<CommentFieldsFragment>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentDeleted'
  commentDeleted?: Types.Maybe<CommentFieldsFragment>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentEdited'
  commentEdited?: Types.Maybe<CommentFieldsFragment>
}

type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment = {
  __typename: 'MetaprotocolTransactionResultCommentModerated'
  commentModerated?: Types.Maybe<CommentFieldsFragment>
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

type BasicNftOwnerFields_NftOwnerChannel_Fragment = {
  __typename: 'NftOwnerChannel'
  channel: { ownerMember?: Types.Maybe<BasicMembershipFieldsFragment> }
}

type BasicNftOwnerFields_NftOwnerMember_Fragment = {
  __typename: 'NftOwnerMember'
  member: BasicMembershipFieldsFragment
}

export type BasicNftOwnerFieldsFragment =
  | BasicNftOwnerFields_NftOwnerChannel_Fragment
  | BasicNftOwnerFields_NftOwnerMember_Fragment

export type GetMembershipsQueryVariables = Types.Exact<{
  where: Types.MembershipWhereInput
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetMembershipsQuery = { memberships: Array<FullMembershipFieldsFragment> }

export type GetNftQueryVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetNftQuery = { ownedNftById?: Types.Maybe<FullNftFieldsFragment> }

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
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export type GetEndingAuctionsNftsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.OwnedNftWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
  offset?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetEndingAuctionsNftsQuery = {
  endingAuctionsNfts: Array<Types.Maybe<FullNftFieldsFragment>>
}

export type GetNotificationsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  limit: Types.Scalars['Int']
}>

export type GetNotificationsQuery = {
  notifications: Array<{
    event: {
      id: string
      timestamp: any
      inBlock: number
      data:
        | {
            bid: {
              bidder: BasicMembershipFieldsFragment
              previousTopBid?: Types.Maybe<{ bidder: BasicMembershipFieldsFragment }>
              auction: { nft: { video: { id: string; title?: Types.Maybe<string> } } }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            winningBid: {
              amount: string
              bidder: BasicMembershipFieldsFragment
              nft: { video: { id: string; title?: Types.Maybe<string> } }
            }
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            comment: {
              id: string
              video: { id: string; title?: Types.Maybe<string> }
              parentComment?: Types.Maybe<{ id: string }>
              author: BasicMembershipFieldsFragment
            }
          }
        | {
            winningBid: {
              bidder: BasicMembershipFieldsFragment
              auction: { nft: { video: { id: string; title?: Types.Maybe<string> } } }
            }
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            price: string
            buyer: BasicMembershipFieldsFragment
            nft: { video: { id: string; title?: Types.Maybe<string> } }
          }
        | {
            winningBid: {
              amount: string
              bidder: BasicMembershipFieldsFragment
              auction: { nft: { video: { id: string; title?: Types.Maybe<string> } } }
            }
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
    }
  }>
}

export type GetNftHistoryQueryVariables = Types.Exact<{
  nftId: Types.Scalars['String']
}>

export type GetNftHistoryQuery = {
  nftHistoryEntries: Array<{
    event: {
      id: string
      timestamp: any
      data:
        | { member: BasicMembershipFieldsFragment }
        | { bid: { amount: string; bidder: BasicMembershipFieldsFragment } }
        | {
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            winningBid: { amount: string; bidder: BasicMembershipFieldsFragment }
          }
        | {
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            newPrice: string
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            winningBid: { bidder: BasicMembershipFieldsFragment }
          }
        | {
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | { price: string; buyer: BasicMembershipFieldsFragment }
        | {
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            price: string
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            winningBid: { amount: string; bidder: BasicMembershipFieldsFragment }
          }
        | {
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
    }
  }>
}

export type GetNftActivitiesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  limit: Types.Scalars['Int']
}>

export type GetNftActivitiesQuery = {
  nftActivities: Array<{
    event: {
      id: string
      timestamp: any
      inBlock: number
      data:
        | {
            member: BasicMembershipFieldsFragment
            bid: {
              auction: {
                nft: {
                  video: {
                    id: string
                    title?: Types.Maybe<string>
                    thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                  }
                }
              }
            }
          }
        | {
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            bid: {
              amount: string
              bidder: BasicMembershipFieldsFragment
              previousTopBid?: Types.Maybe<{ bidder: BasicMembershipFieldsFragment }>
              auction: {
                nft: {
                  video: {
                    id: string
                    title?: Types.Maybe<string>
                    thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                  }
                }
              }
            }
          }
        | {
            auction: {
              nft: {
                video: {
                  id: string
                  title?: Types.Maybe<string>
                  thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                }
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            winningBid: {
              amount: string
              bidder: BasicMembershipFieldsFragment
              auction: {
                nft: {
                  video: {
                    id: string
                    title?: Types.Maybe<string>
                    thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                  }
                }
              }
            }
          }
        | {
            nft: {
              video: {
                id: string
                title?: Types.Maybe<string>
                thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            newPrice: string
            nft: {
              video: {
                id: string
                title?: Types.Maybe<string>
                thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            winningBid: {
              amount: string
              bidder: BasicMembershipFieldsFragment
              auction: {
                nft: {
                  video: {
                    id: string
                    title?: Types.Maybe<string>
                    thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                  }
                }
              }
            }
          }
        | {
            auction: {
              nft: {
                video: {
                  id: string
                  title?: Types.Maybe<string>
                  thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                }
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            price: string
            buyer: BasicMembershipFieldsFragment
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
            nft: {
              video: {
                id: string
                title?: Types.Maybe<string>
                thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
              }
            }
          }
        | {
            nft: {
              video: {
                id: string
                title?: Types.Maybe<string>
                thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            price: string
            nft: {
              video: {
                id: string
                title?: Types.Maybe<string>
                thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            winningBid: {
              amount: string
              bidder: BasicMembershipFieldsFragment
              auction: {
                nft: {
                  video: {
                    id: string
                    title?: Types.Maybe<string>
                    thumbnailPhoto?: Types.Maybe<{ id: string }>
                  }
                }
              }
            }
            previousNftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
        | {
            auction: {
              nft: {
                video: {
                  id: string
                  title?: Types.Maybe<string>
                  thumbnailPhoto?: Types.Maybe<StorageDataObjectFieldsFragment>
                }
              }
            }
            nftOwner:
              | BasicNftOwnerFields_NftOwnerChannel_Fragment
              | BasicNftOwnerFields_NftOwnerMember_Fragment
          }
    }
  }>
}

export type GetQueryNodeStateSubscriptionVariables = Types.Exact<{ [key: string]: never }>

export type GetQueryNodeStateSubscription = { processorState: { lastProcessedBlock: number } }

export type GetDistributionBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetDistributionBucketsWithBagsQuery = {
  distributionBuckets: Array<{
    id: string
    bags: Array<{ bag: { id: string } }>
    operators: Array<DistributionBucketOperatorFieldFragment>
  }>
}

export type GetStorageBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetStorageBucketsWithBagsQuery = {
  storageBuckets: Array<{
    id: string
    operatorMetadata?: Types.Maybe<{ nodeEndpoint?: Types.Maybe<string> }>
    bags: Array<{ bag: { id: string } }>
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
  events: Array<{
    inExtrinsic?: Types.Maybe<string>
    inBlock: number
    data: {
      result:
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment
        | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment
    }
  }>
}

export type GetFullVideoQueryVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetFullVideoQuery = { videoById?: Types.Maybe<FullVideoFieldsFragment> }

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
    pageInfo: { hasNextPage: boolean; endCursor: string }
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
    pageInfo: { hasNextPage: boolean; endCursor: string }
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
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export type GetTop10VideosThisWeekQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetTop10VideosThisWeekQuery = {
  mostViewedVideosConnection: { edges: Array<{ node: BasicVideoFieldsFragment }> }
}

export type GetTop10VideosThisMonthQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetTop10VideosThisMonthQuery = {
  mostViewedVideosConnection: { edges: Array<{ node: BasicVideoFieldsFragment }> }
}

export type AddVideoViewMutationVariables = Types.Exact<{
  videoId: Types.Scalars['String']
}>

export type AddVideoViewMutation = { addVideoView: { videoId: string; viewsNum: number } }

export type ReportVideoMutationVariables = Types.Exact<{
  videoId: Types.Scalars['String']
  rationale: Types.Scalars['String']
}>

export type ReportVideoMutation = { reportVideo: { id: string; videoId: string } }

type StateQueryActorFields_ContentActorCurator_Fragment = {
  __typename: 'ContentActorCurator'
  curator: { id: string }
}

type StateQueryActorFields_ContentActorLead_Fragment = { __typename: 'ContentActorLead' }

type StateQueryActorFields_ContentActorMember_Fragment = {
  __typename: 'ContentActorMember'
  member: { id: string }
}

export type StateQueryActorFieldsFragment =
  | StateQueryActorFields_ContentActorCurator_Fragment
  | StateQueryActorFields_ContentActorLead_Fragment
  | StateQueryActorFields_ContentActorMember_Fragment

type StateQueryNftOwnerFields_NftOwnerChannel_Fragment = {
  __typename: 'NftOwnerChannel'
  channel: { id: string; ownerMember?: Types.Maybe<{ id: string }> }
}

type StateQueryNftOwnerFields_NftOwnerMember_Fragment = {
  __typename: 'NftOwnerMember'
  member: { id: string }
}

export type StateQueryNftOwnerFieldsFragment =
  | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
  | StateQueryNftOwnerFields_NftOwnerMember_Fragment

type StateQueryTransactionalStatusFields_TransactionalStatusAuction_Fragment = {
  __typename: 'TransactionalStatusAuction'
  auction: { id: string }
}

type StateQueryTransactionalStatusFields_TransactionalStatusBuyNow_Fragment = {
  __typename: 'TransactionalStatusBuyNow'
  price: string
}

type StateQueryTransactionalStatusFields_TransactionalStatusIdle_Fragment = {
  __typename: 'TransactionalStatusIdle'
}

type StateQueryTransactionalStatusFields_TransactionalStatusInitiatedOfferToMember_Fragment = {
  __typename: 'TransactionalStatusInitiatedOfferToMember'
  offerPrice?: Types.Maybe<string>
  member: { id: string }
}

export type StateQueryTransactionalStatusFieldsFragment =
  | StateQueryTransactionalStatusFields_TransactionalStatusAuction_Fragment
  | StateQueryTransactionalStatusFields_TransactionalStatusBuyNow_Fragment
  | StateQueryTransactionalStatusFields_TransactionalStatusIdle_Fragment
  | StateQueryTransactionalStatusFields_TransactionalStatusInitiatedOfferToMember_Fragment

type StateQueryAuctionTypeFields_AuctionTypeEnglish_Fragment = {
  __typename: 'AuctionTypeEnglish'
  duration: number
  extensionPeriod: number
  plannedEndAtBlock: number
  minimalBidStep: string
}

type StateQueryAuctionTypeFields_AuctionTypeOpen_Fragment = {
  __typename: 'AuctionTypeOpen'
  bidLockDuration: number
}

export type StateQueryAuctionTypeFieldsFragment =
  | StateQueryAuctionTypeFields_AuctionTypeEnglish_Fragment
  | StateQueryAuctionTypeFields_AuctionTypeOpen_Fragment

export type StateQueryAuctionRefFieldsFragment = { id: string; nft: { id: string } }

export type StateQueryBidRefFieldsFragment = {
  id: string
  amount: string
  bidder: { id: string }
  previousTopBid?: Types.Maybe<{ id: string; bidder: { id: string } }>
  auction: StateQueryAuctionRefFieldsFragment
}

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment =
  {
    __typename: 'MetaprotocolTransactionResultChannelPaid'
    channelPaid?: Types.Maybe<{ id: string }>
  }

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment =
  {
    __typename: 'MetaprotocolTransactionResultCommentCreated'
    commentCreated?: Types.Maybe<{ id: string }>
  }

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment =
  {
    __typename: 'MetaprotocolTransactionResultCommentDeleted'
    commentDeleted?: Types.Maybe<{ id: string }>
  }

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment =
  {
    __typename: 'MetaprotocolTransactionResultCommentEdited'
    commentEdited?: Types.Maybe<{ id: string }>
  }

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment =
  {
    __typename: 'MetaprotocolTransactionResultCommentModerated'
    commentModerated?: Types.Maybe<{ id: string }>
  }

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment = {
  __typename: 'MetaprotocolTransactionResultFailed'
  errorMessage: string
}

type StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment = {
  __typename: 'MetaprotocolTransactionResultOK'
}

export type StateQueryMetaprotocolTransactionResultFieldsFragment =
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment
  | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment

export type StateQueryEventFieldsFragment = {
  id: string
  inBlock: number
  inExtrinsic?: Types.Maybe<string>
  indexInBlock: number
  createdAt: any
  data:
    | {
        member: { id: string }
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
        bid: StateQueryBidRefFieldsFragment
      }
    | {
        bid: StateQueryBidRefFieldsFragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        contentActor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
        auction: StateQueryAuctionRefFieldsFragment
      }
    | {
        winningBid: StateQueryBidRefFieldsFragment
        previousNftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        nft: { id: string }
        contentActor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        newPrice: string
        nft: { id: string }
        contentActor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        amount: string
        account?: Types.Maybe<string>
        channel: { id: string }
        actor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
      }
    | {
        amount: string
        rationale?: Types.Maybe<string>
        payer: { id: string }
        payeeChannel?: Types.Maybe<{ id: string }>
        paymentContext?: Types.Maybe<
          | { __typename: 'PaymentContextChannel'; channel: { id: string } }
          | { __typename: 'PaymentContextVideo'; video: { id: string } }
        >
      }
    | {
        commitment?: Types.Maybe<string>
        minCashoutAllowed?: Types.Maybe<string>
        maxCashoutAllowed?: Types.Maybe<string>
        channelCashoutsEnabled?: Types.Maybe<boolean>
        payloadDataObject?: Types.Maybe<{ id: string }>
      }
    | {
        amount: string
        account?: Types.Maybe<string>
        channel: { id: string }
        actor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
      }
    | { amount: string; channel: { id: string } }
    | { text: string; comment: { id: string } }
    | { newText: string; comment: { id: string } }
    | {
        winningBid: StateQueryBidRefFieldsFragment
        previousNftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        actor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
        auction: { id: string }
      }
    | { action: boolean; channel: { id: string }; member: { id: string } }
    | {
        result:
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment
          | StateQueryMetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment
      }
    | {
        price: string
        nft: { id: string }
        member: { id: string }
        previousNftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        contentActor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
        nft: { id: string }
      }
    | {
        price: string
        nft: { id: string }
        contentActor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        contentActor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        winningBid: StateQueryBidRefFieldsFragment
        previousNftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
      }
    | {
        actor:
          | StateQueryActorFields_ContentActorCurator_Fragment
          | StateQueryActorFields_ContentActorLead_Fragment
          | StateQueryActorFields_ContentActorMember_Fragment
        nftOwner:
          | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
          | StateQueryNftOwnerFields_NftOwnerMember_Fragment
        auction: StateQueryAuctionRefFieldsFragment
      }
}

export type StateQueryV2QueryVariables = Types.Exact<{ [key: string]: never }>

export type StateQueryV2Query = {
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
    platforms?: Types.Maybe<Array<Types.Maybe<string>>>
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
    language?: Types.Maybe<string>
    createdInBlock: number
    rewardAccount: string
    channelStateBloatBond: string
    cumulativeRewardClaimed?: Types.Maybe<string>
    totalVideosCreated: number
    ownerMember?: Types.Maybe<{ id: string }>
    coverPhoto?: Types.Maybe<{ id: string }>
    avatarPhoto?: Types.Maybe<{ id: string }>
    videos: Array<{ id: string }>
    bannedMembers: Array<{ member: { id: string } }>
    entryApp?: Types.Maybe<{ id: string }>
  }>
  commentCreatedEvents: Array<StateQueryEventFieldsFragment>
  commentTextUpdatedEvents: Array<StateQueryEventFieldsFragment>
  openAuctionStartedEvents: Array<StateQueryEventFieldsFragment>
  englishAuctionStartedEvents: Array<StateQueryEventFieldsFragment>
  nftIssuedEvents: Array<StateQueryEventFieldsFragment>
  auctionBidMadeEvents: Array<StateQueryEventFieldsFragment>
  auctionBidCanceledEvents: Array<StateQueryEventFieldsFragment>
  auctionCanceledEvents: Array<StateQueryEventFieldsFragment>
  englishAuctionSettledEvents: Array<StateQueryEventFieldsFragment>
  bidMadeCompletingAuctionEvents: Array<StateQueryEventFieldsFragment>
  openAuctionBidAcceptedEvents: Array<StateQueryEventFieldsFragment>
  nftSellOrderMadeEvents: Array<StateQueryEventFieldsFragment>
  nftBoughtEvents: Array<StateQueryEventFieldsFragment>
  buyNowCanceledEvents: Array<StateQueryEventFieldsFragment>
  buyNowPriceUpdatedEvents: Array<StateQueryEventFieldsFragment>
  metaprotocolTransactionStatusEvents: Array<StateQueryEventFieldsFragment>
  channelRewardClaimedEvents: Array<StateQueryEventFieldsFragment>
  channelRewardClaimedAndWithdrawnEvents: Array<StateQueryEventFieldsFragment>
  channelFundsWithdrawnEvents: Array<StateQueryEventFieldsFragment>
  channelPayoutsUpdatedEvents: Array<StateQueryEventFieldsFragment>
  channelPaymentMadeEvents: Array<StateQueryEventFieldsFragment>
  memberBannedFromChannelEvents: Array<StateQueryEventFieldsFragment>
  memberships: Array<{
    id: string
    createdAt: any
    handle: string
    controllerAccount: string
    totalChannelsCreated: number
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
    owner:
      | StateQueryNftOwnerFields_NftOwnerChannel_Fragment
      | StateQueryNftOwnerFields_NftOwnerMember_Fragment
    transactionalStatus?: Types.Maybe<
      | StateQueryTransactionalStatusFields_TransactionalStatusAuction_Fragment
      | StateQueryTransactionalStatusFields_TransactionalStatusBuyNow_Fragment
      | StateQueryTransactionalStatusFields_TransactionalStatusIdle_Fragment
      | StateQueryTransactionalStatusFields_TransactionalStatusInitiatedOfferToMember_Fragment
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
      | StateQueryAuctionTypeFields_AuctionTypeEnglish_Fragment
      | StateQueryAuctionTypeFields_AuctionTypeOpen_Fragment
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

export const ExtendedVideoCategoryFields = gql`
  fragment ExtendedVideoCategoryFields on ExtendedVideoCategory {
    category {
      id
      name
    }
    activeVideosCount
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
export const BasicChannelFields = gql`
  fragment BasicChannelFields on Channel {
    id
    title
    description
    createdAt
    followsNum
    rewardAccount
    channelStateBloatBond
    avatarPhoto {
      ...StorageDataObjectFields
    }
  }
  ${StorageDataObjectFields}
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
export const FullChannelFields = gql`
  fragment FullChannelFields on Channel {
    ...BasicChannelFields
    videoViewsNum
    description
    isPublic
    isCensored
    cumulativeRewardClaimed
    language
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
export const ExtendedFullChannelFields = gql`
  fragment ExtendedFullChannelFields on ExtendedChannel {
    channel {
      ...FullChannelFields
    }
    activeVideosCount
  }
  ${FullChannelFields}
`
export const ExtendedBasicChannelFields = gql`
  fragment ExtendedBasicChannelFields on ExtendedChannel {
    channel {
      ...BasicChannelFields
    }
    activeVideosCount
  }
  ${BasicChannelFields}
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
    owner {
      ... on NftOwnerChannel {
        channel {
          ...BasicChannelFields
        }
      }
      ... on NftOwnerMember {
        member {
          ...BasicMembershipFields
        }
      }
    }
    transactionalStatus {
      __typename
      ... on TransactionalStatusBuyNow {
        price
      }
      ... on TransactionalStatusAuction {
        auction {
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
            member {
              ...BasicMembershipFields
            }
          }
        }
      }
    }
  }
  ${BasicChannelFields}
  ${BasicMembershipFields}
  ${BasicBidFields}
`
export const SubtitlesFields = gql`
  fragment SubtitlesFields on VideoSubtitle {
    id
    language
    asset {
      ...StorageDataObjectFields
    }
    mimeType
    type
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
      member {
        id
      }
    }
    category {
      id
      name
    }
    viewsNum
    duration
    createdAt
    isPublic
    isExplicit
    hasMarketing
    isCensored
    isCommentSectionEnabled
    commentsCount
    language
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
    viewsNum
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
    video {
      ...BasicVideoFields
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${BasicNftFields}
  ${BasicVideoFields}
  ${BasicChannelFields}
`
export const FullBidFields = gql`
  fragment FullBidFields on Bid {
    ...BasicBidFields
    auction {
      auctionType {
        __typename
      }
      isCompleted
      winningMember {
        id
      }
      id
    }
  }
  ${BasicBidFields}
`
export const CommentReactionsCountByReactionIdFields = gql`
  fragment CommentReactionsCountByReactionIdFields on CommentReactionsCountByReactionId {
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
    parentComment {
      id
    }
    repliesCount
    text
    status
  }
  ${BasicMembershipFields}
  ${CommentReactionsCountByReactionIdFields}
`
export const MetaprotocolTransactionResultFields = gql`
  fragment MetaprotocolTransactionResultFields on MetaprotocolTransactionResult {
    __typename
    ... on MetaprotocolTransactionResultCommentCreated {
      commentCreated {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultCommentEdited {
      commentEdited {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultCommentDeleted {
      commentDeleted {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultCommentModerated {
      commentModerated {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultFailed {
      errorMessage
    }
  }
  ${CommentFields}
`
export const BasicNftOwnerFields = gql`
  fragment BasicNftOwnerFields on NftOwner {
    __typename
    ... on NftOwnerMember {
      member {
        ...BasicMembershipFields
      }
    }
    ... on NftOwnerChannel {
      channel {
        ownerMember {
          ...BasicMembershipFields
        }
      }
    }
  }
  ${BasicMembershipFields}
`
export const StateQueryTransactionalStatusFields = gql`
  fragment StateQueryTransactionalStatusFields on TransactionalStatus {
    __typename
    ... on TransactionalStatusInitiatedOfferToMember {
      member {
        id
      }
      offerPrice: price
    }
    ... on TransactionalStatusBuyNow {
      price
    }
    ... on TransactionalStatusAuction {
      auction {
        id
      }
    }
  }
`
export const StateQueryAuctionTypeFields = gql`
  fragment StateQueryAuctionTypeFields on AuctionType {
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
export const StateQueryActorFields = gql`
  fragment StateQueryActorFields on ContentActor {
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
export const StateQueryNftOwnerFields = gql`
  fragment StateQueryNftOwnerFields on NftOwner {
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
export const StateQueryAuctionRefFields = gql`
  fragment StateQueryAuctionRefFields on Auction {
    id
    nft {
      id
    }
  }
`
export const StateQueryBidRefFields = gql`
  fragment StateQueryBidRefFields on Bid {
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
      ...StateQueryAuctionRefFields
    }
  }
  ${StateQueryAuctionRefFields}
`
export const StateQueryMetaprotocolTransactionResultFields = gql`
  fragment StateQueryMetaprotocolTransactionResultFields on MetaprotocolTransactionResult {
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
export const StateQueryEventFields = gql`
  fragment StateQueryEventFields on Event {
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
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
        auction {
          ...StateQueryAuctionRefFields
        }
      }
      ... on EnglishAuctionStartedEventData {
        actor {
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
        auction {
          id
        }
      }
      ... on NftIssuedEventData {
        contentActor: actor {
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
        nft {
          id
        }
      }
      ... on AuctionBidMadeEventData {
        bid {
          ...StateQueryBidRefFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
      }
      ... on AuctionBidCanceledEventData {
        member {
          id
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
        bid {
          ...StateQueryBidRefFields
        }
      }
      ... on AuctionCanceledEventData {
        contentActor: actor {
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
        auction {
          ...StateQueryAuctionRefFields
        }
      }
      ... on EnglishAuctionSettledEventData {
        winningBid {
          ...StateQueryBidRefFields
        }
        previousNftOwner {
          ...StateQueryNftOwnerFields
        }
      }
      ... on BidMadeCompletingAuctionEventData {
        winningBid {
          ...StateQueryBidRefFields
        }
        previousNftOwner {
          ...StateQueryNftOwnerFields
        }
      }
      ... on OpenAuctionBidAcceptedEventData {
        contentActor: actor {
          ...StateQueryActorFields
        }
        winningBid {
          ...StateQueryBidRefFields
        }
        previousNftOwner {
          ...StateQueryNftOwnerFields
        }
      }
      ... on NftSellOrderMadeEventData {
        nft {
          id
        }
        contentActor: actor {
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
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
          ...StateQueryNftOwnerFields
        }
        price
      }
      ... on BuyNowCanceledEventData {
        nft {
          id
        }
        contentActor: actor {
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
      }
      ... on BuyNowPriceUpdatedEventData {
        nft {
          id
        }
        contentActor: actor {
          ...StateQueryActorFields
        }
        nftOwner {
          ...StateQueryNftOwnerFields
        }
        newPrice
      }
      ... on MetaprotocolTransactionStatusEventData {
        result {
          ...StateQueryMetaprotocolTransactionResultFields
        }
      }
      ... on ChannelRewardClaimedEventData {
        channel {
          id
        }
        amount
      }
      ... on ChannelRewardClaimedAndWithdrawnEventData {
        channel {
          id
        }
        amount
        account
        actor {
          ...StateQueryActorFields
        }
      }
      ... on ChannelFundsWithdrawnEventData {
        channel {
          id
        }
        amount
        account
        actor {
          ...StateQueryActorFields
        }
      }
      ... on ChannelPayoutsUpdatedEventData {
        commitment
        payloadDataObject {
          id
        }
        minCashoutAllowed
        maxCashoutAllowed
        channelCashoutsEnabled
      }
      ... on ChannelPaymentMadeEventData {
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
      ... on MemberBannedFromChannelEventData {
        channel {
          id
        }
        member {
          id
        }
        action
      }
    }
  }
  ${StateQueryActorFields}
  ${StateQueryNftOwnerFields}
  ${StateQueryAuctionRefFields}
  ${StateQueryBidRefFields}
  ${StateQueryMetaprotocolTransactionResultFields}
`
export const GetKillSwitch = gql`
  query GetKillSwitch {
    getKillSwitch {
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
export const GetExtendedVideoCategories = gql`
  query GetExtendedVideoCategories {
    extendedVideoCategories {
      ...ExtendedVideoCategoryFields
    }
  }
  ${ExtendedVideoCategoryFields}
`
export const GetFullChannel = gql`
  query GetFullChannel($id: String!) {
    channelById(id: $id) {
      ...FullChannelFields
    }
  }
  ${FullChannelFields}
`
export const GetVideoCount = gql`
  query GetVideoCount($where: VideoWhereInput) {
    videosConnection(first: 0, where: $where, orderBy: id_ASC) {
      totalCount
    }
  }
`
export const GetExtendedBasicChannels = gql`
  query GetExtendedBasicChannels(
    $where: ExtendedChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    extendedChannels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...ExtendedBasicChannelFields
    }
  }
  ${ExtendedBasicChannelFields}
`
export const GetExtendedFullChannels = gql`
  query GetExtendedFullChannels(
    $where: ExtendedChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    extendedChannels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...ExtendedFullChannelFields
    }
  }
  ${ExtendedFullChannelFields}
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
  mutation FollowChannel($channelId: String!) {
    followChannel(channelId: $channelId) {
      channelId
      follows
      cancelToken
    }
  }
`
export const UnfollowChannel = gql`
  mutation UnfollowChannel($channelId: String!, $token: String!) {
    unfollowChannel(channelId: $channelId, token: $token) {
      channelId
      follows
    }
  }
`
export const GetTop10Channels = gql`
  query GetTop10Channels($where: ExtendedChannelWhereInput) {
    extendedChannels(where: $where, orderBy: followsNum_DESC, limit: 10) {
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${BasicChannelFields}
`
export const GetPromisingChannels = gql`
  query GetPromisingChannels($where: ExtendedChannelWhereInput) {
    mostRecentChannels(
      where: $where
      orderBy: videoViewsNum_DESC
      mostRecentLimit: 100
      resultsLimit: 15
    ) {
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${BasicChannelFields}
`
export const GetDiscoverChannels = gql`
  query GetDiscoverChannels($where: ExtendedChannelWhereInput) {
    mostRecentChannels(
      where: $where
      orderBy: followsNum_DESC
      mostRecentLimit: 100
      resultsLimit: 15
    ) {
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${BasicChannelFields}
`
export const GetPopularChannels = gql`
  query GetPopularChannels($where: ExtendedChannelWhereInput) {
    extendedChannels(where: $where, orderBy: videoViewsNum_DESC, limit: 15) {
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${BasicChannelFields}
`
export const GetChannelNftCollectors = gql`
  query GetChannelNftCollectors(
    $channelId: String!
    $orderBy: ChannelNftCollectorsOrderByInput = amount_DESC
  ) {
    channelNftCollectors(channelId: $channelId, orderBy: $orderBy) {
      member {
        ...BasicMembershipFields
      }
      amount
    }
  }
  ${BasicMembershipFields}
`
export const GetPayloadDataObjectIdByCommitment = gql`
  query GetPayloadDataObjectIdByCommitment($commitment: String!) {
    events(
      where: { data: { isTypeOf_eq: "ChannelPayoutsUpdatedEventData", commitment_eq: $commitment } }
      limit: 1
    ) {
      data {
        ... on ChannelPayoutsUpdatedEventData {
          payloadDataObject {
            id
            storageBag {
              id
            }
          }
        }
      }
    }
  }
`
export const GetTopSellingChannels = gql`
  query GetTopSellingChannels($where: ExtendedChannelWhereInput, $limit: Int!, $periodDays: Int!) {
    topSellingChannels(where: $where, limit: $limit, periodDays: $periodDays) {
      channel {
        ...BasicChannelFields
      }
      amount
    }
  }
  ${BasicChannelFields}
`
export const ReportChannel = gql`
  mutation ReportChannel($channelId: String!, $rationale: String!) {
    reportChannel(channelId: $channelId, rationale: $rationale) {
      id
      channelId
    }
  }
`
export const GetChannelPaymentEvents = gql`
  query GetChannelPaymentEvents($ownerMemberId: String!, $channelId: String!) {
    events(
      where: {
        OR: [
          {
            AND: [
              {
                data: {
                  isTypeOf_in: [
                    "NftBoughtEventData"
                    "BidMadeCompletingAuctionEventData"
                    "EnglishAuctionSettledEventData"
                    "OpenAuctionBidAcceptedEventData"
                  ]
                }
              }
              {
                OR: [
                  { data: { previousNftOwner: { member: { id_eq: $ownerMemberId } } } }
                  {
                    data: {
                      previousNftOwner: { channel: { ownerMember: { id_eq: $ownerMemberId } } }
                    }
                  }
                ]
              }
            ]
          }
          {
            data: {
              isTypeOf_in: ["ChannelRewardClaimedEventData", "ChannelFundsWithdrawnEventData"]
              channel: { id_eq: $channelId }
            }
          }
        ]
      }
    ) {
      inBlock
      timestamp
      data {
        __typename
        ... on NftBoughtEventData {
          price
        }
        ... on BidMadeCompletingAuctionEventData {
          winningBid {
            amount
          }
        }
        ... on EnglishAuctionSettledEventData {
          winningBid {
            amount
          }
        }
        ... on OpenAuctionBidAcceptedEventData {
          winningBid {
            amount
          }
        }
      }
    }
  }
`
export const GetComment = gql`
  query GetComment($commentId: String!) {
    commentById(id: $commentId) {
      ...CommentFields
    }
  }
  ${CommentFields}
`
export const GetCommentRepliesConnection = gql`
  query GetCommentRepliesConnection(
    $first: Int
    $after: String
    $parentCommentId: String!
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
    $memberId: String
    $videoId: String
    $orderBy: [CommentOrderByInput!] = [createdAt_DESC]
  ) {
    userComments: comments(
      where: {
        AND: [
          { parentComment: { id_isNull: true } }
          { video: { id_eq: $videoId } }
          { author: { id_eq: $memberId } }
          { OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }] }
        ]
      }
      orderBy: [createdAt_DESC]
    ) {
      ...CommentFields
    }
    videoCommentsConnection: commentsConnection(
      first: $first
      after: $after
      where: {
        AND: [
          { video: { id_eq: $videoId } }
          { parentComment: { id_isNull: true } }
          { OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }] }
        ]
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
  query GetUserCommentsReactions($memberId: String!, $videoId: String!) {
    commentReactions(
      where: { member: { id_eq: $memberId }, video: { id_eq: $videoId } }
      limit: 1000
    ) {
      reactionId
      comment {
        id
      }
    }
  }
`
export const GetCommentEdits = gql`
  query GetCommentEdits($commentId: String!) {
    events(
      where: {
        data: {
          isTypeOf_in: ["CommentCreatedEventData", "CommentTextUpdatedEventData"]
          comment: { id_eq: $commentId }
        }
      }
    ) {
      id
      timestamp
      data {
        ... on CommentCreatedEventData {
          text
        }
        ... on CommentTextUpdatedEventData {
          newText
        }
      }
    }
  }
`
export const GetDataObjectAvailability = gql`
  query GetDataObjectAvailability($id_eq: String, $id_in: [String!], $limit: Int) {
    storageDataObjects(where: { id_eq: $id_eq, id_in: $id_in }, limit: $limit) {
      id
      isAccepted
    }
  }
`
export const GetVideoHero = gql`
  query GetVideoHero {
    videoHero {
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
    videoCategories(where: { featuredVideos_some: { video_isNull: false } }) {
      id
      name
      featuredVideos(limit: 3) {
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
  query GetCategoriesFeaturedVideos($categoryId: String!) {
    videoCategoryById(id: $categoryId) {
      featuredVideos {
        videoCutUrl
        video {
          ...FullVideoFields
        }
      }
    }
  }
  ${FullVideoFields}
`
export const GetMemberships = gql`
  query GetMemberships($where: MembershipWhereInput!, $limit: Int) {
    memberships(where: $where, orderBy: [createdAt_ASC], limit: $limit) {
      ...FullMembershipFields
    }
  }
  ${FullMembershipFields}
`
export const GetNft = gql`
  query GetNft($id: String!) {
    ownedNftById(id: $id) {
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
    ownedNfts(where: $where, orderBy: $orderBy, limit: $limit) {
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
export const GetEndingAuctionsNfts = gql`
  query GetEndingAuctionsNfts($where: OwnedNftWhereInput, $limit: Int, $offset: Int) {
    endingAuctionsNfts(where: $where, limit: $limit, offset: $offset) {
      ...FullNftFields
    }
  }
  ${FullNftFields}
`
export const GetNotifications = gql`
  query GetNotifications($memberId: String!, $limit: Int!) {
    notifications(
      limit: $limit
      orderBy: event_timestamp_DESC
      where: { member: { id_eq: $memberId } }
    ) {
      event {
        id
        timestamp
        inBlock
        data {
          ... on AuctionBidMadeEventData {
            bid {
              bidder {
                ...BasicMembershipFields
              }
              previousTopBid {
                bidder {
                  ...BasicMembershipFields
                }
              }
              auction {
                nft {
                  video {
                    id
                    title
                  }
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on NftBoughtEventData {
            buyer {
              ...BasicMembershipFields
            }
            price
            nft {
              video {
                id
                title
              }
            }
          }
          ... on BidMadeCompletingAuctionEventData {
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
              amount
              nft {
                video {
                  id
                  title
                }
              }
            }
            previousNftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on OpenAuctionBidAcceptedEventData {
            winningBid {
              amount
              bidder {
                ...BasicMembershipFields
              }
              auction {
                nft {
                  video {
                    id
                    title
                  }
                }
              }
            }
            previousNftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on EnglishAuctionSettledEventData {
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
              auction {
                nft {
                  video {
                    id
                    title
                  }
                }
              }
            }
            previousNftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on CommentCreatedEventData {
            comment {
              id
              video {
                id
                title
              }
              parentComment {
                id
              }
              author {
                ...BasicMembershipFields
              }
            }
          }
        }
      }
    }
  }
  ${BasicMembershipFields}
  ${BasicNftOwnerFields}
`
export const GetNftHistory = gql`
  query GetNftHistory($nftId: String!) {
    nftHistoryEntries(orderBy: event_timestamp_DESC, where: { nft: { id_eq: $nftId } }) {
      event {
        id
        timestamp
        data {
          ... on NftIssuedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on OpenAuctionStartedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on EnglishAuctionStartedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on NftSellOrderMadeEventData {
            price
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on AuctionBidMadeEventData {
            bid {
              bidder {
                ...BasicMembershipFields
              }
              amount
            }
          }
          ... on BidMadeCompletingAuctionEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
              amount
            }
          }
          ... on NftBoughtEventData {
            buyer {
              ...BasicMembershipFields
            }
            price
          }
          ... on EnglishAuctionSettledEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
            }
          }
          ... on OpenAuctionBidAcceptedEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              amount
              bidder {
                ...BasicMembershipFields
              }
            }
          }
          ... on AuctionBidCanceledEventData {
            member {
              ...BasicMembershipFields
            }
          }
          ... on AuctionCanceledEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on BuyNowCanceledEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on BuyNowPriceUpdatedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
            newPrice
          }
        }
      }
    }
  }
  ${BasicNftOwnerFields}
  ${BasicMembershipFields}
`
export const GetNftActivities = gql`
  query GetNftActivities($memberId: String!, $limit: Int!) {
    nftActivities(
      limit: $limit
      orderBy: event_timestamp_DESC
      where: { member: { id_eq: $memberId } }
    ) {
      event {
        id
        timestamp
        inBlock
        data {
          ... on AuctionBidMadeEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
            bid {
              amount
              bidder {
                ...BasicMembershipFields
              }
              previousTopBid {
                bidder {
                  ...BasicMembershipFields
                }
              }
              auction {
                nft {
                  video {
                    id
                    title
                    thumbnailPhoto {
                      ...StorageDataObjectFields
                    }
                  }
                }
              }
            }
          }
          ... on EnglishAuctionSettledEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
              amount
              auction {
                nft {
                  video {
                    id
                    title
                    thumbnailPhoto {
                      ...StorageDataObjectFields
                    }
                  }
                }
              }
            }
          }
          ... on NftBoughtEventData {
            buyer {
              ...BasicMembershipFields
            }
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            nft {
              video {
                id
                title
                thumbnailPhoto {
                  ...StorageDataObjectFields
                }
              }
            }
            price
          }
          ... on BidMadeCompletingAuctionEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
              auction {
                nft {
                  video {
                    id
                    title
                    thumbnailPhoto {
                      ...StorageDataObjectFields
                    }
                  }
                }
              }
              amount
            }
          }
          ... on OpenAuctionBidAcceptedEventData {
            winningBid {
              amount
              bidder {
                ...BasicMembershipFields
              }
              auction {
                nft {
                  video {
                    id
                    title
                    thumbnailPhoto {
                      id
                    }
                  }
                }
              }
            }
            previousNftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on EnglishAuctionStartedEventData {
            auction {
              nft {
                video {
                  id
                  title
                  thumbnailPhoto {
                    ...StorageDataObjectFields
                  }
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on OpenAuctionStartedEventData {
            auction {
              nft {
                video {
                  id
                  title
                  thumbnailPhoto {
                    ...StorageDataObjectFields
                  }
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on NftSellOrderMadeEventData {
            price
            nft {
              video {
                id
                title
                thumbnailPhoto {
                  ...StorageDataObjectFields
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on AuctionBidCanceledEventData {
            member {
              ...BasicMembershipFields
            }
            bid {
              auction {
                nft {
                  video {
                    id
                    title
                    thumbnailPhoto {
                      ...StorageDataObjectFields
                    }
                  }
                }
              }
            }
          }
          ... on BuyNowCanceledEventData {
            nft {
              video {
                id
                title
                thumbnailPhoto {
                  ...StorageDataObjectFields
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on AuctionCanceledEventData {
            auction {
              nft {
                video {
                  id
                  title
                  thumbnailPhoto {
                    ...StorageDataObjectFields
                  }
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on BuyNowPriceUpdatedEventData {
            newPrice
            nft {
              video {
                id
                title
                thumbnailPhoto {
                  ...StorageDataObjectFields
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on NftIssuedEventData {
            nft {
              video {
                id
                title
                thumbnailPhoto {
                  ...StorageDataObjectFields
                }
              }
            }
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
        }
      }
    }
  }
  ${BasicNftOwnerFields}
  ${BasicMembershipFields}
  ${StorageDataObjectFields}
`
export const GetQueryNodeState = gql`
  subscription GetQueryNodeState {
    processorState {
      lastProcessedBlock
    }
  }
`
export const GetDistributionBucketsWithBags = gql`
  query GetDistributionBucketsWithBags {
    distributionBuckets(limit: 500, where: { distributing_eq: true }) {
      id
      bags {
        bag {
          id
        }
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
        operatorStatus: { isTypeOf_eq: "StorageBucketOperatorStatusActive" }
        operatorMetadata: { nodeEndpoint_contains: "http" }
      }
    ) {
      id
      operatorMetadata {
        nodeEndpoint
      }
      bags {
        bag {
          id
        }
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
    events(
      where: {
        data: { isTypeOf_eq: "MetaprotocolTransactionStatusEventData" }
        inExtrinsic_eq: $transactionHash
      }
    ) {
      inExtrinsic
      inBlock
      data {
        ... on MetaprotocolTransactionStatusEventData {
          result {
            ...MetaprotocolTransactionResultFields
          }
        }
      }
    }
  }
  ${MetaprotocolTransactionResultFields}
`
export const GetFullVideo = gql`
  query GetFullVideo($id: String!) {
    videoById(id: $id) {
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
    mostViewedVideosConnection(limit: 10, where: $where, periodDays: 7, orderBy: createdAt_DESC) {
      edges {
        node {
          ...BasicVideoFields
        }
      }
    }
  }
  ${BasicVideoFields}
`
export const GetTop10VideosThisMonth = gql`
  query GetTop10VideosThisMonth($where: VideoWhereInput) {
    mostViewedVideosConnection(limit: 10, where: $where, periodDays: 30, orderBy: createdAt_DESC) {
      edges {
        node {
          ...BasicVideoFields
        }
      }
    }
  }
  ${BasicVideoFields}
`
export const AddVideoView = gql`
  mutation AddVideoView($videoId: String!) {
    addVideoView(videoId: $videoId) {
      videoId
      viewsNum
    }
  }
`
export const ReportVideo = gql`
  mutation ReportVideo($videoId: String!, $rationale: String!) {
    reportVideo(videoId: $videoId, rationale: $rationale) {
      id
      videoId
    }
  }
`
export const StateQueryV2 = gql`
  query StateQueryV2 {
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
      cumulativeRewardClaimed
      entryApp {
        id
      }
      totalVideosCreated
    }
    commentCreatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "CommentCreatedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    commentTextUpdatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "CommentTextUpdatedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    openAuctionStartedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "OpenAuctionStartedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    englishAuctionStartedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "EnglishAuctionStartedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    nftIssuedEvents: events(limit: 9999, where: { data: { isTypeOf_eq: "NftIssuedEventData" } }) {
      ...StateQueryEventFields
    }
    auctionBidMadeEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "AuctionBidMadeEventData" } }
    ) {
      ...StateQueryEventFields
    }
    auctionBidCanceledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "AuctionBidCanceledEventData" } }
    ) {
      ...StateQueryEventFields
    }
    auctionCanceledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "AuctionCanceledEventData" } }
    ) {
      ...StateQueryEventFields
    }
    englishAuctionSettledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "EnglishAuctionSettledEventData" } }
    ) {
      ...StateQueryEventFields
    }
    bidMadeCompletingAuctionEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "BidMadeCompletingAuctionEventData" } }
    ) {
      ...StateQueryEventFields
    }
    openAuctionBidAcceptedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "OpenAuctionBidAcceptedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    nftSellOrderMadeEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "NftSellOrderMadeEventData" } }
    ) {
      ...StateQueryEventFields
    }
    nftBoughtEvents: events(limit: 9999, where: { data: { isTypeOf_eq: "NftBoughtEventData" } }) {
      ...StateQueryEventFields
    }
    buyNowCanceledEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "BuyNowCanceledEventData" } }
    ) {
      ...StateQueryEventFields
    }
    buyNowPriceUpdatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "BuyNowPriceUpdatedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    metaprotocolTransactionStatusEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "MetaprotocolTransactionStatusEventData" } }
    ) {
      ...StateQueryEventFields
    }
    channelRewardClaimedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "ChannelRewardClaimedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    channelRewardClaimedAndWithdrawnEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "ChannelRewardClaimedAndWithdrawnEventData" } }
    ) {
      ...StateQueryEventFields
    }
    channelFundsWithdrawnEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "ChannelFundsWithdrawnEventData" } }
    ) {
      ...StateQueryEventFields
    }
    channelPayoutsUpdatedEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "ChannelPayoutsUpdatedEventData" } }
    ) {
      ...StateQueryEventFields
    }
    channelPaymentMadeEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "ChannelPaymentMadeEventData" } }
    ) {
      ...StateQueryEventFields
    }
    memberBannedFromChannelEvents: events(
      limit: 9999
      where: { data: { isTypeOf_eq: "MemberBannedFromChannelEventData" } }
    ) {
      ...StateQueryEventFields
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
      owner {
        ...StateQueryNftOwnerFields
      }
      transactionalStatus {
        ...StateQueryTransactionalStatusFields
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
        ...StateQueryAuctionTypeFields
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
  ${StateQueryEventFields}
  ${StateQueryNftOwnerFields}
  ${StateQueryTransactionalStatusFields}
  ${StateQueryAuctionTypeFields}
`
