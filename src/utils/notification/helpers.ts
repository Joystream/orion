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
  Membership,
} from '../../model'
import { getNextIdForEntity } from '../nextEntityId'
import { sgSendMail } from '../mail'
import { ConfigVariable, config } from '../config'
import { Flat } from 'lodash'
import { notificationEmailContent } from '../../auth-server/emails'

function notificationPrefAllTrue(): NotificationPreference {
  return new NotificationPreference({ inAppEnabled: true, emailEnabled: true })
}

export function defaultNotificationPreferences(): AccountNotificationPreferences {
  return new AccountNotificationPreferences({
    channelExcludedFromApp: notificationPrefAllTrue(),
    videoExcludedFromApp: notificationPrefAllTrue(),
    videoFeaturedAsHero: notificationPrefAllTrue(),
    videoFeaturedOnCategoryPage: notificationPrefAllTrue(),
    nftFeaturedOnMarketPlace: notificationPrefAllTrue(),
    newChannelFollower: notificationPrefAllTrue(),
    videoCommentCreated: notificationPrefAllTrue(),
    videoLiked: notificationPrefAllTrue(),
    videoDisliked: notificationPrefAllTrue(),
    yppChannelSuspended: notificationPrefAllTrue(),
    yppChannelVerified: notificationPrefAllTrue(),
    nftBought: notificationPrefAllTrue(),
    bidMadeOnNft: notificationPrefAllTrue(),
    royaltyReceived: notificationPrefAllTrue(),
    channelPaymentReceived: notificationPrefAllTrue(),
    channelReceivedFundsFromWg: notificationPrefAllTrue(),
    newPayoutUpdatedByCouncil: notificationPrefAllTrue(),
    channelFundsWithdrawn: notificationPrefAllTrue(),

    channelCreated: notificationPrefAllTrue(),
    replyToComment: notificationPrefAllTrue(),
    reactionToComment: notificationPrefAllTrue(),
    videoPosted: notificationPrefAllTrue(),
    newNftOnAuction: notificationPrefAllTrue(),
    newNftOnSale: notificationPrefAllTrue(),
    higherBidThanYoursMade: notificationPrefAllTrue(),
    timedAuctionExpired: notificationPrefAllTrue(),
    auctionWon: notificationPrefAllTrue(),
    auctionLost: notificationPrefAllTrue(),
    openAuctionBidCanBeWithdrawn: notificationPrefAllTrue(),
    fundsFromCouncilReceived: notificationPrefAllTrue(),
    fundsToExternalWalletSent: notificationPrefAllTrue(),
    fundsFromWgReceived: notificationPrefAllTrue(),
  })
}

export function preferencesForNotification(
  preferences: AccountNotificationPreferences,
  notificationType: NotificationType
): NotificationPreference {
  switch (notificationType.isTypeOf) {
    case 'ChannelExcluded':
      return preferences.channelExcludedFromApp
    case 'VideoExcluded':
      return preferences.videoExcludedFromApp
    case 'VideoFeaturedAsCategoryHero':
      return preferences.videoFeaturedAsHero
    case 'VideoFeaturedOnCategoryPage':
      return preferences.videoFeaturedOnCategoryPage
    case 'NftFeaturedOnMarketPlace':
      return preferences.nftFeaturedOnMarketPlace
    case 'NewChannelFollower':
      return preferences.newChannelFollower
    case 'CommentPostedToVideo':
      return preferences.videoCommentCreated
    case 'VideoLiked':
      return preferences.videoLiked
    case 'VideoDisliked':
      return preferences.videoDisliked
    case 'EnglishAuctionSettled':
      return preferences.timedAuctionExpired
    case 'ChannelSuspended':
      return preferences.yppChannelSuspended
    case 'ChannelVerified':
      return preferences.yppChannelVerified
    case 'NftPurchased':
      return preferences.nftBought
    case 'CreatorReceivesAuctionBid':
      return preferences.bidMadeOnNft
    case 'RoyaltyPaid':
      return preferences.royaltyReceived
    case 'DirectChannelPaymentByMember':
      return preferences.channelPaymentReceived
    case 'ChannelFundsWithdrawn':
      return preferences.channelFundsWithdrawn
    case 'ChannelCreated':
      return preferences.channelCreated
    case 'CommentReply':
      return preferences.replyToComment
    case 'ReactionToComment':
      return preferences.reactionToComment
    case 'VideoPosted':
      return preferences.videoPosted
    case 'NewAuction':
      return preferences.newNftOnAuction
    case 'NewNftOnSale':
      return preferences.newNftOnSale
    case 'EnglishAuctionLost':
      return preferences.auctionLost
    case 'EnglishAuctionWon':
      return preferences.auctionWon
    case 'OpenAuctionLost':
      return preferences.auctionLost
    case 'OpenAuctionWon':
      return preferences.auctionWon
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
  // case: orion is deployed and resynching happens, since there are no accounts (before migration) yet we do not create notifications
  // this will prevent notifications from being created twice after a new orion release
  if (account) {
    const notificationChainTag = event ? 'OnChainNotification' : 'OffChainNotification'
    // create notification as disabled = true
    const { inAppEnabled, emailEnabled } = preferencesForNotification(
      account.notificationPreferences,
      notificationType
    )
    // create notification (for the notification center)
    const nextNotificationId = await getNextIdForEntity(em, notificationChainTag)
    // case: in case the orion_processor is restarted (but not orion_db) and resynching happens not deposit the same notification again
    if (event) {
      const notification = await em
        .getRepository(Notification)
        .findOneBy({ id: nextNotificationId.toString() })
      if (notification) {
        return
      }
    }
    const notification = new Notification({
      id: notificationChainTag + '-' + nextNotificationId.toString(),
      accountId: account.id,
      notificationType,
      eventId: event?.id,
      status: new Unread(),
      createdAt: new Date(),
    })

    // deliver via mail if enabled
    if (emailEnabled) {
      // handle the case gracefully in case of error
      try {
        await deliverNotificationViaEmail(em, account, notification)
      } catch (e) {
        console.error(e)
      }
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

async function deliverNotificationViaEmail(
  em: EntityManager,
  toAccount: Account,
  notification: Notification
): Promise<void> {
  const nextEntityId = await getNextIdForEntity(em, 'OffChainNotificationEmailDelivery')
  const notificationDelivery = new NotificationEmailDelivery({
    id: nextEntityId.toString(),
    notificationId: notification.id,
    deliveryAttemptAt: new Date(),
  })
  const appName = await config.get(ConfigVariable.AppName, em)
  const membership = await em
    .getRepository(Membership)
    .findOne({ select: { handle: true }, where: { id: toAccount.membershipId } })
  const preferencePageLink = `https://${await config.get(
    ConfigVariable.AppRootDomain,
    em
  )}/member/${membership?.handle}/?tab=preferences`
  const content = notificationEmailContent({
    notificationText: notification.notificationType.data.text,
    notificationLink: notification.notificationType.data.linkPage,
    preferencePageLink,
    appName,
  })

  const resp = await sgSendMail({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to: toAccount.email,
    subject: `New notification from ${appName}!`,
    content,
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
