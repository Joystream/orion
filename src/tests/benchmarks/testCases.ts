import * as v1 from '../v1/generated/queries'
import * as v2 from '../v2/generated/queries'
import {
  createQueryVariant,
  GetBidsInputs,
  GetFullChannelInputs,
  GetVideoCountInputs,
  GetBasicChannelsInputs,
  GetBasicChannelsConnectionInputs,
  GetFullChannelsInputs,
  GetTop10ChannelsInputs,
  GetChannelNftCollectorsInputs,
  GetCommentEditsInputs,
  GetCommentInputs,
  GetCommentRepliesConnectionInputs,
  GetDataObjectAvailabilityInputs,
  GetDiscoverChannelsInputs,
  GetMembershipsInputs,
  GetNftActivitiesInputs,
  GetNftHistoryInputs,
  GetNftInputs,
  GetNftsConnectionInputs,
  GetNftsInputs,
  GetNotificationsInputs,
  GetPopularChannelsInputs,
  GetPromisingChannelsInputs,
  GetUserCommentsAndVideoCommentsConnectionInputs,
  GetUserCommentsReactionsInputs,
  GetBasicVideosConnectionInputs,
  GetBasicVideosInputs,
  GetFullVideoInputs,
  GetFullVideosConnectionInputs,
  GetFullVideosInputs,
  GetMetaprotocolTransactionStatusEventsInputs,
  GetMostViewedVideosConnectionInputs,
  GetTop10VideosThisMonthInputs,
  GetTop10VideosThisWeekInputs,
} from './queryVariants'

