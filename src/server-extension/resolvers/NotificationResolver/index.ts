import 'reflect-metadata'
import { Resolver, Mutation, UseMiddleware, Ctx, Args, Arg } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { Context } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import { Account, Notification, NotificationPreference, Read } from '../../../model'
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

  // HACK: (not.v1) this is a temporary solution, refactor needed
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
        newPreferences.channelExcludedFromAppNotificationEnabled,
        account.notificationPreferences.channelExcludedFromAppNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoExcludedFromAppNotificationEnabled,
        account.notificationPreferences.videoExcludedFromAppNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoFeaturedAsHeroNotificationEnabled,
        account.notificationPreferences.videoFeaturedAsHeroNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoFeaturedOnCategoryPageNotificationEnabled,
        account.notificationPreferences.videoFeaturedOnCategoryPageNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.nftFeaturedOnMarketPlaceNotificationEnabled,
        account.notificationPreferences.nftFeaturedOnMarketPlaceNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.newChannelFollowerNotificationEnabled,
        account.notificationPreferences.newChannelFollowerNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoCommentCreatedNotificationEnabled,
        account.notificationPreferences.videoCommentCreatedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoLikedNotificationEnabled,
        account.notificationPreferences.videoLikedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoDislikedNotificationEnabled,
        account.notificationPreferences.videoDislikedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.yppChannelSuspendedNotificationEnabled,
        account.notificationPreferences.yppChannelSuspendedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.yppChannelVerifiedNotificationEnabled,
        account.notificationPreferences.yppChannelVerifiedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.nftBoughtNotificationEnabled,
        account.notificationPreferences.nftBoughtNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.bidMadeOnNftNotificationEnabled,
        account.notificationPreferences.bidMadeOnNftNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.royaltyReceivedNotificationEnabled,
        account.notificationPreferences.royaltyReceivedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelPaymentReceivedNotificationEnabled,
        account.notificationPreferences.channelPaymentReceivedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelReceivedFundsFromWgNotificationEnabled,
        account.notificationPreferences.channelReceivedFundsFromWgNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.newPayoutUpdatedByCouncilNotificationEnabled,
        account.notificationPreferences.newPayoutUpdatedByCouncilNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelFundsWithdrawnNotificationEnabled,
        account.notificationPreferences.channelFundsWithdrawnNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.channelCreatedNotificationEnabled,
        account.notificationPreferences.channelCreatedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.replyToCommentNotificationEnabled,
        account.notificationPreferences.replyToCommentNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.reactionToCommentNotificationEnabled,
        account.notificationPreferences.reactionToCommentNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.videoPostedNotificationEnabled,
        account.notificationPreferences.videoPostedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.newNftOnAuctionNotificationEnabled,
        account.notificationPreferences.newNftOnAuctionNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.newNftOnSaleNotificationEnabled,
        account.notificationPreferences.newNftOnSaleNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.higherBidThanYoursMadeNotificationEnabled,
        account.notificationPreferences.higherBidThanYoursMadeNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.auctionExpiredNotificationEnabled,
        account.notificationPreferences.timedAuctionExpiredNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.auctionWonNotificationEnabled,
        account.notificationPreferences.auctionWonNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.auctionLostNotificationEnabled,
        account.notificationPreferences.auctionLostNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.openAuctionBidCanBeWithdrawnNotificationEnabled,
        account.notificationPreferences.openAuctionBidCanBeWithdrawnNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.fundsFromCouncilReceivedNotificationEnabled,
        account.notificationPreferences.fundsFromCouncilReceivedNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.fundsToExternalWalletSentNotificationEnabled,
        account.notificationPreferences.fundsToExternalWalletSentNotificationEnabled
      )
      maybeUpdateNotificationPreference(
        newPreferences.fundsFromWgReceivedNotificationEnabled,
        account.notificationPreferences.fundsFromWgReceivedNotificationEnabled
      )
      await em.save(account)

      return toOutputGQL(account.notificationPreferences)
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
