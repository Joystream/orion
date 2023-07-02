import 'reflect-metadata'
import { Resolver, Mutation, UseMiddleware, Ctx, Args } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { Context } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import { NotificationPreferences, OffChainNotification, RuntimeNotification, RuntimeNotificationProcessed } from '../../../model'
import { NotificationArgs, SetNotificationPreferencesArgs } from './types'

@Resolver()
export class NotificationResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) { }

  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async markOffChainNotificationAsRead(
    @Args() { notificationId }: NotificationArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const notification = await em.findOne(OffChainNotification, {
        where: { id: notificationId },
      })
      if (notification) {
        if (notification.account.id === ctx.accountId) {
          if (!notification.inAppRead) {
            notification.inAppRead = true
            await em.save(notification)
            return true
          }
        }
      }
      return false
    })
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async markRuntimeNotificationAsRead(
    @Args() { notificationId }: NotificationArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const notification = await em.findOne(RuntimeNotification, {
        where: { id: notificationId },
      })
      const notificationProcessed = await em.findOne(RuntimeNotificationProcessed, {
        where: { notificationId },
      })
      if (notification !== null && notificationProcessed !== null) {
        if (notification.account.id === ctx.accountId) {
          if (!notificationProcessed.inAppRead) {
            notificationProcessed.inAppRead = true
            await em.save(notificationProcessed)
            return true
          }
        }
      }
      return false
    })
  }

  // write complementary function for marking as unread
  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async markOffChainNotificationAsUnread(
    @Args() { notificationId }: NotificationArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    const em = await this.em()
    return withHiddenEntities(em, async () => {
      const notification = await em.findOne(OffChainNotification, {
        where: { id: notificationId },
      })
      if (notification) {
        if (notification.account.id === ctx.accountId) {
          if (notification.inAppRead) {
            notification.inAppRead = false
            await em.save(notification)
            return true
          }
        }
      }
      return false
    })
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async markRuntimeNotificationAsUnread(
    @Args() { notificationId }: NotificationArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    const em = await this.em()
    return withHiddenEntities(em, async () => {
      const notification = await em.findOne(RuntimeNotification, {
        where: { id: notificationId },
      })
      const notificationProcessed = await em.findOne(RuntimeNotificationProcessed, {
        where: { notificationId },
      })
      if (notification !== null && notificationProcessed !== null) {
        if (notification.account.id === ctx.accountId) {
          if (!notificationProcessed.inAppRead) {
            notificationProcessed.inAppRead = true
            await em.save(notificationProcessed)
            return true
          }
        }
      }
      return false
    })
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AccountOnly)
  async setAccountNotificatioPreferences(
    @Args() notificationPreferences: SetNotificationPreferencesArgs,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    console.log('mutating account preferences')

    const {
      commentCreatedInAppNotificationEnabled,
      commentTextUpdatedInAppNotificationEnabled,
      openAuctionStartedInAppNotificationEnabled,
      englishAuctionStartedInAppNotificationEnabled,
      nftIssuedInAppNotificationEnabled,
      auctionBidMadeInAppNotificationEnabled,
      auctionBidCanceledInAppNotificationEnabled,
      auctionCanceledInAppNotificationEnabled,
      englishAuctionSettledInAppNotificationEnabled,
      bidMadeCompletingAuctionInAppNotificationEnabled,
      openAuctionBidAcceptedInAppNotificationEnabled,
      nftSellOrderMadeInAppNotificationEnabled,
      nftBoughtInAppNotificationEnabled,
      buyNowCanceledInAppNotificationEnabled,
      buyNowPriceUpdatedInAppNotificationEnabled,
      metaprotocolTransactionStatusInAppNotificationEnabled,
      channelRewardClaimedInAppNotificationEnabled,
      channelRewardClaimedAndWithdrawnInAppNotificationEnabled,
      channelFundsWithdrawnInAppNotificationEnabled,
      channelPayoutsUpdatedInAppNotificationEnabled,
      channelPaymentMadeInAppNotificationEnabled,
      memberBannedFromChannelInAppNotificationEnabled,
      channelCreatedInAppNotificationEnabled,
      commentCreatedMailNotificationEnabled,
      commentTextUpdatedMailNotificationEnabled,
      openAuctionStartedMailNotificationEnabled,
      englishAuctionStartedMailNotificationEnabled,
      nftIssuedMailNotificationEnabled,
      auctionBidMadeMailNotificationEnabled,
      auctionBidCanceledMailNotificationEnabled,
      auctionCanceledMailNotificationEnabled,
      englishAuctionSettledMailNotificationEnabled,
      bidMadeCompletingAuctionMailNotificationEnabled,
      openAuctionBidAcceptedMailNotificationEnabled,
      nftSellOrderMadeMailNotificationEnabled,
      nftBoughtMailNotificationEnabled,
      buyNowCanceledMailNotificationEnabled,
      buyNowPriceUpdatedMailNotificationEnabled,
      metaprotocolTransactionStatusMailNotificationEnabled,
      channelRewardClaimedMailNotificationEnabled,
      channelRewardClaimedAndWithdrawnMailNotificationEnabled,
      channelFundsWithdrawnMailNotificationEnabled,
      channelPayoutsUpdatedMailNotificationEnabled,
      channelPaymentMadeMailNotificationEnabled,
      memberBannedFromChannelMailNotificationEnabled,
      channelCreatedMailNotificationEnabled,
    } = notificationPreferences

    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const accountId = ctx.accountId
      if (!accountId) {
        throw new Error('Account not found')
      }
      const notificationPreferences = await em.findOne(
        NotificationPreferences,
        {
          where: { accountId: accountId },
        }
      )
      if (notificationPreferences) {
        notificationPreferences.commentCreatedInAppNotificationEnabled =
          commentCreatedInAppNotificationEnabled
        notificationPreferences.commentCreatedMailNotificationEnabled =
          commentCreatedMailNotificationEnabled
        notificationPreferences.commentTextUpdatedInAppNotificationEnabled =
          commentTextUpdatedInAppNotificationEnabled
        notificationPreferences.openAuctionStartedInAppNotificationEnabled =
          openAuctionStartedInAppNotificationEnabled
        notificationPreferences.englishAuctionStartedInAppNotificationEnabled =
          englishAuctionStartedInAppNotificationEnabled
        notificationPreferences.nftIssuedInAppNotificationEnabled =
          nftIssuedInAppNotificationEnabled
        notificationPreferences.auctionBidMadeInAppNotificationEnabled =
          auctionBidMadeInAppNotificationEnabled
        notificationPreferences.auctionBidCanceledInAppNotificationEnabled =
          auctionBidCanceledInAppNotificationEnabled
        notificationPreferences.auctionCanceledInAppNotificationEnabled =
          auctionCanceledInAppNotificationEnabled
        notificationPreferences.englishAuctionSettledInAppNotificationEnabled =
          englishAuctionSettledInAppNotificationEnabled
        notificationPreferences.bidMadeCompletingAuctionInAppNotificationEnabled =
          bidMadeCompletingAuctionInAppNotificationEnabled
        notificationPreferences.openAuctionBidAcceptedInAppNotificationEnabled =
          openAuctionBidAcceptedInAppNotificationEnabled
        notificationPreferences.nftSellOrderMadeInAppNotificationEnabled =
          nftSellOrderMadeInAppNotificationEnabled
        notificationPreferences.nftBoughtInAppNotificationEnabled =
          nftBoughtInAppNotificationEnabled
        notificationPreferences.buyNowCanceledInAppNotificationEnabled =
          buyNowCanceledInAppNotificationEnabled
        notificationPreferences.buyNowPriceUpdatedInAppNotificationEnabled =
          buyNowPriceUpdatedInAppNotificationEnabled
        notificationPreferences.metaprotocolTransactionStatusInAppNotificationEnabled =
          metaprotocolTransactionStatusInAppNotificationEnabled
        notificationPreferences.channelRewardClaimedInAppNotificationEnabled =
          channelRewardClaimedInAppNotificationEnabled
        notificationPreferences.channelRewardClaimedAndWithdrawnInAppNotificationEnabled =
          channelRewardClaimedAndWithdrawnInAppNotificationEnabled
        notificationPreferences.channelFundsWithdrawnInAppNotificationEnabled =
          channelFundsWithdrawnInAppNotificationEnabled
        notificationPreferences.channelPayoutsUpdatedInAppNotificationEnabled =
          channelPayoutsUpdatedInAppNotificationEnabled
        notificationPreferences.channelPaymentMadeInAppNotificationEnabled =
          channelPaymentMadeInAppNotificationEnabled
        notificationPreferences.memberBannedFromChannelInAppNotificationEnabled =
          memberBannedFromChannelInAppNotificationEnabled
        notificationPreferences.channelCreatedInAppNotificationEnabled =
          channelCreatedInAppNotificationEnabled
        notificationPreferences.commentCreatedMailNotificationEnabled =
          commentCreatedMailNotificationEnabled
        notificationPreferences.commentTextUpdatedMailNotificationEnabled =
          commentTextUpdatedMailNotificationEnabled
        notificationPreferences.openAuctionStartedMailNotificationEnabled =
          openAuctionStartedMailNotificationEnabled
        notificationPreferences.englishAuctionStartedMailNotificationEnabled =
          englishAuctionStartedMailNotificationEnabled
        notificationPreferences.nftIssuedMailNotificationEnabled =
          nftIssuedMailNotificationEnabled
        notificationPreferences.auctionBidMadeMailNotificationEnabled =
          auctionBidMadeMailNotificationEnabled
        notificationPreferences.auctionBidCanceledMailNotificationEnabled =
          auctionBidCanceledMailNotificationEnabled
        notificationPreferences.auctionCanceledMailNotificationEnabled =
          auctionCanceledMailNotificationEnabled
        notificationPreferences.englishAuctionSettledMailNotificationEnabled =
          englishAuctionSettledMailNotificationEnabled
        notificationPreferences.bidMadeCompletingAuctionMailNotificationEnabled =
          bidMadeCompletingAuctionMailNotificationEnabled
        notificationPreferences.openAuctionBidAcceptedMailNotificationEnabled =
          openAuctionBidAcceptedMailNotificationEnabled
        notificationPreferences.nftSellOrderMadeMailNotificationEnabled =
          nftSellOrderMadeMailNotificationEnabled
        notificationPreferences.nftBoughtMailNotificationEnabled =
          nftBoughtMailNotificationEnabled
        notificationPreferences.buyNowCanceledMailNotificationEnabled =
          buyNowCanceledMailNotificationEnabled
        notificationPreferences.buyNowPriceUpdatedMailNotificationEnabled =
          buyNowPriceUpdatedMailNotificationEnabled
        notificationPreferences.metaprotocolTransactionStatusMailNotificationEnabled =
          metaprotocolTransactionStatusMailNotificationEnabled
        notificationPreferences.channelRewardClaimedMailNotificationEnabled =
          channelRewardClaimedMailNotificationEnabled
        notificationPreferences.channelRewardClaimedAndWithdrawnMailNotificationEnabled =
          channelRewardClaimedAndWithdrawnMailNotificationEnabled
        notificationPreferences.channelFundsWithdrawnMailNotificationEnabled =
          channelFundsWithdrawnMailNotificationEnabled
        notificationPreferences.channelPayoutsUpdatedMailNotificationEnabled =
          channelPayoutsUpdatedMailNotificationEnabled
        notificationPreferences.channelPaymentMadeMailNotificationEnabled =
          channelPaymentMadeMailNotificationEnabled
        notificationPreferences.memberBannedFromChannelMailNotificationEnabled =
          memberBannedFromChannelMailNotificationEnabled
        notificationPreferences.channelCreatedMailNotificationEnabled =
          channelCreatedMailNotificationEnabled

        await em.save(notificationPreferences)
        return true
      }
      return false
    })
  }

}

