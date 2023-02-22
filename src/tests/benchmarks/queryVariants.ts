import * as v1 from '../v1/generated/queries'
import * as v2 from '../v2/generated/queries'
import * as v1Schema from '../v1/generated/schema'
import * as v2Schema from '../v2/generated/schema'

type QueryVariant<V1Vars, V2Vars> = {
  v1Input: V1Vars
  v2Input: V2Vars
  v1Results: number[]
  v2Results: number[]
}

export function createQueryVariant<V1Vars = undefined, V2Vars = undefined>(
  v1Input: V1Vars,
  v2Input?: V2Vars
): QueryVariant<V1Vars, V2Vars> {
  return {
    v1Input,
    v2Input: v2Input || (v1Input as unknown as V2Vars),
    v1Results: [],
    v2Results: [],
  }
}

export const GetBidsInputs: QueryVariant<v1.GetBidsQueryVariables, v2.GetBidsQueryVariables>[] = [
  createQueryVariant(
    { where: { nft: { id_eq: '5' } } },
    { where: { auction: { nft: { id_eq: '5' } } } }
  ),
  createQueryVariant({ where: { bidder: { id_eq: '510' } } }),
  createQueryVariant({ where: {}, limit: 100 }),
]

export const GetFullChannelInputs: QueryVariant<
  v1.GetFullChannelQueryVariables,
  v2.GetFullChannelQueryVariables
>[] = [createQueryVariant({ where: { id: '7757' } }, { id: '7757' })]

export const GetVideoCountInputs: QueryVariant<
  v1.GetVideoCountQueryVariables,
  v2.GetVideoCountQueryVariables
>[] = [
  createQueryVariant({ where: { category: { name_eq: 'Memes' } } }),
  createQueryVariant({ where: {} }),
]

export const GetBasicChannelsInputs: QueryVariant<
  v1.GetBasicChannelsQueryVariables,
  v2.GetExtendedBasicChannelsQueryVariables
>[] = [
  createQueryVariant(
    {
      where: { activeVideosCounter_gt: 1, language: { iso_contains: 'en' } },
      limit: 100,
      orderBy: v1Schema.ChannelOrderByInput.CreatedAtAsc,
    },
    {
      where: { activeVideosCount_gt: 1, channel: { language_contains: 'en' } },
      limit: 100,
      orderBy: v2Schema.ChannelOrderByInput.CreatedAtAsc,
    }
  ),
  createQueryVariant({ where: {}, limit: 100 }),
  createQueryVariant({ where: {}, limit: 1000 }),
]

export const GetFullChannelsInputs: QueryVariant<
  v1.GetFullChannelsQueryVariables,
  v2.GetExtendedFullChannelsQueryVariables
>[] = [
  createQueryVariant(
    { where: { activeVideosCounter_gt: 5 } },
    { where: { activeVideosCount_gt: 5 } }
  ),
  createQueryVariant({ where: {}, limit: 100 }),
  createQueryVariant({ where: {}, limit: 1000 }),
]

export const GetBasicChannelsConnectionInputs: QueryVariant<
  v1.GetBasicChannelsConnectionQueryVariables,
  v2.GetBasicChannelsConnectionQueryVariables
>[] = [
  createQueryVariant({
    where: { title_contains: 'a', avatarPhoto: { isAccepted_eq: true }, isPublic_eq: true },
    first: 50,
  }),
]

export const GetTop10ChannelsInputs: QueryVariant<
  v1.GetTop10ChannelsQueryVariables,
  v2.GetTop10ChannelsQueryVariables
>[] = [
  createQueryVariant(
    { where: { activeVideosCounter_gt: 0, isPublic_eq: true } },
    { where: { activeVideosCount_gt: 0, channel: { isPublic_eq: true, followsNum_gt: 0 } } }
  ),
]

export const GetPromisingChannelsInputs: QueryVariant<
  v1.GetPromisingChannelsQueryVariables,
  v2.GetPromisingChannelsQueryVariables
>[] = [
  createQueryVariant(
    { where: { activeVideosCounter_gt: 4, isPublic_eq: true } },
    { where: { activeVideosCount_gt: 4, channel: { isPublic_eq: true, videoViewsNum_gt: 0 } } }
  ),
]

export const GetDiscoverChannelsInputs: QueryVariant<
  v1.GetDiscoverChannelsQueryVariables,
  v2.GetDiscoverChannelsQueryVariables
>[] = [
  createQueryVariant(
    { where: { activeVideosCounter_gt: 4, isPublic_eq: true } },
    { where: { activeVideosCount_gt: 4, channel: { isPublic_eq: true, followsNum_gt: 0 } } }
  ),
]

export const GetPopularChannelsInputs: QueryVariant<
  v1.GetPopularChannelsQueryVariables,
  v2.GetPopularChannelsQueryVariables
