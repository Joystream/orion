import { EntityManager } from 'typeorm'
import { populateDbWithSeedData } from './testUtils'
import { globalEm } from '../../utils/globalEm'
import { excludeChannelInner } from '../../server-extension/resolvers/ChannelsResolver'
import {
  Account,
  Channel,
  ChannelRecipient,
  Exclusion,
  NextEntityId,
  NftFeaturedOnMarketPlace,
  Notification,
  OwnedNft,
  Video,
} from '../../model'
import { expect } from 'chai'
import {
  OFFCHAIN_NOTIFICATION_ID_TAG,
  RUNTIME_NOTIFICATION_ID_TAG,
} from '../../utils/notification/helpers'
import { excludeVideoInner } from '../../server-extension/resolvers/VideosResolver'
import { setFeaturedNftsInner } from '../../server-extension/resolvers/AdminResolver'

const getNextNotificationId = async (em: EntityManager, onchain: boolean) => {
  const tag = onchain ? RUNTIME_NOTIFICATION_ID_TAG : OFFCHAIN_NOTIFICATION_ID_TAG
  const row = await em.getRepository(NextEntityId).findOneBy({ entityName: tag })
  const id = parseInt(row?.nextId.toString() || '1')
  return id
}

describe('notifications tests', () => {
  let em: EntityManager
  before(async () => {
    em = await globalEm
    await populateDbWithSeedData()
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
      expect(notification!.recipient.isTypeOf).to.equal('ChannelRecipient')
      expect((notification!.recipient as ChannelRecipient).channel).to.equal(channel?.id)
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
})