"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChannelPaymentEvents = exports.ReportChannel = exports.GetTopSellingChannels = exports.GetPayloadDataObjectIdByCommitment = exports.GetChannelNftCollectors = exports.GetPopularChannels = exports.GetDiscoverChannels = exports.GetPromisingChannels = exports.GetTop10Channels = exports.UnfollowChannel = exports.FollowChannel = exports.GetBasicChannelsConnection = exports.GetExtendedFullChannels = exports.GetExtendedBasicChannels = exports.GetVideoCount = exports.GetFullChannel = exports.GetExtendedVideoCategories = exports.GetBids = exports.SetKillSwitch = exports.GetKillSwitch = exports.StateQueryEventFields = exports.StateQueryMetaprotocolTransactionResultFields = exports.StateQueryBidRefFields = exports.StateQueryAuctionRefFields = exports.StateQueryNftOwnerFields = exports.StateQueryActorFields = exports.StateQueryAuctionTypeFields = exports.StateQueryTransactionalStatusFields = exports.BasicNftOwnerFields = exports.MetaprotocolTransactionResultFields = exports.CommentFields = exports.CommentReactionsCountByReactionIdFields = exports.FullBidFields = exports.FullNftFields = exports.BasicVideoFields = exports.FullVideoFields = exports.SubtitlesFields = exports.BasicNftFields = exports.BasicBidFields = exports.LicenseFields = exports.VideoMediaMetadataFields = exports.DistributionBucketOperatorField = exports.FullMembershipFields = exports.ExtendedBasicChannelFields = exports.ExtendedFullChannelFields = exports.FullChannelFields = exports.BasicMembershipFields = exports.BasicChannelFields = exports.StorageDataObjectFields = exports.ExtendedVideoCategoryFields = void 0;
exports.StateQueryV2 = exports.ReportVideo = exports.AddVideoView = exports.GetTop10VideosThisMonth = exports.GetTop10VideosThisWeek = exports.GetMostViewedVideosConnection = exports.GetFullVideos = exports.GetBasicVideos = exports.GetFullVideosConnection = exports.GetBasicVideosConnection = exports.GetFullVideo = exports.GetMetaprotocolTransactionStatusEvents = exports.GetBasicStorageBuckets = exports.GetBasicDistributionBuckets = exports.GetStorageBucketsWithBags = exports.GetDistributionBucketsWithBags = exports.GetQueryNodeState = exports.GetNftActivities = exports.GetNftHistory = exports.GetNotifications = exports.GetEndingAuctionsNfts = exports.GetNftsConnection = exports.GetNfts = exports.GetNft = exports.GetMemberships = exports.GetCategoriesFeaturedVideos = exports.GetAllCategoriesFeaturedVideos = exports.GetVideoHero = exports.GetDataObjectAvailability = exports.GetCommentEdits = exports.GetUserCommentsReactions = exports.GetUserCommentsAndVideoCommentsConnection = exports.GetCommentRepliesConnection = exports.GetComment = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ExtendedVideoCategoryFields = (0, graphql_tag_1.default) `
  fragment ExtendedVideoCategoryFields on ExtendedVideoCategory {
    category {
      id
      name
    }
    activeVideosCount
  }
`;
exports.StorageDataObjectFields = (0, graphql_tag_1.default) `
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
`;
exports.BasicChannelFields = (0, graphql_tag_1.default) `
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
  ${exports.StorageDataObjectFields}
`;
exports.BasicMembershipFields = (0, graphql_tag_1.default) `
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
  ${exports.StorageDataObjectFields}
`;
exports.FullChannelFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
  ${exports.BasicMembershipFields}
  ${exports.StorageDataObjectFields}
`;
exports.ExtendedFullChannelFields = (0, graphql_tag_1.default) `
  fragment ExtendedFullChannelFields on ExtendedChannel {
    channel {
      ...FullChannelFields
    }
    activeVideosCount
  }
  ${exports.FullChannelFields}
`;
exports.ExtendedBasicChannelFields = (0, graphql_tag_1.default) `
  fragment ExtendedBasicChannelFields on ExtendedChannel {
    channel {
      ...BasicChannelFields
    }
    activeVideosCount
  }
  ${exports.BasicChannelFields}
