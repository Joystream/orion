import { EntityManager } from 'typeorm'
import {
  Account,
  AccountNotificationPreferences,
  NextEntityId,
  NotificationPreference,
  EmailDeliveryStatus,
  NotificationType,
  Notification,
  Event,
  Unread,
  NotificationInAppDelivery,
  NotificationEmailDelivery,
} from '../../model'
import { getNextIdForEntity } from '../nextEntityId'
import { sgSendMail } from '../mail'
import { ConfigVariable, config } from '../config'
import { Flat } from 'lodash'

function notificationPrefAllTrue(): NotificationPreference {
  return new NotificationPreference({ inAppEnabled: true, emailEnabled: true })
}

export function defaultNotificationPreferences(): AccountNotificationPreferences {
  return new AccountNotificationPreferences({
    channelExcludedFromAppNotificationEnabled: notificationPrefAllTrue(),
    videoExcludedFromAppNotificationEnabled: notificationPrefAllTrue(),
    videoFeaturedAsHeroNotificationEnabled: notificationPrefAllTrue(),
    videoFeaturedOnCategoryPageNotificationEnabled: notificationPrefAllTrue(),
    nftFeaturedOnMarketPlaceNotificationEnabled: notificationPrefAllTrue(),
    newChannelFollowerNotificationEnabled: notificationPrefAllTrue(),
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

export function preferencesForNotification(
  preferences: AccountNotificationPreferences,
  notificationType: NotificationType
): NotificationPreference {
  switch (notificationType.isTypeOf) {
    case 'ChannelExcluded':
      return preferences.channelExcludedFromAppNotificationEnabled
    case 'VideoExcluded':
      return preferences.videoExcludedFromAppNotificationEnabled
    case 'VideoFeaturedAsCategoryHero':
      return preferences.videoFeaturedAsHeroNotificationEnabled
    case 'VideoFeaturedOnCategoryPage':
      return preferences.videoFeaturedOnCategoryPageNotificationEnabled
    case 'NftFeaturedOnMarketPlace':
      return preferences.nftFeaturedOnMarketPlaceNotificationEnabled
    case 'NewChannelFollower':
      return preferences.newChannelFollowerNotificationEnabled
    case 'CommentPostedToVideo':
      return preferences.videoCommentCreatedNotificationEnabled
    case 'VideoLiked':
      return preferences.videoLikedNotificationEnabled
    case 'VideoDisliked':
      return preferences.videoDislikedNotificationEnabled
    case 'YppSignupSuccessful':
      return preferences.yppSignupSuccessfulNotificationEnabled
    case 'ChannelVerified':
      return preferences.yppChannelVerifiedNotificationEnabled
    case 'NftPurchased':
      return preferences.nftBoughtNotificationEnabled
    case 'CreatorReceivesAuctionBid':
      return preferences.bidMadeOnNftNotificationEnabled
    case 'RoyaltyPaid':
      return preferences.royaltyReceivedNotificationEnabled
    case 'DirectChannelPaymentByMember':
      return preferences.channelPaymentReceivedNotificationEnabled
    case 'ChannelFundsWithdrawn':
      return preferences.channelFundsWithdrawnNotificationEnabled
    case 'ChannelCreated':
      return preferences.channelCreatedNotificationEnabled
    case 'CommentReply':
      return preferences.replyToCommentNotificationEnabled
    case 'ReactionToComment':
      return preferences.reactionToCommentNotificationEnabled
    case 'VideoPosted':
      return preferences.videoPostedNotificationEnabled
    case 'NewAuction':
      return preferences.newNftOnAuctionNotificationEnabled
    case 'NewNftOnSale':
      return preferences.newNftOnSaleNotificationEnabled
    case 'EnglishAuctionLost':
      return preferences.auctionLostNotificationEnabled
    case 'EnglishAuctionWon':
      return preferences.auctionWonNotificationEnabled
    case 'OpenAuctionLost':
      return preferences.auctionLostNotificationEnabled
    case 'OpenAuctionWon':
      return preferences.auctionWonNotificationEnabled
    default:
      return new NotificationPreference({ inAppEnabled: false, emailEnabled: false })
  }
}

export async function addNotification(
  em: EntityManager,
  account: Flat<Account> | null,
  notificationType: NotificationType,
  event?: Event
) {
  if (account) {
    const notificationChainTag = event ? 'OffChainNotification' : 'OnChainNotification'
    // create notification as disabled = true
    const { inAppEnabled, emailEnabled } = preferencesForNotification(
      account!.notificationPreferences,
      notificationType
    )
    // create notification (for the notification center)
    const nextNotificationId = await getNextIdForEntity(em, notificationChainTag)
    const notification = new Notification({
      id: notificationChainTag + '-' + nextNotificationId.toString(),
      accountId: account!.id,
      notificationType,
      eventId: event?.id,
      status: new Unread(),
    })

    // deliver via mail if enabled
    if (emailEnabled) {
      await deliverOffChainNotificationViaEmail(em, account!.email, notification)
    }

    // deliver via in app if enabled
    if (inAppEnabled) {
      const deliveryId = await getNextIdForEntity(em, 'NotificationInAppDelivery')
      const inAppDelivery = new NotificationInAppDelivery({
        id: deliveryId.toString(),
        notificationId: notification.id,
      })
      await em.save([
        inAppDelivery,
        new NextEntityId({
          entityName: 'NotificationInAppDelivery',
          nextId: deliveryId + 1,
        }),
      ])
    }

    const newOffChainNotificationNextEntityId = new NextEntityId({
      entityName: notificationChainTag,
      nextId: nextNotificationId + 1,
    })
    await em.save([notification, newOffChainNotificationNextEntityId])
  }
}

async function deliverOffChainNotificationViaEmail(
  em: EntityManager,
  to: string,
  notification: Notification
): Promise<void> {
  const nextEntityId = await getNextIdForEntity(em, 'OffChainNotificationEmailDelivery')
  const notificationDelivery = new NotificationEmailDelivery({
    id: nextEntityId.toString(),
    notificationId: notification.id,
    deliveryAttemptAt: new Date(),
  })
  const appName = await config.get(ConfigVariable.AppName, em)
  const resp = await sgSendMail({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to,
    subject: `New notification from ${appName}!`,
    content: notification.notificationType.data.text,
  })
  if (resp?.statusCode === 202 || resp?.statusCode === 200) {
    notificationDelivery.deliveryStatus = EmailDeliveryStatus.Success
  } else {
    notificationDelivery.deliveryStatus = EmailDeliveryStatus.Failure
  }
  await em.save([
    notificationDelivery,
    new NextEntityId({
      entityName: 'OffChainNotificationEmailDelivery',
      nextId: nextEntityId + 1,
    }),
  ])
}
