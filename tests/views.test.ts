import { ApolloServer } from 'apollo-server-express'
import { Mongoose } from 'mongoose'
import { Aggregates } from '../src/types'
import { ApolloServerTestClient } from 'apollo-server-testing/dist/createTestClient'
import { buildAggregates, connectMongoose, createServer } from '../src/server'
import { createTestClient } from 'apollo-server-testing'
import {
  ADD_VIDEO_VIEW,
  AddVideoView,
  AddVideoViewArgs,
  GET_CHANNEL_VIEWS,
  GET_MOST_VIEWED_CHANNELS,
  GET_MOST_VIEWED_CHANNELS_ALL_TIME,
  GET_VIDEO_VIEWS,
  GET_MOST_VIEWED_VIDEOS,
  GET_MOST_VIEWED_VIDEOS_ALL_TIME,
  GET_MOST_VIEWED_CATEGORIES,
  GET_MOST_VIEWED_CATEGORIES_ALL_TIME,
  GetChannelViews,
  GetChannelViewsArgs,
  GetVideoViews,
  GetVideoViewsArgs,
  GetMostViewedVideosArgs,
  GetMostViewedVideosAllTimeArgs,
  GetMostViewedChannelsArgs,
  GetMostViewedChannelsAllTimeArgs,
  GetMostViewedVideos,
  GetMostViewedVideosAllTime,
  GetMostViewedChannels,
  GetMostViewedChannelsAllTime,
  GetMostViewedCategoriesArgs,
  GetMostViewedCategoriesAllTimeArgs,
  GetMostViewedCategories,
  GetMostViewedCategoriesAllTime,
} from './queries/views'
import { EntityViewsInfo } from '../src/entities/EntityViewsInfo'
import { VideoEventsBucketModel } from '../src/models/VideoEvent'
import { TEST_BUCKET_SIZE } from './setup'

const FIRST_VIDEO_ID = '12'
const SECOND_VIDEO_ID = '13'
const FIRST_CHANNEL_ID = '22'
const SECOND_CHANNEL_ID = '23'
const FIRST_CATEGORY_ID = '32'

