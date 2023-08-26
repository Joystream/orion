import { EntityManager } from 'typeorm'
import { notificationEmailContent } from '../auth-server/emails'
import {
  Account,
  DeliveryStatus,
  EmailDeliveryStatus,
  FailureReport,
  Notification,
  SuccessDelivery,
  FailedDelivery,
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
  content: string,
  deliveryId: string
): Promise<SuccessDelivery | FailedDelivery> {
  try {
    await sgSendMail({
      from: await config.get(ConfigVariable.SendgridFromEmail, em),
      to: toAccount.email,
      subject: `New notification from ${appName}!`,
      content,
    })
    return await processSuccessCase(em, deliveryId)
  } catch (e) {
    return await processFailureCase(em, deliveryId)
  }
}

async function processSuccessCase(em: EntityManager, deliveryId: string): Promise<SuccessDelivery> {
  const successReport = new SuccessReport({
    id: uniqueId(),
    timestamp: new Date(),
  })
  const success = new SuccessDelivery({
    id: deliveryId + '-' + successReport.id,
    successReportId: successReport.id,
    deliveryId,
  })
  await em.save([successReport, success])
  return success
}

async function processFailureCase(em: EntityManager, deliveryId: string): Promise<FailedDelivery> {
  const failureReport = new FailureReport({
    id: uniqueId(),
    timestamp: new Date(),
    errorCode: 'test',
  })
  const failure = new FailedDelivery({
    id: deliveryId + '-' + failureReport.id,
    failureReportId: failureReport.id,
    deliveryId,
  })
  await em.save([failureReport, failure])
  return failure
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
