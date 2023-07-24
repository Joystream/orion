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
import { getNextIdForEntity } from './nextEntityId'

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
export function preferencesForNotification(
  preferences: AccountNotificationPreferences,
  notificationType: EventData | OffChainNotificationData,
  auctionWon?: boolean
): NotificationPreference {
  switch (notificationType.isTypeOf) {
    // TODO: (not.v1) check if this is the correct event data
    case 'CommentCreatedEventData':
      return preferences.videoCommentCreatedNotificationEnabled
    case 'OpenAuctionStartedEventData':
      return preferences.newNftOnAuctionNotificationEnabled
    case 'EnglishAuctionStartedEventData':
      return preferences.newNftOnAuctionNotificationEnabled
    case 'AuctionBidMadeEventData':
      return preferences.bidMadeOnNftNotificationEnabled
    case 'AuctionCanceledEventData':
      // NOTE: (not.v1) this might not be the best preference for this notification
      return preferences.auctionLostNotificationEnabled
    case 'EnglishAuctionSettledEventData':
      if (auctionWon) {
        return preferences.auctionWonNotificationEnabled
      } else {
        return preferences.auctionLostNotificationEnabled
      }
    case 'BidMadeCompletingAuctionEventData':
      return preferences.auctionWonNotificationEnabled
    case 'OpenAuctionBidAcceptedEventData':
      return preferences.bidMadeOnNftNotificationEnabled
    case 'NftSellOrderMadeEventData':
      return preferences.newNftOnSaleNotificationEnabled
    case 'NftBoughtEventData':
      return preferences.nftBoughtNotificationEnabled
    case 'ChannelRewardClaimedEventData':
      // TODO: (not.v1) check if this is the correct event data
      return preferences.channelReceivedFundsFromWgNotificationEnabled
    case 'ChannelRewardClaimedAndWithdrawnEventData':
      return preferences.channelFundsWithdrawnNotificationEnabled
    case 'ChannelFundsWithdrawnEventData':
      return preferences.channelFundsWithdrawnNotificationEnabled
    case 'ChannelPayoutsUpdatedEventData':
      return preferences.newPayoutUpdatedByCouncilNotificationEnabled
    case 'ChannelPaymentMadeEventData':
      // TODO: (not.v1) check if this is the correct event data
      return preferences.channelPaymentReceivedNotificationEnabled
    case 'ChannelCreatedEventData':
      return preferences.channelCreatedNotificationEnabled
    case 'NewChannelFollowerNotificationData':
      return preferences.newChannelFollowerNotificationPreferences
    case 'ChannelExcludedNotificationData':
      return preferences.channelExcludedFromAppNotificationEnabled
    case 'VideoExcludedNotificationData':
      return preferences.videoExcludedFromAppNotificationEnabled
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
      const { inAppEnabled: shouldSendAppNotification, emailEnabled: shouldSendMail } =
        preferencesForNotification(account.notificationPreferences, data)
      if (shouldSendAppNotification || shouldSendMail) {
        const nextOffchainNotificationId = await getNextIdForEntity(em, 'OffChainNotification')
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
