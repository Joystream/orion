import { EntityManager } from 'typeorm'
import {
  Account,
  Channel,
  DeliveryStatus,
  EmailFailure,
  EmailSuccess,
  Membership,
  Notification,
} from '../model'
import { ConfigVariable, config } from '../utils/config'
import sgMail, { ClientResponse, ResponseError } from '@sendgrid/mail'
import { getNotificationData } from '../utils/notification/notificationsData'
import { notificationEmailContent, NotificationEmailTemplateData } from '../auth-server/emails'

export const DEFAULT_STATUS_CODE = 'Undefined error code'

export async function executeMailDelivery(
  appName: string,
  em: EntityManager,
  toAccount: Account,
  subject: string,
  content: string
): Promise<DeliveryStatus> {
  const resp = await sendGridSend({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to: toAccount.email,
    subject: subject || `New notification from ${appName}`,
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

export async function createMailContent(
  em: EntityManager,
  appName: string,
  notification: Notification
): Promise<{
  content: string
  subject: string
}> {
  const appRoot = `https://${await config.get(ConfigVariable.AppRootDomain, em)}`

  const appKey = notification.recipient.isTypeOf === 'MemberRecipient' ? 'viewer' : 'studio'
  const notificationLink =
    appKey === 'viewer'
      ? `${appRoot}/notifications/member`
      : `${appRoot}/studio/notifications/channel`
  const unsubscribeLink =
    appKey === 'viewer'
      ? `${appRoot}/member/settings?tab=Notifications`
      : `${appRoot}/studio/channel?tab=Notifications`
  const name = appKey === 'viewer' ? appName : 'Studio'

  const appAssetStorage = await config.get(ConfigVariable.AppAssetStorage, em)
  const logosAssetsRoot = `${appAssetStorage}/logos/${appName.toLowerCase()}`
  const appNameAlt = await config.get(ConfigVariable.AppNameAlt, em)

  const notificationData = await getNotificationData(em, notification)

  const content = notificationEmailContent({
    ...(await getMessage(em, notification)),
    app: {
      name,
      nameAlt: appNameAlt,
      logo: `${logosAssetsRoot}/header-${appKey}.png`,
      logoAlt: `${logosAssetsRoot}/footer.png`,
      homeLink: appRoot,
      notificationLink,
      unsubscribeLink,
    },
    notification: notificationData,
  })
  return {
    content,
    subject: notificationData.subject,
  }
}

async function getMessage(
  em: EntityManager,
  { recipient }: Notification
): Promise<Pick<NotificationEmailTemplateData, 'title' | 'subTitle'>> {
  switch (recipient.isTypeOf) {
    case 'MemberRecipient': {
      const member = await em.getRepository(Membership).findOneBy({ id: recipient.membership })
      return {
        title: `Hi ${member?.handle ?? ''}`,
        subTitle: 'You have a new notification:',
      }
    }
    case 'ChannelRecipient': {
      const channel = await em.getRepository(Channel).findOneBy({ id: recipient.channel })
      return {
        title: `Your channel “${channel?.title}”,`,
        subTitle: 'Has a new notification:',
      }
    }
  }
}

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
