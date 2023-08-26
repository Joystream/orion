import { ConfigVariable, config } from '../utils/config'
import schedule from 'node-schedule'
import { globalEm } from '../utils/globalEm'
import {
  DeliveryStatus,
  EmailDeliveryStatus,
  FailedDelivery,
  NotificationEmailDelivery,
  SuccessDelivery,
} from '../model'
import { EntityManager, Equal, FindOptionsWhere } from 'typeorm'
import { createMailContent, executeMailDelivery } from './utils'

export async function findDeliveriesByStatus(
  em: EntityManager,
  status: DeliveryStatus
): Promise<EmailDeliveryStatus[]> {
  const result = await em.getRepository(EmailDeliveryStatus).find({
    where: {
      deliveryStatus: Equal(status),
    },
    relations: {
      notificationDelivery: { notification: { account: true } },
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
    const successOrFailure = await executeMailDelivery(
      appName,
      em,
      toAccount,
      content,
      notificationDelivery.id
    )
    if (successOrFailure instanceof SuccessDelivery) {
      notificationDelivery.deliveryStatus = DeliveryStatus.SUCCESS
    }
    if (successOrFailure instanceof FailedDelivery) {
      notificationDelivery.deliveryStatus = DeliveryStatus.FAILURE
    }
  }
  await em.save(newEmailDeliveries)
}

// Function to send failed data
export async function sendFailed() {
  // Implement your logic here
}

// Schedule the tasks
schedule.scheduleJob('0 12 * * *', sendNew) // Everyday at 12:00 PM
schedule.scheduleJob('0 0,12 * * *', sendFailed) // Everyday at 12:00 AM and 12:00 PM
