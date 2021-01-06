import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { connect, Mongoose } from 'mongoose'
import { buildSchema } from 'type-graphql'

import { FollowsAggregate, ViewsAggregate } from './aggregates'
import { ChannelFollowsInfosResolver, VideoViewsInfosResolver } from './resolvers'
import { Aggregates, Context } from './types'

export const createServer = async (mongoose: Mongoose, aggregates: Aggregates) => {
  await mongoose.connection

  const schema = await buildSchema({
    resolvers: [VideoViewsInfosResolver, ChannelFollowsInfosResolver],
    emitSchemaFile: 'schema.graphql',
    validate: false,
  })

  const context: Context = {
    ...aggregates,
  }

  return new ApolloServer({ schema, context })
}

export const connectMongoose = async (connectionUri: string) => {
  const mongoose = await connect(connectionUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  await mongoose.connection
  return mongoose
}

export const buildAggregates = async (): Promise<Aggregates> => {
  const viewsAggregate = await ViewsAggregate.Build()
  const followsAggregate = await FollowsAggregate.Build()

  return { viewsAggregate, followsAggregate }
}
