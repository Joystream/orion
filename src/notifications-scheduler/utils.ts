import { EntityManager } from 'typeorm'
import { FutureNotificationOrionEvent, RevenueShare } from '../model'
import { notifyTokenHolders } from '../mappings/token/utils'
import { isObject } from 'lodash'
import { has } from '../utils/misc'

export async function createNotificationsForGivenType(
  em: EntityManager,
  notification: FutureNotificationOrionEvent
) {
  switch (notification.notificationType.isTypeOf) {
    case 'CreatorTokenRevenueShareStarted': {
      await notifyTokenHolders(
        em,
        notification.notificationType.tokenId,
        notification.notificationType,
        notification.event ?? undefined
      )
      break
    }
    case 'CreatorTokenRevenueShareEnded': {
      await notifyTokenHolders(
        em,
        notification.notificationType.tokenId,
        notification.notificationType,
        notification.event ?? undefined
      )
      break
    }
  }
}

export async function getCurrentBlockHeight(em: EntityManager) {
  const dbResult: unknown = await em.query('SELECT "height" FROM "squid_processor"."status"')
  return {
    lastProcessedBlock:
      Array.isArray(dbResult) &&
      isObject(dbResult[0]) &&
      has(dbResult[0], 'height') &&
      typeof dbResult[0].height === 'number'
        ? dbResult[0].height
        : -1,
  }
}

export async function checkFutureNotificationViability(
  em: EntityManager,
  notification: FutureNotificationOrionEvent,
  currentBlockHeight: number
): Promise<boolean> {
  switch (notification.notificationType.isTypeOf) {
    case 'CreatorTokenRevenueShareStarted': {
      const revenueShare = await em.getRepository(RevenueShare).findOne({
        where: {
          id: notification.notificationType.revenueShareId,
        },
      })
      return !(
        !revenueShare ||
        revenueShare.finalized ||
        revenueShare.startingAt > currentBlockHeight
      )
    }
    case 'CreatorTokenRevenueShareEnded': {
      const revenueShare = await em.getRepository(RevenueShare).findOne({
        where: {
          id: notification.notificationType.revenueShareId,
        },
      })
      return !(!revenueShare || revenueShare.endsAt > currentBlockHeight)
    }
    default:
      // maybe it's better to throw here, so we don't gather events that will never be dispatched ???
      return false
  }
}
