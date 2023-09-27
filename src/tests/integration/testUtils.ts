import { EntityManager } from 'typeorm'
import {
  User,
  Account,
  Membership,
  Video,
  Channel,
  YppUnverified,
  Notification,
  NotificationEmailDelivery,
  OwnedNft,
  NftOwnerChannel,
  TransactionalStatusIdle,
} from '../../model'
import { defaultNotificationPreferences } from '../../utils/notification'
import { globalEm } from '../../utils/globalEm'

// TODO: refactor this using the Builder pattern
export async function populateDbWithSeedData() {
  const em = await globalEm
  for (let i = 0; i < 10; i++) {
    const member = new Membership({
      createdAt: new Date(),
      id: i.toString(),
      controllerAccount: `controller-account-${i}`,
      handle: `handle-${i}`,
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
      yppStatus: new YppUnverified(),
    })
    const video = new Video({
      id: i.toString(),
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
  }
}

export async function clearDb(): Promise<void> {
  const em = await globalEm
  await em.getRepository(NotificationEmailDelivery).delete({})
  await em.getRepository(Notification).delete({})
  await em.getRepository(OwnedNft).delete({})
  await em.getRepository(Video).delete({})
  await em.getRepository(Channel).delete({})
  await em.getRepository(Account).delete({})
  await em.getRepository(Membership).delete({})
  await em.getRepository(User).delete({})
}
