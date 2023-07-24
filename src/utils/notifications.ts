import { Flat } from 'lodash'
import { EntityManager } from 'typeorm'
import {
  Account,
  AccountNotificationPreferences,
  EventData,
  NextEntityId,
  NotificationPreference,
  NotificationType,
  OffChainNotification,
  OffChainNotificationData,
} from '../model'
import { ConfigVariable, config } from './config'
import { MailNotifier } from './mail'

export function notificationPrefAllTrue(): NotificationPreference {
  return new NotificationPreference({ inAppEnabled: true, emailEnabled: true })
}

export function defaultNotificationPreferences(): AccountNotificationPreferences {
  return new AccountNotificationPreferences({
    channelExcludedFromAppNotificationEnabled: notificationPrefAllTrue(),
    videoExcludedFromAppNotificationEnabled: notificationPrefAllTrue(),
    videoFeaturedAsHeroNotificationEnabled: notificationPrefAllTrue(),
    videoFeaturedOnCategoryPageNotificationEnabled: notificationPrefAllTrue(),
    nftFeaturedOnMarketPlace: notificationPrefAllTrue(),
    newChannelFollowerNotificationPreferences: notificationPrefAllTrue(),
    videoCommentCreatedNotificationEnabled: notificationPrefAllTrue(),
    videoLikedNotificationEnabled: notificationPrefAllTrue(),
    videoDislikedNotificationEnabled: notificationPrefAllTrue(),
    yppSignupSuccessfulNotificationEnabled: notificationPrefAllTrue(),
    yppChannelVerifiedNotificationEnabled: notificationPrefAllTrue(),
    nftBoughtNotificationEnabled: notificationPrefAllTrue(),
    bidMadeOnNftNotificationEnabled: notificationPrefAllTrue(),
    royaltyReceivedNotificationEnabled: notificationPrefAllTrue(),
    channelPaymentReceivedNotificationEnabled: notificationPrefAllTrue(),
    channelReceivedFundsFromWgNotificationEnabled: notificationPrefAllTrue(),
    newPayoutUpdatedByCouncilNotificationEnabled: notificationPrefAllTrue(),
    channelFundsWithdrawnNotificationEnabled: notificationPrefAllTrue(),

    channelCreatedNotificationEnabled: notificationPrefAllTrue(),
    replyToCommentNotificationEnabled: notificationPrefAllTrue(),
    reactionToCommentNotificationEnabled: notificationPrefAllTrue(),
    videoPostedNotificationEnabled: notificationPrefAllTrue(),
    newNftOnAuctionNotificationEnabled: notificationPrefAllTrue(),
    newNftOnSaleNotificationEnabled: notificationPrefAllTrue(),
    higherBidThanYoursMadeNotificationEnabled: notificationPrefAllTrue(),
    auctionExpiredNotificationEnabled: notificationPrefAllTrue(),
    auctionWonNotificationEnabled: notificationPrefAllTrue(),
    auctionLostNotificationEnabled: notificationPrefAllTrue(),
    openAuctionBidCanBeWithdrawnNotificationEnabled: notificationPrefAllTrue(),
    fundsFromCouncilReceivedNotificationEnabled: notificationPrefAllTrue(),
    fundsToExternalWalletSentNotificationEnabled: notificationPrefAllTrue(),
    fundsFromWgReceivedNotificationEnabled: notificationPrefAllTrue(),
  })
}

