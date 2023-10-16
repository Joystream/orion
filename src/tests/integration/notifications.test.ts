import { EntityManager } from 'typeorm'
import { createType } from '@joystream/types'
import { Bytes } from '@polkadot/types'
import { IMemberRemarked, ReactVideo, MemberRemarked } from '@joystream/metadata-protobuf'
import { AnyMetadataClass } from '@joystream/metadata-protobuf/types'
import { clearDb, defaultTestBlock, populateDbWithSeedData } from './testUtils'
import { globalEm } from '../../utils/globalEm'
import { excludeChannelInner } from '../../server-extension/resolvers/ChannelsResolver'
import {
  Account,
  Channel,
  ChannelRecipient,
  CommentPostedToVideo,
  Exclusion,
  MemberRecipient,
  NextEntityId,
  NftFeaturedOnMarketPlace,
  NftOwnerChannel,
  Notification,
  OwnedNft,
  Video,
  VideoLiked,
} from '../../model'
import { expect } from 'chai'
import {
  OFFCHAIN_NOTIFICATION_ID_TAG,
  RUNTIME_NOTIFICATION_ID_TAG,
} from '../../utils/notification/helpers'
import { excludeVideoInner } from '../../server-extension/resolvers/VideosResolver'
import { setFeaturedNftsInner } from '../../server-extension/resolvers/AdminResolver'
import { auctionBidMadeInner } from '../../mappings/content/nft'
import { EntityManagerOverlay } from '../../utils/overlay'
import { Store } from '@subsquid/typeorm-store'
import { processMemberRemarkedEvent } from '../../mappings/membership'
import Long from 'long'
import { backwardCompatibleMetaID } from '../../mappings/utils'

const metadataToBytes = <T>(metaClass: AnyMetadataClass<T>, obj: T): Bytes => {
  return createType('Bytes', '0x' + Buffer.from(metaClass.encode(obj).finish()).toString('hex'))
}

const getNextNotificationId = async (em: EntityManager, onchain: boolean) => {
  const tag = onchain ? RUNTIME_NOTIFICATION_ID_TAG : OFFCHAIN_NOTIFICATION_ID_TAG
  const row = await em.getRepository(NextEntityId).findOneBy({ entityName: tag })
  const id = parseInt(row?.nextId.toString() || '1')
  return id
}

const createOverlay = async () => {
  return await EntityManagerOverlay.create(new Store(() => globalEm), (_em: EntityManager) =>
    Promise.resolve()
  )
}

