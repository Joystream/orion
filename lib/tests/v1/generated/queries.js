"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDataObjectAvailability = exports.GetCommentEdits = exports.GetUserCommentsReactions = exports.GetUserCommentsAndVideoCommentsConnection = exports.GetCommentRepliesConnection = exports.GetComment = exports.GetChannelPaymentEvents = exports.ReportChannel = exports.GetChannelNftCollectors = exports.GetPopularChannels = exports.GetDiscoverChannels = exports.GetPromisingChannels = exports.GetTop10Channels = exports.GetMostFollowedChannelsConnection = exports.GetMostViewedChannelsConnection = exports.UnfollowChannel = exports.FollowChannel = exports.GetBasicChannelsConnection = exports.GetFullChannels = exports.GetBasicChannels = exports.GetVideoCount = exports.GetFullChannel = exports.GetBasicChannel = exports.GetVideoCategories = exports.GetBids = exports.SetKillSwitch = exports.GetKillSwitch = exports.VideoMediaEncodingFields = exports.BidFields = exports.AuctionTypeFields = exports.ActorFields = exports.MetaprotocolTransactionSuccessFields = exports.CommentFields = exports.CommentReactionsCountByReactionIdFields = exports.FullBidFields = exports.FullNftFields = exports.BasicVideoFields = exports.FullVideoFields = exports.SubtitlesFields = exports.BasicNftFields = exports.BasicBidFields = exports.LicenseFields = exports.FullChannelFields = exports.VideoMediaMetadataFields = exports.DistributionBucketOperatorField = exports.FullMembershipFields = exports.BasicChannelFields = exports.BasicMembershipFields = exports.StorageDataObjectFields = exports.VideoCategoryFields = void 0;
exports.StateQueryV1 = exports.ReportVideo = exports.AddVideoView = exports.GetTop10VideosThisMonth = exports.GetTop10VideosThisWeek = exports.GetMostViewedVideosConnection = exports.GetFullVideos = exports.GetBasicVideos = exports.GetFullVideosConnection = exports.GetBasicVideosConnection = exports.GetFullVideo = exports.GetBasicVideo = exports.GetMetaprotocolTransactionStatusEvents = exports.GetBasicStorageBuckets = exports.GetBasicDistributionBuckets = exports.GetStorageBucketsWithBags = exports.GetDistributionBucketsWithBags = exports.GetQueryNodeState = exports.GetNftActivities = exports.GetNftHistory = exports.GetNotifications = exports.GetNftsConnection = exports.GetNfts = exports.GetNft = exports.GetMemberships = exports.GetMembership = exports.GetCategoriesFeaturedVideos = exports.GetAllCategoriesFeaturedVideos = exports.GetVideoHero = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.VideoCategoryFields = (0, graphql_tag_1.default) `
  fragment VideoCategoryFields on VideoCategory {
    id
    name
    activeVideosCounter
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
exports.BasicChannelFields = (0, graphql_tag_1.default) `
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
  ${exports.StorageDataObjectFields}
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
exports.FullChannelFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
  ${exports.BasicMembershipFields}
  ${exports.StorageDataObjectFields}
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
  ${exports.BasicMembershipFields}
  ${exports.BasicBidFields}
`;
exports.SubtitlesFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
  ${exports.StorageDataObjectFields}
  ${exports.BasicNftFields}
`;
exports.FullNftFields = (0, graphql_tag_1.default) `
  fragment FullNftFields on OwnedNft {
    ...BasicNftFields
    creatorChannel {
      ...BasicChannelFields
    }
    video {
      ...BasicVideoFields
    }
  }
  ${exports.BasicNftFields}
  ${exports.BasicChannelFields}
  ${exports.BasicVideoFields}
`;
exports.FullBidFields = (0, graphql_tag_1.default) `
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
  ${exports.BasicBidFields}
`;
exports.CommentReactionsCountByReactionIdFields = (0, graphql_tag_1.default) `
  fragment CommentReactionsCountByReactionIdFields on CommentReactionsCountByReactionId {
    id
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
    parentCommentId
    repliesCount
    text
    status
  }
  ${exports.BasicMembershipFields}
  ${exports.CommentReactionsCountByReactionIdFields}
`;
exports.MetaprotocolTransactionSuccessFields = (0, graphql_tag_1.default) `
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
  ${exports.CommentFields}
`;
exports.ActorFields = (0, graphql_tag_1.default) `
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
`;
exports.AuctionTypeFields = (0, graphql_tag_1.default) `
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
`;
exports.BidFields = (0, graphql_tag_1.default) `
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
`;
exports.VideoMediaEncodingFields = (0, graphql_tag_1.default) `
  fragment VideoMediaEncodingFields on VideoMediaEncoding {
    id
    codecName
    container
    mimeMediaType
  }
`;
exports.GetKillSwitch = (0, graphql_tag_1.default) `
  query GetKillSwitch {
    admin {
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
exports.GetVideoCategories = (0, graphql_tag_1.default) `
  query GetVideoCategories {
    videoCategories(where: { name_startsWith: "" }) {
      ...VideoCategoryFields
    }
  }
  ${exports.VideoCategoryFields}