// [app notification, email notification] preference
export async function preferencesForNotification(
  preferences: AccountNotificationPreferences,
  notificationType: EventData | OffChainNotificationData
): NotificationPreference {
  account.notificationPreferences
  switch (notificationType.isTypeOf) {
    default:
      return new NotificationPreference({ inAppEnabled: false, emailEnabled: false })
  }
  //   case 'CommentCreatedEventData':
  //     return account.commentCreatedInAppNotificationEnabled,
  //   case 'CommentTextUpdatedEventData':
  //     return [
  //       account.commentCreatedInAppNotificationEnabled,
  //       account.commentCreatedMailNotificationEnabled,
  //     ]
  //   case 'OpenAuctionStartedEventData':
  //     return [
  //       account.openAuctionStartedInAppNotificationEnabled,
  //       account.openAuctionStartedMailNotificationEnabled,
  //     ]
  //   case 'EnglishAuctionStartedEventData':
  //     return [
  //       account.englishAuctionStartedInAppNotificationEnabled,
  //       account.englishAuctionStartedMailNotificationEnabled,
  //     ]
  //   case 'NftIssuedEventData':
  //     return [account.nftIssuedInAppNotificationEnabled, account.nftBoughtMailNotificationEnabled]
  //   case 'AuctionBidMadeEventData':
  //     return [
  //       account.auctionBidMadeInAppNotificationEnabled,
  //       account.auctionBidMadeMailNotificationEnabled,
  //     ]
  //   case 'AuctionBidCanceledEventData':
  //     return [
  //       account.auctionCanceledInAppNotificationEnabled,
  //       account.auctionBidCanceledMailNotificationEnabled,
  //     ]
  //   case 'AuctionCanceledEventData':
  //     return [
  //       account.auctionCanceledInAppNotificationEnabled,
  //       account.auctionCanceledMailNotificationEnabled,
  //     ]
  //   case 'EnglishAuctionSettledEventData':
  //     return [
  //       account.englishAuctionSettledInAppNotificationEnabled,
  //       account.englishAuctionSettledMailNotificationEnabled,
  //     ]
  //   case 'BidMadeCompletingAuctionEventData':
  //     return [
  //       account.bidMadeCompletingAuctionInAppNotificationEnabled,
  //       account.bidMadeCompletingAuctionMailNotificationEnabled,
  //     ]
  //   case 'OpenAuctionBidAcceptedEventData':
  //     return [
  //       account.openAuctionBidAcceptedInAppNotificationEnabled,
  //       account.openAuctionBidAcceptedMailNotificationEnabled,
  //     ]
  //   case 'NftSellOrderMadeEventData':
  //     return [
  //       account.nftSellOrderMadeInAppNotificationEnabled,
  //       account.nftSellOrderMadeMailNotificationEnabled,
  //     ]
  //   case 'NftBoughtEventData':
  //     return [account.nftBoughtInAppNotificationEnabled, account.nftBoughtMailNotificationEnabled]
  //   case 'BuyNowCanceledEventData':
  //     return [
  //       account.buyNowCanceledInAppNotificationEnabled,
  //       account.buyNowCanceledMailNotificationEnabled,
  //     ]
  //   case 'BuyNowPriceUpdatedEventData':
  //     return [
  //       account.buyNowPriceUpdatedInAppNotificationEnabled,
  //       account.buyNowPriceUpdatedMailNotificationEnabled,
  //     ]
  //   case 'MetaprotocolTransactionStatusEventData':
  //     return [
  //       account.metaprotocolTransactionStatusInAppNotificationEnabled,
  //       account.metaprotocolTransactionStatusMailNotificationEnabled,
  //     ]
  //   case 'ChannelRewardClaimedEventData':
  //     return [
  //       account.channelRewardClaimedInAppNotificationEnabled,
  //       account.channelRewardClaimedMailNotificationEnabled,
  //     ]
  //   case 'ChannelRewardClaimedAndWithdrawnEventData':
  //     return [
  //       account.channelRewardClaimedAndWithdrawnInAppNotificationEnabled,
  //       account.channelRewardClaimedAndWithdrawnMailNotificationEnabled,
  //     ]
  //   case 'ChannelFundsWithdrawnEventData':
  //     return [
  //       account.channelFundsWithdrawnInAppNotificationEnabled,
  //       account.channelFundsWithdrawnMailNotificationEnabled,
  //     ]
  //   case 'ChannelPayoutsUpdatedEventData':
  //     return [
  //       account.channelPayoutsUpdatedInAppNotificationEnabled,
  //       account.channelPayoutsUpdatedMailNotificationEnabled,
  //     ]
  //   case 'ChannelPaymentMadeEventData':
  //     return [
  //       account.channelPaymentMadeInAppNotificationEnabled,
  //       account.channelPaymentMadeMailNotificationEnabled,
  //     ]
  //   case 'MemberBannedFromChannelEventData':
  //     return [
  //       account.memberBannedFromChannelInAppNotificationEnabled,
  //       account.memberBannedFromChannelMailNotificationEnabled,
  //     ]
  //   case 'ChannelCreatedEventData':
  //     return [
  //       account.channelCreatedInAppNotificationEnabled,
  //       account.channelCreatedMailNotificationEnabled,
  //     ]
  //   case 'NewChannelFollowerNotificationData':
  //     return [
  //       account.newChannelFollowerInAppNotificationPreferences,
  //       account.newChannelFollowerMailNotificationPreferences,
  //     ]
  //   case 'ChannelExcludedNotificationData':
  //     return [
  //       account.channelExcludedFromAppInAppNotificationEnabled,
  //       account.channelExcludedFromAppMailNotificationEnabled,
  //     ]
  //   case 'VideoExcludedNotificationData':
  //     return [
  //       account.videoExcludedFromAppInAppNotificationEnabled,
  //       account.videoExcludedFromAppMailNotificationEnabled,
  //     ]
  //   default:
  //     return [false, false]
  // }
}

