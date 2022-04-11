import { ApolloServer } from 'apollo-server-express'
import { Mongoose } from 'mongoose'
import { Aggregates } from '../src/types'
import { buildAggregates, connectMongoose, createServer } from '../src/server'
import {
  ADD_VIDEO_VIEW,
  AddVideoView,
  AddVideoViewArgs,
  GET_MOST_VIEWED_CHANNELS_CONNECTION,
  GET_MOST_VIEWED_VIDEOS_CONNECTION,
  GET_MOST_VIEWED_CATEGORIES,
  GET_MOST_VIEWED_CATEGORIES_ALL_TIME,
  GetMostViewedVideosConnectionArgs,
  GetMostViewedChannelsConnectionArgs,
  GetMostViewedVideosConnection,
  GetMostViewedChannelsConnection,
  GetMostViewedCategoriesArgs,
  GetMostViewedCategoriesAllTimeArgs,
  GetMostViewedCategories,
  GetMostViewedCategoriesAllTime,
} from './queries/views'
import { EntityViewsInfo } from '../src/entities/EntityViewsInfo'
import { VideoEventModel } from '../src/models/VideoEvent'
import { createMutationFn, createQueryFn, MutationFn, QueryFn } from './helpers'

jest.setTimeout(20000)

const FIRST_VIDEO_ID = '1'
const SECOND_VIDEO_ID = '2'
const FIRST_CHANNEL_ID = '2'
const SECOND_CHANNEL_ID = '3'
const FIRST_CATEGORY_ID = '1'