`;
exports.GetBasicChannel = (0, graphql_tag_1.default) `
  query GetBasicChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...BasicChannelFields
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetFullChannel = (0, graphql_tag_1.default) `
  query GetFullChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...FullChannelFields
    }
  }
  ${exports.FullChannelFields}
`;
exports.GetVideoCount = (0, graphql_tag_1.default) `
  query GetVideoCount($where: VideoWhereInput) {
    videosConnection(first: 0, where: $where) {
      totalCount
    }
  }
`;
exports.GetBasicChannels = (0, graphql_tag_1.default) `
  query GetBasicChannels(
    $where: ChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...BasicChannelFields
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetFullChannels = (0, graphql_tag_1.default) `
  query GetFullChannels(
    $where: ChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...FullChannelFields
    }
  }
  ${exports.FullChannelFields}
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
  mutation FollowChannel($channelId: ID!) {
    followChannel(channelId: $channelId) {
      id
      follows
    }
  }
`;
exports.UnfollowChannel = (0, graphql_tag_1.default) `
  mutation UnfollowChannel($channelId: ID!) {
    unfollowChannel(channelId: $channelId) {
      id
      follows
    }
  }
`;
exports.GetMostViewedChannelsConnection = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
`;
exports.GetMostFollowedChannelsConnection = (0, graphql_tag_1.default) `
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
  ${exports.BasicChannelFields}
`;
exports.GetTop10Channels = (0, graphql_tag_1.default) `
  query GetTop10Channels($where: ChannelWhereInput) {
    top10Channels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetPromisingChannels = (0, graphql_tag_1.default) `
  query GetPromisingChannels($where: ChannelWhereInput) {
    promisingChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetDiscoverChannels = (0, graphql_tag_1.default) `
  query GetDiscoverChannels($where: ChannelWhereInput) {
    discoverChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetPopularChannels = (0, graphql_tag_1.default) `
  query GetPopularChannels($where: ChannelWhereInput) {
    popularChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${exports.BasicChannelFields}
`;
exports.GetChannelNftCollectors = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
`;
exports.ReportChannel = (0, graphql_tag_1.default) `
  mutation ReportChannel($channelId: ID!, $rationale: String!) {
    reportChannel(channelId: $channelId, rationale: $rationale) {
      id
      channelId
    }
  }
`;
exports.GetChannelPaymentEvents = (0, graphql_tag_1.default) `
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
`;
exports.GetComment = (0, graphql_tag_1.default) `
  query GetComment($commentId: ID!) {
    commentByUniqueInput(where: { id: $commentId }) {
      ...CommentFields
    }
  }
  ${exports.CommentFields}
`;
exports.GetCommentRepliesConnection = (0, graphql_tag_1.default) `
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
  ${exports.CommentFields}
`;
exports.GetUserCommentsAndVideoCommentsConnection = (0, graphql_tag_1.default) `
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
  ${exports.CommentFields}
`;
exports.GetUserCommentsReactions = (0, graphql_tag_1.default) `
  query GetUserCommentsReactions($memberId: ID!, $videoId: ID!) {
    commentReactions(
      where: { member: { id_eq: $memberId }, video: { id_eq: $videoId } }
      limit: 1000
    ) {
      reactionId
      commentId
    }
  }
`;
exports.GetCommentEdits = (0, graphql_tag_1.default) `
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
`;
exports.GetDataObjectAvailability = (0, graphql_tag_1.default) `
  query GetDataObjectAvailability($id_eq: ID, $id_in: [ID!], $limit: Int) {
    storageDataObjects(where: { id_eq: $id_eq, id_in: $id_in }, limit: $limit) {
      id
      isAccepted
    }
  }
`;
exports.GetVideoHero = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetAllCategoriesFeaturedVideos = (0, graphql_tag_1.default) `
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
  ${exports.BasicVideoFields}
`;
exports.GetCategoriesFeaturedVideos = (0, graphql_tag_1.default) `
  query GetCategoriesFeaturedVideos($categoryId: ID!) {
    categoryFeaturedVideos(categoryId: $categoryId) {
      videoId
      videoCutUrl
      video {
        ...FullVideoFields
      }
    }
  }
  ${exports.FullVideoFields}
`;
exports.GetMembership = (0, graphql_tag_1.default) `
  query GetMembership($where: MembershipWhereUniqueInput!) {
    membershipByUniqueInput(where: $where) {
      ...FullMembershipFields
    }
  }
  ${exports.FullMembershipFields}
`;
exports.GetMemberships = (0, graphql_tag_1.default) `
  query GetMemberships($where: MembershipWhereInput!, $limit: Int) {
    memberships(where: $where, limit: $limit, orderBy: [createdAt_ASC]) {
      ...FullMembershipFields
    }
  }
  ${exports.FullMembershipFields}
`;
exports.GetNft = (0, graphql_tag_1.default) `
  query GetNft($id: ID!) {
    ownedNftByUniqueInput(where: { id: $id }) {
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
    ownedNfts(where: $where, limit: $limit, orderBy: $orderBy) {
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
exports.GetNotifications = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
`;
exports.GetNftHistory = (0, graphql_tag_1.default) `
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
  ${exports.BasicMembershipFields}
`;
exports.GetNftActivities = (0, graphql_tag_1.default) `
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
  ${exports.StorageDataObjectFields}
  ${exports.BasicMembershipFields}
`;
exports.GetQueryNodeState = (0, graphql_tag_1.default) `
  subscription GetQueryNodeState {
    stateSubscription {
      lastCompleteBlock
    }
  }
`;
exports.GetDistributionBucketsWithBags = (0, graphql_tag_1.default) `
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
  ${exports.DistributionBucketOperatorField}
`;
exports.GetStorageBucketsWithBags = (0, graphql_tag_1.default) `
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
  ${exports.MetaprotocolTransactionSuccessFields}
`;
exports.GetBasicVideo = (0, graphql_tag_1.default) `
  query GetBasicVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...BasicVideoFields
    }
  }
  ${exports.BasicVideoFields}
`;
exports.GetFullVideo = (0, graphql_tag_1.default) `
  query GetFullVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
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
    top10VideosThisWeek(where: $where) {
      ...BasicVideoFields
    }
  }
  ${exports.BasicVideoFields}
`;
exports.GetTop10VideosThisMonth = (0, graphql_tag_1.default) `
  query GetTop10VideosThisMonth($where: VideoWhereInput) {
    top10VideosThisMonth(where: $where) {
      ...BasicVideoFields
    }
  }
  ${exports.BasicVideoFields}
`;
exports.AddVideoView = (0, graphql_tag_1.default) `
  mutation AddVideoView($videoId: ID!, $channelId: ID!, $categoryId: ID) {
    addVideoView(videoId: $videoId, channelId: $channelId, categoryId: $categoryId) {
      id
      views
    }
  }
`;
exports.ReportVideo = (0, graphql_tag_1.default) `
  mutation ReportVideo($videoId: ID!, $rationale: String!) {
    reportVideo(videoId: $videoId, rationale: $rationale) {
      id
      videoId
    }
  }
`;
exports.StateQueryV1 = (0, graphql_tag_1.default) `
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
  ${exports.ActorFields}
  ${exports.AuctionTypeFields}
  ${exports.BidFields}
  ${exports.VideoMediaEncodingFields}
`;
//# sourceMappingURL=queries.js.map