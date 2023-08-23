import { sgSendMail } from '../mail'
import { ConfigVariable, config } from '../config'
import { EntityManager } from 'typeorm'
import {
  Account,
  EmailDeliveryStatus,
  Notification,
  NextEntityId,
  NotificationEmailDelivery,
} from '../../model'
import { getNextIdForEntity } from '../nextEntityId'
import { notificationEmailContent } from '../../auth-server/emails'
import { linkForNotification } from './notificationLinks'
import { getMemberHandle, textForNotification } from './notificationTexts'
import { Flat } from 'lodash'
import { EntityManagerOverlay } from '../overlay'

// mail notification are immediately deposited into orion_db
// FIXME: there could be a problem if the processor crashes and the overlay doesn't flush and also this can decrease performance
export async function deliverNotificationViaEmail(
  em: EntityManager,
  toAccount: Account,
  notification: Flat<Notification>
): Promise<void> {
  const nextEntityId = await getNextIdForEntity(em, 'OffChainNotificationEmailDelivery')
  const notificationDelivery = new NotificationEmailDelivery({
    id: nextEntityId.toString(),
    notificationId: notification.id,
    deliveryStatus: EmailDeliveryStatus.Unsent,
  })

  const appName = await config.get(ConfigVariable.AppName, em)
  const content = await createMailContent(em, toAccount, appName, notification)
  notificationDelivery.deliveryStatus = await executeMailDelivery(appName, em, toAccount, content)
  await em.save([
    new NextEntityId({
      entityName: 'OffChainNotificationEmailDelivery',
      nextId: nextEntityId + 1,
    }),
    notificationDelivery,
  ])
}

async function executeMailDelivery(
  appName: string,
  em: EntityManager,
  toAccount: Account,
  content: string
): Promise<EmailDeliveryStatus> {
  const resp = await sgSendMail({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to: toAccount.email,
    subject: `New notification from ${appName}!`,
    content,
  })
  if (resp?.statusCode === 202 || resp?.statusCode === 200) {
    return EmailDeliveryStatus.Success
  }
  return EmailDeliveryStatus.Failure
}

async function createMailContent(
  em: EntityManager,
  toAccount: Account,
  appName: string,
  notification: Notification
): Promise<string> {
  const handle = await getMemberHandle(em, toAccount.membershipId)
  const preferencePageLink = `https://${await config.get(
    ConfigVariable.AppRootDomain,
    em
  )}/member/${handle}/?tab=preferences`
  const content = notificationEmailContent({
    notificationText: await textForNotification(notification.notificationType),
    notificationLink: await linkForNotification(em, notification.notificationType), // em used only for fetching root domain from orion_db
    preferencePageLink,
    appName,
  })
  return content
}