`;
exports.FullMembershipFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
  ${exports.BasicChannelFields}
  ${exports.StorageDataObjectFields}
`;
exports.DistributionBucketOperatorField = (0, graphql_tag_1.default) `
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
`;
exports.VideoMediaMetadataFields = (0, graphql_tag_1.default) `
  fragment VideoMediaMetadataFields on VideoMediaMetadata {
    id
    pixelHeight
    pixelWidth
  }
`;
exports.LicenseFields = (0, graphql_tag_1.default) `
  fragment LicenseFields on License {
    id
    code
    attribution
    customText
  }
`;
exports.BasicBidFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
`;
exports.BasicNftFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
  ${exports.BasicMembershipFields}
  ${exports.BasicBidFields}
`;
exports.SubtitlesFields = (0, graphql_tag_1.default) `
  fragment SubtitlesFields on VideoSubtitle {
    id
    language
    asset {
      ...StorageDataObjectFields
    }
    mimeType
    type
  }
  ${exports.StorageDataObjectFields}
`;
exports.FullVideoFields = (0, graphql_tag_1.default) `
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
  ${exports.VideoMediaMetadataFields}
  ${exports.StorageDataObjectFields}
  ${exports.FullChannelFields}
  ${exports.LicenseFields}
  ${exports.BasicNftFields}
  ${exports.SubtitlesFields}
`;
exports.BasicVideoFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
  ${exports.StorageDataObjectFields}
  ${exports.BasicNftFields}
