import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types';
import request from 'supertest';
import { ChannelCreatedNotificationSub, executeSubcription, FollowChannelMutation, MembershipById } from './queries'
import { expect } from 'chai'
import { LoggedInAccountInfo } from '../../auth-server/tests/common';
import { createChannel, createMember } from './extrinsics';
import { createAccountAndSignIn, operatorLogin } from './authUtils';
import { EntityManager } from 'typeorm'
import { globalEm } from '../../utils/globalEm';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import Websocket from 'ws';

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  webSocketImpl: Websocket,
}))

// Create the Apollo Client instance
const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

// HACK: (not.v1) convert to .env variable
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const server = request('http://127.0.0.1:4074')
const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

describe('Notifications', () => {
  let api: ApiPromise
  let alice: KeyringPair
  let aliceMemberId: string
  let operatorSessionId: string
  let operatorRequest: request.Test
  let channelId: string
  let loginData: LoggedInAccountInfo
  let em: EntityManager

  before(async () => {
    await cryptoWaitReady()
    alice = keyring.addFromUri('//Alice');
    api = await ApiPromise.create({ provider: wsProvider });
    
    // create account 
    em = await globalEm

    // create membership for alice 
    aliceMemberId = await createMember(api, alice)
    expect(executeSubcription(client, MembershipById, { id: aliceMemberId})).not.to.be.null

    loginData = await createAccountAndSignIn(em, server, aliceMemberId, alice)

    // sign in as operator
    operatorSessionId = await operatorLogin(server)

    operatorRequest = server.post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Cookie', `session_id=${operatorSessionId}`)
  })

  describe('Runtime Notifications', () => {
    it('creating channel should deposit runtime notification for alice', async () => {
      channelId = await createChannel(api, aliceMemberId, alice)

      // const response = await operatorRequest.send({
      //   "query": ChannelCreatedNotificationSubj w(),
      //   "operationName": "ChannelCreatedNotification",
      // })

      // expect(response.status).to.equal(200)
      // expect(response.body.data).to.equal({
      //   "runtimeNotifications": [
      //     {
      //       __typename: "ChannelCreatedNotification",
      //       channel: {
      //         id: channelId!,
      //         ownerMember: {
      //           id: aliceMemberId
      //         }
      //       }
      //     }
      //   ]
      // })
    })
  })

  // describe("Offchain Notifications", () => {
  //   let userSessionId: string
  //   let aliceRequest: request.Test
  //   before(async () => {
  //     userSessionId = loginData.sessionId
  //     aliceRequest = server.post('/graphql')
  //       .set('Content-Type', 'application/json')
  //       .set('Cookie', `session_id=${userSessionId}`)
  //   })
  //   it('following a channel should deposit a notification', async () => {
  //     await aliceRequest.send({
  //       "query": FollowChannelMutation(channelId),
  //       "operationName": "FollowChannel",
  //     }).expect(200)

  //     const response = await operatorRequest.send({
  //       "query": ChannelFollowerNotificationQuery(channelId),
  //       "operationName": "ChannelFollowerNotification",
  //     })

  //     expect(response.status).to.equal(200)
  //     expect(response.body.data).to.equal({
  //       "offchainNotifications": [
  //         {
  //           __typename: "ChannelFollowerNotification",
  //           channel: {
  //             id: channelId!,
  //             ownerMember: {
  //               id: aliceMemberId
  //             }
  //           },
  //           follower: {
  //             id: aliceMemberId
  //           }
  //         }
  //       ]
  //     })
  //   })
  // })
})

