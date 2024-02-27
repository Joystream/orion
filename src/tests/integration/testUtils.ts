import { SubstrateBlock } from '@subsquid/substrate-processor'
import { EntityManager } from 'typeorm'
import {
  Account,
  Auction,
  AuctionTypeEnglish,
  Bid,
  Channel,
  Membership,
  NftOwnerChannel,
  Notification,
  NotificationEmailDelivery,
  OwnedNft,
  TransactionalStatusAuction,
  TransactionalStatusIdle,
  User,
  Video,
  YppUnverified,
} from '../../model'
import { globalEm } from '../../utils/globalEm'
import { defaultNotificationPreferences } from '../../utils/notification'

// TODO: refactor this using the Builder pattern
export async function populateDbWithSeedData() {
  const em = await globalEm
  for (let i = 0; i < 10; i++) {
    const member = new Membership({
      createdAt: new Date(),
      id: i.toString(),
      controllerAccount: `controller-account-${i}`,
      handle: `handle-${i}`,
      handleRaw: '0x' + Buffer.from(`handle-${i}`).toString('hex'),
      totalChannelsCreated: 0,
    })
    const user = new User({
      id: `user-${i}`,
      isRoot: false,
    })
    const account = new Account({
      id: i.toString(),
      email: `test-email-${i}@example.com`,
      isEmailConfirmed: false,
      registeredAt: new Date(),
      isBlocked: false,
      userId: user.id,
      joystreamAccount: `test-joystream-account-${i}`,
      membershipId: member.id,
      notificationPreferences: defaultNotificationPreferences(),
    })
    await em.save([user, member, account])
  }
  for (let i = 0; i < 10; i++) {
    const channel = new Channel({
      id: i.toString(),
      title: `test-channel-${i}`,
      isCensored: false,
      isExcluded: false,
      createdAt: new Date(),
      createdInBlock: i,
      ownerMemberId: i.toString(),
      rewardAccount: `test-reward-account-${i}`,
      channelStateBloatBond: BigInt(100),
      followsNum: 0,
      videoViewsNum: 0,
      totalVideosCreated: 0,
      cumulativeRewardClaimed: 0n,
      cumulativeReward: 0n,
      cumulativeRevenue: BigInt(0),
      yppStatus: new YppUnverified(),
    })
    const video = new Video({
      id: i.toString(),
      title: `test-video-${i}`,
      createdAt: new Date(),
      channelId: channel.id,
      isCensored: false,
      isExcluded: false,
      createdInBlock: i,
      isCommentSectionEnabled: true,
      isReactionFeatureEnabled: true,
      videoStateBloatBond: BigInt(1000),
      commentsCount: 0,
      reactionsCount: 0,
      viewsNum: 1,
      videoRelevance: 0,
    })
    const nft = new OwnedNft({
      id: video.id,
      videoId: video.id,
      creatorRoyalty: null,
      owner: new NftOwnerChannel({ channel: channel.id }),
      createdAt: new Date(),
      isFeatured: false,
      transactionalStatus: new TransactionalStatusIdle(),
    })
    await em.save([channel, video, nft])
    if (i === 5) {
      const auction = new Auction({
        id: '1',
        nftId: nft.id,
        startingPrice: BigInt(100),
        buyNowPrice: BigInt(1000),
        auctionType: new AuctionTypeEnglish({
          duration: 100,
          extensionPeriod: 10,
          minimalBidStep: BigInt(10),
          plannedEndAtBlock: 101, // start + duration
        }),
        startsAtBlock: 1,
        isCanceled: false,
        isCompleted: false,
      })
      await em.save(auction)
      nft.transactionalStatus = new TransactionalStatusAuction({ auction: auction.id })
      await em.save(nft)
      const bids = []
      for (let j = 0; j < 5; ++j) {
        const newBid = new Bid({
          id: `${i}-${j}`,
          createdAt: new Date(),
          auctionId: auction.id,
          nftId: nft.id,
          bidderId: j.toString(),
          amount: BigInt(100 + j * 10),
          createdInBlock: j + 1,
          isCanceled: false,
          indexInBlock: j,
        })
        await em.save(newBid)
        bids.push(newBid)
      }
      auction.bids = bids
      auction.topBidId = bids[4].id
      await em.save(auction)
    }
  }
}

export async function clearDb(): Promise<void> {
  const em = await globalEm
  await auctionTearDown(em)

  await em.getRepository(NotificationEmailDelivery).delete({})
  await em.getRepository(Notification).delete({})
  await em.getRepository(Bid).delete({})
  await em.getRepository(Auction).delete({})
  await em.getRepository(OwnedNft).delete({})
  await em.getRepository(Video).delete({})
  await em.getRepository(Channel).delete({})
  await em.getRepository(Account).delete({})
  await em.getRepository(Membership).delete({})
  await em.getRepository(User).delete({})
}

export const auctionTearDown = async (em: EntityManager) => {
  const auction = await em
    .getRepository(Auction)
    .findOneOrFail({ where: { id: '1' }, relations: { topBid: true, bids: true } })
  auction.topBid = null
  auction.topBidId = null
  auction.bids = []
  await em.save(auction)
}

export class TestBlock implements SubstrateBlock {
  id: string
  height: number
  hash: string
  parentHash: string
  extrinsics: any[]
  events: any[]
  timestamp: number
  specId: string
  extrinsicsRoot: string
  stateRoot: string
  constructor(
    id: string,
    height: number,
    hash: string,
    parentHash: string,
    extrinsics: any[],
    events: any[],
    timestamp: number,
    specId: string,
    extrinsicsRoot: string,
    stateRoot: string
  ) {
    this.id = id
    this.height = height
    this.hash = hash
    this.parentHash = parentHash
    this.extrinsics = extrinsics
    this.events = events
    this.timestamp = timestamp
    this.specId = specId
    this.extrinsicsRoot = extrinsicsRoot
    this.stateRoot = stateRoot
  }
}

export const defaultTestBlock = () =>
  new TestBlock(
    '1-0x1234',
    1,
    '0x1234',
    '0x1234',
    [],
    [],
    Date.now(),
    'test-spec',
    '0x1234',
    '0x1234'
  )
