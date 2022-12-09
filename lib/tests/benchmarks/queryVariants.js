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
exports.GetTop10VideosThisMonthInputs = exports.GetTop10VideosThisWeekInputs = exports.GetMostViewedVideosConnectionInputs = exports.GetFullVideosInputs = exports.GetBasicVideosInputs = exports.GetFullVideosConnectionInputs = exports.GetBasicVideosConnectionInputs = exports.GetFullVideoInputs = exports.GetMetaprotocolTransactionStatusEventsInputs = exports.GetNftActivitiesInputs = exports.GetNftHistoryInputs = exports.GetNotificationsInputs = exports.GetNftsConnectionInputs = exports.GetNftsInputs = exports.GetNftInputs = exports.GetMembershipsInputs = exports.GetDataObjectAvailabilityInputs = exports.GetCommentEditsInputs = exports.GetUserCommentsReactionsInputs = exports.GetUserCommentsAndVideoCommentsConnectionInputs = exports.GetCommentRepliesConnectionInputs = exports.GetCommentInputs = exports.GetChannelNftCollectorsInputs = exports.GetPopularChannelsInputs = exports.GetDiscoverChannelsInputs = exports.GetPromisingChannelsInputs = exports.GetTop10ChannelsInputs = exports.GetBasicChannelsConnectionInputs = exports.GetFullChannelsInputs = exports.GetBasicChannelsInputs = exports.GetVideoCountInputs = exports.GetFullChannelInputs = exports.GetBidsInputs = exports.createQueryVariant = void 0;
const v1Schema = __importStar(require("../v1/generated/schema"));
const v2Schema = __importStar(require("../v2/generated/schema"));
function createQueryVariant(v1Input, v2Input) {
    return {
        v1Input,
        v2Input: v2Input || v1Input,
        v1Results: [],
        v2Results: [],
    };
}
exports.createQueryVariant = createQueryVariant;
exports.GetBidsInputs = [
    createQueryVariant({ where: { nft: { id_eq: '5' } } }, { where: { auction: { nft: { id_eq: '5' } } } }),
    createQueryVariant({ where: { bidder: { id_eq: '510' } } }),
    createQueryVariant({ where: {}, limit: 100 }),
];
exports.GetFullChannelInputs = [createQueryVariant({ where: { id: '7757' } }, { id: '7757' })];
exports.GetVideoCountInputs = [
    createQueryVariant({ where: { category: { name_eq: 'Memes' } } }),
    createQueryVariant({ where: {} }),
];
exports.GetBasicChannelsInputs = [
    createQueryVariant({
        where: { activeVideosCounter_gt: 1, language: { iso_contains: 'en' } },
        limit: 100,
        orderBy: v1Schema.ChannelOrderByInput.CreatedAtAsc,
    }, {
        where: { activeVideosCount_gt: 1, channel: { language_contains: 'en' } },
        limit: 100,
        orderBy: v2Schema.ChannelOrderByInput.CreatedAtAsc,
    }),
    createQueryVariant({ where: {}, limit: 100 }),
    createQueryVariant({ where: {}, limit: 1000 }),
];
exports.GetFullChannelsInputs = [
    createQueryVariant({ where: { activeVideosCounter_gt: 5 } }, { where: { activeVideosCount_gt: 5 } }),
    createQueryVariant({ where: {}, limit: 100 }),
    createQueryVariant({ where: {}, limit: 1000 }),
];
exports.GetBasicChannelsConnectionInputs = [
    createQueryVariant({
        where: { title_contains: 'a', avatarPhoto: { isAccepted_eq: true }, isPublic_eq: true },
        first: 50,
    }),
];
exports.GetTop10ChannelsInputs = [
    createQueryVariant({ where: { activeVideosCounter_gt: 0, isPublic_eq: true } }, { where: { activeVideosCount_gt: 0, channel: { isPublic_eq: true, followsNum_gt: 0 } } }),
];
exports.GetPromisingChannelsInputs = [
    createQueryVariant({ where: { activeVideosCounter_gt: 4, isPublic_eq: true } }, { where: { activeVideosCount_gt: 4, channel: { isPublic_eq: true, videoViewsNum_gt: 0 } } }),
];
exports.GetDiscoverChannelsInputs = [
    createQueryVariant({ where: { activeVideosCounter_gt: 4, isPublic_eq: true } }, { where: { activeVideosCount_gt: 4, channel: { isPublic_eq: true, followsNum_gt: 0 } } }),
];
exports.GetPopularChannelsInputs = [
    createQueryVariant({ where: { activeVideosCounter_gt: 4, isPublic_eq: true } }, { where: { activeVideosCount_gt: 4, channel: { isPublic_eq: true, videoViewsNum_gt: 0 } } }),
];
exports.GetChannelNftCollectorsInputs = [createQueryVariant({ where: { channel: { id_eq: '7693' } } }, { channelId: '7693' })];
exports.GetCommentInputs = [createQueryVariant({ commentId: 'METAPROTOCOL-OLYMPIA-769463-2' })];
exports.GetCommentRepliesConnectionInputs = [
    createQueryVariant({
        parentCommentId: 'METAPROTOCOL-OLYMPIA-874662-2',
        first: 10,
        orderBy: v1Schema.CommentOrderByInput.CreatedAtDesc,
    }),
];
exports.GetUserCommentsAndVideoCommentsConnectionInputs = [
    createQueryVariant({
        videoId: '5',
        memberId: '4680',
        first: 10,
        orderBy: v1Schema.CommentOrderByInput.CreatedAtDesc,
    }),
];
exports.GetUserCommentsReactionsInputs = [createQueryVariant({ memberId: '3233', videoId: '193' })];
exports.GetCommentEditsInputs = [createQueryVariant({ commentId: 'METAPROTOCOL-OLYMPIA-1049713-2' })];
exports.GetDataObjectAvailabilityInputs = [
    createQueryVariant({ id_in: Array.from({ length: 10 }, (_, i) => i.toString()), limit: 10 }),
    createQueryVariant({ id_in: Array.from({ length: 100 }, (_, i) => i.toString()), limit: 100 }),
    createQueryVariant({ id_in: Array.from({ length: 1000 }, (_, i) => i.toString()), limit: 1000 }),
];
exports.GetMembershipsInputs = [
    createQueryVariant({
        where: {
            controllerAccount_in: [
                'j4SWDEbtMBiaTJKAKDcPRHNF7dg8WdxLNeuqN1hDb1UzGJWAN',
                'j4WTvK1JfVWZUAvusYikc8i5VoUpz9bmvmb6KFLj4WrokiiJy',
                'j4V3fP63zYPpZCfHyVRu7FWteH3i5iwXQHQRrtPL2dvcUWeD5',
                'j4W3QjQR3AgLdNEXVwfu155Xe1eyo2AeRnkHfrnpwtAM5oR2U',
                'j4WDX3mn1mF3c4QCqcCLjpaLfkY1jhRAwZgAvriiSh1aCBrvR',
                'j4WUC8TDs4H4kMjRCy8U8qXtVZLZuEzVGMcqDmmkjbFuUKMeM',
                'j4Sq83pcTsGty9km6DwpwXo9b8XcEByqCs6fFCb9D9ZJCtXF2',
                'j4U9AZVNXB5cXDw7NEiK6Z31UDg5Utm3R5XD8ktK821ESGnq4',
                'j4TY71W1kJD9fS7KczUd2SNrLFuwpYF8uN5iSiRz1PzTpP85z',
                'j4SsUJDvVVaijud6dsTNS2JbvpiEYygWcyjQK6f7iXijQmQ41',
                'j4T4USiujhYGzbgon4jxcfNpvGRKJJd8yN8Am7DMhDqGGBZAR',
                'j4VbEtGKJiP3vpvQyP5bRTmRSfHRfMcypzViXDbudd15S8G4q',
                'j4WPf2womuAXiVE5xBYg5sJ1ff3LJhCL6zMK16yk1hR6t95jZ',
                'j4SHxgTBdcrogoH2VB24iZzR7zv5tBntkiicXwReLiK8t7NVF',
                'j4W34M9gBApzi8Sj9nXSSHJmv3UHnGKecyTFjLGnmxtJDi98L',
                'j4UckpZSZac8wuVhpoYqZ7C4xxUycbTF3M9RiwWnP3XRFsPXf',
                'j4V3RkKua5wbpFUP31YGyPhXnWaRAJvAKLzGqfS4dKDnoutCm',
                'j4SrUeptC5G95Vag3Ra5JsuuQXHcXMoQkGaUgP2S3f6KnWUee',
                'j4SeiVffM77RhGTRuxCcnoxu6R2qMh2EnwghiZn8ZbXwU4cfV',
                'j4VNCZqMciDuMjyiuY6p3s6wD4FWJ89CBpoK9yV6xUY5fnY4N',
                'j4RyBBBgxMT5XEB4qNFvudT5Rx59v7w2Un3kDe6mGLw5vDFrA',
                'j4SeeWMa8CYzQCZD2noxjJ6eHbtw9tQ154tjT3ocWdgmLFvR8',
                'j4UENK6W7sbay1SQgb4oHEf7ewvBYTvN8PmkvTnZq6N71jCtS',
                'j4RWDGhsBxg6qyvzos2CABMFvBYqat7Eu4354YKgyNRskWHuN',
                'j4UuVLEC76EEHvBmudKRcd3kJM62Yh8oKsDtEr6YyiVPyudUA',
                'j4U2zS4xWzoaUzKypRZhKcAX7pLiAXpcu3xS3KbUdSccrBn5C',
                'j4RcHhV7qT2n1DrsoueKuCABN8B7JM7UtKKRt4EmUt27MvmEW',
                'j4TSv5trxx4EPTJ4zQKhZdoZ3EKbDpn1kZGM7rmNbXEkFkjQP',
                'j4VrdVLzFn1N8na8TYzt7uD4xvXUEiDEdTPKPBXx7GvMBgsZ4',
                'j4VPVpnJR9UaLAJn6zyaqqoohw3vs35RWR5vdHGrYrKF8zA3u',
                'j4TCNmxvN1sBjEnJacPPjctJe9ahvEtZxdSJNWLxLjSThs6Mp',
                'j4VpfG5Dv5k88SkDeaiE2uXw4ARiSvgVJFEm57cmGQTkrJK3g',
                'j4Rg5krcGiXJp7iKSwGwy9bvqFFyHXyx8L61WPzLHHY1PRGLz',
                'j4SmihQwX6Q6mxBxcK5M8tdSJ7MFkV1PqRAfD3KdfLYeBv6Zb',
                'j4T3zuV5KrKD3C9CoPmzP1DBkZUC8NzXWZitQy5hkm4cgw7Um',
                'j4SbmAisVRNfLGYyh36PYbPNgS7rXMHw8Hyn8gCgWYfZaP9M9',
                'j4Vz22dhfq3WRZ6jNLhkRPo1ujYrWJuJJRaFFknJDGLxWbD85',
                'j4TFB16Qg5zexUbnwLpfQrqtnUtqno6cYTD1JxzzYecwexHNB',
                'j4RdR14j4JFpbLGHV7ebAgk7ghLLrKb64e64uKsNELNenPdtg',
                'j4ViBSXawtD1Rbpb4sLLKMEeLq7gkSfQ3mPMfvqdmjnZcGGNE',
                'j4RVqhMCsDjFisfwZ5ahqSzYjNFDiKWjHPCiLx1vi4p95MNJh',
                'j4Uj3eFDcUwoptESfjazMcZoKykc2cZ6dahNrfoQw2VQXr3bB',
                'j4UpK8CVkVE7kos5xsZt5kUbFTmtWDsmoBZnSYqNBoohXdCfi',
                'j4WDf4RAiC91egyQiey8QLMm1n6tWRvnpi8iTtsh2T92GJe4a',
                'j4UCL8xKf8JXqocvM9uFXrwNdmrp4ZSBrU4LAjkhbeFYpFnzk',
                'j4SuiLX4dBS5qYFJ85gpJuUAHhA4dwckFi4HFSrSSn26m1HZE',
                'j4Wj4cBBmcCeRVy129MCZCZkNjexLNasrUjQd9oWaqFqC5Kju',
                'j4VhFwpNQqrF7uNiDnMfGWt4ZRXfysQbFzrN2Yx3f5Ny1FVyX',
                'j4WoxzewNdRX4yBGpE2ZHaHNiFf1HJm9SjYAKXjCJanKHGYYb',
                'j4UkFztC8v2sXhSYbKwoHutZD1u2KqqmMfqgFYSTZUMyAD52D',
            ],
        },
    }),
    createQueryVariant({ where: {}, limit: 100 }),
    createQueryVariant({ where: {}, limit: 1000 }),
];
exports.GetNftInputs = [
    createQueryVariant({ id: '5' }),
    createQueryVariant({ id: '9' }),
];
exports.GetNftsInputs = [
    createQueryVariant({ where: {}, limit: 100 }),
    createQueryVariant({ where: {}, limit: 1000 }),
];
exports.GetNftsConnectionInputs = [
    createQueryVariant({
        where: {
            OR: [
                {
                    transactionalStatusAuction: {
                        auctionType_json: { isTypeOf_eq: 'AuctionTypeEnglish' },
                    },
                },
                {
                    transactionalStatusAuction: {
                        auctionType_json: { isTypeOf_eq: 'AuctionTypeOpen' },
                    },
                },
                {
                    transactionalStatus_json: { isTypeOf_eq: 'TransactionalStatusBuyNow' },
                },
            ],
        },
        first: 10,
        orderBy: v1Schema.OwnedNftOrderByInput.CreatedAtDesc,
    }, {
        where: {
            transactionalStatus: {
                isTypeOf_in: ['TransactionalStatusAuction', 'TransactionalStatusBuyNow'],
            },
        },
        first: 10,
        orderBy: v2Schema.OwnedNftOrderByInput.CreatedAtDesc,
    }),
    createQueryVariant({
        where: { creatorChannel: { id_eq: '7712' }, video: { isPublic_eq: true } },
        orderBy: v1Schema.OwnedNftOrderByInput.CreatedAtDesc,
        first: 50,
    }, {
        where: { video: { channel: { id_eq: '7712' }, isPublic_eq: true } },
        orderBy: v2Schema.OwnedNftOrderByInput.CreatedAtDesc,
        first: 50,
    }),
    createQueryVariant({
        where: { ownerMember: { handle_eq: 'web3mercury' }, video: { isPublic_eq: true } },
        first: 50,
    }, {
        where: {
            OR: [
                { owner: { member: { handle_eq: 'web3mercury' } } },
                { owner: { channel: { ownerMember: { handle_eq: 'web3mercury' } } } },
            ],
        },
        first: 50,
    }),
];
// Due to the fact that in Orion v2 the GetNotifications query includes
// notifications about comments posted in all of the member's channels
// (in Orion v1 this was only possible for one channel), `memberId` should
// ideally be of a member that has only one channel (in order for the number of rows to be the same)
exports.GetNotificationsInputs = [
    createQueryVariant({ limit: 50, channelId: '7692', memberId: '2962' }),
    createQueryVariant({ limit: 50, channelId: '7693', memberId: '3233' }),
];
exports.GetNftHistoryInputs = [
    createQueryVariant({ nftId: '5' }),
    createQueryVariant({ nftId: '14' }),
    createQueryVariant({ nftId: '338' }),
];
exports.GetNftActivitiesInputs = [
    createQueryVariant({ limit: 1000, memberId: '4537' }),
    createQueryVariant({ limit: 1000, memberId: '798' }),
];
exports.GetMetaprotocolTransactionStatusEventsInputs = [
    createQueryVariant({
        transactionHash: '0x536d93a5e19c48d6f5983c8de3b9622fe44d096f13698aa2c13e8ae0f8a62780',
    }),
];
exports.GetFullVideoInputs = [
    createQueryVariant({ where: { id: '5' } }, { id: '5' }),
    createQueryVariant({ where: { id: '338' } }, { id: '338' }),
];
exports.GetBasicVideosConnectionInputs = [
    createQueryVariant({
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
            title_contains: 'a',
        },
        first: 50,
        orderBy: [
            v1Schema.VideoOrderByInput.ReactionsCountDesc,
            v1Schema.VideoOrderByInput.CommentsCountDesc,
            v1Schema.VideoOrderByInput.CreatedAtDesc,
        ],
    }),
    createQueryVariant({
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
            channel: { id_in: ['7712', '7757', '7831'] },
        },
        first: 50,
        orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
    }),
];
exports.GetFullVideosConnectionInputs = [
    createQueryVariant({
        first: 50,
        orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
        where: { channel: { id_eq: '7712' } },
    }),
];
exports.GetBasicVideosInputs = [
    createQueryVariant({ where: {}, limit: 100 }),
    createQueryVariant({ where: {}, limit: 1000 }),
];
exports.GetFullVideosInputs = [
    createQueryVariant({ where: {}, limit: 100 }),
    createQueryVariant({ where: {}, limit: 1000 }),
];
exports.GetMostViewedVideosConnectionInputs = [
    createQueryVariant({
        periodDays: 30,
        orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
        },
    }, {
        periodDays: 30,
        orderBy: v2Schema.VideoOrderByInput.CreatedAtDesc,
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
            viewsNum_gt: 0,
        },
    }),
    createQueryVariant({
        periodDays: 7,
        orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
        },
    }, {
        periodDays: 7,
        orderBy: v2Schema.VideoOrderByInput.CreatedAtDesc,
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
            viewsNum_gt: 0,
        },
    }),
];
exports.GetTop10VideosThisWeekInputs = [
    createQueryVariant({
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
        },
    }, {
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
            viewsNum_gt: 0,
        },
    }),
];
exports.GetTop10VideosThisMonthInputs = [
    createQueryVariant({
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
        },
    }, {
        where: {
            isPublic_eq: true,
            thumbnailPhoto: { isAccepted_eq: true },
            media: { isAccepted_eq: true },
            viewsNum_gt: 0,
        },
    }),
];
//# sourceMappingURL=queryVariants.js.map