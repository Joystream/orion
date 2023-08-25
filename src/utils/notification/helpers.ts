import { EntityManager } from 'typeorm'
import {
  Account,
  AccountNotificationPreferences,
  NextEntityId,
  NotificationPreference,
  NotificationType,
  Notification,
  Event,
  Unread,
  NotificationInAppDelivery,
} from '../../model'
import { getNextIdForEntity } from '../nextEntityId'
import { Flat } from 'lodash'
import { deliverNotificationViaEmail } from './mail'
import { EntityManagerOverlay } from '../overlay'

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
    case 'NftRoyaltyPaid':
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

export type OnChain = {
  store: EntityManagerOverlay
  event: Event
}

export type OffChain = {
  store: EntityManager
}

export type NotificationParameters = OnChain | OffChain

// invoked by orion_processor and uses the EntityManagerOverlay as a store
export async function addNotification(
  em: EntityManager,
  account: Flat<Account> | null,
  notificationType: NotificationType,
  event?: Event
) {
  // whether the notification is being added by the processor (i.e. on chain)
  const notificationByProcessor = event !== undefined
  // case: orion is deployed and resynching happens, since there are no accounts (before migration) yet we do not create notifications
  // this will prevent notifications from being created twice after a new orion release
  if (account) {
    const notificationChainTag = notificationByProcessor
      ? 'OnChainNotification'
      : 'OffChainNotification'
    const { inAppEnabled, emailEnabled } = preferencesForNotification(
      account.notificationPreferences,
      notificationType
    )
    // get notification Id from orion_db in any case
    const nextNotificationId = await getNextIdForEntity(em, notificationChainTag)

    // check that on-notification is not already present in orion_db in case the processor has been restarted (but not orion_db)
    if (notificationByProcessor) {
      const existingNotification = await em
        .getRepository(Notification)
        .findOneBy({ id: nextNotificationId.toString() })
      if (existingNotification) {
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
