import { EntityManager } from 'typeorm'
import { Account, DeliveryStatus, EmailFailure, EmailSuccess } from '../model'
import { ConfigVariable, config } from '../utils/config'
import sgMail, { ClientResponse, ResponseError } from '@sendgrid/mail'

export const DEFAULT_STATUS_CODE = 'Undefined error code'

export async function executeMailDelivery(
  appName: string,
  em: EntityManager,
  toAccount: Account,
  content: string
): Promise<DeliveryStatus> {
  const resp = await sendGridSend({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to: toAccount.email,
    subject: `New notification from ${appName}!`,
    content,
  })
  const className = Object.prototype.toString.call(resp)
  if (className === '[object Error]') {
    return new EmailFailure({
      errorStatus: (resp as ResponseError).code?.toString() || DEFAULT_STATUS_CODE,
    })
  } else {
    return new EmailSuccess({})
  }
}

// export async function createMailContent(
//   em: EntityManager,
//   toAccount: Account,
//   appName: string,
//   notification: Notification
// ): Promise<string> {
//   const handle = await getMemberHandle(em, toAccount.membershipId)
//   const preferencePageLink = `https://${await config.get(
//     ConfigVariable.AppRootDomain,
//     em
//   )}/member/${handle}/?tab=preferences`
//   const content = notificationEmailContent({
//     notificationText: await textForNotification(notification.notificationType),
//     notificationLink: await linkForNotification(em, notification.notificationType), // em used only for fetching root domain from orion_db
//     preferencePageLink,
//     appName,
//   })
//   return content
// }

type SendMailArgs = {
  from: string
  to: string
  subject: string
  content: string
}

type SendGridResponse = ClientResponse | ResponseError | Error

export async function sendGridSend({
  from,
  to,
  subject,
  content,
}: SendMailArgs): Promise<SendGridResponse> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (process.env.TESTING === 'true' || process.env.TESTING === '1') {
    return mockSend(to)
  }
  if (apiKey) {
    sgMail.setApiKey(apiKey)
  }

  try {
    const [sendGridSuccess] = await sgMail.send({
      from,
      to,
      subject,
      html: content,
    })
    return sendGridSuccess
  } catch (sendGrideFailure) {
    return sendGrideFailure as SendGridResponse
  }
}

const mockSend = (to: string): SendGridResponse => {
  if (to.match(/incorrect/gi)) {
    return new Error('Test error')
  } else {
    return {
      statusCode: 202,
      headers: {},
      body: {},
    }
  }
}
