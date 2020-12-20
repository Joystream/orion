import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { connect } from 'mongoose'
import { buildSchema } from 'type-graphql'
import { VideoViewsInfosResolver } from './resolvers/videoViewsInfos'
import config from './config'
import { videoAggregate } from './aggregate'

const main = async () => {
  await getMongooseConnection()
  await rebuildAggregates()

  const schema = await buildSchema({
    resolvers: [VideoViewsInfosResolver],
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
  process.stdout.write(`Connecting to MongoDB at "${config.mongoDBUri}"...`)
  try {
    const mongoose = await connect(config.mongoDBUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    await mongoose.connection
  } catch (error) {
    process.stdout.write(' Failed!\n')
    console.error(error)
    process.exit()
    return
  }
  process.stdout.write(' Done.\n')
}

const rebuildAggregates = async () => {
  process.stdout.write('Rebuilding video events aggregate...')
  try {
    await videoAggregate.rebuild()
  } catch (error) {
    process.stdout.write(' Failed!\n')
    console.error(error)
    process.exit()
    return
  }
  process.stdout.write(' Done.\n')
}

main()