describe('notifications tests', () => {
  let overlay: EntityManagerOverlay
  let em: EntityManager
  before(async () => {
    em = await globalEm
    await populateDbWithSeedData()
  })
  after(async () => {
    await clearDb()
  })
  describe('exclude channel', () => {
    it('exclude channel should deposit notification', async () => {
      const channelId = '1'
      const rationale = 'test-rationale'
      const nextNotificationIdPre = await getNextNotificationId(em, false)

      await excludeChannelInner(em, channelId, rationale)

      const notification = await em.getRepository(Notification).findOneBy({
        id: OFFCHAIN_NOTIFICATION_ID_TAG + '-' + nextNotificationIdPre,
      })
      const channel = await em.getRepository(Channel).findOneBy({ id: channelId })
      const nextNotificationIdPost = await getNextNotificationId(em, false)
      const account = await em
        .getRepository(Account)
        .findOneBy({ membershipId: channel!.ownerMemberId! })
      expect(notification).not.to.be.null
      expect(channel).not.to.be.null
      expect(notification!.notificationType.isTypeOf).to.equal('ChannelExcluded')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('MemberRecipient')
      expect((notification!.recipient as MemberRecipient).membership).to.equal(
        channel?.ownerMemberId
      )
      expect(nextNotificationIdPost.toString()).to.equal((nextNotificationIdPre + 1).toString())
      expect(notification?.accountId).to.equal(account?.id)
    })
    it('exclude channel should mark channel as excluded with entity inserted', async () => {
      const channelId = '2'
      const rationale = 'test-rationale'

      await excludeChannelInner(em, channelId, rationale)

      const channel = await em.getRepository(Channel).findOneBy({ id: channelId })
      const exclusion = await em.getRepository(Exclusion).findOneBy({ channelId })
      expect(exclusion).not.to.be.null
      expect(exclusion!.rationale).to.equal(rationale)
      expect(channel).not.to.be.null
      expect(channel!.isExcluded).to.be.true
    })
  })
  describe('exclude video', () => {
    it('exclude video should deposit notification', async () => {
      const videoId = '1'
      const rationale = 'test-rationale'
      const nextNotificationIdPre = await getNextNotificationId(em, false)

      await excludeVideoInner(em, videoId, rationale)

      const notification = await em.getRepository(Notification).findOneBy({
        id: OFFCHAIN_NOTIFICATION_ID_TAG + '-' + nextNotificationIdPre,
      })
      const video = await em
        .getRepository(Video)
        .findOne({ where: { id: videoId }, relations: { channel: true } })
      expect(video).not.to.be.null
      expect(video!.channel).not.to.be.null
      const nextNotificationIdPost = await getNextNotificationId(em, false)
      const account = await em
        .getRepository(Account)
        .findOneBy({ membershipId: video!.channel.ownerMemberId! })
      expect(notification).not.to.be.null
      expect(notification!.notificationType.isTypeOf).to.equal('VideoExcluded')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
      expect((notification!.recipient as ChannelRecipient).channel).to.equal(video!.channel!.id)
      expect(nextNotificationIdPost.toString()).to.equal((nextNotificationIdPre + 1).toString())
      expect(notification?.accountId).to.equal(account?.id)
    })
    it('exclude video should work with exclusion entity added', async () => {
      const videoId = '2'
      const rationale = 'test-rationale'

      await excludeVideoInner(em, videoId, rationale)

      const video = await em.getRepository(Video).findOneBy({ id: videoId })
      const exclusion = await em.getRepository(Exclusion).findOneBy({ videoId })
      expect(exclusion).not.to.be.null
      expect(exclusion!.rationale).to.equal(rationale)
      expect(video).not.to.be.null
      expect(video!.isExcluded).to.be.true
    })
  })
  describe('set nft as featured', () => {
    it('feature nfts should deposit notification and set nft as featured', async () => {
      const nftId = '1'
      const nextNotificationIdPre = await getNextNotificationId(em, false)

      await setFeaturedNftsInner(em, [nftId])

      const notification = await em.getRepository(Notification).findOneBy({
        id: OFFCHAIN_NOTIFICATION_ID_TAG + '-' + nextNotificationIdPre,
      })
      const nft = await em
        .getRepository(OwnedNft)
        .findOneOrFail({ where: { id: nftId }, relations: { video: { channel: true } } })
      const account = await em
        .getRepository(Account)
        .findOneBy({ membershipId: nft!.video!.channel!.ownerMemberId! })
      const nextNotificationIdPost = await getNextNotificationId(em, false)
      expect(notification).not.to.be.null
      expect(notification!.notificationType.isTypeOf).to.equal('NftFeaturedOnMarketPlace')
      expect((notification!.notificationType as NftFeaturedOnMarketPlace).videoId).to.equal(
        nft.videoId
      )
      expect((notification!.notificationType as NftFeaturedOnMarketPlace).videoTitle).to.equal(
        nft.video!.title || '??'
      )
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
      expect((notification!.recipient as ChannelRecipient).channel).to.equal(
        nft!.video!.channel!.id
      )
      expect(nextNotificationIdPost.toString()).to.equal((nextNotificationIdPre + 1).toString())
      expect(notification?.accountId).to.equal(account?.id)
      expect(nft.isFeatured).to.be.true
    })
  })
  describe('New bid made', () => {
    let nft: OwnedNft
    const memberId = '5'
    const outbiddedMember = '4'
    const videoId = '5'
    let nextNotificationIdPre: number

    before(async () => {
      const bidAmount = BigInt(100000)
      nextNotificationIdPre = await getNextNotificationId(em, true)
      nft = await em.getRepository(OwnedNft).findOneByOrFail({ videoId })
      overlay = await createOverlay()

      await auctionBidMadeInner(
        overlay,
        defaultTestBlock(),
        100,
        undefined,
        memberId,
        videoId,
        bidAmount
      )
    })
    it('should deposit notification for member outbidded', async () => {
      const notification = await overlay
        .getRepository(Notification)
        .getByIdOrFail(RUNTIME_NOTIFICATION_ID_TAG + '-' + nextNotificationIdPre)
      const account = await overlay
        .getRepository(Account)
        .getOneByRelationOrFail('membershipId', outbiddedMember)

      expect(notification).not.to.be.null
      expect(notification!.notificationType.isTypeOf).to.equal('HigherBidPlaced')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('MemberRecipient')
      expect((notification!.recipient as MemberRecipient).membership).to.equal(outbiddedMember)
      expect(notification?.accountId).to.equal(account?.id)
    })
    it('should deposit notification for creator receiving a new auction bid', async () => {
      const channel = await em
        .getRepository(Channel)
        .findOneBy({ id: (nft.owner as NftOwnerChannel).channel })
      const notification = await overlay
        .getRepository(Notification)
        .getByIdOrFail(RUNTIME_NOTIFICATION_ID_TAG + '-' + (nextNotificationIdPre + 1))
      const account = await overlay
        .getRepository(Account)
        .getOneByRelationOrFail('membershipId', channel!.ownerMemberId!)

      // complete the missing checks as above
      expect(notification).not.to.be.null
      expect(notification!.notificationType.isTypeOf).to.equal('CreatorReceivesAuctionBid')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
      expect(channel).not.to.be.null
      expect((notification!.recipient as ChannelRecipient).channel).to.equal(channel!.id)
      expect(notification?.accountId).to.equal(account?.id)
    })
  })
  describe('Video Liked', () => {
    let notificationId: number
    const block = { timestamp: 123456 } as any
    const indexInBlock = 1
    const extrinsicHash = '0x1234567890abcdef'
    const metadataMessage: IMemberRemarked = {
      reactVideo: {
        videoId: Long.fromNumber(1),
        reaction: ReactVideo.Reaction.LIKE,
      },
    }
    const event = {
      isV2001: true,
      asV2001: ['1', metadataToBytes(MemberRemarked, metadataMessage), undefined],
    } as any
    before(async () => {
      overlay = await createOverlay()
      notificationId = await getNextNotificationId(em, true)
    })
    it('should process video liked and deposit notification', async () => {
      await processMemberRemarkedEvent({
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        event,
      })

      const nextNotificationId = await getNextNotificationId(em, true)
      const notification = await overlay
        .getRepository(Notification)
        .getByIdOrFail(RUNTIME_NOTIFICATION_ID_TAG + '-' + notificationId.toString())

      expect(notification.notificationType.isTypeOf).to.equal('VideoLiked')
      const notificationData = notification.notificationType as VideoLiked
      expect(notificationData.videoId).to.equal('1')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(nextNotificationId.toString()).to.equal((notificationId + 1).toString())
      expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
    })
  })
  describe('Comment Posted To Video', () => {
    let notificationId: number
    const block = { timestamp: 123456 } as any
    const indexInBlock = 1
    const extrinsicHash = '0x1234567890abcdef'
    const metadataMessage: IMemberRemarked = {
      createComment: {
        videoId: Long.fromNumber(1),
        parentCommentId: null,
        body: 'test',
      },
    }
    const event = {
      isV2001: true,
      asV2001: ['2', metadataToBytes(MemberRemarked, metadataMessage), undefined], // avoid comment author == creator
    } as any
    before(async () => {
      overlay = await createOverlay()
      notificationId = await getNextNotificationId(em, true)
    })
    it('should process comment to video and deposit notification', async () => {
      await processMemberRemarkedEvent({
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        event,
      })

      const nextNotificationId = await getNextNotificationId(em, true)
      const notification = await overlay
        .getRepository(Notification)
        .getByIdOrFail(RUNTIME_NOTIFICATION_ID_TAG + '-' + notificationId.toString())

      it('notification type is comment posted to video', () => {
        expect(notification.notificationType.isTypeOf).to.equal('CommentPostedToVideo')
      })
      it('notification data for comment posted to video should be ok', () => {
        const notificationData = notification.notificationType as CommentPostedToVideo
        expect(notificationData.videoId).to.equal('1')
        expect(notificationData.comentId).to.equal(backwardCompatibleMetaID(block, indexInBlock))
        expect(notificationData.memberHandle).to.equal('handle-2')
        expect(notificationData.videoTitle).to.equal('test-video-1')
      })

      it('general notification creation setting should be as default', () => {
        expect(notification!.status.isTypeOf).to.equal('Unread')
        expect(notification!.inApp).to.be.true
        expect(nextNotificationId.toString()).to.equal((notificationId + 1).toString())
        expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
      })
    })
  })
})
