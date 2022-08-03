import { ApolloServer } from 'apollo-server-express'
import { Mongoose } from 'mongoose'
import { Aggregates } from '../src/types'
import { createMutationFn, createQueryFn, MutationFn, QueryFn } from './helpers'
import { buildAggregates, connectMongoose, createServer } from '../src/server'

import { GetKillSwitch, GET_KILL_SWITCH, SetKillSwitch, SET_KILL_SWITCH, SetKillSwitchArgs } from './queries/admin'
import { AdminModel } from '../src/models/Admin'

describe('Kill switch resolver', () => {
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
    await AdminModel.deleteMany({})
    await mongoose.disconnect()
  })

  const getKillSwitch = async () => {
    const result = await query<GetKillSwitch>({
      query: GET_KILL_SWITCH,
    })
    expect(result.errors).toBeUndefined()
    return result.data?.admin.isKilled
  }

  it('should return isKilled set to false', async () => {
    const isKilled = await getKillSwitch()
    expect(isKilled).toEqual(false)
  })

  it('should set isKilled to true', async () => {
    await mutate<SetKillSwitch, SetKillSwitchArgs>({ mutation: SET_KILL_SWITCH, variables: { isKilled: true } })
    const isKilled = await getKillSwitch()
    expect(isKilled).toEqual(true)
  })
})
