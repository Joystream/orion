import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { TestContext } from './testUtils'
import { gql } from '@apollo/client/core'

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
  await ctx.connectToJsNodeEndpoint('ws://127.0.0.1:9944')

  ctx.connectToGraphqlEndpoint('http://127.0.0.1:4350/graphql')
})

afterAll(async () => {
  ctx.disconnectJsNode()
})

describe('test the setup', () => {
  it('querying joystream node works', async () => {
    const councilMembers = await ctx.jsNodeApi.query.council.councilMembers()
    expect(councilMembers.toArray()).toHaveLength(0)
  })

  it('querying orion node works', async () => {
    const GET_MEMBERS = gql`
      query ($id_in: [String!], $handle_in: [String!]) {
        memberships(where: { id_in: $id_in, OR: { handle_in: $handle_in } }) {
          id
          handle
        }
      }
    `
    // we can add an api wrapper around orionClient in order for mapping res.data to a desired format as we did in QueryNodeApi
    const res = await ctx.orionClient.query({
      query: GET_MEMBERS,
      variables: { id_in: ['1'], handle_in: ['test_handle1', 'test_handle2'] },
    })
    expect(res.data.memberships).toHaveLength(0)
  })
})
