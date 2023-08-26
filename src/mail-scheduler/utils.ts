import sgMail from '@sendgrid/mail'
import { ResponseError } from '@sendgrid/mail'
import { EntityManager } from 'typeorm'
import { notificationEmailContent } from '../auth-server/emails'
import { Account, Notification, FailedDelivery, SuccessfulDelivery } from '../model'
import { ConfigVariable, config } from '../utils/config'
import { getMemberHandle, textForNotification, linkForNotification } from '../utils/notification'
import { uniqueId } from '../utils/crypto'
import { ClientResponse } from '@sendgrid/mail'

export async function executeMailDelivery(
  appName: string,
  em: EntityManager,
  toAccount: Account,
  content: string,
  deliveryId: string
): Promise<boolean> {
  const resp = await sendGridSend({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to: toAccount.email,
    subject: `New notification from ${appName}!`,
    content,
  })
  if (resp.success) {
    await processSuccessCase(em, deliveryId)
  } else {
    await processFailureCase(em, deliveryId, resp)
  }
  return resp.success
}

async function processSuccessCase(em: EntityManager, deliveryId: string) {
  const success = new SuccessfulDelivery({
    id: uniqueId(),
    timestamp: new Date(),
    deliveryId,
  })
  await em.save(success)
}

function getErrorCode(error: ResponseError | Error): string {
  return (error as ResponseError).code?.toString() || ''
}

async function processFailureCase(
  em: EntityManager,
  deliveryId: string,
  { type: error }: SendGridResponseFailure
) {
  const errorCode = getErrorCode(error)
  const errorStatus = errorCode + ' : ' + error.message
  const failure = new FailedDelivery({
    id: uniqueId(),
    deliveryId,
    timestamp: new Date(),
    errorStatus,
  })
  await em.save(failure)
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

type SendMailArgs = {
  from: string
  to: string
  subject: string
  content: string
}

type SendGridResponseSuccess = {
  type: ClientResponse
  success: true
}
type SendGridResponseFailure = {
  type: ResponseError | Error
  success: false
}
type SendGridResponse = SendGridResponseSuccess | SendGridResponseFailure

export async function sendGridSend({
  from,
  to,
  subject,
  content,
}: SendMailArgs): Promise<SendGridResponse> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (apiKey) {
    sgMail.setApiKey(apiKey)
  }

  try {
    const sendGridSuccess = await new Promise<SendGridResponseSuccess>((resolve, reject) => {
      sgMail.send(
        {
          from,
          to,
          subject,
          html: content,
        },
        undefined,
        (error, result) => {
          if (error) {
            reject({
              type: error,
              success: false,
            })
          } else {
            const [type] = result
            resolve({
              type,
              success: true,
            })
          }
        }
      )
    })
    return sendGridSuccess
  } catch (sendGrideFailure) {
    return sendGrideFailure as SendGridResponseFailure
  }
}
