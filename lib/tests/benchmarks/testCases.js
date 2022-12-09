"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCases = void 0;
const v1 = __importStar(require("../v1/generated/queries"));
const v2 = __importStar(require("../v2/generated/queries"));
const queryVariants_1 = require("./queryVariants");
exports.testCases = [
    {
        v1Query: v1.GetBids,
        v2Query: v2.GetBids,
        inputs: queryVariants_1.GetBidsInputs,
    },
    {
        v1Query: v1.GetVideoCategories,
        v2Query: v2.GetExtendedVideoCategories,
        inputs: [(0, queryVariants_1.createQueryVariant)(undefined)],
    },
    {
        v1Query: v1.GetFullChannel,
        v2Query: v2.GetFullChannel,
        inputs: queryVariants_1.GetFullChannelInputs,
    },
    {
        v1Query: v1.GetVideoCount,
        v2Query: v2.GetVideoCount,
        inputs: queryVariants_1.GetVideoCountInputs,
    },
    {
        v1Query: v1.GetBasicChannels,
        v2Query: v2.GetExtendedBasicChannels,
        inputs: queryVariants_1.GetBasicChannelsInputs,
    },
    {
        v1Query: v1.GetFullChannels,
        v2Query: v2.GetExtendedFullChannels,
        inputs: queryVariants_1.GetFullChannelsInputs,
    },
    {
        v1Query: v1.GetBasicChannelsConnection,
        v2Query: v2.GetBasicChannelsConnection,
        inputs: queryVariants_1.GetBasicChannelsConnectionInputs,
    },
    {
        v1Query: v1.GetTop10Channels,
        v2Query: v2.GetTop10Channels,
        inputs: queryVariants_1.GetTop10ChannelsInputs,
    },
    {
        v1Query: v1.GetPromisingChannels,
        v2Query: v2.GetPromisingChannels,
        inputs: queryVariants_1.GetPromisingChannelsInputs,
    },
    {
        v1Query: v1.GetDiscoverChannels,
        v2Query: v2.GetDiscoverChannels,
        inputs: queryVariants_1.GetDiscoverChannelsInputs,
    },
    {
        v1Query: v1.GetPopularChannels,
        v2Query: v2.GetPopularChannels,
        inputs: queryVariants_1.GetPopularChannelsInputs,
    },
    {
        v1Query: v1.GetChannelNftCollectors,
        v2Query: v2.GetChannelNftCollectors,
        inputs: queryVariants_1.GetChannelNftCollectorsInputs,
    },
    {
        v1Query: v1.GetComment,
        v2Query: v2.GetComment,
        inputs: queryVariants_1.GetCommentInputs,
    },
    {
        v1Query: v1.GetCommentRepliesConnection,
        v2Query: v2.GetCommentRepliesConnection,
        inputs: queryVariants_1.GetCommentRepliesConnectionInputs,
    },
    {
        v1Query: v1.GetUserCommentsAndVideoCommentsConnection,
        v2Query: v2.GetUserCommentsAndVideoCommentsConnection,
        inputs: queryVariants_1.GetUserCommentsAndVideoCommentsConnectionInputs,
    },
    {
        v1Query: v1.GetUserCommentsReactions,
        v2Query: v2.GetUserCommentsReactions,
        inputs: queryVariants_1.GetUserCommentsReactionsInputs,
    },
    {
        v1Query: v1.GetCommentEdits,
        v2Query: v2.GetCommentEdits,
        inputs: queryVariants_1.GetCommentEditsInputs,
    },
    {
        v1Query: v1.GetDataObjectAvailability,
        v2Query: v2.GetDataObjectAvailability,
        inputs: queryVariants_1.GetDataObjectAvailabilityInputs,
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
        inputs: [(0, queryVariants_1.createQueryVariant)(undefined)],
    },
    {
        v1Query: v1.GetMemberships,
        v2Query: v2.GetMemberships,
        inputs: queryVariants_1.GetMembershipsInputs,
    },
    {
        v1Query: v1.GetNft,
        v2Query: v2.GetNft,
        inputs: queryVariants_1.GetNftInputs,
    },
    {
        v1Query: v1.GetNfts,
        v2Query: v2.GetNfts,
        inputs: queryVariants_1.GetNftsInputs,
    },
    {
        v1Query: v1.GetNftsConnection,
        v2Query: v2.GetNftsConnection,
        inputs: queryVariants_1.GetNftsConnectionInputs,
    },
    {
        v1Query: v1.GetNotifications,
        v2Query: v2.GetNotifications,
        inputs: queryVariants_1.GetNotificationsInputs,
    },
    {
        v1Query: v1.GetNftHistory,
        v2Query: v2.GetNftHistory,
        inputs: queryVariants_1.GetNftHistoryInputs,
    },
    {
        v1Query: v1.GetNftActivities,
        v2Query: v2.GetNftActivities,
        inputs: queryVariants_1.GetNftActivitiesInputs,
    },
    {
        v1Query: v1.GetDistributionBucketsWithBags,
        v2Query: v2.GetDistributionBucketsWithBags,
        inputs: [(0, queryVariants_1.createQueryVariant)(undefined)],
    },
    {
        v1Query: v1.GetStorageBucketsWithBags,
        v2Query: v2.GetStorageBucketsWithBags,
        inputs: [(0, queryVariants_1.createQueryVariant)(undefined)],
    },
    {
        v1Query: v1.GetBasicDistributionBuckets,
        v2Query: v2.GetBasicDistributionBuckets,
        inputs: [(0, queryVariants_1.createQueryVariant)(undefined)],
    },
    {
        v1Query: v1.GetBasicStorageBuckets,
        v2Query: v2.GetBasicStorageBuckets,
        inputs: [(0, queryVariants_1.createQueryVariant)(undefined)],
    },
    {
        v1Query: v1.GetBasicVideosConnection,
        v2Query: v2.GetBasicVideosConnection,
        inputs: queryVariants_1.GetBasicVideosConnectionInputs,
    },
    {
        v1Query: v1.GetBasicVideos,
        v2Query: v2.GetBasicVideos,
        inputs: queryVariants_1.GetBasicVideosInputs,
    },
    {
        v1Query: v1.GetFullVideo,
        v2Query: v2.GetFullVideo,
        inputs: queryVariants_1.GetFullVideoInputs,
    },
    {
        v1Query: v1.GetFullVideosConnection,
        v2Query: v2.GetFullVideosConnection,
        inputs: queryVariants_1.GetFullVideosConnectionInputs,
    },
    {
        v1Query: v1.GetFullVideos,
        v2Query: v2.GetFullVideos,
        inputs: queryVariants_1.GetFullVideosInputs,
    },
    {
        v1Query: v1.GetMetaprotocolTransactionStatusEvents,
        v2Query: v2.GetMetaprotocolTransactionStatusEvents,
        inputs: queryVariants_1.GetMetaprotocolTransactionStatusEventsInputs,
    },
    {
        v1Query: v1.GetMostViewedVideosConnection,
        v2Query: v2.GetMostViewedVideosConnection,
        inputs: queryVariants_1.GetMostViewedVideosConnectionInputs,
    },
    {
        v1Query: v1.GetTop10VideosThisMonth,
        v2Query: v2.GetTop10VideosThisMonth,
        inputs: queryVariants_1.GetTop10VideosThisMonthInputs,
    },
    {
        v1Query: v1.GetTop10VideosThisWeek,
        v2Query: v2.GetTop10VideosThisWeek,
        inputs: queryVariants_1.GetTop10VideosThisWeekInputs,
    },
    //   {
    //     v1Query: v1.StateQueryV1,
    //     v2Query: v2.StateQueryV2,
    //     inputs: [createQueryVariant(undefined)],
    //   },
];
//# sourceMappingURL=testCases.js.map