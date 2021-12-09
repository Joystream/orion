import { ApolloServer } from 'apollo-server-express'
import { Mongoose } from 'mongoose'
import { Aggregates } from '../src/types'
import { createMutationFn, createQueryFn, MutationFn, QueryFn } from './helpers'
import { buildAggregates, connectMongoose, createServer } from '../src/server'
import {
  GET_ALL_CATEGORIES_FEATURED_VIDEOS,
  GET_CATEGORY_FEATURED_VIDEOS,
  GET_VIDEO_HERO,
  GetAllCategoriesFeaturedVideos,
  GetCategoryFeaturedVideos,
  GetCategoryFeaturedVideosArgs,
  GetVideoHero,
  SET_CATEGORY_FEATURED_VIDEOS,
  SET_VIDEO_HERO,
  SetCategoryFeaturedVideos,
  SetCategoryFeaturedVideosArgs,
  SetVideoHero,
  SetVideoHeroArgs,
} from './queries/featuredContent'
import {
  DEFAULT_FEATURED_CONTENT_DOC,
  FeaturedContentModel,
  FeaturedVideo,
  VideoHero,
} from '../src/models/FeaturedContent'

describe('Featured content resolver', () => {
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
    await FeaturedContentModel.deleteMany({})
    await mongoose.disconnect()
  })

  const getVideoHero = async () => {
    const result = await query<GetVideoHero>({
      query: GET_VIDEO_HERO,
    })
    expect(result.errors).toBeUndefined()
    return result.data?.videoHero
  }

  const getCategoryFeaturedVideos = async (categoryId: string) => {
    const result = await query<GetCategoryFeaturedVideos, GetCategoryFeaturedVideosArgs>({
      query: GET_CATEGORY_FEATURED_VIDEOS,
      variables: { categoryId },
    })
    expect(result.errors).toBeUndefined()
    return result.data?.categoryFeaturedVideos
  }

  const getAllCategoriesFeaturedVideos = async () => {
    const result = await query<GetAllCategoriesFeaturedVideos>({
      query: GET_ALL_CATEGORIES_FEATURED_VIDEOS,
    })
    expect(result.errors).toBeUndefined()
    return result.data?.allCategoriesFeaturedVideos
  }

  it("should return default video hero if it wasn't set", async () => {
    const videoHero = await getVideoHero()
    expect(videoHero).toEqual(DEFAULT_FEATURED_CONTENT_DOC.videoHero)
  })

  it('should return empty array of featured videos for unknown category id', async () => {
    const featuredVideos = await getCategoryFeaturedVideos('1')
    expect(featuredVideos).toHaveLength(0)
  })

  it('should return empty array for list of all categories with featured videos', async () => {
    const allCategoriesFeaturedVideos = await getAllCategoriesFeaturedVideos()
    expect(allCategoriesFeaturedVideos).toHaveLength(0)
  })

  it('should set video hero', async () => {
    const newVideoHero: VideoHero = {
      videoId: '1111',
      heroTitle: 'Hello darkness my old friend',
      heroVideoCutUrl: 'example_url',
      heroPosterUrl: 'example_url_2',
    }
    await mutate<SetVideoHero, SetVideoHeroArgs>({
      mutation: SET_VIDEO_HERO,
      variables: { newVideoHero },
    })

    const videoHero = await getVideoHero()
    expect(videoHero).toEqual(newVideoHero)
  })

  it('should set featured videos for a given category', async () => {
    const newFeaturedVideos: FeaturedVideo[] = [
      { videoId: '1', videoCutUrl: 'test_url' },
      { videoId: '2', videoCutUrl: 'another_url' },
    ]
    await mutate<SetCategoryFeaturedVideos, SetCategoryFeaturedVideosArgs>({
      mutation: SET_CATEGORY_FEATURED_VIDEOS,
      variables: { categoryId: '3', videos: newFeaturedVideos },
    })

    const featuredVideos = await getCategoryFeaturedVideos('3')
    expect(featuredVideos).toEqual(newFeaturedVideos)
  })

  it('should return all categories that have featured videos set', async () => {
    const category1FeaturedVideos: FeaturedVideo[] = [
      { videoId: '1', videoCutUrl: 'test_url' },
      { videoId: '2', videoCutUrl: 'another_url' },
    ]
    const category2FeaturedVideos: FeaturedVideo[] = [
      { videoId: '3', videoCutUrl: 'url_test' },
      { videoId: '4', videoCutUrl: 'url_another' },
    ]
    await mutate<SetCategoryFeaturedVideos, SetCategoryFeaturedVideosArgs>({
      mutation: SET_CATEGORY_FEATURED_VIDEOS,
      variables: { categoryId: '1', videos: category1FeaturedVideos },
    })
    await mutate<SetCategoryFeaturedVideos, SetCategoryFeaturedVideosArgs>({
      mutation: SET_CATEGORY_FEATURED_VIDEOS,
      variables: { categoryId: '2', videos: category2FeaturedVideos },
    })

    const allCategoriesFeaturedVideos = await getAllCategoriesFeaturedVideos()
    expect(allCategoriesFeaturedVideos).toEqual([
      {
        categoryId: '1',
        videos: category1FeaturedVideos,
      },
      {
        categoryId: '2',
        videos: category2FeaturedVideos,
      },
    ])
  })
})
