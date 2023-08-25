import { EntityManager } from 'typeorm'
import { notificationEmailContent } from '../auth-server/emails'
import {
  Account,
  DeliveryStatus,
  EmailDeliveryStatus,
  Notification,
  SuccessDelivery,
  SuccessReport,
} from '../model'
import { ConfigVariable, config } from '../utils/config'
import { sgSendMail } from '../utils/mail'
import { getMemberHandle, textForNotification, linkForNotification } from '../utils/notification'
import { uniqueId } from '../utils/crypto'

export async function executeMailDelivery(
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
    return processSuccessCase()
  }
  return processFailureCase()
}

function processSuccessCase(): EmailDeliveryStatus {
  return new EmailDeliveryStatus({})
}
function processFailureCase(): EmailDeliveryStatus {
  return new EmailDeliveryStatus({})
}

export async function createMailContent(
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