describe('Video and channel views resolver', () => {
  let server: ApolloServer
  let mongoose: Mongoose
  let aggregates: Aggregates
  let query: ApolloServerTestClient['query']
  let mutate: ApolloServerTestClient['mutate']

  beforeEach(async () => {
    mongoose = await connectMongoose(process.env.MONGO_URL!)
    aggregates = await buildAggregates()
    server = await createServer(mongoose, aggregates)
    const testClient = createTestClient(server)
    query = testClient.query
    mutate = testClient.mutate
  })

  afterEach(async () => {
    await server.stop()
    await VideoEventsBucketModel.deleteMany({})
    await mongoose.disconnect()
  })

  const addVideoView = async (videoId: string, channelId: string, categoryId?: string) => {
    const addVideoViewResponse = await mutate<AddVideoView, AddVideoViewArgs>({
      mutation: ADD_VIDEO_VIEW,
      variables: { videoId, channelId, categoryId },
    })
    expect(addVideoViewResponse.errors).toBeUndefined()
    return addVideoViewResponse.data?.addVideoView
  }

  const getVideoViews = async (videoId: string) => {
    const videoViewsResponse = await query<GetVideoViews, GetVideoViewsArgs>({
      query: GET_VIDEO_VIEWS,
      variables: { videoId },
    })
    expect(videoViewsResponse.errors).toBeUndefined()
    return videoViewsResponse.data?.videoViews
  }

  const getMostViewedVideos = async (period: number) => {
    const mostViewedVideosResponse = await query<GetMostViewedVideos, GetMostViewedVideosArgs>({
      query: GET_MOST_VIEWED_VIDEOS,
      variables: { period },
    })
    expect(mostViewedVideosResponse.errors).toBeUndefined()
    return mostViewedVideosResponse.data?.mostViewedVideos
  }

  const getMostViewedVideosAllTime = async (limit: number) => {
    const mostViewedVideosAllTimeResponse = await query<GetMostViewedVideosAllTime, GetMostViewedVideosAllTimeArgs>({
      query: GET_MOST_VIEWED_VIDEOS_ALL_TIME,
      variables: { limit },
    })
    expect(mostViewedVideosAllTimeResponse.errors).toBeUndefined()
    return mostViewedVideosAllTimeResponse.data?.mostViewedVideosAllTime
  }

  const getChannelViews = async (channelId: string) => {
    const channelViewsResponse = await query<GetChannelViews, GetChannelViewsArgs>({
      query: GET_CHANNEL_VIEWS,
      variables: { channelId },
    })
    expect(channelViewsResponse.errors).toBeUndefined()
    return channelViewsResponse.data?.channelViews
  }

  const getMostViewedChannels = async (period: number) => {
    const mostViewedChannelsResponse = await query<GetMostViewedChannels, GetMostViewedChannelsArgs>({
      query: GET_MOST_VIEWED_CHANNELS,
      variables: { period },
    })
    expect(mostViewedChannelsResponse.errors).toBeUndefined()
    return mostViewedChannelsResponse.data?.mostViewedChannels
  }

  const getMostViewedChannelsAllTime = async (limit: number) => {
    const mostViewedChannelsAllTimeResponse = await query<
      GetMostViewedChannelsAllTime,
      GetMostViewedChannelsAllTimeArgs
    >({
      query: GET_MOST_VIEWED_CHANNELS_ALL_TIME,
      variables: { limit },
    })
    expect(mostViewedChannelsAllTimeResponse.errors).toBeUndefined()
    return mostViewedChannelsAllTimeResponse.data?.mostViewedChannelsAllTime
  }

  const getMostViewedCategories = async (period: number) => {
    const mostViewedCategoriesResponse = await query<GetMostViewedCategories, GetMostViewedCategoriesArgs>({
      query: GET_MOST_VIEWED_CATEGORIES,
      variables: { period },
    })
    expect(mostViewedCategoriesResponse.errors).toBeUndefined()
    return mostViewedCategoriesResponse.data?.mostViewedCategories
  }

  const getMostViewedCategoriesAllTime = async (limit: number) => {
    const mostViewedCategoriesAllTimeResponse = await query<
      GetMostViewedCategoriesAllTime,
      GetMostViewedCategoriesAllTimeArgs
    >({
      query: GET_MOST_VIEWED_CATEGORIES_ALL_TIME,
      variables: { limit },
    })
    expect(mostViewedCategoriesAllTimeResponse.errors).toBeUndefined()
    return mostViewedCategoriesAllTimeResponse.data?.mostViewedCategoriesAllTime
  }

  it('should return null for unknown video, channel and category views', async () => {
    const videoViews = await getVideoViews(FIRST_VIDEO_ID)
    const mostViewedVideos = await getMostViewedVideos(30)
    const mostViewedVideosAllTime = await getMostViewedVideosAllTime(10)
    const channelViews = await getChannelViews(FIRST_CHANNEL_ID)
    const mostViewedChannels = await getMostViewedChannels(30)
    const mostViewedChannelsAllTime = await getMostViewedChannelsAllTime(10)
    const mostViewedCategories = await getMostViewedCategories(30)
    const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

    expect(videoViews).toBeNull()
    expect(mostViewedVideos).toHaveLength(0)
    expect(mostViewedVideosAllTime).toHaveLength(0)
    expect(channelViews).toBeNull()
    expect(mostViewedChannels).toHaveLength(0)
    expect(mostViewedChannelsAllTime).toHaveLength(0)
    expect(mostViewedCategories).toHaveLength(0)
    expect(mostViewedCategoriesAllTime).toHaveLength(0)
  })

  it('should properly save video and channel views', async () => {
    const expectedVideoViews: EntityViewsInfo = {
      id: FIRST_VIDEO_ID,
      views: 1,
    }
    const expectedChannelViews: EntityViewsInfo = {
      id: FIRST_CHANNEL_ID,
      views: 1,
    }
    const expectedCategoryViews: EntityViewsInfo = {
      id: FIRST_CATEGORY_ID,
      views: 1,
    }
    const checkViews = async () => {
      const videoViews = await getVideoViews(FIRST_VIDEO_ID)
      const mostViewedVideos = await getMostViewedVideos(30)
      const mostViewedVideosAllTime = await getMostViewedVideosAllTime(10)
      const channelViews = await getChannelViews(FIRST_CHANNEL_ID)
      const mostViewedChannels = await getMostViewedChannels(30)
      const mostViewedChannelsAllTime = await getMostViewedChannelsAllTime(10)
      const mostViewedCategories = await getMostViewedCategories(30)
      const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

      expect(videoViews).toEqual(expectedVideoViews)
      expect(mostViewedVideos).toEqual([expectedVideoViews])
      expect(mostViewedVideosAllTime).toEqual([expectedVideoViews])
      expect(channelViews).toEqual(expectedChannelViews)
      expect(mostViewedChannels).toEqual([expectedChannelViews])
      expect(mostViewedChannelsAllTime).toEqual([expectedChannelViews])
      expect(mostViewedCategories).toEqual([expectedCategoryViews])
      expect(mostViewedCategoriesAllTime).toEqual([expectedCategoryViews])
    }

    let addVideoViewData = await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    expect(addVideoViewData).toEqual(expectedVideoViews)

    await checkViews()

    expectedVideoViews.views++
    expectedChannelViews.views++
    expectedCategoryViews.views++

    addVideoViewData = await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    expect(addVideoViewData).toEqual(expectedVideoViews)

    await checkViews()
  })

  it('should distinct views of separate videos', async () => {
    const expectedFirstVideoViews: EntityViewsInfo = {
      id: FIRST_VIDEO_ID,
      views: 1,
    }
    const expectedSecondVideoViews: EntityViewsInfo = {
      id: SECOND_VIDEO_ID,
      views: 1,
    }

    const addFirstVideoViewData = await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    const addSecondVideoViewData = await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID)

    expect(addFirstVideoViewData).toEqual(expectedFirstVideoViews)
    expect(addSecondVideoViewData).toEqual(expectedSecondVideoViews)

    expectedFirstVideoViews.views++

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)

    const firstVideoViews = await getVideoViews(FIRST_VIDEO_ID)
    const secondVideoViews = await getVideoViews(SECOND_VIDEO_ID)
    const mostViewedVideos = await getMostViewedVideos(30)
    const mostViewedVideosAllTime = await getMostViewedVideosAllTime(10)

    expect(firstVideoViews).toEqual(expectedFirstVideoViews)
    expect(secondVideoViews).toEqual(expectedSecondVideoViews)
    expect(mostViewedVideos).toEqual([expectedFirstVideoViews, expectedSecondVideoViews])
    expect(mostViewedVideosAllTime).toEqual([expectedFirstVideoViews, expectedSecondVideoViews])
  })

  it('should distinct views of separate channels', async () => {
    const expectedFirstChanelViews: EntityViewsInfo = {
      id: FIRST_CHANNEL_ID,
      views: 1,
    }
    const expectedSecondChannelViews: EntityViewsInfo = {
      id: SECOND_CHANNEL_ID,
      views: 1,
    }

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    await addVideoView(SECOND_VIDEO_ID, SECOND_CHANNEL_ID)

    const firstChannelViews = await getChannelViews(FIRST_CHANNEL_ID)
    const secondChannelViews = await getChannelViews(SECOND_CHANNEL_ID)
    const mostViewedChannels = await getMostViewedChannels(30)
    const mostViewedChannelsAllTime = await getMostViewedChannelsAllTime(10)

    expect(firstChannelViews).toEqual(expectedFirstChanelViews)
    expect(secondChannelViews).toEqual(expectedSecondChannelViews)
    expect(mostViewedChannels).toEqual([expectedFirstChanelViews, expectedSecondChannelViews])
    expect(mostViewedChannelsAllTime).toEqual([expectedFirstChanelViews, expectedSecondChannelViews])
  })

  it('should properly aggregate views of a channel', async () => {
    const expectedChannelViews: EntityViewsInfo = {
      id: FIRST_CHANNEL_ID,
      views: 2,
    }

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID)

    const channelViews = await getChannelViews(FIRST_CHANNEL_ID)
    const mostViewedChannels = await getMostViewedChannels(30)
    const mostViewedChannelsAllTime = await getMostViewedChannelsAllTime(10)

    expect(channelViews).toEqual(expectedChannelViews)
    expect(mostViewedChannels).toEqual([expectedChannelViews])
    expect(mostViewedChannelsAllTime).toEqual([expectedChannelViews])
  })

  it('should properly aggregate views of a category', async () => {
    const expectedChannelViews: EntityViewsInfo = {
      id: FIRST_CATEGORY_ID,
      views: 2,
    }

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)

    const mostViewedCategories = await getMostViewedCategories(30)
    const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

    expect(mostViewedCategories).toEqual([expectedChannelViews])
    expect(mostViewedCategoriesAllTime).toEqual([expectedChannelViews])
  })

  it('should properly rebuild the aggregate', async () => {
    const expectedFirstVideoViews: EntityViewsInfo = {
      id: FIRST_VIDEO_ID,
      views: 3,
    }
    const expectedSecondVideoViews: EntityViewsInfo = {
      id: SECOND_VIDEO_ID,
      views: 4,
    }
    const expectedChannelViews: EntityViewsInfo = {
      id: FIRST_CHANNEL_ID,
      views: 7,
    }
    const expectedCategoryViews: EntityViewsInfo = {
      id: FIRST_CATEGORY_ID,
      views: 7,
    }

    const checkViews = async () => {
      const firstVideoViews = await getVideoViews(FIRST_VIDEO_ID)
      const secondVideoViews = await getVideoViews(SECOND_VIDEO_ID)
      const channelViews = await getChannelViews(FIRST_CHANNEL_ID)
      const mostViewedVideos = await getMostViewedVideos(30)
      const mostViewedVideosAllTime = await getMostViewedVideosAllTime(10)
      const mostViewedChannels = await getMostViewedChannels(30)
      const mostViewedChannelsAllTime = await getMostViewedChannelsAllTime(10)
      const mostViewedCategories = await getMostViewedCategories(30)
      const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

      expect(firstVideoViews).toEqual(expectedFirstVideoViews)
      expect(secondVideoViews).toEqual(expectedSecondVideoViews)
      expect(mostViewedVideos).toEqual([expectedSecondVideoViews, expectedFirstVideoViews])
      expect(mostViewedVideosAllTime).toEqual([expectedSecondVideoViews, expectedFirstVideoViews])
      expect(channelViews).toEqual(expectedChannelViews)
      expect(mostViewedChannels).toEqual([expectedChannelViews])
      expect(mostViewedChannelsAllTime).toEqual([expectedChannelViews])
      expect(mostViewedCategories).toEqual([expectedCategoryViews])
      expect(mostViewedCategoriesAllTime).toEqual([expectedCategoryViews])
    }

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)

    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)
    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID, FIRST_CATEGORY_ID)

    await checkViews()

    await server.stop()
    aggregates = await buildAggregates()
    server = await createServer(mongoose, aggregates)
    const testClient = createTestClient(server)
    query = testClient.query
    mutate = testClient.mutate

    await checkViews()
  })

  it('should properly handle saving events across buckets', async () => {
    const eventsCount = TEST_BUCKET_SIZE * 2 + 1
    const expectedVideoViews: EntityViewsInfo = {
      id: FIRST_VIDEO_ID,
      views: eventsCount,
    }

    for (let i = 0; i < eventsCount; i++) {
      await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    }

    const videoViews = await getVideoViews(FIRST_VIDEO_ID)
    const mostViewedVideos = await getMostViewedVideos(30)
    const mostViewedVideosAllTime = await getMostViewedVideosAllTime(10)
    expect(videoViews).toEqual(expectedVideoViews)
    expect(mostViewedVideos).toEqual([expectedVideoViews])
    expect(mostViewedVideosAllTime).toEqual([expectedVideoViews])
  })
})
