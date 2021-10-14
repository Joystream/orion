import config from './config'
import Express from 'express'
import { buildAggregates, connectMongoose, createServer } from './server'
import { FeaturedContent, FeaturedContentModel } from './models/FeaturedContent'

const main = async () => {
  config.loadConfig()

  const mongoose = await wrapTask(`Connecting to MongoDB at "${config.mongoDBUri}"`, () =>
    connectMongoose(config.mongoDBUri)
  )

  const aggregates = await wrapTask('Rebuilding aggregates', buildAggregates)

  const featuredContentDoc = await FeaturedContentModel.findOne()
  if (!featuredContentDoc) {
    await wrapTask('Inserting default featured content doc', async () => {
      const newFeaturedContentDoc: FeaturedContent = {
        videoHero: {
          videoId: '0',
          heroTitle: 'Change Me',
          heroVideoCutUrl: 'https://google.com',
        },
      }
      await FeaturedContentModel.create(newFeaturedContentDoc)
    })
  }

  const server = await createServer(mongoose, aggregates)
  await server.start()
  const app = Express()
  server.applyMiddleware({ app })

  app.enable('trust proxy')
  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server listening at ==> http://localhost:${config.port}${server.graphqlPath}`)
  )
}

const wrapTask = async <T>(message: string, task: () => Promise<T>): Promise<T> => {
  process.stdout.write(`${message}...`)
  try {
    const result = await task()
    process.stdout.write(' Done.\n')
    return result
  } catch (error) {
    process.stdout.write(' Failed!\n')
    console.error(error)
    process.exit()
  }
}

main()
