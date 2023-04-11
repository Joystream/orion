// const provider = new WsProvider(nodeUrl)
import { ApiPromise, WsProvider } from '@polkadot/api'
import { beforeAll, describe, it } from "@jest/globals"
import { waitMilliSec } from "./testUtils"

beforeAll(async () => {
  const provider = new WsProvider("ws://127.0.0.1/9944")
  const api = new ApiPromise({ provider })
  await api.isReadyOrError
  await waitMilliSec(5000) // in order for the node to start producing blocks
})
