import 'reflect-metadata'
import { Resolver, Mutation, UseMiddleware, Ctx, Args } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { Context } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import { Account, OffChainNotification, RuntimeNotification } from '../../../model'
import { NotificationArgs, SetNotificationPreferencesArgs, SetNotificationPreferencesReturn } from './types'

@Resolver()
export class NotificationResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) { }

  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async markNotificationsAsRead(
    @Args() { notificationIds }: NotificationArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean[]> {
    const em = await this.em()
    const results: Boolean[] = []
    return withHiddenEntities(em, async () => {
      for (const notificationId of notificationIds) {
        let notification: RuntimeNotification | OffChainNotification | null = null

        notification = await em.findOne(RuntimeNotification, {
          where: { id: notificationId },
        })
        if (notification === null) {
          notification = await em.findOne(OffChainNotification, {
            where: { id: notificationId },
          })
        }
        if (notification !== null) {
          if (notification.account.id === ctx.accountId) {
            if (!notification.inAppRead) {
              notification.inAppRead = true
              await em.save(notification)
              results.push(true)
            }
          }
          results.push(false)
        }
      }
      return results
    })
  }

  // HACK: (not.v1) this is a temporary solution, refactor needed
  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async setAccountNotificationPreferences(
    @Args() newNotificationPreferences: SetNotificationPreferencesArgs,
    @Ctx() ctx: Context
  ): Promise<SetNotificationPreferencesReturn> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const account = ctx.account
      if (!account) {
        throw new Error('Account not found')
      }
      if (account.notificationPreferences !== newNotificationPreferences.newPreferences) {
        account.notificationPreferences = newNotificationPreferences.newPreferences
        await em.save(account)
      }

      return newNotificationPreferences
    })
  }
}
