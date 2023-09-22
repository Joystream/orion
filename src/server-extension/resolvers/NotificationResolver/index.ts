import 'reflect-metadata'
import { Resolver, Mutation, UseMiddleware, Ctx, Args, Arg } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { Context } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import { Notification, NotificationPreference, Read } from '../../../model'
import {
  AccountNotificationPreferencesInput,
  AccountNotificationPreferencesOutput,
  MarkNotificationsAsReadResult,
  NotificationArgs,
  NotificationPreferenceGQL,
  toOutputGQL,
} from './types'

@Resolver()
export class NotificationResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @Mutation(() => MarkNotificationsAsReadResult)
  @UseMiddleware(AccountOnly)
  async markNotificationsAsRead(
    @Args() { notificationIds }: NotificationArgs,
    @Ctx() ctx: Context
  ): Promise<MarkNotificationsAsReadResult> {
    const em = await this.em()
    return withHiddenEntities(em, async () => {
      const notificationsReadIds: string[] = []
      for (const notificationId of notificationIds.filter((id) => id)) {
        const notification = await em.getRepository(Notification).findOneBy({ id: notificationId })
        if (notification?.accountId) {
          if (notification.accountId !== ctx.accountId) {
            throw new Error('This notification cannot be read from this account')
          } else {
            if (notification.status.isTypeOf === 'Unread')
              notification.status = new Read({ readAt: new Date() })
            await em.save(notification)
            notificationsReadIds.push(notification.id)
          }
        }
      }
      return { notificationsReadIds }
    })
  }

  @Mutation(() => AccountNotificationPreferencesOutput)
  @UseMiddleware(AccountOnly)
  async setAccountNotificationPreferences(
    @Arg('notificationPreferences') newPreferences: AccountNotificationPreferencesInput,
    @Ctx() ctx: Context
  ): Promise<AccountNotificationPreferencesOutput> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      if (!ctx.account) {
        // account not null because of the UseMiddleware(AccountOnly) decorator
        throw new Error('Account not specified')
      }
      const account = ctx.account

      maybeUpdateNotificationPreference(
        newPreferences.channelExcludedFromApp,
        account.notificationPreferences.channelExcludedFromApp
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoExcludedFromApp,
        account.notificationPreferences.videoExcludedFromApp
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoFeaturedAsHero,
        account.notificationPreferences.videoFeaturedAsHero
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoFeaturedOnCategoryPage,
        account.notificationPreferences.videoFeaturedOnCategoryPage
      )
      maybeUpdateNotificationPreference(
        newPreferences.nftFeaturedOnMarketPlace,
        account.notificationPreferences.nftFeaturedOnMarketPlace
      )
      maybeUpdateNotificationPreference(
        newPreferences.newChannelFollower,
        account.notificationPreferences.newChannelFollower
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoCommentCreated,
        account.notificationPreferences.videoCommentCreated
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoLiked,
        account.notificationPreferences.videoLiked
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoDisliked,
        account.notificationPreferences.videoDisliked
      )
      maybeUpdateNotificationPreference(
        newPreferences.yppChannelSuspended,
        account.notificationPreferences.yppChannelSuspended
      )
      maybeUpdateNotificationPreference(
        newPreferences.yppChannelVerified,
        account.notificationPreferences.yppChannelVerified
      )
      maybeUpdateNotificationPreference(
        newPreferences.nftBought,
        account.notificationPreferences.nftBought
      )
      maybeUpdateNotificationPreference(
        newPreferences.bidMadeOnNft,
        account.notificationPreferences.bidMadeOnNft
      )
      maybeUpdateNotificationPreference(
        newPreferences.royaltyReceived,
        account.notificationPreferences.royaltyReceived
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelPaymentReceived,
        account.notificationPreferences.channelPaymentReceived
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelReceivedFundsFromWg,
        account.notificationPreferences.channelReceivedFundsFromWg
      )
      maybeUpdateNotificationPreference(
        newPreferences.newPayoutUpdatedByCouncil,
        account.notificationPreferences.newPayoutUpdatedByCouncil
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelFundsWithdrawn,
        account.notificationPreferences.channelFundsWithdrawn
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelCreated,
        account.notificationPreferences.channelCreated
      )
      maybeUpdateNotificationPreference(
        newPreferences.replyToComment,
        account.notificationPreferences.replyToComment
      )
      maybeUpdateNotificationPreference(
        newPreferences.reactionToComment,
        account.notificationPreferences.reactionToComment
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoPosted,
        account.notificationPreferences.videoPosted
      )
      maybeUpdateNotificationPreference(
        newPreferences.newNftOnAuction,
        account.notificationPreferences.newNftOnAuction
      )
      maybeUpdateNotificationPreference(
        newPreferences.newNftOnSale,
        account.notificationPreferences.newNftOnSale
      )
      maybeUpdateNotificationPreference(
        newPreferences.higherBidThanYoursMade,
        account.notificationPreferences.higherBidThanYoursMade
      )
      maybeUpdateNotificationPreference(
        newPreferences.auctionExpired,
        account.notificationPreferences.timedAuctionExpired
      )
      maybeUpdateNotificationPreference(
        newPreferences.auctionWon,
        account.notificationPreferences.auctionWon
      )
      maybeUpdateNotificationPreference(
        newPreferences.auctionLost,
        account.notificationPreferences.auctionLost
      )
      maybeUpdateNotificationPreference(
        newPreferences.openAuctionBidCanBeWithdrawn,
        account.notificationPreferences.openAuctionBidCanBeWithdrawn
      )
      maybeUpdateNotificationPreference(
        newPreferences.fundsFromCouncilReceived,
        account.notificationPreferences.fundsFromCouncilReceived
      )
      maybeUpdateNotificationPreference(
        newPreferences.fundsToExternalWalletSent,
        account.notificationPreferences.fundsToExternalWalletSent
      )
      maybeUpdateNotificationPreference(
        newPreferences.fundsFromWgReceived,
        account.notificationPreferences.fundsFromWgReceived
      )
      await em.save(account)

      return toOutputGQL(account.notificationPreferences)
    })
  }

  @Query(() => NotificationsResult)
  @UseMiddleware(AccountOnly)
  async getInAppNotifications(
    @Ctx() ctx: Context,
    @Arg('channelId', { nullable: true }) channelId?: string
  ): Promise<NotificationsResult> {
    const em = await this.em()
    if (!ctx.account) {
      throw new Error('Account not specified')
    }
    const account = assertNotNull(ctx.account)
    const isCreator = channelId ? true : false

    return withHiddenEntities(em, async () => {
      let whereCond = `
        WHERE "n"."accountId" = "${account.id} AND "n"."status" = "Unread"
      `
      if (isCreator) {
        whereCond + ` AND "channel"."id" = "${channelId}"`
      }

      const extraJoin = isCreator
        ? `
        LEFT JOIN "creator_notification" as cr ON "r"."id" = "cr"."recipient_id"
        LEFT JOIN "channel" ON "cr"."channel_id" = "channel"."id"
      `
        : `
        LEFT JOIN "member_notification" as mn ON "r"."id" = "mn"."recipient_id"
        LEFT JOIN "membership" ON "mn"."membership_id" = "membership"."id"
      `

      let selection = `
        SELECT "n".*
      `
      if (isCreator) {
        selection += `, "channel"."id" as "channel_id"`
      } else {
        selection += `, "membership"."handle" as "member_handle"`
      }

      const queryResult = await em.query(
        `
        ${selection}
        FROM "notification_in_app_delivery" as nd
        LEFT JOIN "notification" as n ON "nd"."notification_id" = "n"."id"
        LEFT JOIN "recipient" as r ON "n"."recipient_id" = "r"."id"
        ${extraJoin}
        ${whereCond}
        `
      )

      return queryResult.map((result: any) => {
        return {
          notificationId: result.id,
          accountId: result.accountId,
          createdAt: result.createdAt,
          recipient: result.recipient,
        }
      })
    })
  }
}

// Helper function to update notification preferences
function maybeUpdateNotificationPreference(
  newPreference: NotificationPreferenceGQL,
  accountPreference: NotificationPreference
) {
  if (newPreference?.emailEnabled !== undefined || null) {
    accountPreference.emailEnabled = newPreference.emailEnabled
  }
  if (newPreference?.inAppEnabled !== undefined || null) {
    accountPreference.inAppEnabled = newPreference.inAppEnabled
  }
}
