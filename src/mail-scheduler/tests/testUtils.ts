import { EntityManager } from 'typeorm'
import {
  Membership,
  User,
  Notification,
  Account,
  Unread,
  ChannelCreated,
  MemberRecipient,
  NotificationEmailDelivery,
  FailedDelivery,
  EmailDeliveryStatus,
  SuccessfulDelivery,
} from '../../model'
import { defaultNotificationPreferences } from '../../utils/notification'

export async function populateDbWithSeedData(em: EntityManager) {
  // put contents of ./seedData.json in a variable
  const seedData = require('./seedData.json')
  for (const _member of seedData.memberships) {
    const member = new Membership({
      ..._member,
    })
    await em.save(member)
  }
  for (const _user of seedData.users) {
    const user = new User({
      ..._user,
    })
    await em.save(user)
  }
  for (const _account of seedData.accounts) {
    const account = new Account({
      ..._account,
      notificationPreferences: defaultNotificationPreferences(),
    })
    await em.save(account)
  }
  for (const _notification of seedData.notifications) {
    const notification = new Notification({
      ..._notification,
      status: new Unread({}),
      createdAt: new Date(),
      notificationType: new ChannelCreated({
        channelId: _notification.notificationType.channelId,
        channelTitle: _notification.notificationType.channelTitle,
        recipient: new MemberRecipient({
          memberHandle: _notification.notificationType.recipient.memberHandle,
        }),
      }),
    })
    await em.save(notification)
  }
  for (const _notificationEmailDelivery of seedData.notificationEmailDeliveries) {
    const notificationEmailDelivery = new NotificationEmailDelivery({
      ..._notificationEmailDelivery,
    })
    await em.save(notificationEmailDelivery)
  }
  for (const _emailDeliveryStatus of seedData.emailDeliveryStatuses) {
    const emailDeliveryStatus = new EmailDeliveryStatus({
      ..._emailDeliveryStatus,
    })
    await em.save(emailDeliveryStatus)
  }
  return em
}

export async function clearDb(em: EntityManager): Promise<void> {
  await em.getRepository(SuccessfulDelivery).delete({})
  await em.getRepository(FailedDelivery).delete({})
  await em.getRepository(EmailDeliveryStatus).delete({})
  await em.getRepository(NotificationEmailDelivery).delete({})
  await em.getRepository(Notification).delete({})
  await em.getRepository(Account).delete({})
  await em.getRepository(User).delete({})
  await em.getRepository(Membership).delete({})
}