`;
exports.FullNftFields = (0, graphql_tag_1.default) `
  fragment FullNftFields on OwnedNft {
    ...BasicNftFields
    video {
      ...BasicVideoFields
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${exports.BasicNftFields}
  ${exports.BasicVideoFields}
  ${exports.BasicChannelFields}
`;
exports.FullBidFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicBidFields}
`;
exports.CommentReactionsCountByReactionIdFields = (0, graphql_tag_1.default) `
  fragment CommentReactionsCountByReactionIdFields on CommentReactionsCountByReactionId {
    count
    reactionId
  }
`;
exports.CommentFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
  ${exports.CommentReactionsCountByReactionIdFields}
`;
exports.MetaprotocolTransactionResultFields = (0, graphql_tag_1.default) `
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
  ${exports.CommentFields}
`;
exports.BasicNftOwnerFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
`;
exports.StateQueryTransactionalStatusFields = (0, graphql_tag_1.default) `
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
`;
exports.StateQueryAuctionTypeFields = (0, graphql_tag_1.default) `
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
`;
exports.StateQueryActorFields = (0, graphql_tag_1.default) `
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
`;
exports.StateQueryNftOwnerFields = (0, graphql_tag_1.default) `
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
`;
exports.StateQueryAuctionRefFields = (0, graphql_tag_1.default) `
  fragment StateQueryAuctionRefFields on Auction {
    id
    nft {
      id
    }
  }
`;
exports.StateQueryBidRefFields = (0, graphql_tag_1.default) `
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
  ${exports.StateQueryAuctionRefFields}
`;
exports.StateQueryMetaprotocolTransactionResultFields = (0, graphql_tag_1.default) `
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
`;
exports.StateQueryEventFields = (0, graphql_tag_1.default) `
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
  ${exports.StateQueryActorFields}
  ${exports.StateQueryNftOwnerFields}
  ${exports.StateQueryAuctionRefFields}
  ${exports.StateQueryBidRefFields}
  ${exports.StateQueryMetaprotocolTransactionResultFields}
`;
exports.GetKillSwitch = (0, graphql_tag_1.default) `
  query GetKillSwitch {
    getKillSwitch {
      isKilled
    }
  }
`;
exports.SetKillSwitch = (0, graphql_tag_1.default) `
  mutation SetKillSwitch($isKilled: Boolean!) {
    setKillSwitch(isKilled: $isKilled) {
      isKilled
    }
  }
`;
exports.GetBids = (0, graphql_tag_1.default) `
  query GetBids($where: BidWhereInput!, $limit: Int) {
    bids(where: $where, limit: $limit, orderBy: [createdAt_ASC]) {
      ...FullBidFields
    }
  }
  ${exports.FullBidFields}
`;
exports.GetExtendedVideoCategories = (0, graphql_tag_1.default) `
  query GetExtendedVideoCategories {
    extendedVideoCategories {
      ...ExtendedVideoCategoryFields
    }
  }
  ${exports.ExtendedVideoCategoryFields}
`;
exports.GetFullChannel = (0, graphql_tag_1.default) `
  query GetFullChannel($id: String!) {
    channelById(id: $id) {
      ...FullChannelFields
    }
  }
  ${exports.FullChannelFields}
`;
exports.GetVideoCount = (0, graphql_tag_1.default) `
  query GetVideoCount($where: VideoWhereInput) {
    videosConnection(first: 0, where: $where, orderBy: id_ASC) {
      totalCount
    }
  }
`;
exports.GetExtendedBasicChannels = (0, graphql_tag_1.default) `
  query GetExtendedBasicChannels(
    $where: ExtendedChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    extendedChannels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...ExtendedBasicChannelFields
    }
  }
  ${exports.ExtendedBasicChannelFields}
`;
exports.GetExtendedFullChannels = (0, graphql_tag_1.default) `
  query GetExtendedFullChannels(
    $where: ExtendedChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    extendedChannels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...ExtendedFullChannelFields
    }
  }
  ${exports.ExtendedFullChannelFields}
`;
exports.GetBasicChannelsConnection = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
`;
exports.FollowChannel = (0, graphql_tag_1.default) `
  mutation FollowChannel($channelId: String!) {
    followChannel(channelId: $channelId) {
      channelId
      follows
      cancelToken
    }
  }
`;
exports.UnfollowChannel = (0, graphql_tag_1.default) `
  mutation UnfollowChannel($channelId: String!, $token: String!) {
    unfollowChannel(channelId: $channelId, token: $token) {
      channelId
      follows
    }
  }
`;
exports.GetTop10Channels = (0, graphql_tag_1.default) `
  query GetTop10Channels($where: ExtendedChannelWhereInput) {
    extendedChannels(where: $where, orderBy: followsNum_DESC, limit: 10) {
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetPromisingChannels = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
`;
exports.GetDiscoverChannels = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
`;
exports.GetPopularChannels = (0, graphql_tag_1.default) `
  query GetPopularChannels($where: ExtendedChannelWhereInput) {
    extendedChannels(where: $where, orderBy: videoViewsNum_DESC, limit: 15) {
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetChannelNftCollectors = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
`;
exports.GetPayloadDataObjectIdByCommitment = (0, graphql_tag_1.default) `
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
`;
exports.GetTopSellingChannels = (0, graphql_tag_1.default) `
  query GetTopSellingChannels($where: ExtendedChannelWhereInput, $limit: Int!, $periodDays: Int!) {
    topSellingChannels(where: $where, limit: $limit, periodDays: $periodDays) {
      channel {
        ...BasicChannelFields
      }
      amount
    }
  }
  ${exports.BasicChannelFields}
`;
exports.ReportChannel = (0, graphql_tag_1.default) `
  mutation ReportChannel($channelId: String!, $rationale: String!) {
    reportChannel(channelId: $channelId, rationale: $rationale) {
      id
      channelId
    }
  }
`;
exports.GetChannelPaymentEvents = (0, graphql_tag_1.default) `
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
`;
exports.GetComment = (0, graphql_tag_1.default) `
  query GetComment($commentId: String!) {
    commentById(id: $commentId) {
      ...CommentFields
    }
  }
  ${exports.CommentFields}
`;
exports.GetCommentRepliesConnection = (0, graphql_tag_1.default) `
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
  ${exports.CommentFields}
`;
exports.GetUserCommentsAndVideoCommentsConnection = (0, graphql_tag_1.default) `
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
  ${exports.CommentFields}
`;
exports.GetUserCommentsReactions = (0, graphql_tag_1.default) `
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
`;
exports.GetCommentEdits = (0, graphql_tag_1.default) `
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
`;
exports.GetDataObjectAvailability = (0, graphql_tag_1.default) `
  query GetDataObjectAvailability($id_eq: String, $id_in: [String!], $limit: Int) {
    storageDataObjects(where: { id_eq: $id_eq, id_in: $id_in }, limit: $limit) {
      id
      isAccepted
    }
  }
`;
exports.GetVideoHero = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetAllCategoriesFeaturedVideos = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetCategoriesFeaturedVideos = (0, graphql_tag_1.default) `
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
  ${exports.FullVideoFields}
`;
exports.GetMemberships = (0, graphql_tag_1.default) `
  query GetMemberships($where: MembershipWhereInput!, $limit: Int) {
    memberships(where: $where, orderBy: [createdAt_ASC], limit: $limit) {
      ...FullMembershipFields
    }
  }
  ${exports.FullMembershipFields}
`;
exports.GetNft = (0, graphql_tag_1.default) `
  query GetNft($id: String!) {
    ownedNftById(id: $id) {
      ...FullNftFields
    }
  }
  ${exports.FullNftFields}
`;
exports.GetNfts = (0, graphql_tag_1.default) `
  query GetNfts(
    $where: OwnedNftWhereInput
    $orderBy: [OwnedNftOrderByInput!] = [createdAt_DESC]
    $limit: Int
  ) {
    ownedNfts(where: $where, orderBy: $orderBy, limit: $limit) {
      ...FullNftFields
    }
  }
  ${exports.FullNftFields}
`;
exports.GetNftsConnection = (0, graphql_tag_1.default) `
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
  ${exports.FullNftFields}
`;
exports.GetEndingAuctionsNfts = (0, graphql_tag_1.default) `
  query GetEndingAuctionsNfts($where: OwnedNftWhereInput, $limit: Int, $offset: Int) {
    endingAuctionsNfts(where: $where, limit: $limit, offset: $offset) {
      ...FullNftFields
    }
  }
  ${exports.FullNftFields}
`;
exports.GetNotifications = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
  ${exports.BasicNftOwnerFields}
`;
exports.GetNftHistory = (0, graphql_tag_1.default) `
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
  ${exports.BasicNftOwnerFields}
  ${exports.BasicMembershipFields}
`;
exports.GetNftActivities = (0, graphql_tag_1.default) `
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
  ${exports.BasicNftOwnerFields}
  ${exports.BasicMembershipFields}
  ${exports.StorageDataObjectFields}
`;
exports.GetQueryNodeState = (0, graphql_tag_1.default) `
  subscription GetQueryNodeState {
    processorState {
      lastProcessedBlock
    }
  }
`;
exports.GetDistributionBucketsWithBags = (0, graphql_tag_1.default) `
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
  ${exports.DistributionBucketOperatorField}
`;
exports.GetStorageBucketsWithBags = (0, graphql_tag_1.default) `
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
`;
exports.GetBasicDistributionBuckets = (0, graphql_tag_1.default) `
  query GetBasicDistributionBuckets {
    distributionBuckets(limit: 500, where: { acceptingNewBags_eq: true }) {
      id
      bucketIndex
      family {
        id
      }
    }
  }
`;
exports.GetBasicStorageBuckets = (0, graphql_tag_1.default) `
  query GetBasicStorageBuckets {
    storageBuckets(limit: 500, where: { acceptingNewBags_eq: true }) {
      id
    }
  }
`;
exports.GetMetaprotocolTransactionStatusEvents = (0, graphql_tag_1.default) `
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
  ${exports.MetaprotocolTransactionResultFields}
`;
exports.GetFullVideo = (0, graphql_tag_1.default) `
  query GetFullVideo($id: String!) {
    videoById(id: $id) {
      ...FullVideoFields
    }
  }
  ${exports.FullVideoFields}
`;
exports.GetBasicVideosConnection = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetFullVideosConnection = (0, graphql_tag_1.default) `
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
  ${exports.FullVideoFields}
`;
exports.GetBasicVideos = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetFullVideos = (0, graphql_tag_1.default) `
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
  ${exports.FullVideoFields}
`;
exports.GetMostViewedVideosConnection = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetTop10VideosThisWeek = (0, graphql_tag_1.default) `
  query GetTop10VideosThisWeek($where: VideoWhereInput) {
    mostViewedVideosConnection(limit: 10, where: $where, periodDays: 7, orderBy: createdAt_DESC) {
      edges {
        node {
          ...BasicVideoFields
        }
      }
    }
  }
  ${exports.BasicVideoFields}
`;
exports.GetTop10VideosThisMonth = (0, graphql_tag_1.default) `
  query GetTop10VideosThisMonth($where: VideoWhereInput) {
    mostViewedVideosConnection(limit: 10, where: $where, periodDays: 30, orderBy: createdAt_DESC) {
      edges {
        node {
          ...BasicVideoFields
        }
      }
    }
  }
  ${exports.BasicVideoFields}
`;
exports.AddVideoView = (0, graphql_tag_1.default) `
  mutation AddVideoView($videoId: String!) {
    addVideoView(videoId: $videoId) {
      videoId
      viewsNum
    }
  }
`;
exports.ReportVideo = (0, graphql_tag_1.default) `
  mutation ReportVideo($videoId: String!, $rationale: String!) {
    reportVideo(videoId: $videoId, rationale: $rationale) {
      id
      videoId
    }
  }
`;
exports.StateQueryV2 = (0, graphql_tag_1.default) `
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
  ${exports.StateQueryEventFields}
  ${exports.StateQueryNftOwnerFields}
  ${exports.StateQueryTransactionalStatusFields}
  ${exports.StateQueryAuctionTypeFields}
`;
//# sourceMappingURL=queries.js.map