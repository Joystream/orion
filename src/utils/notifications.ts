import { EntityManager } from 'typeorm'
import {
  Account,
  EventData,
  NextEntityId,
  NotificationType,
  OffChainNotification,
  OffChainNotificationData,
} from '../model'
import { NotificationPreferences } from '../model/generated/notificationPreferences.model'
import { ConfigVariable, config } from './config'
import { MailNotifier } from './mail'

export function defaultNotificationPreferences(accountId: string): NotificationPreferences {
  return new NotificationPreferences({
    accountId,
    commentCreatedInAppNotificationEnabled: true,
    commentTextUpdatedInAppNotificationEnabled: true,
    openAuctionStartedInAppNotificationEnabled: true,
    englishAuctionStartedInAppNotificationEnabled: true,
    nftIssuedInAppNotificationEnabled: true,
    auctionBidMadeInAppNotificationEnabled: true,
    auctionBidCanceledInAppNotificationEnabled: true,
    auctionCanceledInAppNotificationEnabled: true,
    englishAuctionSettledInAppNotificationEnabled: true,
    bidMadeCompletingAuctionInAppNotificationEnabled: true,
    openAuctionBidAcceptedInAppNotificationEnabled: true,
    nftSellOrderMadeInAppNotificationEnabled: true,
    nftBoughtInAppNotificationEnabled: true,
    buyNowCanceledInAppNotificationEnabled: true,
    buyNowPriceUpdatedInAppNotificationEnabled: true,
    metaprotocolTransactionStatusInAppNotificationEnabled: true,
    channelRewardClaimedInAppNotificationEnabled: true,
    channelRewardClaimedAndWithdrawnInAppNotificationEnabled: true,
    channelFundsWithdrawnInAppNotificationEnabled: true,
    channelPayoutsUpdatedInAppNotificationEnabled: true,
    channelPaymentMadeInAppNotificationEnabled: true,
    memberBannedFromChannelInAppNotificationEnabled: true,
    channelCreatedInAppNotificationEnabled: true,
    commentCreatedMailNotificationEnabled: true,
    commentTextUpdatedMailNotificationEnabled: true,
    openAuctionStartedMailNotificationEnabled: true,
    englishAuctionStartedMailNotificationEnabled: true,
    nftIssuedMailNotificationEnabled: true,
    auctionBidMadeMailNotificationEnabled: true,
    auctionBidCanceledMailNotificationEnabled: true,
    auctionCanceledMailNotificationEnabled: true,
    englishAuctionSettledMailNotificationEnabled: true,
    bidMadeCompletingAuctionMailNotificationEnabled: true,
    openAuctionBidAcceptedMailNotificationEnabled: true,
    nftSellOrderMadeMailNotificationEnabled: true,
    nftBoughtMailNotificationEnabled: true,
    buyNowCanceledMailNotificationEnabled: true,
    buyNowPriceUpdatedMailNotificationEnabled: true,
    metaprotocolTransactionStatusMailNotificationEnabled: true,
    channelRewardClaimedMailNotificationEnabled: true,
    channelRewardClaimedAndWithdrawnMailNotificationEnabled: true,
    channelFundsWithdrawnMailNotificationEnabled: true,
    channelPayoutsUpdatedMailNotificationEnabled: true,
    channelPaymentMadeMailNotificationEnabled: true,
    memberBannedFromChannelMailNotificationEnabled: true,
    channelCreatedMailNotificationEnabled: true,
    newChannelFollowerInAppNotificationPreferences: true,
    newChannelFollowerMailNotificationPreferences: true,
  }) // TODo: format ordinately by pairs
}

