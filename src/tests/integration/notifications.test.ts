import { IMemberRemarked, MemberRemarked, ReactVideo } from '@joystream/metadata-protobuf'
import { AnyMetadataClass } from '@joystream/metadata-protobuf/types'
import { Store } from '@subsquid/typeorm-store'
import { expect } from 'chai'
import { config as dontenvConfig } from 'dotenv'
import Long from 'long'
import path from 'path'
import { EntityManager, FindOptionsWhere } from 'typeorm'
import { auctionBidMadeInner } from '../../mappings/content/nft'
import { processMemberRemarkedEvent } from '../../mappings/membership'
import { backwardCompatibleMetaID } from '../../mappings/utils'
import {
  Account,
  Channel,
  ChannelRecipient,
  CommentPostedToVideo,
  CommentReply,
  MemberRecipient,
  NftFeaturedOnMarketPlace,
  NftOwnerChannel,
  Notification,
  NotificationEmailDelivery,
  NotificationType,
  OwnedNft,
  VideoLiked,
} from '../../model'
import { setFeaturedNftsInner } from '../../server-extension/resolvers/AdminResolver'
import { globalEm } from '../../utils/globalEm'
import { EntityManagerOverlay } from '../../utils/overlay'
import { defaultTestBlock, populateDbWithSeedData } from './testUtils'
import assert from 'assert'

dontenvConfig({
  path: path.resolve(__dirname, './.env'),
})

const metadataToBytes = <T>(metaClass: AnyMetadataClass<T>, obj: T): Uint8Array => {
  return Buffer.from(metaClass.encode(obj).finish())
}

const createOverlay = async () => {
  return await EntityManagerOverlay.create(new Store(() => globalEm), (_em: EntityManager) =>
    Promise.resolve()
  )
}

const findNotification = async (em: EntityManager, by: Partial<NotificationType>) => {
  const notification = await em
    .getRepository(Notification)
    .createQueryBuilder('n')
    .where(
      Object.entries(by)
        .map(([field, value]) => `n.notification_type->>'${field}' = '${value}'`)
        .join(' AND ')
    )
    .getOne()
  assert(notification, 'Notification not found')
  return notification
}