>[] = [
  createQueryVariant(
    { where: { activeVideosCounter_gt: 4, isPublic_eq: true } },
    { where: { activeVideosCount_gt: 4, channel: { isPublic_eq: true, videoViewsNum_gt: 0 } } }
  ),
]

export const GetChannelNftCollectorsInputs: QueryVariant<
  v1.GetChannelNftCollectorsQueryVariables,
  v2.GetChannelNftCollectorsQueryVariables
>[] = [createQueryVariant({ where: { channel: { id_eq: '7693' } } }, { channelId: '7693' })]

export const GetCommentInputs: QueryVariant<
  v1.GetCommentQueryVariables,
  v2.GetCommentQueryVariables
>[] = [createQueryVariant({ commentId: 'METAPROTOCOL-OLYMPIA-769463-2' })]

export const GetCommentRepliesConnectionInputs: QueryVariant<
  v1.GetCommentRepliesConnectionQueryVariables,
  v2.GetCommentRepliesConnectionQueryVariables
>[] = [
  createQueryVariant({
    parentCommentId: 'METAPROTOCOL-OLYMPIA-874662-2',
    first: 10,
    orderBy: v1Schema.CommentOrderByInput.CreatedAtDesc,
  }),
]

export const GetUserCommentsAndVideoCommentsConnectionInputs: QueryVariant<
  v1.GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  v2.GetUserCommentsAndVideoCommentsConnectionQueryVariables
>[] = [
  createQueryVariant({
    videoId: '5',
    memberId: '4680',
    first: 10,
    orderBy: v1Schema.CommentOrderByInput.CreatedAtDesc,
  }),
]

export const GetUserCommentsReactionsInputs: QueryVariant<
  v1.GetUserCommentsReactionsQueryVariables,
  v2.GetUserCommentsReactionsQueryVariables
>[] = [createQueryVariant({ memberId: '3233', videoId: '193' })]

export const GetCommentEditsInputs: QueryVariant<
  v1.GetCommentEditsQueryVariables,
  v2.GetCommentEditsQueryVariables
>[] = [createQueryVariant({ commentId: 'METAPROTOCOL-OLYMPIA-1049713-2' })]

export const GetDataObjectAvailabilityInputs: QueryVariant<
  v1.GetDataObjectAvailabilityQueryVariables,
  v2.GetDataObjectAvailabilityQueryVariables
>[] = [
  createQueryVariant({ id_in: Array.from({ length: 10 }, (_, i) => i.toString()), limit: 10 }),
  createQueryVariant({ id_in: Array.from({ length: 100 }, (_, i) => i.toString()), limit: 100 }),
  createQueryVariant({ id_in: Array.from({ length: 1000 }, (_, i) => i.toString()), limit: 1000 }),
]

export const GetMembershipsInputs: QueryVariant<
  v1.GetMembershipsQueryVariables,
  v2.GetMembershipsQueryVariables
>[] = [
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
]

export const GetNftInputs: QueryVariant<v1.GetNftQueryVariables, v2.GetNftQueryVariables>[] = [
  createQueryVariant({ id: '5' }),
  createQueryVariant({ id: '9' }),
]

export const GetNftsInputs: QueryVariant<v1.GetNftsQueryVariables, v2.GetNftsQueryVariables>[] = [
  createQueryVariant({ where: {}, limit: 100 }),
  createQueryVariant({ where: {}, limit: 1000 }),
]

export const GetNftsConnectionInputs: QueryVariant<
  v1.GetNftsConnectionQueryVariables,
  v2.GetNftsConnectionQueryVariables
>[] = [
  createQueryVariant(
    {
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
    },
    {
      where: {
        transactionalStatus: {
          isTypeOf_in: ['TransactionalStatusAuction', 'TransactionalStatusBuyNow'],
        },
      },
      first: 10,
      orderBy: v2Schema.OwnedNftOrderByInput.CreatedAtDesc,
    }
  ),
  createQueryVariant(
    {
      where: { creatorChannel: { id_eq: '7712' }, video: { isPublic_eq: true } },
      orderBy: v1Schema.OwnedNftOrderByInput.CreatedAtDesc,
      first: 50,
    },
    {
      where: { video: { channel: { id_eq: '7712' }, isPublic_eq: true } },
      orderBy: v2Schema.OwnedNftOrderByInput.CreatedAtDesc,
      first: 50,
    }
  ),
  createQueryVariant(
    {
      where: { ownerMember: { handle_eq: 'web3mercury' }, video: { isPublic_eq: true } },
      first: 50,
    },
    {
      where: {
        OR: [
          { owner: { member: { handle_eq: 'web3mercury' } } },
          { owner: { channel: { ownerMember: { handle_eq: 'web3mercury' } } } },
        ],
      },
      first: 50,
    }
  ),
]

