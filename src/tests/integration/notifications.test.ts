import { IMemberRemarked, MemberRemarked, ReactVideo } from '@joystream/metadata-protobuf'
import { AnyMetadataClass } from '@joystream/metadata-protobuf/types'
import { Store } from '@subsquid/typeorm-store'
import { expect } from 'chai'
import { config as dontenvConfig } from 'dotenv'
import Long from 'long'
import path from 'path'
import { EntityManager } from 'typeorm'
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
  TipCommentPostedToVideo,
} from '../../model'
import { setFeaturedNftsInner } from '../../server-extension/resolvers/AdminResolver'
import { globalEm } from '../../utils/globalEm'
import { EntityManagerOverlay } from '../../utils/overlay'
import { defaultTestBlock, populateDbWithSeedData } from './testUtils'
import assert from 'assert'
import { MembersMemberRemarkedEvent } from '../../types/events'
import { SubstrateBlock } from '@subsquid/substrate-processor'

dontenvConfig({
  path: path.resolve(__dirname, './.env'),
})

const metadataToBytes = <T>(metaClass: AnyMetadataClass<T>, obj: T): Uint8Array => {
  return Buffer.from(metaClass.encode(obj).finish())
}

const withOverlayTransaction = async (cb: (overlay: EntityManagerOverlay) => Promise<void>) => {
  const em = await globalEm
  const runner = em.connection.createQueryRunner()
  await runner.connect()
  await runner.startTransaction()

  const overlay = await EntityManagerOverlay.create(
    new Store(async () => runner.manager),
    // onDbUpdate
    async () => {
      /* Do nothing */
    }
  )
  await cb(overlay)
  await overlay.updateDatabase()
  await runner.commitTransaction()
  await runner.release()
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
  if (!notification) {
    throw new Error(`Could not find notification by: ${JSON.stringify({ notificationType: by })}`)
  }
  return notification
}

const checkNotificationEmailDelivery = async (notificationId: string) => {
  const notificationEmailDelivery = await (await globalEm)
    .getRepository(NotificationEmailDelivery)
    .findOneOrFail({ where: { notificationId }, relations: { attempts: true } })
  expect(notificationEmailDelivery.discard).to.be.false
  expect(notificationEmailDelivery.attempts).to.be.empty
}

