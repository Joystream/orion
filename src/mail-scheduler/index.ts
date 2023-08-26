import { ConfigVariable, config } from '../utils/config'
import schedule from 'node-schedule'
import { globalEm } from '../utils/globalEm'
import { DeliveryStatus, EmailDeliveryStatus, FailedDelivery } from '../model'
import { EntityManager, Equal } from 'typeorm'
import { createMailContent, executeMailDelivery } from './utils'
import { assert } from 'console'

export async function getMaxAttempts(em: EntityManager): Promise<number> {
  // TODO: replace with value in GatewayConfig
  return Promise.resolve(5)
}

export async function getFailedDeliveries(
  em: EntityManager,
  deliveryId: string
): Promise<FailedDelivery[]> {
  return await em.getRepository(FailedDelivery).findBy({ deliveryId })
}

export async function findDeliveriesByStatus(
  em: EntityManager,
  status: DeliveryStatus
): Promise<EmailDeliveryStatus[]> {
  const result = await em.getRepository(EmailDeliveryStatus).find({
    where: {
      deliveryStatus: Equal(status),
    },
    relations: {
      notificationDelivery: {
        notification: { account: true },
      },
    },
  })
  return result
}

// Function to send new data
export async function sendNew() {
  const em = await globalEm
  const newEmailDeliveries = await findDeliveriesByStatus(em, DeliveryStatus.UNSENT)
  for (const notificationDelivery of newEmailDeliveries) {
    const toAccount = notificationDelivery.notificationDelivery.notification.account
    const notification = notificationDelivery.notificationDelivery.notification
    const appName = await config.get(ConfigVariable.AppName, em)
    const content = await createMailContent(em, toAccount, appName, notification)
    const wasSuccessful = await executeMailDelivery(
      appName,
      em,
      toAccount,
      content,
      notificationDelivery.id
    )
    if (wasSuccessful) {
      notificationDelivery.deliveryStatus = DeliveryStatus.SUCCESS
    } else {
      notificationDelivery.deliveryStatus = DeliveryStatus.FAILURE
    }
  }
  await em.save(newEmailDeliveries)
}

// Function to send failed data
export async function sendFailed() {
  const em = await globalEm
  const failedEmailDeliveries = await findDeliveriesByStatus(em, DeliveryStatus.FAILURE)
  const maxAttempts = await getMaxAttempts(em)
  if (maxAttempts === 0) {
    throw Error('maxAttempts cannot be 0')
  }

  for (const notificationDelivery of failedEmailDeliveries) {
    const toAccount = notificationDelivery.notificationDelivery.notification.account
    const notification = notificationDelivery.notificationDelivery.notification
    const appName = await config.get(ConfigVariable.AppName, em)
    const content = await createMailContent(em, toAccount, appName, notification)
    const wasSuccessful = await executeMailDelivery(
      appName,
      em,
      toAccount,
      content,
      notificationDelivery.id
    )
    if (wasSuccessful) {
      notificationDelivery.deliveryStatus = DeliveryStatus.SUCCESS
    } else {
      const failedDeliveries = await getFailedDeliveries(em, notificationDelivery.id)
      if (failedDeliveries.length === maxAttempts) {
        notificationDelivery.deliveryStatus = DeliveryStatus.DISCARD
      } else {
        notificationDelivery.deliveryStatus = DeliveryStatus.FAILURE
      }
    }

    await em.save(notificationDelivery)
  }
}

// Schedule the tasks
// schedule.scheduleJob('0 12 * * *', sendNew) // Everyday at 12:00 PM
// schedule.scheduleJob('0 0,12 * * *', sendFailed) // Everyday at 12:00 AM and 12:00 PM
