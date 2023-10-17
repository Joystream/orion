import { ConfigVariable, config } from '../utils/config'
import { EmailDeliveryAttempt, NotificationEmailDelivery } from '../model'
import { EntityManager } from 'typeorm'
import { globalEm } from '../utils/globalEm'
import { uniqueId } from '../utils/crypto'
import { executeMailDelivery } from './utils'

export async function getMaxAttempts(em: EntityManager): Promise<number> {
  const maxAttempts = await config.get(ConfigVariable.EmailNotificationDeliveryMaxAttempts, em)
  return maxAttempts
}

export async function mailsToDeliver(em: EntityManager): Promise<NotificationEmailDelivery[]> {
  const result = await em.getRepository(NotificationEmailDelivery).find({
    where: {
      discard: false,
    },
    relations: {
      notification: { account: true },
      attempts: true,
    },
  })
  return result
}

export async function deliverEmails() {
  const em = await globalEm
  const newEmailDeliveries = await mailsToDeliver(em)
  for (const notificationDelivery of newEmailDeliveries) {
    const toAccount = notificationDelivery.notification.account
    const appName = await config.get(ConfigVariable.AppName, em)
    const content = '' // await createMailContent(em, appName, notification)
    const attempts = notificationDelivery.attempts
    const status = await executeMailDelivery(appName, em, toAccount, content)
    const newAttempt = new EmailDeliveryAttempt({
      id: uniqueId(),
      timestamp: new Date(),
      status,
    })
    attempts.push(newAttempt)
    notificationDelivery.attempts = attempts
    if (status.isTypeOf === 'EmailSuccess') {
      notificationDelivery.discard = true
    } else {
      if (attempts.length >= (await getMaxAttempts(em))) {
        notificationDelivery.discard = true
      }
    }
    await em.save(newAttempt)
  }
  await em.save(newEmailDeliveries)
}
