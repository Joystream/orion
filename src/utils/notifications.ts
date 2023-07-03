import { Flat } from 'lodash'
import { EntityManager } from 'typeorm'
import {
  Account,
  EventData,
  NextEntityId,
  NotificationType,
  OffChainNotification,
  OffChainNotificationData,
} from '../model'
import { ConfigVariable, config } from './config'
import { MailNotifier } from './mail'

export type NotificationPreferences = {
  commentCreatedInAppNotificationEnabled: boolean
  commentTextUpdatedInAppNotificationEnabled: boolean
  openAuctionStartedInAppNotificationEnabled: boolean
  englishAuctionStartedInAppNotificationEnabled: boolean
  nftIssuedInAppNotificationEnabled: boolean
  auctionBidMadeInAppNotificationEnabled: boolean
  auctionBidCanceledInAppNotificationEnabled: boolean
  auctionCanceledInAppNotificationEnabled: boolean
  englishAuctionSettledInAppNotificationEnabled: boolean
  bidMadeCompletingAuctionInAppNotificationEnabled: boolean
  openAuctionBidAcceptedInAppNotificationEnabled: boolean
  nftSellOrderMadeInAppNotificationEnabled: boolean
  nftBoughtInAppNotificationEnabled: boolean
  buyNowCanceledInAppNotificationEnabled: boolean
  buyNowPriceUpdatedInAppNotificationEnabled: boolean
  metaprotocolTransactionStatusInAppNotificationEnabled: boolean
  channelRewardClaimedInAppNotificationEnabled: boolean
  channelRewardClaimedAndWithdrawnInAppNotificationEnabled: boolean
  channelFundsWithdrawnInAppNotificationEnabled: boolean
  channelPayoutsUpdatedInAppNotificationEnabled: boolean
  channelPaymentMadeInAppNotificationEnabled: boolean
  memberBannedFromChannelInAppNotificationEnabled: boolean
  channelCreatedInAppNotificationEnabled: boolean
  commentCreatedMailNotificationEnabled: boolean
  commentTextUpdatedMailNotificationEnabled: boolean
  openAuctionStartedMailNotificationEnabled: boolean
  englishAuctionStartedMailNotificationEnabled: boolean
  nftIssuedMailNotificationEnabled: boolean
  auctionBidMadeMailNotificationEnabled: boolean
  auctionBidCanceledMailNotificationEnabled: boolean
  auctionCanceledMailNotificationEnabled: boolean
  englishAuctionSettledMailNotificationEnabled: boolean
  bidMadeCompletingAuctionMailNotificationEnabled: boolean
  openAuctionBidAcceptedMailNotificationEnabled: boolean
  nftSellOrderMadeMailNotificationEnabled: boolean
  nftBoughtMailNotificationEnabled: boolean
  buyNowCanceledMailNotificationEnabled: boolean
  buyNowPriceUpdatedMailNotificationEnabled: boolean
  metaprotocolTransactionStatusMailNotificationEnabled: boolean
  channelRewardClaimedMailNotificationEnabled: boolean
  channelRewardClaimedAndWithdrawnMailNotificationEnabled: boolean
  channelFundsWithdrawnMailNotificationEnabled: boolean
  channelPayoutsUpdatedMailNotificationEnabled: boolean
  channelPaymentMadeMailNotificationEnabled: boolean
  memberBannedFromChannelMailNotificationEnabled: boolean
  channelCreatedMailNotificationEnabled: boolean
  newChannelFollowerInAppNotificationPreferences: boolean
  newChannelFollowerMailNotificationPreferences: boolean
}
export function defaultNotificationPreferences(): NotificationPreferences {
  return {
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
  } // TODo: format ordinately by pairs
}

