import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { membershipParamsFromAccount, StateBuilderHelper, TestContext } from './testUtils'
import { gql } from '@apollo/client/core'

import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import dotenv from 'dotenv'
import { JsNodeApi, TransactionBuilder } from 'joystreamNodeApi'
import { BN } from 'bn.js'
import { SubmittableExtrinsics } from '@polkadot/api/types'
import Keyring from '@polkadot/keyring'
import { SubmittableResult } from '@polkadot/api'
dotenv.config()

const env = process.env
const ctx = new TestContext()
let builder: StateBuilderHelper
let txs: SubmittableExtrinsics<'promise'>
let jsApi: JsNodeApi
let blankTx: () => TransactionBuilder
let result: SubmittableResult

beforeAll(async () => {
  if (env.TREASURY_ACCOUNT_URI === undefined) {
    console.log('treasury account uri not set aborting..')
    process.exit(-1)
  }
  ctx.setTreasuryUri(env.TREASURY_ACCOUNT_URI)
  await ctx.connectToJsNodeEndpoint('ws://127.0.0.1:9944')

  // ctx.connectToGraphqlEndpoint('http://127.0.0.1:4350/graphql')
  builder = new StateBuilderHelper(ctx.jsNodeApi())
  jsApi = ctx.jsNodeApi()
  txs = jsApi.tx()
  blankTx = jsApi.createTransaction.bind(jsApi)
})

describe('test the setup', () => {
  it('querying joystream node works', async () => {
    const councilMembers = await ctx.jsNodeApi().query().council.councilMembers()
    expect(councilMembers.toArray()).toHaveLength(0)
  })

  // it('querying orion node works', async () => {
  //   const GET_MEMBERS = gql`
  //     query ($id_in: [String!], $handle_in: [String!]) {
  //       memberships(where: { id_in: $id_in, OR: { handle_in: $handle_in } }) {
  //         id
  //         handle
  //       }
  //     }
  //   `
  //   // we can add an api wrapper around orionClient in order for mapping res.data to a desired format as we did in QueryNodeApi
  //   const res = await ctx.orionClient.query({
  //     query: GET_MEMBERS,
  //     variables: { id_in: ['1'], handle_in: ['test_handle1', 'test_handle2'] },
  //   })
  //   expect(res.data.memberships).toHaveLength(0)
  // })

  describe("sending transactions works", () => {
    it("test basic transaction", async () => {
      let finalized: { (result: SubmittableResult): void }
      const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })
      const sender = keyring.addFromUri(env.TREASURY_ACCOUNT_URI!)
      const receiver = keyring.addFromUri("//test")
      const test = await txs.balances
        .transfer(receiver.address, 10)
        .signAndSend(sender, (res: SubmittableResult) => {
          if (!res.status.isFinalized) {
            result = res
            console.log(res)
            finalized(res)
          }
        })
      expect(result).toBeTruthy()
    })
  })
})

afterAll(async () => {
  ctx.disconnectJsNode()
})

