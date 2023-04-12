import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { TestContext } from './testUtils'

import dotenv from 'dotenv'
dotenv.config()

const env = process.env
const ctx = new TestContext()

beforeAll(async () => {
  if (env.TREASURY_ACCOUNT_URI === undefined) {
    console.log('treasury account uri not set aborting..')
    process.exit(-1)
  }
  ctx.setTreasuryUri(env.TREASURY_ACCOUNT_URI)
  await ctx.connectToJsNodeEndpoint('ws://localhost:9944')

  ctx.connectToGraphqlEndpoint('http://127.0.0.1:4350/graphql')
})

afterAll(async () => {
  ctx.disconnectJsNode()
})

describe('testing jsApi', () => {
  it('initial council is empty', async () => {
    const councilMembers = await ctx.jsNodeApi.query.council.councilMembers()
    expect(councilMembers.toArray()).toEqual([])
  })
})
