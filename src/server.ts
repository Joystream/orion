import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { connect } from 'mongoose'
import { buildSchema } from 'type-graphql'

import config from './config'
import { followsAggregate, viewsAggregate } from './aggregates'
import { ChannelFollowsInfosResolver, VideoViewsInfosResolver } from './resolvers'

const main = async () => {
  await getMongooseConnection()
  await rebuildAggregates()

  const schema = await buildSchema({
    resolvers: [VideoViewsInfosResolver, ChannelFollowsInfosResolver],
    emitSchemaFile: 'schema.graphql',
    validate: false,
  })

  const server = new ApolloServer({ schema })
  const app = Express()
  server.applyMiddleware({ app })
  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server listening at ==> http://localhost:${config.port}${server.graphqlPath}`)
  )
}

const getMongooseConnection = async () => {
  const task = async () => {
    const mongoose = await connect(config.mongoDBUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    await mongoose.connection
  }
  await wrapTask(`Connecting to MongoDB at "${config.mongoDBUri}"`, task)
}

const rebuildAggregates = async () => {
  const viewEventsTask = async () => {
    await viewsAggregate.rebuild()
  }

  const followEventsTask = async () => {
    await followsAggregate.rebuild()
  }

  await wrapTask('Rebuiliding view events aggregate', viewEventsTask)
  await wrapTask('Rebuiliding follow events aggregate', followEventsTask)
}

const wrapTask = async (message: string, task: () => Promise<void>) => {
  process.stdout.write(`${message}...`)
  try {
    await task()
  } catch (error) {
    process.stdout.write(' Failed!\n')
    console.error(error)
    process.exit()
    return
  }
  process.stdout.write(' Done.\n')
}

main()
