import { buildAggregates, connectMongoose, createServer } from '../src/server'
import { Mongoose } from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import { Aggregates } from '../src/types'

describe('The server', () => {
  let server: ApolloServer
  let mongoose: Mongoose
  let aggregates: Aggregates

  beforeEach(async () => {
    mongoose = await connectMongoose(process.env.MONGO_URL!)
    aggregates = await buildAggregates()
    server = await createServer(mongoose, aggregates, process.env.ORION_QUERY_NODE_URL!)
    await server.start()
  })

  afterEach(async () => {
    await server.stop()
    await mongoose.disconnect()
  })

  it('should run without any issues', async () => {
    expect(true).toBe(true)
  })

  it('should start with empty aggregates', async () => {
    const videoViewsMap = aggregates.viewsAggregate.getVideoViewsMap()
    const channelViewsMap = aggregates.viewsAggregate.getChannelViewsMap()
    const channelFollowsMap = aggregates.followsAggregate.getChannelFollowsMap()

    expect(videoViewsMap).toEqual({})
    expect(channelViewsMap).toEqual({})
    expect(channelFollowsMap).toEqual({})
  })
})