describe('notifications tests', () => {
  let notification: Notification | null
  let overlay: EntityManagerOverlay
  let em: EntityManager
  before(async () => {
    em = await globalEm
    overlay = await createOverlay()
    await populateDbWithSeedData()
  })
  // TODO: Set YPP status
  describe('👉 Set nft as featured', () => {
    let notificationId: string
    it('feature nfts should deposit notification and set nft as featured', async () => {
      const nftId = '1'

      await setFeaturedNftsInner(em, [nftId])

      notification = await findNotification(em, {
        isTypeOf: 'NftFeaturedOnMarketPlace',
        videoId: nftId,
      })
      notificationId = notification.id
      const nft = await em
        .getRepository(OwnedNft)
        .findOneOrFail({ where: { id: nftId }, relations: { video: { channel: true } } })
      const account = await em
        .getRepository(Account)
        .findOneBy({ membershipId: nft!.video!.channel!.ownerMemberId! })
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
      expect(notification?.accountId).to.equal(account?.id)
      expect(nft.isFeatured).to.be.true
    })
    it('notification email entity should be correctly deposited', async () => {
      const notificationEmailDelivery = await em
        .getRepository(NotificationEmailDelivery)
        .findOneBy({ notificationId })
      expect(notificationEmailDelivery).not.to.be.null
      expect(notificationEmailDelivery!.discard).to.be.false
      expect(notificationEmailDelivery!.attempts).to.be.undefined
    })
  })
  describe('👉 New bid made', () => {
    let nft: OwnedNft
    const memberId = '5'
    const outbiddedMember = '4'
    const videoId = '5'
    let notificationId: string

    before(async () => {
      const bidAmount = BigInt(100000)
      nft = await em.getRepository(OwnedNft).findOneByOrFail({ videoId })

      await auctionBidMadeInner(
        overlay,
        defaultTestBlock(),
        100,
        undefined,
        memberId,
        videoId,
        bidAmount
      )
      await overlay.updateDatabase()
    })
    it('should deposit notification for member outbidded', async () => {
      notification = await findNotification(em, {
        isTypeOf: 'HigherBidPlaced',
        videoId,
      })
      notificationId = notification.id
      const account = (await overlay
        .getRepository(Account)
        .getOneByRelationOrFail('membershipId', outbiddedMember)) as Account

      expect(notification).not.to.be.null
      expect(notification!.notificationType.isTypeOf).to.equal('HigherBidPlaced')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('MemberRecipient')
      expect((notification!.recipient as MemberRecipient).membership).to.equal(outbiddedMember)
      expect(notification?.accountId).to.equal(account!.id)
    })
    it('notification email entity should be correctly deposited', async () => {
      const notificationEmailDelivery = (await overlay
        .getRepository(NotificationEmailDelivery)
        .getOneByRelation('notificationId', notificationId)) as NotificationEmailDelivery | null
      expect(notificationEmailDelivery).not.to.be.null
      expect(notificationEmailDelivery!.discard).to.be.false
      expect(notificationEmailDelivery!.attempts).to.be.empty
    })
    it('should deposit notification for creator receiving a new auction bid', async () => {
      const channel = await em
        .getRepository(Channel)
        .findOneBy({ id: (nft.owner as NftOwnerChannel).channel })
      notification = await findNotification(em, {
        isTypeOf: 'CreatorReceivesAuctionBid',
        videoId,
      })
      notificationId = notification.id
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
    it('notification email entity should be correctly deposited on overlay', async () => {
      const notificationEmailDelivery = (await overlay
        .getRepository(NotificationEmailDelivery)
        .getOneByRelation('notificationId', notificationId)) as NotificationEmailDelivery | null
      expect(notificationEmailDelivery).not.to.be.null
      expect(notificationEmailDelivery!.discard).to.be.false
      expect(notificationEmailDelivery!.attempts).to.be.empty
    })
  })
  describe('👉 Video Liked', () => {
    let notificationId: string
    const videoId = '1'
    const block = { timestamp: 123456 } as any
    const indexInBlock = 1
    const extrinsicHash = '0x1234567890abcdef'
    const metadataMessage: IMemberRemarked = {
      reactVideo: {
        videoId: Long.fromString(videoId),
        reaction: ReactVideo.Reaction.LIKE,
      },
    }
    const event = {
      isV2001: true,
      asV2001: ['3', metadataToBytes(MemberRemarked, metadataMessage), undefined],
    } as any
    it('should process video liked and deposit notification', async () => {
      await processMemberRemarkedEvent({
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        event,
      })
      await overlay.updateDatabase()

      notification = await findNotification(em, {
        isTypeOf: 'VideoLiked',
        videoId,
      })
      notificationId = notification.id

      expect(notification.notificationType.isTypeOf).to.equal('VideoLiked')
      const notificationData = notification.notificationType as VideoLiked
      expect(notificationData.videoId).to.equal('1')
      expect(notification!.status.isTypeOf).to.equal('Unread')
      expect(notification!.inApp).to.be.true
      expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
    })
    it('notification email entity should be correctly deposited on overlay', async () => {
      const notificationEmailDelivery = (await overlay
        .getRepository(NotificationEmailDelivery)
        .getOneByRelation('notificationId', notificationId)) as NotificationEmailDelivery | null
      expect(notificationEmailDelivery).not.to.be.null
      expect(notificationEmailDelivery!.discard).to.be.false
      expect(notificationEmailDelivery!.attempts).to.be.empty
    })
  })
  describe('👉 Comment Posted To Video', () => {
    let notificationId: string
    const videoId = '1'
    const block = { timestamp: 123456 } as any
    const indexInBlock = 1
    const extrinsicHash = '0x1234567890abcdef'
    const commentId = backwardCompatibleMetaID(block, indexInBlock)
    const metadataMessage: IMemberRemarked = {
      createComment: {
        videoId: Long.fromString(videoId),
        parentCommentId: null,
        body: 'test',
      },
    }
    const event = {
      isV2001: true,
      asV2001: ['2', metadataToBytes(MemberRemarked, metadataMessage), undefined], // avoid comment author == creator
    } as any
    it('should process comment to video and deposit notification', async () => {
      await processMemberRemarkedEvent({
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        event,
      })
      await overlay.updateDatabase()

      notification = await findNotification(em, {
        isTypeOf: 'CommentPostedToVideo',
        videoId,
      })
      notificationId = notification.id

      it('notification type is comment posted to video', () => {
        expect(notification).not.to.be.null
        expect(notification!.notificationType.isTypeOf).to.equal('CommentPostedToVideo')
      })
      it('notification data for comment posted to video should be ok', () => {
        const notificationData = notification!.notificationType as CommentPostedToVideo
        expect(notificationData.videoId).to.equal('1')
        expect(notificationData.comentId).to.equal(commentId)
        expect(notificationData.memberHandle).to.equal('handle-2')
        expect(notificationData.videoTitle).to.equal('test-video-1')
      })

      it('general notification creation setting should be as default', () => {
        expect(notification!.status.isTypeOf).to.equal('Unread')
        expect(notification!.inApp).to.be.true
        expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
      })
      it('notification email entity should be correctly deposited on overlay', async () => {
        const notificationEmailDelivery = (await overlay
          .getRepository(NotificationEmailDelivery)
          .getOneByRelation('notificationId', notificationId)) as NotificationEmailDelivery | null
        expect(notificationEmailDelivery).not.to.be.null
        expect(notificationEmailDelivery!.discard).to.be.false
        expect(notificationEmailDelivery!.attempts).to.be.empty
      })
    })
    describe('👉 Reply To Comment', () => {
      let notificationId: string
      const videoId = '1'
      const block = { timestamp: 123457 } as any
      const indexInBlock = 1
      const metadataMessage = {
        createComment: {
          videoId: Long.fromString(videoId),
          parentCommentId: commentId,
          body: 'reply test',
        },
      }
      const event = {
        isV2001: true,
        asV2001: ['3', metadataToBytes(MemberRemarked, metadataMessage!), undefined],
      } as any

      before(async () => {
        await processMemberRemarkedEvent({
          overlay,
          block,
          indexInBlock,
          extrinsicHash,
          event,
        })
        await overlay.updateDatabase()
      })

      describe('should process reply to comment and deposit notification', () => {
        before(async () => {
          notification = await findNotification(em, {
            isTypeOf: 'CommentReply',
            videoId,
          })
          notificationId = notification.id
        })

        it('notification type is reply to comment', () => {
          expect(notification).not.to.be.null
          expect(notification!.notificationType.isTypeOf).to.equal('CommentReply')
          expect(notification?.accountId).to.equal('2')
        })
        it('notification data for comment reply should be ok', () => {
          const notificationData = notification!.notificationType as CommentReply
          expect(notificationData.videoId).to.equal('1')
          expect(notificationData.memberHandle).to.equal('handle-3')
          expect(notificationData.commentId).to.equal(backwardCompatibleMetaID(block, indexInBlock))
          expect(notificationData.videoTitle).to.equal('test-video-1')
          expect(notification!.recipient.isTypeOf).to.equal('MemberRecipient')
          expect((notification!.recipient as MemberRecipient).membership).to.equal(
            '2',
            'member recipient should be parent comment author'
          )
        })
        it('general notification creation setting should be as default', () => {
          expect(notification!.status.isTypeOf).to.equal('Unread')
          expect(notification!.inApp).to.be.true
        })
        it('notification email entity should be correctly deposited on overlay', async () => {
          const notificationEmailDelivery = (await overlay
            .getRepository(NotificationEmailDelivery)
            .getOneByRelation('notificationId', notificationId)) as NotificationEmailDelivery | null
          expect(notificationEmailDelivery).not.to.be.null
          expect(notificationEmailDelivery!.discard).to.be.false
          expect(notificationEmailDelivery!.attempts).to.be.empty
        })
      })
    })
  })
})
