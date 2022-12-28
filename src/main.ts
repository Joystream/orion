import config from './config'
import Express from 'express'
import { buildAggregates, connectMongoose, createServer } from './server'
import { cryptoWaitReady } from '@polkadot/util-crypto'

const main = async () => {
  config.loadConfig()

  const mongoose = await wrapTask(`Connecting to MongoDB at "${config.mongoDBUri}"`, () =>
    connectMongoose(config.mongoDBUri)
  )

  const aggregates = await wrapTask('Rebuilding aggregates', buildAggregates)

  const server = await createServer(mongoose, aggregates, config.queryNodeUrl)
  await server.start()
  const app = Express()
  server.applyMiddleware({ app })

  app.enable('trust proxy')
  app.listen({ port: config.port }, () =>
    console.log(`
        🚀 Orion online
        Mongo => ${config.mongoDBUri}
        Query node => ${config.queryNodeUrl}
        Playground => http://localhost:${config.port}${server.graphqlPath}
      `)
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

wrapTask('Initializing WASM bridge for @polkadot/util-crypto', cryptoWaitReady).then(() => {
  main()
})
