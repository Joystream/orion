import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { membershipParamsFromAccount, StateBuilderHelper, TestContext, waitMilliSec } from './testUtils'
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
// let builder: StateBuilderHelper
let txs: SubmittableExtrinsics<'promise'>
let jsApi: JsNodeApi
let blankTx: () => TransactionBuilder
let keyring: Keyring
let finalized: { (result: SubmittableResult): void }

beforeAll(async () => {
  if (env.TREASURY_ACCOUNT_URI === undefined) {
    console.log('treasury account uri not set aborting..')
    process.exit(-1)
  }
  ctx.setTreasuryUri(env.TREASURY_ACCOUNT_URI)
  await ctx.connectToJsNodeEndpoint('ws://127.0.0.1:9944')
  waitMilliSec(5000)

  // ctx.connectToGraphqlEndpoint('http://127.0.0.1:4350/graphql')
  // builder = new StateBuilderHelper(ctx.jsNodeApi())
  jsApi = ctx.jsNodeApi()
  txs = jsApi.tx()
  blankTx = jsApi.createTransaction.bind(jsApi)
  keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })
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
      // let finalized: { (result: SubmittableResult): void }
      const bob = keyring.addFromUri(env.TREASURY_ACCOUNT_URI!)
      const alice = keyring.addFromUri("//AliceX")
      const ed = jsApi.const().balances.existentialDeposit
      await txs.balances.transfer(alice.address, ed).signAndSend(bob)
      console.log("ed tx done")

      // const alice = await jsApi.addAccountFromUri("//Alice")
      const buyMmebershipTx = txs.members
        .buyMembership(membershipParamsFromAccount(alice.address))
      // await blankTx().withSender(alice).withExtrinsic(buyMmebershipTx).execute()

      const fee = await buyMmebershipTx.paymentInfo(alice).then((info) => info.partialFee.toBn())
      await txs.balances.transfer(alice.address, fee).signAndSend(bob)
      let result: SubmittableResult | undefined
      await buyMmebershipTx.signAndSend(alice, (res) => {
        result = res
      }) 

      expect(result).toBeTruthy()
      //   (res) => {
      //   if (res.isFinalized) {
      //     result = res
      //   }
      // })
      // console.log(`result is ${result}`)

      const newMemberId = (await jsApi.query().members.nextMemberId()).toBn().subn(1)
      // const memberData = await jsApi.query().members.membershipById(newMmeberId)
    })
    // it("tests saving results", async () => {
    //   const bob = keyring.addFromUri(env.TREASURY_ACCOUNT_URI!)
    //   let alices = []
    //   for (let i = 0; i < 100; ++i) {
    //     alices.push(keyring.addFromUri("//Alice${i}"))
    //   }
    //   
    //   Promise.all(alices.map(async (alice, j) => {
    //     txs.balances.transfer(alice.address, 10).signAndSend(bob, {tip: 99 - j})
    //   }))
    // })
  })
})

afterAll(async () => {
  ctx.disconnectJsNode()
})