export async function addOffChainNotification(
  em: EntityManager,
  accountIds: string[],
  data: OffChainNotificationData,
  type: NotificationType
) {
  const mailNotifier = new MailNotifier()
  mailNotifier.setSender(await config.get(ConfigVariable.SendgridFromEmail, em))
  mailNotifier.setSubject(data.toString())
  mailNotifier.setContentUsingTemplate('test')
  for (const accountId of accountIds) {
    const account = await em.getRepository(Account).findOneById(accountId)
    if (account) {
      const { inAppEnabled: shouldSendAppNotification, emailEnabled: shouldSendMail } = preferencesForNotification(
        account.notificationPreferences,
        data
      )
      if (shouldSendAppNotification || shouldSendMail) {
        const nextOffchainNotificationId = parseInt(
          (
            await em.getRepository(NextEntityId).findOne({
              where: { entityName: 'OffChainNotification' },
              lock: { mode: 'pessimistic_write' },
            })
          )?.nextId.toString() || '1'
        )
        const notification = new OffChainNotification({
          id: nextOffchainNotificationId.toString(),
          accountId,
          data,
          inAppRead: false,
          type,
          mailSent: false,
        })
        if (shouldSendMail) {
          mailNotifier.setReciever(account.email)
          await mailNotifier.send()
          notification.mailSent = mailNotifier.mailHasBeenSent()
        }
        await em.save([
          notification,
          new NextEntityId({
            entityName: 'OffChainNotification',
            nextId: nextOffchainNotificationId + 1,
          }),
        ])
      }
    }
    return
  }
}

