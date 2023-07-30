import { ApiPromise, WsProvider } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import request from 'supertest'
import { TestContext } from './extrinsics'
import { globalEm } from '../../utils/globalEm'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import Websocket from 'ws'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { UserContext } from './utils'
import path from 'path'
import { assert } from 'console'

async function initTestContext(): Promise<TestContext> {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944')
  await cryptoWaitReady()
  const api = await ApiPromise.create({ provider: wsProvider })
  const ctx = new TestContext(api)
  return ctx
}

// read user data from user.json file
async function createUserFromData(jsonFile: string): Promise<UserContext> {
  const userConfig = require(path.join(__dirname, jsonFile))
  const user = new UserContext(`//${userConfig.USER_URI}`)
  user.setSessionId(userConfig.LOGIN_SESSION_ID)
  console.log('user login session id:', userConfig.LOGIN_SESSION_ID)
  user.setMembershipId(userConfig.USER_MEMBER_ID)
  return user
}

// main
async function main(): Promise<void> {
  const ctx = await initTestContext()
  const alice = await createUserFromData('Alice.json')
  const bob = await createUserFromData('Bob.json')

  // alice creates channel
  console.log('alice', alice.joystreamAccount.address)
  const { channelId, channelRewardAccount } = await ctx.createChannel(
    alice.membershipId,
    alice.joystreamAccount
  )
  assert(channelId !== '', 'channelId is empty')
  assert(channelRewardAccount !== '', 'channel reward account is empty')

  // bob sends payment to alice's channel
}

main()
  .then(() => {
    return
  })
  .catch((err) => {
    console.log(err)
  })