// [app notification, email notification] preference
export async function preferencesForNotification(
  account: Account,
  notificationType: EventData | OffChainNotificationData
): Promise<[boolean, boolean]> {
  switch (notificationType.isTypeOf) {
    case 'CommentCreatedEventData':
      return [
        account.commentCreatedInAppNotificationEnabled,
        account.commentCreatedMailNotificationEnabled,
      ]
    case 'CommentTextUpdatedEventData':
      return [
        account.commentCreatedInAppNotificationEnabled,
        account.commentCreatedMailNotificationEnabled,
      ]
    case 'OpenAuctionStartedEventData':
      return [
        account.openAuctionStartedInAppNotificationEnabled,
        account.openAuctionStartedMailNotificationEnabled,
      ]
    case 'EnglishAuctionStartedEventData':
      return [
        account.englishAuctionStartedInAppNotificationEnabled,
        account.englishAuctionStartedMailNotificationEnabled,
      ]
    case 'NftIssuedEventData':
      return [account.nftIssuedInAppNotificationEnabled, account.nftBoughtMailNotificationEnabled]
    case 'AuctionBidMadeEventData':
      return [
        account.auctionBidMadeInAppNotificationEnabled,
        account.auctionBidMadeMailNotificationEnabled,
      ]
    case 'AuctionBidCanceledEventData':
      return [
        account.auctionCanceledInAppNotificationEnabled,
        account.auctionBidCanceledMailNotificationEnabled,
      ]
    case 'AuctionCanceledEventData':
      return [
        account.auctionCanceledInAppNotificationEnabled,
        account.auctionCanceledMailNotificationEnabled,
      ]
    case 'EnglishAuctionSettledEventData':
      return [
        account.englishAuctionSettledInAppNotificationEnabled,
        account.englishAuctionSettledMailNotificationEnabled,
      ]
    case 'BidMadeCompletingAuctionEventData':
      return [
        account.bidMadeCompletingAuctionInAppNotificationEnabled,
        account.bidMadeCompletingAuctionMailNotificationEnabled,
      ]
    case 'OpenAuctionBidAcceptedEventData':
      return [
        account.openAuctionBidAcceptedInAppNotificationEnabled,
        account.openAuctionBidAcceptedMailNotificationEnabled,
      ]
    case 'NftSellOrderMadeEventData':
      return [
        account.nftSellOrderMadeInAppNotificationEnabled,
        account.nftSellOrderMadeMailNotificationEnabled,
      ]
    case 'NftBoughtEventData':
      return [account.nftBoughtInAppNotificationEnabled, account.nftBoughtMailNotificationEnabled]
    case 'BuyNowCanceledEventData':
      return [
        account.buyNowCanceledInAppNotificationEnabled,
        account.buyNowCanceledMailNotificationEnabled,
      ]
    case 'BuyNowPriceUpdatedEventData':
      return [
        account.buyNowPriceUpdatedInAppNotificationEnabled,
        account.buyNowPriceUpdatedMailNotificationEnabled,
      ]
    case 'MetaprotocolTransactionStatusEventData':
      return [
        account.metaprotocolTransactionStatusInAppNotificationEnabled,
        account.metaprotocolTransactionStatusMailNotificationEnabled,
      ]
    case 'ChannelRewardClaimedEventData':
      return [
        account.channelRewardClaimedInAppNotificationEnabled,
        account.channelRewardClaimedMailNotificationEnabled,
      ]
    case 'ChannelRewardClaimedAndWithdrawnEventData':
      return [
        account.channelRewardClaimedAndWithdrawnInAppNotificationEnabled,
        account.channelRewardClaimedAndWithdrawnMailNotificationEnabled,
      ]
    case 'ChannelFundsWithdrawnEventData':
      return [
        account.channelFundsWithdrawnInAppNotificationEnabled,
        account.channelFundsWithdrawnMailNotificationEnabled,
      ]
    case 'ChannelPayoutsUpdatedEventData':
      return [
        account.channelPayoutsUpdatedInAppNotificationEnabled,
        account.channelPayoutsUpdatedMailNotificationEnabled,
      ]
    case 'ChannelPaymentMadeEventData':
      return [
        account.channelPaymentMadeInAppNotificationEnabled,
        account.channelPaymentMadeMailNotificationEnabled,
      ]
    case 'MemberBannedFromChannelEventData':
      return [
        account.memberBannedFromChannelInAppNotificationEnabled,
        account.memberBannedFromChannelMailNotificationEnabled,
      ]
    case 'ChannelCreatedEventData':
      return [
        account.channelCreatedInAppNotificationEnabled,
        account.channelCreatedMailNotificationEnabled,
      ]
    case 'NewChannelFollowerNotificationData':
      return [
        account.newChannelFollowerInAppNotificationPreferences,
        account.newChannelFollowerMailNotificationPreferences,
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
        account,
        data
      )
      if (shouldSendAppNotification || shouldSendMail) {
        const nextOffchainNotificationId = parseInt(
          (
            await em
              .getRepository(NextEntityId)
              .findOne({
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
