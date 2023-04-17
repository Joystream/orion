
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { membershipParamsFromAccount, pollCondition, StateBuilderHelper, TestContext, waitMilliSec } from './testUtils'

import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import dotenv from 'dotenv'
import Keyring from '@polkadot/keyring'
import { ApiPromise, SubmittableResult, WsProvider } from '@polkadot/api'
import AsyncLock from 'async-lock'
import { JsNodeApi } from 'joystreamNodeApi'
import { BN } from 'bn.js'
dotenv.config()

const env = process.env
let keyring: Keyring
let api: ApiPromise
let provider: WsProvider
const lock = new AsyncLock()

beforeAll(async () => {
  if (env.TREASURY_ACCOUNT_URI === undefined) {
    console.log('treasury account uri not set aborting..')
    process.exit(-1)
  }
  provider = new WsProvider("ws://127.0.0.1:9944")
  api = await ApiPromise.create({ provider })
  try {
    await api.isReadyOrError
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
  await waitMilliSec(5000)
  keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })
})

describe('basic tests', () => {
  it("transfer works from treasury from", async () => {
    const treasury = keyring.addFromUri(env.TREASURY_ACCOUNT_URI!)
    const alice = keyring.addFromUri("//Alice")
    const ed = api.consts.balances.existentialDeposit.toBn()
    const balancePre = await api.query.balances.account(alice.address)
    await api.tx.balances.transfer(alice.address, ed).signAndSend(treasury)
    const balancePost = await api.query.balances.account(alice.address)
    expect(balancePost.free.toBn().gt(balancePre.free.toBn()))
  })
  it("transfer works from treasury multiple rounds", async () => {
    const treasury = keyring.addFromUri(env.TREASURY_ACCOUNT_URI!)
    const ed = api.consts.balances.existentialDeposit.toBn()
    for (let i = 0; i < 100; ++i) {
      const alice = keyring.addFromUri(`//Alice//${i}`)
      const tip = 10 * i
      await lock.acquire(`nonce-${i % 3}`, async () => {
        await api.tx.balances.transfer(alice.address, ed).signAndSend(treasury, { nonce: -1, tip })
      })
    }
  })
  it("initial next member id is one", async () => {
    const nextMemberIdPre = (await api.query.members.nextMemberId()).toBn()
    expect(nextMemberIdPre === new BN(1))
  })
  describe("testing transactions", () => {
    it("successfully creates accounst", async () => {
      const treasury = keyring.addFromUri(env.TREASURY_ACCOUNT_URI!)
      const nMembers = 100
      const ed = api.consts.balances.existentialDeposit.toBn()
      const pairs = Array.from({ length: nMembers }, (_, i) => {
        return keyring.addFromUri(`//Dave//${i}`)
      })
      const fundForEdTxs = pairs.map((pair) => {
        return api.tx.balances.transfer(pair.address, ed)
      })
      await api.tx.utility.batch(fundForEdTxs).signAndSend(treasury)

      const everyAccountFunded = pairs.every(async (pair) => {
        const balance = (await api.query.balances.account(pair.address)).free.toBn()
        return balance.gtn(0)
      })

      expect(everyAccountFunded)
    })

  })
  // it("buys membeships in batch", async () => {
  //   const buyMembershipTxs = pairs.map((acc) => {
  //     const params = membershipParamsFromAccount(acc.address)
  //     return api.tx.members.buyMembership(params)
  //   });


  //   const fundForFeesTxs = await Promise.all(buyMembershipTxs.map(async (tx, i) => {
  //     const fee = (await tx.paymentInfo(pairs[i])).partialFee.toBn()
  //     return api.tx.balances.transfer(pairs[i].address, fee)
  //   }))

  //   await api.tx.utility.batch(fundForEdTxs.concat(fundForFeesTxs)).signAndSend(treasury)

  //   for (let i = 0; i < nMembers; ++i) {
  //     await buyMembershipTxs[i].signAndSend(pairs[i])
  //   }

  //   const nextMemberIdPost = (await api.query.members.nextMemberId()).toBn()
  //   expect(nextMemberIdPost === new BN(nMembers + 1))

  // })
})

afterAll(async () => {
  await provider.disconnect().then(() => { })
})

