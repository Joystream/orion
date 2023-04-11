import { ApiPromise, WsProvider } from '@polkadot/api'
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals"
import { waitMilliSec } from "./testUtils"
import { JsNodeApi } from './joystreamNodeApi'
import dotenv from 'dotenv';
dotenv.config();

const env = process.env
let jsNode: JsNodeApi;
let provider: WsProvider;

beforeAll(async () => {
  if (env.TREASURY_ACCOUNT_URI === undefined) {
    process.exit(-1)
  }

  // try {
  provider = new WsProvider("ws://127.0.0.1:9944")
  const api = await ApiPromise.create({ provider })
  await api.isReadyOrError
  jsNode = new JsNodeApi(env.TREASURY_ACCOUNT_URI!, api)
    // await waitMilliSec(5000) // in order for the node to start producing blocks
  // } catch (error) {
  //   console.error(error)
  // }

})

describe("testing jsApi", () => {
  it("initial council is empty", async () => {
    const councilMembers = (await jsNode.query.council.councilMembers()).toArray()
    expect(councilMembers).toEqual([])
  })
})

afterAll(async () => {
  provider.disconnect().catch(() => {})
})