describe('Video and channel views resolver', () => {
  let server: ApolloServer
  let mongoose: Mongoose
  let aggregates: Aggregates
  let query: QueryFn
  let mutate: MutationFn

  beforeEach(async () => {
    mongoose = await connectMongoose(process.env.MONGO_URL!)
    aggregates = await buildAggregates()
    server = await createServer(mongoose, aggregates, process.env.ORION_QUERY_NODE_URL!)
    await server.start()
    query = createQueryFn(server)
    mutate = createMutationFn(server)
  })

  afterEach(async () => {
    await server.stop()
    await VideoEventModel.deleteMany({})
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

  const getMostViewedVideos = async (periodDays: 7 | 30 | null) => {
    const mostViewedVideosResponse = await query<GetMostViewedVideosConnection, GetMostViewedVideosConnectionArgs>({
      query: GET_MOST_VIEWED_VIDEOS_CONNECTION,
      variables: { periodDays, limit: 10 },
    })
    expect(mostViewedVideosResponse.errors).toBeUndefined()
    return mostViewedVideosResponse.data?.mostViewedVideosConnection
  }

  const getMostViewedChannels = async (periodDays: 7 | 30 | null) => {
    const mostViewedChannelsResponse = await query<
      GetMostViewedChannelsConnection,
      GetMostViewedChannelsConnectionArgs
    >({
      query: GET_MOST_VIEWED_CHANNELS_CONNECTION,
      variables: { periodDays, limit: 10 },
    })
    expect(mostViewedChannelsResponse.errors).toBeUndefined()
    return mostViewedChannelsResponse.data?.mostViewedChannelsConnection
  }

  const getMostViewedCategories = async (timePeriodDays: number) => {
    const mostViewedCategoriesResponse = await query<GetMostViewedCategories, GetMostViewedCategoriesArgs>({
      query: GET_MOST_VIEWED_CATEGORIES,
      variables: { timePeriodDays },
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
    const mostViewedVideos = await getMostViewedVideos(30)
    const mostViewedVideosAllTime = await getMostViewedVideos(null)
    const mostViewedChannels = await getMostViewedChannels(30)
    const mostViewedChannelsAllTime = await getMostViewedChannels(null)
    const mostViewedCategories = await getMostViewedCategories(30)
    const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

    expect(mostViewedVideos?.edges).toHaveLength(0)
    expect(mostViewedVideosAllTime?.edges).toHaveLength(0)
    expect(mostViewedChannels?.edges).toHaveLength(0)
    expect(mostViewedChannelsAllTime?.edges).toHaveLength(0)
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

    const expectedMostViewedVideos = {
      edges: [expectedVideoViews].map((view) => ({ node: view })),
    }

    const expectedMostViewedChannels = {
      edges: [expectedChannelViews].map((view) => ({ node: view })),
    }

    const checkViews = async () => {
      const mostViewedVideos = await getMostViewedVideos(30)
      const mostViewedVideosAllTime = await getMostViewedVideos(null)
      const mostViewedChannels = await getMostViewedChannels(30)
      const mostViewedChannelsAllTime = await getMostViewedChannels(null)
      const mostViewedCategories = await getMostViewedCategories(30)
      const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

      expect(mostViewedVideos).toEqual(expectedMostViewedVideos)
      expect(mostViewedVideosAllTime).toEqual(expectedMostViewedVideos)
      expect(mostViewedChannels).toEqual(expectedMostViewedChannels)
      expect(mostViewedChannelsAllTime).toEqual(expectedMostViewedChannels)
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

    const expectedMostViewedVideos = {
      edges: [expectedFirstVideoViews, expectedSecondVideoViews].map((view) => ({ node: view })),
    }

    const addFirstVideoViewData = await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    const addSecondVideoViewData = await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID)

    expect(addFirstVideoViewData).toEqual(expectedFirstVideoViews)
    expect(addSecondVideoViewData).toEqual(expectedSecondVideoViews)

    expectedFirstVideoViews.views++

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)

    const mostViewedVideos = await getMostViewedVideos(30)
    const mostViewedVideosAllTime = await getMostViewedVideos(null)

    expect(mostViewedVideos).toEqual(expectedMostViewedVideos)
    expect(mostViewedVideosAllTime).toEqual(expectedMostViewedVideos)
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

    const expectedMostViewedChannels = {
      edges: [expectedFirstChanelViews, expectedSecondChannelViews].map((view) => ({ node: view })),
    }

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    await addVideoView(SECOND_VIDEO_ID, SECOND_CHANNEL_ID)

    const mostViewedChannels = await getMostViewedChannels(30)
    const mostViewedChannelsAllTime = await getMostViewedChannels(null)

    expect(mostViewedChannels).toEqual(expectedMostViewedChannels)
    expect(mostViewedChannelsAllTime).toEqual(expectedMostViewedChannels)
  })

  it('should properly aggregate views of a channel', async () => {
    const expectedChannelViews: EntityViewsInfo = {
      id: FIRST_CHANNEL_ID,
      views: 2,
    }

    await addVideoView(FIRST_VIDEO_ID, FIRST_CHANNEL_ID)
    await addVideoView(SECOND_VIDEO_ID, FIRST_CHANNEL_ID)

    const expectedMostViewedChannels = {
      edges: [expectedChannelViews].map((view) => ({ node: view })),
    }

    const mostViewedChannels = await getMostViewedChannels(30)
    const mostViewedChannelsAllTime = await getMostViewedChannels(null)

    expect(mostViewedChannels).toEqual(expectedMostViewedChannels)
    expect(mostViewedChannelsAllTime).toEqual(expectedMostViewedChannels)
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

    const expectedMostViewedVideos = {
      edges: [expectedFirstVideoViews, expectedSecondVideoViews].map((view) => ({ node: view })),
    }

    const expectedMostViewedChannels = {
      edges: [expectedChannelViews].map((view) => ({ node: view })),
    }

    const checkViews = async () => {
      const mostViewedVideos = await getMostViewedVideos(30)
      const mostViewedVideosAllTime = await getMostViewedVideos(null)
      const mostViewedChannels = await getMostViewedChannels(30)
      const mostViewedChannelsAllTime = await getMostViewedChannels(null)
      const mostViewedCategories = await getMostViewedCategories(30)
      const mostViewedCategoriesAllTime = await getMostViewedCategoriesAllTime(10)

      expect(mostViewedVideos).toEqual(expectedMostViewedVideos)
      expect(mostViewedVideosAllTime).toEqual(expectedMostViewedVideos)
      expect(mostViewedChannels).toEqual(expectedMostViewedChannels)
      expect(mostViewedChannelsAllTime).toEqual(expectedMostViewedChannels)
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
    server = await createServer(mongoose, aggregates, process.env.ORION_QUERY_NODE_URL!)
    query = createQueryFn(server)
    mutate = createMutationFn(server)

    await checkViews()
  })
})