export function setNotificationPreferences(
  account: Account,
  notificationPreferences: NotificationPreferences
) {
  // account.commentCreatedInAppNotificationEnabled =
  //   notificationPreferences.commentCreatedInAppNotificationEnabled
  // account.commentCreatedMailNotificationEnabled =
  //   notificationPreferences.commentCreatedMailNotificationEnabled
  // account.commentTextUpdatedInAppNotificationEnabled =
  //   notificationPreferences.commentTextUpdatedInAppNotificationEnabled
  // account.openAuctionStartedInAppNotificationEnabled =
  //   notificationPreferences.openAuctionStartedInAppNotificationEnabled
  // account.englishAuctionStartedInAppNotificationEnabled =
  //   notificationPreferences.englishAuctionStartedInAppNotificationEnabled
  // account.nftIssuedInAppNotificationEnabled =
  //   notificationPreferences.nftIssuedInAppNotificationEnabled
  // account.auctionBidMadeInAppNotificationEnabled =
  //   notificationPreferences.auctionBidMadeInAppNotificationEnabled
  // account.auctionBidCanceledInAppNotificationEnabled =
  //   notificationPreferences.auctionBidCanceledInAppNotificationEnabled
  // account.auctionCanceledInAppNotificationEnabled =
  //   notificationPreferences.auctionCanceledInAppNotificationEnabled
  // account.englishAuctionSettledInAppNotificationEnabled =
  //   notificationPreferences.englishAuctionSettledInAppNotificationEnabled
  // account.bidMadeCompletingAuctionInAppNotificationEnabled =
  //   notificationPreferences.bidMadeCompletingAuctionInAppNotificationEnabled
  // account.openAuctionBidAcceptedInAppNotificationEnabled =
  //   notificationPreferences.openAuctionBidAcceptedInAppNotificationEnabled
  // account.nftSellOrderMadeInAppNotificationEnabled =
  //   notificationPreferences.nftSellOrderMadeInAppNotificationEnabled
  // account.nftBoughtInAppNotificationEnabled =
  //   notificationPreferences.nftBoughtInAppNotificationEnabled
  // account.buyNowCanceledInAppNotificationEnabled =
  //   notificationPreferences.buyNowCanceledInAppNotificationEnabled
  // account.buyNowPriceUpdatedInAppNotificationEnabled =
  //   notificationPreferences.buyNowPriceUpdatedInAppNotificationEnabled
  // account.metaprotocolTransactionStatusInAppNotificationEnabled =
  //   notificationPreferences.metaprotocolTransactionStatusInAppNotificationEnabled
  // account.channelRewardClaimedInAppNotificationEnabled =
  //   notificationPreferences.channelRewardClaimedInAppNotificationEnabled
  // account.channelRewardClaimedAndWithdrawnInAppNotificationEnabled =
  //   notificationPreferences.channelRewardClaimedAndWithdrawnInAppNotificationEnabled
  // account.channelFundsWithdrawnInAppNotificationEnabled =
  //   notificationPreferences.channelFundsWithdrawnInAppNotificationEnabled
  // account.channelPayoutsUpdatedInAppNotificationEnabled =
  //   notificationPreferences.channelPayoutsUpdatedInAppNotificationEnabled
  // account.channelPaymentMadeInAppNotificationEnabled =
  //   notificationPreferences.channelPaymentMadeInAppNotificationEnabled
  // account.memberBannedFromChannelInAppNotificationEnabled =
  //   notificationPreferences.memberBannedFromChannelInAppNotificationEnabled
  // account.channelCreatedInAppNotificationEnabled =
  //   notificationPreferences.channelCreatedInAppNotificationEnabled
  // account.commentCreatedMailNotificationEnabled =
  //   notificationPreferences.commentCreatedMailNotificationEnabled
  // account.commentTextUpdatedMailNotificationEnabled =
  //   notificationPreferences.commentTextUpdatedMailNotificationEnabled
  // account.openAuctionStartedMailNotificationEnabled =
  //   notificationPreferences.openAuctionStartedMailNotificationEnabled
  // account.englishAuctionStartedMailNotificationEnabled =
  //   notificationPreferences.englishAuctionStartedMailNotificationEnabled
  // account.nftIssuedMailNotificationEnabled =
  //   notificationPreferences.nftIssuedMailNotificationEnabled
  // account.auctionBidMadeMailNotificationEnabled =
  //   notificationPreferences.auctionBidMadeMailNotificationEnabled
  // account.auctionBidCanceledMailNotificationEnabled =
  //   notificationPreferences.auctionBidCanceledMailNotificationEnabled
  // account.auctionCanceledMailNotificationEnabled =
  //   notificationPreferences.auctionCanceledMailNotificationEnabled
  // account.englishAuctionSettledMailNotificationEnabled =
  //   notificationPreferences.englishAuctionSettledMailNotificationEnabled
  // account.bidMadeCompletingAuctionMailNotificationEnabled =
  //   notificationPreferences.bidMadeCompletingAuctionMailNotificationEnabled
  // account.openAuctionBidAcceptedMailNotificationEnabled =
  //   notificationPreferences.openAuctionBidAcceptedMailNotificationEnabled
  // account.nftSellOrderMadeMailNotificationEnabled =
  //   notificationPreferences.nftSellOrderMadeMailNotificationEnabled
  // account.nftBoughtMailNotificationEnabled =
  //   notificationPreferences.nftBoughtMailNotificationEnabled
  // account.buyNowCanceledMailNotificationEnabled =
  //   notificationPreferences.buyNowCanceledMailNotificationEnabled
  // account.buyNowPriceUpdatedMailNotificationEnabled =
  //   notificationPreferences.buyNowPriceUpdatedMailNotificationEnabled
  // account.metaprotocolTransactionStatusMailNotificationEnabled =
  //   notificationPreferences.metaprotocolTransactionStatusMailNotificationEnabled
  // account.channelRewardClaimedMailNotificationEnabled =
  //   notificationPreferences.channelRewardClaimedMailNotificationEnabled
  // account.channelRewardClaimedAndWithdrawnMailNotificationEnabled =
  //   notificationPreferences.channelRewardClaimedAndWithdrawnMailNotificationEnabled
  // account.channelFundsWithdrawnMailNotificationEnabled =
  //   notificationPreferences.channelFundsWithdrawnMailNotificationEnabled
  // account.channelPayoutsUpdatedMailNotificationEnabled =
  //   notificationPreferences.channelPayoutsUpdatedMailNotificationEnabled
  // account.channelPaymentMadeMailNotificationEnabled =
  //   notificationPreferences.channelPaymentMadeMailNotificationEnabled
  // account.memberBannedFromChannelMailNotificationEnabled =
  //   notificationPreferences.memberBannedFromChannelMailNotificationEnabled
  // account.channelCreatedMailNotificationEnabled =
  //   notificationPreferences.channelCreatedMailNotificationEnabled
  // account.channelExcludedFromAppInAppNotificationEnabled = notificationPreferences.channelExcludedFromAppInAppNotificationEnabled
  // account.channelExcludedFromAppMailNotificationEnabled = notificationPreferences.channelExcludedFromAppMailNotificationEnabled
}
