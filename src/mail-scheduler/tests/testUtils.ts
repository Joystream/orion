import {
  Membership,
  User,
  Notification,
  Account,
  Unread,
  MemberRecipient,
  NotificationEmailDelivery,
  GatewayConfig,
  AuctionWon,
  EmailDeliveryAttempt,
  AuctionTypeOpen,
} from '../../model'
import { defaultNotificationPreferences } from '../../utils/notification'
import { globalEm } from '../../utils/globalEm'
import { idStringFromNumber } from '../../utils/misc'
import { RUNTIME_NOTIFICATION_ID_TAG } from '../../utils/notification/helpers'
import { uniqueId } from '../../utils/crypto'

export const NUM_ENTITIES = 3

export async function populateDbWithSeedData() {
  const em = await globalEm
  for (let i = 0; i < NUM_ENTITIES; i++) {
    // create memberships
    const member: Membership = await em.getRepository(Membership).save({
      id: i.toString(),
      createdAt: new Date(),
      metadata: {
        id: `metadat-id-${i}`,
      },
      bannedFromChannels: [],
      totalChannelsCreated: 0,
      handle: `handle-${i}`,
      handleRaw: '0x' + Buffer.from(`handle-${i}`).toString('hex'),
      controllerAccount: `j4${i}7rVcUCxi2crhhjRq46fNDRbVHTjJrz6bKxZwehEMQxZeSf`,
      channels: [],
    })
    // create users
    const user = await em.getRepository(User).save({
      isRoot: false,
      id: i.toString(),
    })
    // create accounts
    const account = await em.getRepository(Account).save({
      id: idStringFromNumber(i),
      userId: user.id,
      email: `incorrect${i}@example.com`,
      isEmailConfirmed: false,
      isBlocked: false,
      registeredAt: member.createdAt,
      membershipId: member.id,
      joystreamAccount: member.controllerAccount,
      notificationPreferences: defaultNotificationPreferences(),
    })
    // create notifications
    const notification = await em.getRepository(Notification).save({
      id: RUNTIME_NOTIFICATION_ID_TAG + '-' + i.toString(),
      accountId: account.id,
      status: new Unread(),
      createdAt: new Date(),
      recipient: new MemberRecipient({ membership: member.id }),
      notificationType: new AuctionWon({
        type: new AuctionTypeOpen({ bidLockDuration: 10 }),
        videoId: uniqueId(),
        videoTitle: 'test',
      }),
      inApp: true,
    })

    await em.getRepository(NotificationEmailDelivery).save({
      id: uniqueId(),
      notificationId: notification.id,
      attempts: [],
      discard: false,
    })
  }
}

export async function clearDb(): Promise<void> {
  const em = await globalEm
  await em.getRepository(EmailDeliveryAttempt).delete({})
  await em.getRepository(NotificationEmailDelivery).delete({})
  await em.getRepository(Notification).delete({})
  await em.getRepository(Account).delete({})
  await em.getRepository(User).delete({})
  await em.getRepository(Membership).delete({})
  await em.getRepository(GatewayConfig).delete({})
}
