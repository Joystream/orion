import { ApolloServer } from 'apollo-server-express'
import { Mongoose } from 'mongoose'
import { Aggregates } from '../src/types'
import { buildAggregates, connectMongoose, createServer } from '../src/server'
import {
  FOLLOW_CHANNEL,
  FollowChannel,
  FollowChannelArgs,
  UNFOLLOW_CHANNEL,
  UnfollowChannel,
  UnfollowChannelArgs,
  GET_MOST_FOLLOWED_CHANNELS_CONNECTION,
  GetMostFollowedChannelsConnection,
  GetMostFollowedChannelsConnectionArgs,
} from './queries/follows'
import { ChannelFollowsInfo } from '../src/entities/ChannelFollowsInfo'
import { createMutationFn, createQueryFn, MutationFn, QueryFn } from './helpers'
import { ChannelEventModel } from '../src/models/ChannelEvent'

const FIRST_CHANNEL_ID = '1'
const SECOND_CHANNEL_ID = '2'

describe('Channel follows resolver', () => {
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
    await ChannelEventModel.deleteMany({})
    await mongoose.disconnect()
  })

  const followChannel = async (channelId: string) => {
    const followChannelResponse = await mutate<FollowChannel, FollowChannelArgs>({
      mutation: FOLLOW_CHANNEL,
      variables: { channelId },
    })
    expect(followChannelResponse.errors).toBeUndefined()
    return followChannelResponse.data?.followChannel
  }

  const unfollowChannel = async (channelId: string) => {
    const unfollowChannelResponse = await mutate<UnfollowChannel, UnfollowChannelArgs>({
      mutation: UNFOLLOW_CHANNEL,
      variables: { channelId },
    })
    expect(unfollowChannelResponse.errors).toBeUndefined()
    return unfollowChannelResponse.data?.unfollowChannel
  }

  const getMostFollowedChannels = async (periodDays: 7 | 30 | null) => {
    const mostFollowedChannelsResponse = await query<
      GetMostFollowedChannelsConnection,
      GetMostFollowedChannelsConnectionArgs
    >({
      query: GET_MOST_FOLLOWED_CHANNELS_CONNECTION,
      variables: { periodDays, limit: 10 },
    })
    expect(mostFollowedChannelsResponse.errors).toBeUndefined()
    return mostFollowedChannelsResponse.data?.mostFollowedChannelsConnection
  }

  it('should return null for unknown channel follows', async () => {
    const mostFollowedChannels = await getMostFollowedChannels(30)
    const mostFollowedChannelsAllTime = await getMostFollowedChannels(null)

    expect(mostFollowedChannels?.edges).toHaveLength(0)
    expect(mostFollowedChannelsAllTime?.edges).toHaveLength(0)
  })

  it('should properly handle channel follow', async () => {
    const expectedChannelFollows: ChannelFollowsInfo = {
      id: FIRST_CHANNEL_ID,
      follows: 1,
    }
    const expectedMostFollowedChannels = {
      edges: [expectedChannelFollows].map((follow) => ({ node: follow })),
    }

    let addChannelFollowData = await followChannel(FIRST_CHANNEL_ID)
    expect(addChannelFollowData).toEqual(expectedChannelFollows)

    let mostFollowedChannels = await getMostFollowedChannels(30)
    let mostFollowedChannelsAllTime = await getMostFollowedChannels(null)
    expect(mostFollowedChannels).toEqual(expectedMostFollowedChannels)
    expect(mostFollowedChannelsAllTime).toEqual(expectedMostFollowedChannels)

    expectedChannelFollows.follows++

    addChannelFollowData = await followChannel(FIRST_CHANNEL_ID)
    expect(addChannelFollowData).toEqual(expectedChannelFollows)

    mostFollowedChannels = await getMostFollowedChannels(30)
    mostFollowedChannelsAllTime = await getMostFollowedChannels(null)
    expect(mostFollowedChannels).toEqual(expectedMostFollowedChannels)
    expect(mostFollowedChannelsAllTime).toEqual(expectedMostFollowedChannels)
  })

  it('should properly handle channel unfollow', async () => {
    const expectedChannelFollows: ChannelFollowsInfo = {
      id: FIRST_CHANNEL_ID,
      follows: 5,
    }

    const expectedMostFollowedChannels = {
      edges: [expectedChannelFollows].map((follow) => ({ node: follow })),
    }

    await followChannel(FIRST_CHANNEL_ID)
    await followChannel(FIRST_CHANNEL_ID)
    await followChannel(FIRST_CHANNEL_ID)
    await followChannel(FIRST_CHANNEL_ID)
    await followChannel(FIRST_CHANNEL_ID)

    let mostFollowedChannels = await getMostFollowedChannels(30)
    let mostFollowedChannelsAllTime = await getMostFollowedChannels(null)
    expect(mostFollowedChannels).toEqual(expectedMostFollowedChannels)
    expect(mostFollowedChannelsAllTime).toEqual(expectedMostFollowedChannels)

    expectedChannelFollows.follows--

    const unfollowChannelData = await unfollowChannel(FIRST_CHANNEL_ID)
    expect(unfollowChannelData).toEqual(expectedChannelFollows)

    mostFollowedChannels = await getMostFollowedChannels(30)
    mostFollowedChannelsAllTime = await getMostFollowedChannels(null)
    expect(mostFollowedChannels).toEqual(expectedMostFollowedChannels)
    expect(mostFollowedChannelsAllTime).toEqual(expectedMostFollowedChannels)
  })

  it('should distinct follows of separate channels', async () => {
    const expectedFirstChannelFollows: ChannelFollowsInfo = {
      id: FIRST_CHANNEL_ID,
      follows: 1,
    }
    const expectedSecondChannelFollows: ChannelFollowsInfo = {
      id: SECOND_CHANNEL_ID,
      follows: 1,
    }
    const expectedMostFollowedChannels = {
      edges: [expectedFirstChannelFollows, expectedSecondChannelFollows].map((follow) => ({ node: follow })),
    }

    const firstChannelFollowData = await followChannel(FIRST_CHANNEL_ID)
    const secondChannelFollowData = await followChannel(SECOND_CHANNEL_ID)

    expect(firstChannelFollowData).toEqual(expectedFirstChannelFollows)
    expect(secondChannelFollowData).toEqual(expectedSecondChannelFollows)

    expectedFirstChannelFollows.follows++

    await followChannel(FIRST_CHANNEL_ID)

    const mostFollowedChannels = await getMostFollowedChannels(30)
    const mostFollowedChannelsAllTime = await getMostFollowedChannels(null)

    expect(mostFollowedChannels).toEqual(expectedMostFollowedChannels)
    expect(mostFollowedChannelsAllTime).toEqual(expectedMostFollowedChannels)
  })

  it('should properly rebuild the aggregate', async () => {
    const expectedFirstChannelFollows: ChannelFollowsInfo = {
      id: FIRST_CHANNEL_ID,
      follows: 3,
    }
    const expectedSecondChannelFollows: ChannelFollowsInfo = {
      id: SECOND_CHANNEL_ID,
      follows: 4,
    }
    const expectedMostFollowedChannels = {
      edges: [expectedFirstChannelFollows, expectedSecondChannelFollows].map((follow) => ({ node: follow })),
    }

    const checkFollows = async () => {
      const mostFollowedChannels = await getMostFollowedChannels(30)
      const mostFollowedChannelsAllTime = await getMostFollowedChannels(null)

      expect(mostFollowedChannels).toEqual(expectedMostFollowedChannels)
      expect(mostFollowedChannelsAllTime).toEqual(expectedMostFollowedChannels)
    }

    await followChannel(FIRST_CHANNEL_ID)
    await followChannel(FIRST_CHANNEL_ID)
    await followChannel(FIRST_CHANNEL_ID)

    await followChannel(SECOND_CHANNEL_ID)
    await followChannel(SECOND_CHANNEL_ID)
    await followChannel(SECOND_CHANNEL_ID)
    await followChannel(SECOND_CHANNEL_ID)
    await followChannel(SECOND_CHANNEL_ID)
    await unfollowChannel(SECOND_CHANNEL_ID)

    await checkFollows()

    await server.stop()
    aggregates = await buildAggregates()
    server = await createServer(mongoose, aggregates, process.env.ORION_QUERY_NODE_URL!)
    query = createQueryFn(server)
    mutate = createMutationFn(server)

    await checkFollows()
  })
})