export const testCases = [
  {
    v1Query: v1.GetBids,
    v2Query: v2.GetBids,
    inputs: GetBidsInputs,
  },
  {
    v1Query: v1.GetVideoCategories,
    v2Query: v2.GetExtendedVideoCategories,
    inputs: [createQueryVariant(undefined)],
  },
  {
    v1Query: v1.GetFullChannel,
    v2Query: v2.GetFullChannel,
    inputs: GetFullChannelInputs,
  },
  {
    v1Query: v1.GetVideoCount,
    v2Query: v2.GetVideoCount,
    inputs: GetVideoCountInputs,
  },
  {
    v1Query: v1.GetBasicChannels,
    v2Query: v2.GetExtendedBasicChannels,
    inputs: GetBasicChannelsInputs,
  },
  {
    v1Query: v1.GetFullChannels,
    v2Query: v2.GetExtendedFullChannels,
    inputs: GetFullChannelsInputs,
  },
  {
    v1Query: v1.GetBasicChannelsConnection,
    v2Query: v2.GetBasicChannelsConnection,
    inputs: GetBasicChannelsConnectionInputs,
  },
  {
    v1Query: v1.GetTop10Channels,
    v2Query: v2.GetTop10Channels,
    inputs: GetTop10ChannelsInputs,
  },
  {
    v1Query: v1.GetPromisingChannels,
    v2Query: v2.GetPromisingChannels,
    inputs: GetPromisingChannelsInputs,
  },
  {
    v1Query: v1.GetDiscoverChannels,
    v2Query: v2.GetDiscoverChannels,
    inputs: GetDiscoverChannelsInputs,
  },
  {
    v1Query: v1.GetPopularChannels,
    v2Query: v2.GetPopularChannels,
    inputs: GetPopularChannelsInputs,
  },
  {
    v1Query: v1.GetChannelNftCollectors,
    v2Query: v2.GetChannelNftCollectors,
    inputs: GetChannelNftCollectorsInputs,
  },
  {
    v1Query: v1.GetComment,
    v2Query: v2.GetComment,
    inputs: GetCommentInputs,
  },
  {
    v1Query: v1.GetCommentRepliesConnection,
    v2Query: v2.GetCommentRepliesConnection,
    inputs: GetCommentRepliesConnectionInputs,
  },
  {
    v1Query: v1.GetUserCommentsAndVideoCommentsConnection,
    v2Query: v2.GetUserCommentsAndVideoCommentsConnection,
    inputs: GetUserCommentsAndVideoCommentsConnectionInputs,
  },
  {
    v1Query: v1.GetUserCommentsReactions,
    v2Query: v2.GetUserCommentsReactions,
    inputs: GetUserCommentsReactionsInputs,
  },
  {
    v1Query: v1.GetCommentEdits,
    v2Query: v2.GetCommentEdits,
    inputs: GetCommentEditsInputs,
  },
  {
    v1Query: v1.GetDataObjectAvailability,
    v2Query: v2.GetDataObjectAvailability,
    inputs: GetDataObjectAvailabilityInputs,
  },
  // FIXME: V1 returns an error if videoHero is not set
  // {
  //   v1Query: v1.GetVideoHero,
  //   v2Query: v2.GetVideoHero,
  //   inputs: [createQueryVariant(undefined)],
  // },
  {
    v1Query: v1.GetAllCategoriesFeaturedVideos,
    v2Query: v2.GetAllCategoriesFeaturedVideos,
    inputs: [createQueryVariant(undefined)],
  },
  {
    v1Query: v1.GetMemberships,
    v2Query: v2.GetMemberships,
    inputs: GetMembershipsInputs,
  },
  {
    v1Query: v1.GetNft,
    v2Query: v2.GetNft,
    inputs: GetNftInputs,
  },
  {
    v1Query: v1.GetNfts,
    v2Query: v2.GetNfts,
    inputs: GetNftsInputs,
  },
  {
    v1Query: v1.GetNftsConnection,
    v2Query: v2.GetNftsConnection,
    inputs: GetNftsConnectionInputs,
  },
  {
    v1Query: v1.GetNotifications,
    v2Query: v2.GetNotifications,
    inputs: GetNotificationsInputs,
  },
  {
    v1Query: v1.GetNftHistory,
    v2Query: v2.GetNftHistory,
    inputs: GetNftHistoryInputs,
  },
  {
    v1Query: v1.GetNftActivities,
    v2Query: v2.GetNftActivities,
    inputs: GetNftActivitiesInputs,
  },
  {
    v1Query: v1.GetDistributionBucketsWithBags,
    v2Query: v2.GetDistributionBucketsWithBags,
    inputs: [createQueryVariant(undefined)],
  },
  {
    v1Query: v1.GetStorageBucketsWithBags,
    v2Query: v2.GetStorageBucketsWithBags,
    inputs: [createQueryVariant(undefined)],
  },
  {
    v1Query: v1.GetBasicDistributionBuckets,
    v2Query: v2.GetBasicDistributionBuckets,
    inputs: [createQueryVariant(undefined)],
  },
  {
    v1Query: v1.GetBasicStorageBuckets,
    v2Query: v2.GetBasicStorageBuckets,
    inputs: [createQueryVariant(undefined)],
  },
  {
    v1Query: v1.GetBasicVideosConnection,
    v2Query: v2.GetBasicVideosConnection,
    inputs: GetBasicVideosConnectionInputs,
  },
  {
    v1Query: v1.GetBasicVideos,
    v2Query: v2.GetBasicVideos,
    inputs: GetBasicVideosInputs,
  },
  {
    v1Query: v1.GetFullVideo,
    v2Query: v2.GetFullVideo,
    inputs: GetFullVideoInputs,
  },
  {
    v1Query: v1.GetFullVideosConnection,
    v2Query: v2.GetFullVideosConnection,
    inputs: GetFullVideosConnectionInputs,
  },
  {
    v1Query: v1.GetFullVideos,
    v2Query: v2.GetFullVideos,
    inputs: GetFullVideosInputs,
  },
  {
    v1Query: v1.GetMetaprotocolTransactionStatusEvents,
    v2Query: v2.GetMetaprotocolTransactionStatusEvents,
    inputs: GetMetaprotocolTransactionStatusEventsInputs,
  },
  {
    v1Query: v1.GetMostViewedVideosConnection,
    v2Query: v2.GetMostViewedVideosConnection,
    inputs: GetMostViewedVideosConnectionInputs,
  },
  {
    v1Query: v1.GetTop10VideosThisMonth,
    v2Query: v2.GetTop10VideosThisMonth,
    inputs: GetTop10VideosThisMonthInputs,
  },
  {
    v1Query: v1.GetTop10VideosThisWeek,
    v2Query: v2.GetTop10VideosThisWeek,
    inputs: GetTop10VideosThisWeekInputs,
  },
  //   {
  //     v1Query: v1.StateQueryV1,
  //     v2Query: v2.StateQueryV2,
  //     inputs: [createQueryVariant(undefined)],
  //   },
] as const
