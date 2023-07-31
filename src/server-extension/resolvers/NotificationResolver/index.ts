import 'reflect-metadata'
import { Resolver, Mutation, UseMiddleware, Ctx, Args, Arg } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { Context } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import {
  AccountNotificationPreferences,
  DeliveryStatus,
  NotificationPreference,
  OffChainNotification,
  ReadOrUnread,
  RuntimeNotification,
} from '../../../model'
import {
  AccountNotificationPreferencesInput,
  AccountNotificationPreferencesOutput,
  AccountNotificationPreferencesResult,
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
      let notificationsReadIds: string[] = []
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
          if (notification.accountId === ctx.accountId) {
            if (
              notification.status === ReadOrUnread.UNREAD &&
              notification.deliveryStatus !== DeliveryStatus.UNDELIVERED
            ) {
              notification.status = ReadOrUnread.READ
              await em.save(notification)
              notificationsReadIds.push(notification.id)
            }
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
      const account = ctx.account
      if (!account) {
        throw new Error('Account not found')
      }
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
        newPreferences.yppSignupSuccessfulNotificationEnabled,
        account.notificationPreferences.yppSignupSuccessfulNotificationEnabled
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
        account.notificationPreferences.auctionExpiredNotificationEnabled
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

      return toOutputGQL(account!.notificationPreferences)
    })
  }
}

// Helper function to update notification preferences
function maybeUpdateNotificationPreference(
  newPreference: NotificationPreferenceGQL,
  accountPreference: NotificationPreference
) {
  if (newPreference !== undefined && newPreference !== null) {
    if (newPreference.emailEnabled !== undefined) {
      accountPreference.emailEnabled = newPreference.emailEnabled
    }
    if (newPreference.inAppEnabled !== undefined) {
      accountPreference.inAppEnabled = newPreference.inAppEnabled
    }
  }
}
