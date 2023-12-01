import { globalEm } from '../utils/globalEm'
import { EntityManager, LessThanOrEqual } from 'typeorm'
import { FutureNotificationOrionEvent } from '../model'
import {
  checkFutureNotificationViability,
  createNotificationsForGivenType,
  getCurrentBlockHeight,
} from './utils'

async function getFutureNotifications(em: EntityManager) {
  const { lastProcessedBlock } = await getCurrentBlockHeight(em)
  if (lastProcessedBlock < 0) {
    return []
  }
  const dueFutureNotifications = await em.getRepository(FutureNotificationOrionEvent).find({
    where: {
      executionBlock: LessThanOrEqual(lastProcessedBlock),
    },
  })

  const viableNotifications = []

  for (const notification of dueFutureNotifications) {
    const isViable = await checkFutureNotificationViability(em, notification, lastProcessedBlock)
    if (!isViable) {
      // this means that notification is past its schedule, but doesn't meet some requirements to be dispatched
      await em.remove(notification)
    } else {
      viableNotifications.push(notification)
    }
  }

  return viableNotifications
}

export async function createScheduledNotifications() {
  const em = await globalEm
  const futureNotificationsEvents = await getFutureNotifications(em)

  for (const notification of futureNotificationsEvents) {
    await createNotificationsForGivenType(em, notification)
    await em.remove(notification)
  }
}

export async function main() {
  await createScheduledNotifications()
}

main()
  .then(() => {
    console.log('Future notifications job finished')
  })
  .catch((err) => {
    console.error('Future notifications job failed', err)
  })
