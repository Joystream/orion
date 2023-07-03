import 'reflect-metadata'
import { Resolver, Mutation, UseMiddleware, Ctx, Args } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { AccountOnly } from '../middleware'
import { Context } from '../../check'
import { withHiddenEntities } from '../../../utils/sql'
import { Account, OffChainNotification, RuntimeNotification, RuntimeNotificationProcessed } from '../../../model'
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
      const account = ctx.account
      if (!account) {
        throw new Error('Account not found')
      }
      if (notificationPreferences) {
        account.commentCreatedInAppNotificationEnabled =
          commentCreatedInAppNotificationEnabled
        account.commentCreatedMailNotificationEnabled =
          commentCreatedMailNotificationEnabled
        account.commentTextUpdatedInAppNotificationEnabled =
          commentTextUpdatedInAppNotificationEnabled
        account.openAuctionStartedInAppNotificationEnabled =
          openAuctionStartedInAppNotificationEnabled
        account.englishAuctionStartedInAppNotificationEnabled =
          englishAuctionStartedInAppNotificationEnabled
        account.nftIssuedInAppNotificationEnabled =
          nftIssuedInAppNotificationEnabled
        account.auctionBidMadeInAppNotificationEnabled =
          auctionBidMadeInAppNotificationEnabled
        account.auctionBidCanceledInAppNotificationEnabled =
          auctionBidCanceledInAppNotificationEnabled
        account.auctionCanceledInAppNotificationEnabled =
          auctionCanceledInAppNotificationEnabled
        account.englishAuctionSettledInAppNotificationEnabled =
          englishAuctionSettledInAppNotificationEnabled
        account.bidMadeCompletingAuctionInAppNotificationEnabled =
          bidMadeCompletingAuctionInAppNotificationEnabled
        account.openAuctionBidAcceptedInAppNotificationEnabled =
          openAuctionBidAcceptedInAppNotificationEnabled
        account.nftSellOrderMadeInAppNotificationEnabled =
          nftSellOrderMadeInAppNotificationEnabled
        account.nftBoughtInAppNotificationEnabled =
          nftBoughtInAppNotificationEnabled
        account.buyNowCanceledInAppNotificationEnabled =
          buyNowCanceledInAppNotificationEnabled
        account.buyNowPriceUpdatedInAppNotificationEnabled =
          buyNowPriceUpdatedInAppNotificationEnabled
        account.metaprotocolTransactionStatusInAppNotificationEnabled =
          metaprotocolTransactionStatusInAppNotificationEnabled
        account.channelRewardClaimedInAppNotificationEnabled =
          channelRewardClaimedInAppNotificationEnabled
        account.channelRewardClaimedAndWithdrawnInAppNotificationEnabled =
          channelRewardClaimedAndWithdrawnInAppNotificationEnabled
        account.channelFundsWithdrawnInAppNotificationEnabled =
          channelFundsWithdrawnInAppNotificationEnabled
        account.channelPayoutsUpdatedInAppNotificationEnabled =
          channelPayoutsUpdatedInAppNotificationEnabled
        account.channelPaymentMadeInAppNotificationEnabled =
          channelPaymentMadeInAppNotificationEnabled
        account.memberBannedFromChannelInAppNotificationEnabled =
          memberBannedFromChannelInAppNotificationEnabled
        account.channelCreatedInAppNotificationEnabled =
          channelCreatedInAppNotificationEnabled
        account.commentCreatedMailNotificationEnabled =
          commentCreatedMailNotificationEnabled
        account.commentTextUpdatedMailNotificationEnabled =
          commentTextUpdatedMailNotificationEnabled
        account.openAuctionStartedMailNotificationEnabled =
          openAuctionStartedMailNotificationEnabled
        account.englishAuctionStartedMailNotificationEnabled =
          englishAuctionStartedMailNotificationEnabled
        account.nftIssuedMailNotificationEnabled =
          nftIssuedMailNotificationEnabled
        account.auctionBidMadeMailNotificationEnabled =
          auctionBidMadeMailNotificationEnabled
        account.auctionBidCanceledMailNotificationEnabled =
          auctionBidCanceledMailNotificationEnabled
        account.auctionCanceledMailNotificationEnabled =
          auctionCanceledMailNotificationEnabled
        account.englishAuctionSettledMailNotificationEnabled =
          englishAuctionSettledMailNotificationEnabled
        account.bidMadeCompletingAuctionMailNotificationEnabled =
          bidMadeCompletingAuctionMailNotificationEnabled
        account.openAuctionBidAcceptedMailNotificationEnabled =
          openAuctionBidAcceptedMailNotificationEnabled
        account.nftSellOrderMadeMailNotificationEnabled =
          nftSellOrderMadeMailNotificationEnabled
        account.nftBoughtMailNotificationEnabled =
          nftBoughtMailNotificationEnabled
        account.buyNowCanceledMailNotificationEnabled =
          buyNowCanceledMailNotificationEnabled
        account.buyNowPriceUpdatedMailNotificationEnabled =
          buyNowPriceUpdatedMailNotificationEnabled
        account.metaprotocolTransactionStatusMailNotificationEnabled =
          metaprotocolTransactionStatusMailNotificationEnabled
        account.channelRewardClaimedMailNotificationEnabled =
          channelRewardClaimedMailNotificationEnabled
        account.channelRewardClaimedAndWithdrawnMailNotificationEnabled =
          channelRewardClaimedAndWithdrawnMailNotificationEnabled
        account.channelFundsWithdrawnMailNotificationEnabled =
          channelFundsWithdrawnMailNotificationEnabled
        account.channelPayoutsUpdatedMailNotificationEnabled =
          channelPayoutsUpdatedMailNotificationEnabled
        account.channelPaymentMadeMailNotificationEnabled =
          channelPaymentMadeMailNotificationEnabled
        account.memberBannedFromChannelMailNotificationEnabled =
          memberBannedFromChannelMailNotificationEnabled
        account.channelCreatedMailNotificationEnabled =
          channelCreatedMailNotificationEnabled

        await em.save(notificationPreferences)
        return true
      }
      return false
    })
  }

}

