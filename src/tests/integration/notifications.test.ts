import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import request from 'supertest';
import { ChannelByMemberIdSub, ChannelCreatedNotificationSub, executeQuery, executeSubcription, MarkNotificationAsReadMut, MembershipByControllerAccountSub, SetNotificationPreferencesMut, VideoByChannelIdSub, VideoCreatedNotificationSub } from './queries'
import { expect } from 'chai'
import { TestContext } from './extrinsics';
import { AccountLoginData, createAccountAndSignIn, generateEmailAddr } from './authUtils';
import { EntityManager } from 'typeorm'
import { globalEm } from '../../utils/globalEm';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import Websocket from 'ws';
import { UserContext } from './utils';
import { Session, Account } from '../../model';
import { SESSION_COOKIE_NAME } from '../../utils/auth';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

// HACK: (not.v1) convert to .env variable
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const server = request('http://127.0.0.1:4074')

const httpLink = new HttpLink({
  uri: 'http://localhost:4350/graphql'
});
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4350/graphql',
  webSocketImpl: Websocket,
}));
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
describe('Notifications', () => {
  let api: ApiPromise
  let user: UserContext
  let em: EntityManager
  let ctx: TestContext
  let client: ApolloClient<NormalizedCacheObject>

  before(async () => {
    await cryptoWaitReady()
    api = await ApiPromise.create({ provider: wsProvider });
    ctx = new TestContext(api)
    user = UserContext.createUserFromUri('//Alice')

    // create account 
    em = await globalEm

    client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
  })

  describe('Notification: Setup', () => {
    it('create membership should work', async () => {
      // create a synthetic handlers each test run
      const handle = 'Alice'
      await ctx.createMember(user.joystreamAccount, handle)
      // TODO: provide explicit type for both data and shouldUnsuscribe(data)
      const data: any = await executeSubcription(client, { query: MembershipByControllerAccountSub, variables: { accountId: user.joystreamAccount.address }, shouldUnsuscribe: (data: any) => { return data.memberships.length > 0 } })

      expect(data.memberships).not.to.be.empty
      user.setMembershipId(data.memberships[0].id)
    })
    describe('Creating account and/or logging in', () => {
      let loginData: AccountLoginData

      before(async () => {
        loginData = await createAccountAndSignIn(server, user.membershipId, user.joystreamAccount)
      })
      it('Alice should have an account', async () => {
        const account = await em.findOneBy(Account, { email: generateEmailAddr(user.membershipId) })

        expect(account).not.to.be.null
        expect(account!.membershipId).to.equal(user.membershipId)

        user.setAccountId(account!.id)
      })

      it('Alice should have a session', async () => {
        const session = await em.findOneBy(Session, { accountId: user.accountId })

        expect(session).not.to.be.null

        user.setSessionId(session!.id)
      })

      describe('Setting up content for notifications', () => {
        // it('create channel should work', async () => {
        //   const channelId = await ctx.createChannel(user.membershipId, user.joystreamAccount)
        //   user.setChannelId(channelId)
        //   const findChannel = (data: any) => {
        //     const channel = data.channels.find((channel: any) => channel.id === channelId)
        //     return channel !== undefined
        //   }

        //   const data: any = await executeSubcription(
        //     client,
        //     {
        //       query: ChannelByMemberIdSub,
        //       variables: { memberId: user.membershipId },
        //       shouldUnsuscribe: findChannel
        //     })

        //   expect(findChannel(data)).to.be.true

        // })
        // it('create video should work', async () => {
        //   const videoId = await ctx.createVideoWithNft(user.membershipId, user.channelId, user.joystreamAccount)
        //   user.setVideoId(videoId)

        //   const findVideo = (data: any) => {
        //     console.log('findVideo', data.videos)
        //     console.log('findVideo', videoId)
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

        describe('After login has been done', () => {
          let loggedInClient: ApolloClient<NormalizedCacheObject>
          before(() => {
            console.log('Creating logged in client', user.sessionId)
            loggedInClient = new ApolloClient({
              link: new HttpLink({
                uri: 'http://localhost:4350/graphql',
                headers: {
                  'Content-Type': 'application/json',
                  'Cookie': `${SESSION_COOKIE_NAME}=${user.sessionId}`
                }
              }),
              cache: new InMemoryCache(),
            });
          })
          it('update account notification preferences should work', async () => {
            await loggedInClient.mutate({
              mutation: SetNotificationPreferencesMut,
            })

            const account = await em.findOneBy(Account, { id: user.accountId })

            expect(account).not.to.be.null
            expect(account!.channelCreatedMailNotificationEnabled).to.be.false

            //   ******************************************
            //   ******************************************
            //   ******************************************
            //   **** HERE RUNTIME NOTIFICATIONS TESTS ****
            //   ******************************************
            //   ******************************************
            //   ******************************************

          })
        })
      })
    })
    // describe('Runtime Notifications', () => {
    //   let notificationId: string
    //   describe('Channel Created Notification', () => {
    //     it('having a channel created should trigger notifications', async () => {
    //       const data: any = await executeSubcription(client, { query: ChannelCreatedNotificationSub, variables: { channelId: user.channelId }, shouldUnsuscribe: (data: any) => data.runtimeNotifications.length > 0 })

    //       const notification = data.runtimeNotifications[0]
    //       notificationId = notification.id

    //       expect(notification.inAppRead).to.be.false
    //       expect(notification.mailSent).to.be.false

    //     })
    //     it('marking the notification as read should work', async () => {
    //       const response = await server.post('/graphql')
    //         .set('Accept', 'application/json')
    //         .set('Cookie', `${SESSION_COOKIE_NAME}=${user.sessionId}`)
    //         .send({
    //           query: MarkNotificationAsReadMut([notificationId]),
    //           operationName: 'MarkNotificationAsRead',
    //         })

    //       const notification = await em.findOneBy(RuntimeNotification, { id: notificationId! })
    //       console.log(response)
    //       expect(response.status).to.be.equal(200)
    //       expect(notification).not.to.be.null
    //       expect(notification!.inAppRead).to.be.true
    //     })
    //   })
    //   // describe('Video Created Notification', () => {
    //   //   let notificationId: string
    //   //   it('having a channel created should trigger notifications', async () => {
    //   //     const data: any = await executeSubcription(client, { query: VideoCreatedNotificationSub, variables: { videoId: user.videoId }, shouldUnsuscribe: (data: any) => data.runtimeNotifications.length > 0 })

    //   //     const notification = data.runtimeNotifications.find((notification: any) => {
    //   //       console.log('notification: ', notification)
    //   //       return notification.__typename === 'VideoCreatedEventData'
    //   //     })
    //   //     notificationId = notification.id

    //   //     expect(notification.inAppRead).to.be.false
    //   //     expect(notification.mailSend).to.be.true

    //   //   })
    //   //   it('marking the notification as read should work', async () => {
    //   //     await server.post('/graphql')
    //   //       .set('Accept', 'application/json')
    //   //       .set('Cookie', `session=${user.sessionId}`)
    //   //       .send({
    //   //         query: MarkNotificationAsReadMut([notificationId]),
    //   //         operationName: 'MarkNotificationAsRead',
    //   //       })

    //   //     const notification = await em.findOneBy(RuntimeNotification, { id: notificationId! })
    //   //     expect(notification).not.to.be.null
    //   //     expect(notification!.inAppRead).to.be.true
    //   //   })
    //   // })
    //   describe('Nft Issued Notification', () => {
    //     it('having a nft issued should trigger notifications', async () => {

    //     })
    //     it('marking the notification as read should work', async () => {

    //     })
    //   })
    // })
    describe('OffChain Notifications (Resolvers)', () => {
      // resolver tests can be executed serially as they are usually very fast wrt extrinsic tests
      describe('Channel Excluded notification', () => {
        it('getting channel excluded should trigger notification', async () => {

        })
      })
      describe('Video Excluded notification', () => {
        it('getting video excluded should trigger notification', async () => {

        })
      })
      describe('Video Featured notification', () => {
        it('getting video feature should trigger notification', async () => {

        })
      })
      describe('Channel Verified notification', () => {
        it('getting channel verified should trigger notification', async () => {

        })
      })
      describe('Channel Suspended notification', () => {
        it('getting channel suspended should trigger notification', async () => {

        })
      })
      describe('following a channel should trigger notification', () => {
        it('bob creating an account should succeed', () => {

        })
        it('bob following alice s channel should trigger notification', async () => {

        })
      })

    })
    describe('Testing Notification Resolvers', () => {
      it('mark notification as read should work', async () => {
        // mark channel created as read

      })
      it('mark notification as unread should work', async () => {
        // mark channel created as unread

      })
      it('creating another notification', async () => {
        // Alice creates another video or channel

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
    // invoke client.stop after all tests have been executed
    after(() => {
      client.stop()
    })
  })
})