describe('notifications tests', () => {
  let notification: Notification | null
  let em: EntityManager
  before(async () => {
    em = await globalEm
    await populateDbWithSeedData()
  })
  // TODO: Set YPP status
  // TODO: excludeContent
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
      assert(nft.video.channel.ownerMemberId, 'Missing channel owner id')
      const account = await em
        .getRepository(Account)
        .findOneByOrFail({ membershipId: nft.video.channel.ownerMemberId })
      expect(notification.notificationType.isTypeOf).to.equal('NftFeaturedOnMarketPlace')
      expect((notification.notificationType as NftFeaturedOnMarketPlace).videoId).to.equal(
        nft.videoId
      )
      expect((notification.notificationType as NftFeaturedOnMarketPlace).videoTitle).to.equal(
        nft.video.title || '??'
      )
      expect(notification.status.isTypeOf).to.equal('Unread')
      expect(notification.inApp).to.be.true
      expect(notification.recipient.isTypeOf).to.equal('ChannelRecipient')
      expect((notification.recipient as ChannelRecipient).channel).to.equal(nft.video.channel.id)
      expect(notification.accountId).to.equal(account.id)
      expect(nft.isFeatured).to.be.true
    })
    it('notification email entity should be correctly deposited', () =>
      checkNotificationEmailDelivery(notificationId))
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
      await withOverlayTransaction(async (overlay) => {
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
    })
    it('should deposit notification for member outbidded', async () => {
      notification = await findNotification(em, {
        isTypeOf: 'HigherBidPlaced',
        videoId,
      })
      notificationId = notification.id
      const account = await em
        .getRepository(Account)
        .findOneByOrFail({ membershipId: outbiddedMember })

      expect(notification.notificationType.isTypeOf).to.equal('HigherBidPlaced')
      expect(notification.status.isTypeOf).to.equal('Unread')
      expect(notification.inApp).to.be.true
      expect(notification.recipient.isTypeOf).to.equal('MemberRecipient')
      expect((notification.recipient as MemberRecipient).membership).to.equal(outbiddedMember)
      expect(notification.accountId).to.equal(account.id)
    })
    it('notification email entity should be correctly deposited', () =>
      checkNotificationEmailDelivery(notificationId))
    it('should deposit notification for creator receiving a new auction bid', async () => {
      const channel = await em
        .getRepository(Channel)
        .findOneByOrFail({ id: (nft.owner as NftOwnerChannel).channel })
      notification = await findNotification(em, {
        isTypeOf: 'CreatorReceivesAuctionBid',
        videoId,
      })
      notificationId = notification.id
      assert(channel.ownerMemberId, 'Missing channel ownerMemberId!')
      const account = await em
        .getRepository(Account)
        .findOneByOrFail({ membershipId: channel.ownerMemberId })

      // complete the missing checks as above
      expect(notification.notificationType.isTypeOf).to.equal('CreatorReceivesAuctionBid')
      expect(notification.status.isTypeOf).to.equal('Unread')
      expect(notification.inApp).to.be.true
      expect(notification.recipient.isTypeOf).to.equal('ChannelRecipient')
      expect((notification.recipient as ChannelRecipient).channel).to.equal(channel.id)
      expect(notification.accountId).to.equal(account.id)
    })
    it('notification email entity should be correctly deposited', () =>
      checkNotificationEmailDelivery(notificationId))
  })
  describe('👉 Video Liked', () => {
    let notificationId: string
    const videoId = '1'
    const block = { height: 123, timestamp: 123456 } as SubstrateBlock
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
    } as unknown as MembersMemberRemarkedEvent
    it('should process video liked and deposit notification', async () => {
      await withOverlayTransaction(async (overlay) => {
        await processMemberRemarkedEvent({
          overlay,
          block,
          indexInBlock,
          extrinsicHash,
          event,
        })
      })

      notification = await findNotification(em, {
        isTypeOf: 'VideoLiked',
        videoId,
      })
      notificationId = notification.id

      expect(notification.notificationType.isTypeOf).to.equal('VideoLiked')
      const notificationData = notification.notificationType as VideoLiked
      expect(notificationData.videoId).to.equal('1')
      expect(notification.status.isTypeOf).to.equal('Unread')
      expect(notification.inApp).to.be.true
      expect(notification.recipient.isTypeOf).to.equal('ChannelRecipient')
    })
    it('notification email entity should be correctly deposited', () =>
      checkNotificationEmailDelivery(notificationId))
  })
  describe('👉 Comment Posted To Video', () => {
    let notificationId: string
    const videoId = '1'
    const block = { height: 123, timestamp: 123456 } as SubstrateBlock
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
    } as unknown as MembersMemberRemarkedEvent
    it('should process comment to video and deposit notification', async () => {
      await withOverlayTransaction(async (overlay) => {
        await processMemberRemarkedEvent({
          overlay,
          block,
          indexInBlock,
          extrinsicHash,
          event,
        })
      })
      notification = await findNotification(em, {
        isTypeOf: 'CommentPostedToVideo',
        videoId,
      })
      notificationId = notification.id

      expect(notification.notificationType.isTypeOf).to.equal('CommentPostedToVideo')
      const notificationData = notification.notificationType as CommentPostedToVideo
      expect(notificationData.videoId).to.equal('1')
      expect(notificationData.comentId).to.equal(commentId)
      expect(notificationData.memberHandle).to.equal('handle-2')
      expect(notificationData.videoTitle).to.equal('test-video-1')
      expect(notification.status.isTypeOf).to.equal('Unread')
      expect(notification.inApp).to.be.true
      expect(notification.recipient.isTypeOf).to.equal('ChannelRecipient')
    })

    it('notification email entity should be correctly deposited', () =>
      checkNotificationEmailDelivery(notificationId))
    describe('👉 Reply To Comment', () => {
      let notificationId: string
      const videoId = '1'
      const block = { height: 123, timestamp: 123457 } as SubstrateBlock
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
        asV2001: ['3', metadataToBytes(MemberRemarked, metadataMessage), undefined],
      } as unknown as MembersMemberRemarkedEvent

      before(async () => {
        await withOverlayTransaction(async (overlay) => {
          await processMemberRemarkedEvent({
            overlay,
            block,
            indexInBlock,
            extrinsicHash,
            event,
          })
        })
      })

      it('should process reply to comment and deposit notification', async () => {
        notification = await findNotification(em, {
          isTypeOf: 'CommentReply',
          videoId,
        })
        notificationId = notification.id

        expect(notification.notificationType.isTypeOf).to.equal('CommentReply')
        expect(notification.accountId).to.equal('2')
        const notificationData = notification.notificationType as CommentReply
        expect(notificationData.videoId).to.equal('1')
        expect(notificationData.memberHandle).to.equal('handle-3')
        expect(notificationData.commentId).to.equal(backwardCompatibleMetaID(block, indexInBlock))
        expect(notificationData.videoTitle).to.equal('test-video-1')
        expect(notification.recipient.isTypeOf).to.equal('MemberRecipient')
        expect((notification.recipient as MemberRecipient).membership).to.equal(
          '2',
          'member recipient should be parent comment author'
        )
        expect(notification.status.isTypeOf).to.equal('Unread')
        expect(notification.inApp).to.be.true
      })
      it('notification email entity should be correctly deposited', () =>
        checkNotificationEmailDelivery(notificationId))
    })
  })

  describe('👉Tip Comment Posted To Video', () => {
    let nextNotificationIdPre: number
    let notificationId: string
    const block = { timestamp: 123456 } as any
    const indexInBlock = 1
    const extrinsicHash = '0x1234567890abcdef'
    const commentId = backwardCompatibleMetaID(block, indexInBlock)
    const videoId = '1'
    const tipAmount = BigInt(100000)
    let video: Video
    let event: any
    const metadataMessage: IMemberRemarked = {
      createComment: {
        videoId: Long.fromNumber(1),
        parentCommentId: null,
        body: 'test',
      },
    }
    before(async () => {
      nextNotificationIdPre = await getNextNotificationId(overlay, true)
      notificationId = RUNTIME_NOTIFICATION_ID_TAG + '-' + nextNotificationIdPre.toString()
      video = await em
        .getRepository(Video)
        .findOneOrFail({ where: { id: videoId }, relations: { channel: true } })
      event = {
        isV2001: true,
        asV2001: [
          '2',
          metadataToBytes(MemberRemarked, metadataMessage),
          [video.channel.rewardAccount, tipAmount],
        ], // avoid comment author == creator
      }
    })
    it('should process comment to video and deposit notification', async () => {
      await processMemberRemarkedEvent({
        overlay,
        block,
        indexInBlock,
        extrinsicHash,
        event,
      })

      const nextNotificationId = await getNextNotificationId(overlay, true)
      notification = (await overlay
        .getRepository(Notification)
        .getByIdOrFail(notificationId)) as Notification | null

      it('notification type is comment posted to video', () => {
        expect(notification).not.to.be.null
        expect(notification!.notificationType.isTypeOf).to.equal('TipCommentPostedToVideo')
      })
      it('notification data for comment posted to video should be ok', () => {
        const notificationData = notification!.notificationType as TipCommentPostedToVideo
        expect(notificationData.videoId).to.equal('1')
        expect(notificationData.commentId).to.equal(commentId)
        expect(notificationData.memberHandle).to.equal('handle-2')
        expect(notificationData.videoTitle).to.equal('test-video-1')
        expect(notificationData.tipAmount).to.equal(tipAmount)
      })

      it('general notification creation setting should be as default', () => {
        expect(notification!.status.isTypeOf).to.equal('Unread')
        expect(notification!.inApp).to.be.true
        expect(nextNotificationId.toString()).to.equal((nextNotificationIdPre + 1).toString())
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
      let nextNotificationIdPre: number
      let notificationId: string
      const block = { timestamp: 123457 } as any
      const indexInBlock = 1
      const metadataMessage = {
        createComment: {
          videoId: Long.fromNumber(1),
          parentCommentId: commentId,
          body: 'reply test',
        },
      }
      const event = {
        isV2001: true,
        asV2001: ['3', metadataToBytes(MemberRemarked, metadataMessage!), undefined],
      } as any

      before(async () => {
        nextNotificationIdPre = await getNextNotificationId(overlay, true)
        notificationId = RUNTIME_NOTIFICATION_ID_TAG + '-' + nextNotificationIdPre.toString()

        await processMemberRemarkedEvent({
          overlay,
          block,
          indexInBlock,
          extrinsicHash,
          event,
        })
      })

      describe('should process reply to comment and deposit notification', () => {
        let nextNotificationId: number
        before(async () => {
          nextNotificationId = await getNextNotificationId(overlay, true)
          notification = (await overlay
            .getRepository(Notification)
            .getByIdOrFail(notificationId)) as Notification | null
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
          expect(nextNotificationId.toString()).to.equal((nextNotificationIdPre + 1).toString())
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