// [app notification, email notification] preference
export async function preferencesForNotification(
  em: EntityManager,
  accountId: string,
  notificationType: EventData | OffChainNotificationData
): Promise<[boolean, boolean]> {
  const np = await em.findOneByOrFail(NotificationPreferences, { accountId: accountId })
  switch (notificationType.isTypeOf) {
    case 'CommentCreatedEventData':
      return [np.commentCreatedInAppNotificationEnabled, np.commentCreatedMailNotificationEnabled]
    case 'CommentTextUpdatedEventData':
      return [np.commentCreatedInAppNotificationEnabled, np.commentCreatedMailNotificationEnabled]
    case 'OpenAuctionStartedEventData':
      return [
        np.openAuctionStartedInAppNotificationEnabled,
        np.openAuctionStartedMailNotificationEnabled,
      ]
    case 'EnglishAuctionStartedEventData':
      return [
        np.englishAuctionStartedInAppNotificationEnabled,
        np.englishAuctionStartedMailNotificationEnabled,
      ]
    case 'NftIssuedEventData':
      return [np.nftIssuedInAppNotificationEnabled, np.nftBoughtMailNotificationEnabled]
    case 'AuctionBidMadeEventData':
      return [np.auctionBidMadeInAppNotificationEnabled, np.auctionBidMadeMailNotificationEnabled]
    case 'AuctionBidCanceledEventData':
      return [
        np.auctionCanceledInAppNotificationEnabled,
        np.auctionBidCanceledMailNotificationEnabled,
      ]
    case 'AuctionCanceledEventData':
      return [np.auctionCanceledInAppNotificationEnabled, np.auctionCanceledMailNotificationEnabled]
    case 'EnglishAuctionSettledEventData':
      return [
        np.englishAuctionSettledInAppNotificationEnabled,
        np.englishAuctionSettledMailNotificationEnabled,
      ]
    case 'BidMadeCompletingAuctionEventData':
      return [
        np.bidMadeCompletingAuctionInAppNotificationEnabled,
        np.bidMadeCompletingAuctionMailNotificationEnabled,
      ]
    case 'OpenAuctionBidAcceptedEventData':
      return [
        np.openAuctionBidAcceptedInAppNotificationEnabled,
        np.openAuctionBidAcceptedMailNotificationEnabled,
      ]
    case 'NftSellOrderMadeEventData':
      return [
        np.nftSellOrderMadeInAppNotificationEnabled,
        np.nftSellOrderMadeMailNotificationEnabled,
      ]
    case 'NftBoughtEventData':
      return [np.nftBoughtInAppNotificationEnabled, np.nftBoughtMailNotificationEnabled]
    case 'BuyNowCanceledEventData':
      return [np.buyNowCanceledInAppNotificationEnabled, np.buyNowCanceledMailNotificationEnabled]
    case 'BuyNowPriceUpdatedEventData':
      return [
        np.buyNowPriceUpdatedInAppNotificationEnabled,
        np.buyNowPriceUpdatedMailNotificationEnabled,
      ]
    case 'MetaprotocolTransactionStatusEventData':
      return [
        np.metaprotocolTransactionStatusInAppNotificationEnabled,
        np.metaprotocolTransactionStatusMailNotificationEnabled,
      ]
    case 'ChannelRewardClaimedEventData':
      return [
        np.channelRewardClaimedInAppNotificationEnabled,
        np.channelRewardClaimedMailNotificationEnabled,
      ]
    case 'ChannelRewardClaimedAndWithdrawnEventData':
      return [
        np.channelRewardClaimedAndWithdrawnInAppNotificationEnabled,
        np.channelRewardClaimedAndWithdrawnMailNotificationEnabled,
      ]
    case 'ChannelFundsWithdrawnEventData':
      return [
        np.channelFundsWithdrawnInAppNotificationEnabled,
        np.channelFundsWithdrawnMailNotificationEnabled,
      ]
    case 'ChannelPayoutsUpdatedEventData':
      return [
        np.channelPayoutsUpdatedInAppNotificationEnabled,
        np.channelPayoutsUpdatedMailNotificationEnabled,
      ]
    case 'ChannelPaymentMadeEventData':
      return [
        np.channelPaymentMadeInAppNotificationEnabled,
        np.channelPaymentMadeMailNotificationEnabled,
      ]
    case 'MemberBannedFromChannelEventData':
      return [
        np.memberBannedFromChannelInAppNotificationEnabled,
        np.memberBannedFromChannelMailNotificationEnabled,
      ]
    case 'ChannelCreatedEventData':
      return [
        np.channelCreatedInAppNotificationEnabled,
        np.channelCreatedMailNotificationEnabled,
      ]
    case 'NewChannelFollowerNotificationData':
      return [
        np.newChannelFollowerInAppNotificationPreferences,
        np.newChannelFollowerMailNotificationPreferences,
      ]
    default:
      return [false, false]
  }
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
      const [shouldSendAppNotification, shouldSendMail] = await preferencesForNotification(
        em,
        accountId,
        data
      )
      if (shouldSendAppNotification || shouldSendMail) {
        const nextOffchainNotificationId = parseInt(
          (
            await em
              .getRepository(NextEntityId)
              .findOne({ where: { entityName: 'OffChainNotification' }, lock: { mode: 'pessimistic_write' } })
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
          const statusCode = await mailNotifier.send()
          notification.mailSent = statusCode === 202
        }
        await em.save([
          notification,
          new NextEntityId({ entityName: 'OffChainNotification', nextId: nextOffchainNotificationId + 1 })
        ])
      }
    }
    return
  }
}
