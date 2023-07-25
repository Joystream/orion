import { ApiPromise, WsProvider } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import request from 'supertest'
import {
  ChannelByMemberIdSub,
  ChannelCreatedNotificationSub,
  ChannelFollowerNotificationSub,
  checkAllNotificationPreferencesToBe,
  executeSubcription,
  expectNotificationPreferenceToBe,
  FollowChannelMut,
  MarkNotificationAsReadMut,
  MembershipByControllerAccountSub,
  SetNotificationEnabledMut,
  SetNotificationPreferencesAllFalseMut,
} from './queries'
import { expect } from 'chai'
import { TestContext } from './extrinsics'
import { AccountLoginData, createAccountAndSignIn, generateEmailAddr } from './authUtils'
import { EntityManager, FindOptionsWhere } from 'typeorm'
import { globalEm } from '../../utils/globalEm'
import { ApolloClient, gql, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import Websocket from 'ws'
import { UserContext } from './utils'
import { Session, Account, RuntimeNotification, OffChainNotification, fromJsonOffChainNotificationData, OffChainNotificationData } from '../../model'
import { SESSION_COOKIE_NAME } from '../../utils/auth'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'

const wsProvider = new WsProvider('ws://127.0.0.1:9944')
const server = request('http://127.0.0.1:4074')

const httpLink = new HttpLink({
  uri: 'http://localhost:4350/graphql',
})
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4350/graphql',
    webSocketImpl: Websocket,
  })
)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)
describe('Notifications', () => {
  let api: ApiPromise
  let user: UserContext
  let em: EntityManager
  let ctx: TestContext
  let anonClient: ApolloClient<NormalizedCacheObject>
  let loggedInClient: ApolloClient<NormalizedCacheObject>
  let aliceAccount: Account

  before(async () => {
    await cryptoWaitReady()
    api = await ApiPromise.create({ provider: wsProvider })
    ctx = new TestContext(api)
    user = UserContext.createUserFromUri('//Alice')

    // create account
    em = await globalEm

    anonClient = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    })
  })

  describe('Notification: Setup', () => {
    it('create membership should work', async () => {
      // create a synthetic handlers each test run
      const handle = 'Alice'
      await ctx.createMember(user.joystreamAccount, handle)
      // TODO: provide explicit type for both data and shouldUnsuscribe(data)
      const data: any = await executeSubcription(anonClient, {
        query: MembershipByControllerAccountSub,
        variables: { accountId: user.joystreamAccount.address },
        shouldUnsuscribe: (data: any) => {
          return data.memberships.length > 0
        },
      })

      expect(data.memberships).not.to.be.empty
      user.setMembershipId(data.memberships[0].id)
    })
    describe('Account creation and default notification settings', () => {
      let loginData: AccountLoginData
      before(async () => {
        loginData = await createAccountAndSignIn(server, user.membershipId, user.joystreamAccount)
      })
      it('Alice should have an account', async () => {
        const account = await em.findOneBy(Account, { email: generateEmailAddr(user.membershipId) })

        expect(account).not.to.be.null
        aliceAccount = account!
        expect(account!.membershipId).to.equal(user.membershipId)

        user.setAccountId(account!.id)
      })

      it('Alice should have a session', async () => {
        const session = await em.findOneBy(Session, { accountId: user.accountId })

        expect(session).not.to.be.null

        user.setSessionId(session!.id)
      })

      it('Alice should have all notifications enabled', async () => {
        expectNotificationPreferenceToBe(aliceAccount.notificationPreferences.channelCreatedNotificationEnabled, true)
      })
    })
    describe('Batch updating notifications preferences', () => {
      before(async () => {
        loggedInClient = new ApolloClient({
          link: new HttpLink({
            uri: 'http://localhost:4350/graphql',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `${SESSION_COOKIE_NAME}=${user.sessionId}`,
            },
          }),
          cache: new InMemoryCache(),
        })
      })
      it('setting all account notification preferences to false should work', async () => {
        const response = await loggedInClient.mutate({
          mutation: SetNotificationPreferencesAllFalseMut,
        })

        const account = await em.findOneBy(Account, { id: user.accountId })

        expect(account).not.to.be.null
        checkAllNotificationPreferencesToBe(account!.notificationPreferences, false)
        // checkAllNotificationPreferencesToBe(response.data.setNotificationPreference, false)
      })
    })
    describe('Tests on actual notifications', () => {
      describe('Channel Created notification', () => {
        let notificationId: string
        it('setting the notification to enabled should work', async () => {
          const response = await loggedInClient.mutate({
            mutation: SetNotificationEnabledMut('channelCreatedNotificationEnabled')
          })

          const account = await em.findOneBy(Account, { id: user.accountId })
          expect(account).not.to.be.null
          expectNotificationPreferenceToBe(account!.notificationPreferences.channelCreatedNotificationEnabled, true)
          expectNotificationPreferenceToBe(response.data.setAccountNotificationPreferences.channelCreatedNotificationEnabled, true)
        })
        it('create channel should work', async () => {
          const channelId = await ctx.createChannel(user.membershipId, user.joystreamAccount)
          user.setChannelId(channelId)
          const findChannel = (data: any) => {
            const channel = data.channels.find((channel: any) => channel.id === channelId)
            return channel !== undefined
          }

          const data: any = await executeSubcription(anonClient, {
            query: ChannelByMemberIdSub,
            variables: { memberId: user.membershipId },
            shouldUnsuscribe: findChannel,
          })

          expect(findChannel(data)).to.be.true
        })
        it('having a channel created should trigger notifications', async () => {
          const data: any = await executeSubcription(anonClient, {
            query: ChannelCreatedNotificationSub,
            variables: { channelId: user.channelId },
            shouldUnsuscribe: (data: any) => data.runtimeNotifications.length > 0,
          })

          const notification = data.runtimeNotifications[0]
          notificationId = notification.id

          expect(notification.inAppRead).to.be.false
          // FIXME: (not.v1) this should work  with true instead of false
          expect(notification.mailSent).to.be.false
        })
        it('marking the notification as read should work', async () => {
          const response = await loggedInClient.mutate({
            mutation: MarkNotificationAsReadMut,
            variables: { notificationIds: [notificationId] }
          });

          const notification = await em.findOneBy(RuntimeNotification, { id: notificationId! })
          expect(response.data.markNotificationsAsRead.notificationsRead).not.to.be.empty
          expect(response.data.markNotificationsAsRead.notificationsRead[0]).to.be.true
          expect(notification).not.to.be.null
          expect(notification!.inAppRead).to.be.true
        })
      })
      describe('Follow channel notification', () => {
        let notificationId: string
        it('setting the notification to enabled should work', async () => {
          const response = await loggedInClient.mutate({
            mutation: SetNotificationEnabledMut('newChannelFollowerNotificationEnabled')
          })

          const account = await em.findOneBy(Account, { id: user.accountId })
          expect(account).not.to.be.null
          expectNotificationPreferenceToBe(account!.notificationPreferences.newChannelFollowerNotificationEnabled, true)
          expectNotificationPreferenceToBe(response.data.setAccountNotificationPreferences.newChannelFollowerNotificationEnabled, true)
        })
        it('follow channel should deposit notification', async () => {
          const response = await loggedInClient.mutate({
            mutation: FollowChannelMut,
            variables: { channelId: user.channelId }
          })

          const notifications = await em.getRepository(OffChainNotification).find({
            where: {
              data: {
                typeOf: 'NewChannelFollowerNotificationData',
                channel: user.channelId,
              } as FindOptionsWhere<OffChainNotificationData>,
            },
          });

          console.log('notifications')
          console.log(notifications)
          // expect(notification).not.to.be.null
          // notificationId = notification!.id
          // expect(notification!.inAppRead).to.be.false
          // // FIXME: (not.v1) this should work  with true instead of false
          // expect(notification!.mailSent).to.be.false
        })
        it('marking the notification as read should work', async () => {
          const response = await loggedInClient.mutate({
            mutation: MarkNotificationAsReadMut,
            variables: { notificationIds: [notificationId] }
          });

          const notification = await em.findOneBy(OffChainNotification, { id: notificationId! })
          expect(response.data.markNotificationsAsRead.notificationsRead).not.to.be.empty
          expect(response.data.markNotificationsAsRead.notificationsRead[0]).to.be.true
          expect(notification).not.to.be.null
          expect(notification!.inAppRead).to.be.true
        })
      })
    })
  })
  after(() => {
    anonClient.stop()
    loggedInClient.stop()
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
//
// it('create video should work', async () => {
//   const videoId = await ctx.createVideoWithNft(user.membershipId, user.channelId, user.joystreamAccount)
//   user.setVideoId(videoId)
//   const findVideo = (data: any) => {
//     const video = data.videos.find((video: any) => video.id === videoId)
//     return video !== undefined
//   }

//   const data: any = await executeSubcription(
//     client,
//     {
//       query: VideoByChannelIdSub,
//       variables: { channelId: user.channelId },
//       shouldUnsuscribe: findVideo
//     })

//   expect(findVideo(data)).to.be.true

// })

//
// invoke client.stop after all tests have been executed