// Due to the fact that in Orion v2 the GetNotifications query includes
// notifications about comments posted in all of the member's channels
// (in Orion v1 this was only possible for one channel), `memberId` should
// ideally be of a member that has only one channel (in order for the number of rows to be the same)
export const GetNotificationsInputs: QueryVariant<
  v1.GetNotificationsQueryVariables,
  v2.GetNotificationsQueryVariables
>[] = [
  createQueryVariant({ limit: 50, channelId: '7692', memberId: '2962' }),
  createQueryVariant({ limit: 50, channelId: '7693', memberId: '3233' }),
]

export const GetNftHistoryInputs: QueryVariant<
  v1.GetNftHistoryQueryVariables,
  v2.GetNftHistoryQueryVariables
>[] = [
  createQueryVariant({ nftId: '5' }),
  createQueryVariant({ nftId: '14' }),
  createQueryVariant({ nftId: '338' }),
]

export const GetNftActivitiesInputs: QueryVariant<
  v1.GetNftActivitiesQueryVariables,
  v2.GetNftActivitiesQueryVariables
>[] = [
  createQueryVariant({ limit: 1000, memberId: '4537' }),
  createQueryVariant({ limit: 1000, memberId: '798' }),
]

export const GetMetaprotocolTransactionStatusEventsInputs: QueryVariant<
  v1.GetMetaprotocolTransactionStatusEventsQueryVariables,
  v2.GetMetaprotocolTransactionStatusEventsQueryVariables
>[] = [
  createQueryVariant({
    transactionHash: '0x536d93a5e19c48d6f5983c8de3b9622fe44d096f13698aa2c13e8ae0f8a62780',
  }),
]

export const GetFullVideoInputs: QueryVariant<
  v1.GetFullVideoQueryVariables,
  v2.GetFullVideoQueryVariables
>[] = [
  createQueryVariant({ where: { id: '5' } }, { id: '5' }),
  createQueryVariant({ where: { id: '338' } }, { id: '338' }),
]

export const GetBasicVideosConnectionInputs: QueryVariant<
  v1.GetBasicVideosConnectionQueryVariables,
  v2.GetBasicVideosConnectionQueryVariables
>[] = [
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
]

export const GetFullVideosConnectionInputs: QueryVariant<
  v1.GetFullVideosConnectionQueryVariables,
  v2.GetFullVideosConnectionQueryVariables
>[] = [
  createQueryVariant({
    first: 50,
    orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
    where: { channel: { id_eq: '7712' } },
  }),
]

export const GetBasicVideosInputs: QueryVariant<
  v1.GetBasicVideosQueryVariables,
  v2.GetBasicVideosQueryVariables
>[] = [
  createQueryVariant({ where: {}, limit: 100 }),
  createQueryVariant({ where: {}, limit: 1000 }),
]

export const GetFullVideosInputs: QueryVariant<
  v1.GetFullVideosQueryVariables,
  v2.GetFullVideosQueryVariables
>[] = [
  createQueryVariant({ where: {}, limit: 100 }),
  createQueryVariant({ where: {}, limit: 1000 }),
]

export const GetMostViewedVideosConnectionInputs: QueryVariant<
  v1.GetMostViewedVideosConnectionQueryVariables,
  v2.GetMostViewedVideosConnectionQueryVariables
>[] = [
  createQueryVariant(
    {
      periodDays: 30,
      orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
      },
    },
    {
      periodDays: 30,
      orderBy: v2Schema.VideoOrderByInput.CreatedAtDesc,
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
        viewsNum_gt: 0,
      },
    }
  ),
  createQueryVariant(
    {
      periodDays: 7,
      orderBy: v1Schema.VideoOrderByInput.CreatedAtDesc,
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
      },
    },
    {
      periodDays: 7,
      orderBy: v2Schema.VideoOrderByInput.CreatedAtDesc,
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
        viewsNum_gt: 0,
      },
    }
  ),
]

export const GetTop10VideosThisWeekInputs: QueryVariant<
  v1.GetTop10VideosThisWeekQueryVariables,
  v2.GetTop10VideosThisWeekQueryVariables
>[] = [
  createQueryVariant(
    {
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
      },
    },
    {
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
        viewsNum_gt: 0,
      },
    }
  ),
]

export const GetTop10VideosThisMonthInputs: QueryVariant<
  v1.GetTop10VideosThisMonthQueryVariables,
  v2.GetTop10VideosThisMonthQueryVariables
>[] = [
  createQueryVariant(
    {
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
      },
    },
    {
      where: {
        isPublic_eq: true,
        thumbnailPhoto: { isAccepted_eq: true },
        media: { isAccepted_eq: true },
        viewsNum_gt: 0,
      },
    }
  ),
]
