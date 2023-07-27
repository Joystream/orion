import { ApiPromise, WsProvider } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import request from 'supertest'
import {
  ChannelByMemberIdSub,
  ChannelCreatedNotificationSub,
  checkAllNotificationPreferencesToBe,
  executeSubcription,
  expectNotificationPreferenceToBe,
  FollowChannelMut,
  MarkNotificationAsReadMut,
  MembershipByHandleSub,
  SetNotificationEnabledMut,
  SetNotificationPreferencesAllFalseMut,
  VideoByIdSub,
  VideoCreatedNotificationSub,
} from './queries'
import { expect } from 'chai'
import { TestContext } from './extrinsics'
import { AccountLoginData, createAccountAndSignIn, generateEmailAddr } from './authUtils'
import { EntityManager, FindOptionsWhere, MoreThan } from 'typeorm'
import { globalEm } from '../../utils/globalEm'
import { ApolloClient, FetchResult, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import Websocket from 'ws'
import {
  Session,
  Channel,
  Account,
  RuntimeNotification,
  OffChainNotification,
  OffChainNotificationData,
  ReadOrUnread,
  Video,
  NewChannelFollowerNotificationData,
  Membership,
  DeliveryStatus,
  ChannelCreatedEventData,
} from '../../model'
import { SESSION_COOKIE_NAME } from '../../utils/auth'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createApolloClient, UserContext } from './utils'

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
  let alice: UserContext
  let bob: UserContext
  let em: EntityManager
  let ctx: TestContext
  let anonClient: ApolloClient<NormalizedCacheObject>
  let aliceClient: ApolloClient<NormalizedCacheObject>
  let bobClient: ApolloClient<NormalizedCacheObject>
  let aliceAccount: Account

  before(async () => {
    await cryptoWaitReady()
    api = await ApiPromise.create({ provider: wsProvider })
    ctx = new TestContext(api)

    // create account
    em = await globalEm

    anonClient = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    })
  })

  describe('Notification: Setup', () => {
    describe('Alice account creation', () => {
      let membership: Membership | null
      describe('create alice membership should work', () => {
        const handle = 'Alice'
        before(async () => {
          alice = new UserContext('//Alice')
          await ctx.createMember(alice.joystreamAccount, handle)
          const data: any = await executeSubcription(anonClient, {
            query: MembershipByHandleSub,
            variables: { handle },
            shouldUnsuscribe: (data: any) => data.memberships.length > 0
          })
          membership = data.memberships[0]
        })
        it('membership should be in orion db', async () => {
          expect(membership!.handle).to.be.equal(handle)
          expect(membership!.controllerAccount).to.be.equal(alice.joystreamAccount.address)
        })
        after(() => {
          alice.setMembershipId(membership!.id)
        })
      })
      describe('creating gateway account and session', () => {
        let loginData: AccountLoginData
        describe('creating account', () => {
          let account: Account | null
          before(async () => {
            loginData = await createAccountAndSignIn(server, alice.membershipId, alice.joystreamAccount)
            account = await em.getRepository(Account).findOneBy({ membershipId: alice.membershipId })
          })
          it('account should not be null', () => {
            expect(account).to.not.be.null
          })
          after(() => {
            alice.setAccountId(account!.id)
          })
        })
        describe('session checks', () => {
          let session: Session | null
          before(async () => {
            session = await em.getRepository(Session).findOneBy({ id: decodeURIComponent(loginData!.sessionId) })
          })
          it('session should not be null', () => {
            expect(session).to.not.be.null
          })
          after(() => {
            alice.setSessionId(session!.id)
          })
        })
      })
      after(() => {
        aliceClient = new ApolloClient({
          link: new HttpLink({
            uri: 'http://localhost:4350/graphql',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `${SESSION_COOKIE_NAME}=${alice.sessionId}`,
            },
          }),
          cache: new InMemoryCache(),
        })
      })
    })
    describe('Bob account creation', () => {
      let membership: Membership | null
      describe('create bob membership should work', () => {
        const handle = 'Bob'
        before(async () => {
          bob = new UserContext('//Bob')
          await ctx.createMember(bob.joystreamAccount, handle)
          const data: any = await executeSubcription(anonClient, {
            query: MembershipByHandleSub,
            variables: { handle },
            shouldUnsuscribe: (data: any) => data.memberships.length > 0
          })
          membership = data.memberships[0]
        })
        it('membership should be in orion db', async () => {
          expect(membership!.handle).to.be.equal(handle)
          expect(membership!.controllerAccount).to.be.equal(bob.joystreamAccount.address)
        })
        after(() => {
          bob.setMembershipId(membership!.id)
        })
      })
      describe('creating gateway account and session', () => {
        let loginData: AccountLoginData
        describe('creating account', () => {
          let account: Account | null
          before(async () => {
            loginData = await createAccountAndSignIn(server, bob.membershipId, bob.joystreamAccount)
            account = await em.getRepository(Account).findOneBy({ membershipId: bob.membershipId })
          })
          it('account should not be null', () => {
            expect(account).to.not.be.null
          })
          after(() => {
            bob.setAccountId(account!.id)
          })
        })
        describe('session checks', () => {
          let session: Session | null
          before(async () => {
            session = await em.getRepository(Session).findOneBy({ id: decodeURIComponent(loginData!.sessionId) })
          })
          it('session should not be null', () => {
            expect(session).to.not.be.null
          })
          after(() => {
            bob.setSessionId(session!.id)
          })
        })
      })
      after(() => {
        bobClient = new ApolloClient({
          link: new HttpLink({
            uri: 'http://localhost:4350/graphql',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `${SESSION_COOKIE_NAME}=${alice.sessionId}`,
            },
          }),
          cache: new InMemoryCache(),
        })
      })
    })
    describe('Batch updating notifications preferences', () => {
      let account: Account
      before(async () => {
        await aliceClient.mutate({
          mutation: SetNotificationPreferencesAllFalseMut,
        })
        account = await alice.getAccount(em)
      })
      it('Alice setting all preferences to false should work', async () => {
        checkAllNotificationPreferencesToBe(account!.notificationPreferences, false)
      })
    })
  })
  describe('Notification Deposits', () => {
    describe('Channel Created notification', () => {
      let notificationId: string
      let response: FetchResult<any, Record<string, any>, Record<string, any>>
      describe('setting channel created notification to enabled', () => {
        before(async () => {
          response = await aliceClient.mutate({
            mutation: SetNotificationEnabledMut('channelCreatedNotificationEnabled'),
          })

          aliceAccount = await alice.getAccount(em)
        })
        it('account preference should be enabled', async () => {
          expectNotificationPreferenceToBe(
            aliceAccount!.notificationPreferences.channelCreatedNotificationEnabled,
            true
          )
        })
        it('mutation response field should be true', () => {
          expectNotificationPreferenceToBe(
            response.data.setAccountNotificationPreferences.channelCreatedNotificationEnabled,
            true
          )
        })
      })
      describe('create channel should work', () => {
        let channel: Channel
        before(async () => {
          const channelId = await ctx.createChannel(alice.membershipId, alice.joystreamAccount)

          const findChannel = (data: any) => {
            const channel = data.channels.find((channel: any) => channel.id === channelId)
            return channel !== undefined
          }


          const data: any = await executeSubcription(anonClient, {
            query: ChannelByMemberIdSub,
            variables: { memberId: alice.membershipId },
            shouldUnsuscribe: findChannel,
          })
          console.log('channel:', JSON.stringify(channel, null, 2))

          channel = data.channels[0]
        })
        it('channel should not be null', async () => {
          expect(channel).not.to.be.null
        })
        after(() => {
          alice.setChannelId(channel.id)
        })
      })
      describe('channel created notification deposit', () => {
        let notification: RuntimeNotification
        before(async () => {
          await executeSubcription(anonClient, {
            query: ChannelCreatedNotificationSub,
            variables: {},
            shouldUnsuscribe: (data: any) => {
              console.log('channelId', alice.channelId)
              notification = data.runtimeNotifications.find((n: any) => n.event.data.channel.id === alice.channelId)
              return notification !== undefined
            }
          })
        })
        it('notification should be not be null', () => {
          console.log(JSON.stringify(notification))
          expect(notification).to.not.be.null
        })
        it('notification channelId in data should match Alice\'s', () => {
          expect(notification!.event.data).to.have.property('channnel').to.have.property('id').to.equal(alice.channelId)
        })
        it('notification recipient should be alice', () => {
          // expect(notification!.account.id).to.equal(alice.accountId)
        })
        it('notification status should be unread', () => {
          expect(notification!.status).to.equal(ReadOrUnread.UNREAD)
        })
        it('notification delivery status should be in App and mail', () => {
          expect(notification!.deliveryStatus).to.equal(DeliveryStatus.EMAIL_AND_IN_APP)
        })
        after(() => {
          notificationId = notification!.id
        })
      })
      describe('marking the notification as read should work', () => {
        let notification: RuntimeNotification | null
        let response: FetchResult<any, Record<string, any>, Record<string, any>>
        before(async () => {
          response = await aliceClient.mutate({
            mutation: MarkNotificationAsReadMut,
            variables: { notificationIds: [notificationId] },
          })
          notification = await em.findOneBy(RuntimeNotification, { id: notificationId })
        })
        it('notification should not be null', () => {
          expect(notification).not.to.be.null
        })
        it('notifications read returned by the mutations should not be empty', () => {
          expect(response.data.markNotificationsAsRead.notificationsRead).not.to.be.empty
        })
        it('notification read mutation result should be true', () => {
          expect(response.data.markNotificationsAsRead.notificationsRead[0]).to.be.true
        })
        it('notification entity status marked as read', () => {
          expect(notification!.status).equals(ReadOrUnread.READ)
        })
      })
    })
    describe.skip('Follow channel notification', () => {
      let notificationId: string
      let account: Account
      let response: FetchResult<any, Record<string, any>, Record<string, any>>
      describe('setting the notification to enabled should work', () => {
        before(async () => {
          response = await bobClient.mutate({
            mutation: SetNotificationEnabledMut('newChannelFollowerNotificationEnabled'),
          })
          account = await bob.getAccount(em)
        })
        it('account preference should be enabled', async () => {
          expectNotificationPreferenceToBe(
            account!.notificationPreferences.newChannelFollowerNotificationEnabled,
            true
          )
        })
        it('mutation response field should be true', () => {
          expectNotificationPreferenceToBe(
            response.data.setAccountNotificationPreferences.newChannelFollowerNotificationEnabled,
            true
          )
        })
      })
      describe('following channel should trigger notification', () => {
        let notification: OffChainNotification | null
        before(async () => {
          await bobClient.mutate({
            mutation: FollowChannelMut,
            variables: { channelId: alice.channelId },
          })

          notification = await em.getRepository(OffChainNotification).findOneBy({
            data: new NewChannelFollowerNotificationData({ channel: alice.channelId }) as unknown as FindOptionsWhere<OffChainNotificationData>
          })
        })
        it('notification should not be null', () => {
          expect(notification).not.to.be.null
        })
        it('notification should be "new channel follower" type', () => {
          expect(notification!.data.isTypeOf).to.equal('NewChannelFollowerNotificationData')
        })
        it('notification data.channel should be Alice\'s channel id', () => {
          expect(notification!.data.toJSON()).to.have.property('_channel').to.equal(alice.channelId)
        })
        it('notification recipient should be Alice', () => {
          expect(notification!.accountId).to.equal(alice.accountId)
        })
        it('notification status should be unread', () => {
          expect(notification!.status).to.equal(ReadOrUnread.UNREAD)
        })
        it('notification delivery status should be in App and mail', () => {
          expect(notification!.deliveryStatus).to.equal(DeliveryStatus.EMAIL_AND_IN_APP)
        })
        after(() => {
          notificationId = notification!.id
        })
      })
      describe('marking the notification as read should work', () => {
        let response: FetchResult<any, Record<string, any>, Record<string, any>>
        let notification: OffChainNotification | null
        before(async () => {
          response = await aliceClient.mutate({
            mutation: MarkNotificationAsReadMut,
            variables: { notificationIds: [notificationId] },
          })

          notification = await em.findOneBy(OffChainNotification, { id: notificationId! })
        })
        it('notification for the notification id provided should not be null', () => {
          expect(notification).not.to.be.null
        })
        it('notification status should be read', () => {
          expect(notification!.status).equals(ReadOrUnread.READ)
        })
        it('mutation response should provide a non empty array', () => {
          expect(response.data.markNotificationsAsRead.notificationsRead).not.to.be.empty
        })
        it('mutation response first element marked as true since the mutation is successful', () => {
          expect(response.data.markNotificationsAsRead.notificationsRead[0]).to.be.true
        })
      })
    })
    describe.skip('Post Video Notification', () => {
      let notificationId: string
      let account: Account
      let response: FetchResult<any, Record<string, any>, Record<string, any>>
      describe('setting the video posted notification to enabled should work', () => {
        before(async () => {
          response = await aliceClient.mutate({
            mutation: SetNotificationEnabledMut('videoPostedNotificationEnabled'),
          })

          account = await alice.getAccount(em)
        })
        it('account preference should be enabled', () => {
          expectNotificationPreferenceToBe(
            account!.notificationPreferences.videoPostedNotificationEnabled,
            true
          )
        })
        it('mutation response field should be true', () => {
          expectNotificationPreferenceToBe(
            response.data.setAccountNotificationPreferences.videoPostedNotificationEnabled,
            true
          )
        })
      })
      describe('create video should work', () => {
        let videoId: string | null = null
        let video: Video | null = null
        describe('extrinsic should be successful', () => {
          before(async () => {
            videoId = await ctx.createVideoWithNft(alice.membershipId, alice.channelId, alice.joystreamAccount)
          })
          it('video should have been created on chain', () => {
            expect(videoId).not.to.be.null
          })
        })
        describe('video should have been added to orion', () => {
          before(async () => {
            const data: any = await executeSubcription(anonClient, {
              query: VideoByIdSub,
              variables: { videoId },
              shouldUnsuscribe: (data: any) => data.videos.length > 0,
            })

            video = data.videos[0]
          })
          it('video should have been created on chain', () => {
            expect(video).not.to.be.null
          })
        })
        after(() => {
          alice.setVideoId(video!.id)
        })
      })
      describe('having a video created should trigger correct notification', async () => {
        let notification: RuntimeNotification | null = null
        before(async () => {
          const data: any = await executeSubcription(anonClient, {
            query: VideoCreatedNotificationSub,
            variables: { videoId: alice.videoId },
            shouldUnsuscribe: (data: any) => data.runtimeNotifications.length > 0,
          })

          notification = data.runtimeNotifications[0]
        })
        it('notification should not be null', () => {
          expect(notification).not.to.be.null
        })
        it('notification should be "video created" type', () => {
          expect(notification!.event.data.isTypeOf).to.equal('VideoCreatedEventData')
        })
        it('notification recipient should be alice', () => {
          expect(notification!.accountId).to.equal(alice.accountId)
        })
        it('notification status should be unread', () => {
          expect(notification!.status).to.equal(ReadOrUnread.UNREAD)
        })
        it('notification delivery status should be in App and mail', () => {
          expect(notification!.deliveryStatus).to.equal(DeliveryStatus.EMAIL_AND_IN_APP)
        })
        after(() => {
          notificationId = notification!.id
        })
      })
      describe('marking the notification as read should work', () => {
        let notification: RuntimeNotification | null
        let response: FetchResult<any, Record<string, any>, Record<string, any>>
        before(async () => {
          response = await aliceClient.mutate({
            mutation: MarkNotificationAsReadMut,
            variables: { notificationIds: [notificationId] },
          })
          console.log(response)

          notification = await em.findOneBy(RuntimeNotification, { id: notificationId! })
          console.log(JSON.stringify(notification))
        })
        it('notification for the notification id provided should not be null', () => {
          expect(notification).not.to.be.null
        })
        it('notification status should be read', () => {
          expect(notification!.status).equals(ReadOrUnread.READ)
        })
        it('mutation response should provide a non empty array', () => {
          expect(response.data.markNotificationsAsRead.notificationsRead).not.to.be.empty
        })
        it('mutation response first element marked as true since the mutation is successful', () => {
          expect(response.data.markNotificationsAsRead.notificationsRead[0]).to.be.true
        })
      })
    })
  })
  after(() => {
    anonClient.stop()
    aliceClient.stop()
    bobClient.stop()
  })
})
