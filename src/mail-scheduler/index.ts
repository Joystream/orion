import { EntityManager, IsNull, LessThanOrEqual } from 'typeorm'
import { EmailDeliveryAttempt, EmailFailure, NotificationEmailDelivery } from '../model'
import { getCurrentBlockHeight } from '../utils/blockHeight'
import { ConfigVariable, config } from '../utils/config'
import { uniqueId } from '../utils/crypto'
import { globalEm } from '../utils/globalEm'
import { createMailContent, executeMailDelivery } from './utils'
import { updateJoystreamPrice } from '../utils/joystreamPrice'

export async function getMaxAttempts(em: EntityManager): Promise<number> {
  const maxAttempts = await config.get(ConfigVariable.EmailNotificationDeliveryMaxAttempts, em)
  return maxAttempts
}

export async function mailsToDeliver(em: EntityManager): Promise<NotificationEmailDelivery[]> {
  const { lastProcessedBlock } = await getCurrentBlockHeight(em)
  const result = await em.getRepository(NotificationEmailDelivery).find({
    where: {
      discard: false,
      notification: [
        { dispatchBlock: IsNull() },
        { dispatchBlock: LessThanOrEqual(lastProcessedBlock) },
      ],
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
  await updateJoystreamPrice()
  const newEmailDeliveries = await mailsToDeliver(em)
  const maxAttempts = await getMaxAttempts(em)
  const appName = await config.get(ConfigVariable.AppName, em)
  for (const notificationDelivery of newEmailDeliveries) {
    const toAccount = notificationDelivery.notification.account
    let content
    let subject
    if (process.env.TESTING !== 'true' && process.env.TESTING !== '1') {
      const result = await createMailContent(em, appName, notificationDelivery.notification)
      content = result?.content
      subject = result?.subject
    }
    const attempts = notificationDelivery.attempts
    const status =
      content && subject
        ? await executeMailDelivery(appName, em, toAccount, subject, content)
        : new EmailFailure({
            errorStatus: 'Failure in Creating mail content',
          })

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
      if (attempts.length >= maxAttempts) {
        notificationDelivery.discard = true
      }
    }
    await em.save(newAttempt)
  }
  await em.save(newEmailDeliveries)
}

export async function main() {
  await deliverEmails()
}

main()
  .then(() => {
    console.log('Email delivery finished')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Email delivery failed', err)
    process.exit(1)
  })
