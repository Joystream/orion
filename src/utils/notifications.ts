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
} from '../model'
import { getNextIdForEntity } from './nextEntityId'
import { sgSendMail } from './mail'
import { ConfigVariable, config } from './config'

export function notificationPrefAllTrue(): NotificationPreference {
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
  accounts: (Account | null)[],
  notificationType: NotificationType,
  event?: Event
) {
  const notificationChainTag = event ? 'OffChainNotification' : 'OnChainNotification'
  // filter accounts that are not null
  for (const account of accounts.map((account) => account)) {
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

const channelExcludedText = (channelTitle: string) => {
  return `Your channel ${channelTitle} has been excluded`
}
const videoExcludedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been excluded`
}

const videoFeaturedAsHeroText = (videoTitle: string) => {
  return `Your video ${videoTitle} has been featured as Hero`
}

const videoFeaturedOnCategoryPageText = (videoTitle: string, categoryTitle: string) => {
  return `Your video ${videoTitle} has been featured on the ${categoryTitle} category page`
}

const nftFeaturedOnMarketplaceText = (videoTitle: string) => {
  return `Your nft for ${videoTitle} has been featured on the marketplace`
}

const newChannelFollowerText = (channelTitle: string) => {
  return `You have a new follower on channel ${channelTitle}`
}

const commentPostedToVideoText = (videoTitle: string, memberHandle: string) => {
  return `${memberHandle} left a comment on Your video ${videoTitle}`
}

const videoLikedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has a new like`
}

const videoDislikedText = (videoTitle: string) => {
  return `Your video ${videoTitle} has a new dislike`
}

const channelVerifiedViaYPPText = () => {
  return `Your channel has been verified via YPP`
}

const nftPurchasedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `Your NFT for ${videoTitle} has been purchased by ${memberHandle} for ${nftPrice}`
}

const nftBidReceivedText = (videoTitle: string, memberHandle: string, nftPrice: string) => {
  return `${memberHandle} placed a bid of ${nftPrice} on nft: ${videoTitle}`
}

const nftRoyaltyPaymentReceivedText = (nftPrice: string, videoTitle: string) => {
  return `you received ${nftPrice} royalties for your nft: ${videoTitle}`
}

const channelReceivedDirectPaymentText = (memberHandle: string, nftPrice: string) => {
  return `${memberHandle} transferred ${nftPrice} to your channel`
}

const timedAuctionExpiredText = (videoTitle: string) => {
  return `Timed auction expired for your nft: ${videoTitle}`
}

const openAuctionExpiredText = (videoTitle: string) => {
  return `Open auction settled for your nft: ${videoTitle}`
}

const channelCreatedText = (channelTitle: string) => {
  return `${channelTitle} has been created`
}

const commentRepliedText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} has replied to your comment under ${videoTitle}`
}

const commentReactedText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} has reacted to your comment under ${videoTitle}`
}

const newVideoPostedText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just posted a new video ${videoTitle}`
}

const newNftOnAuctionText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just started an auction of nft: ${videoTitle}`
}

const newNftOnSaleText = (channelTitle: string, videoTitle: string) => {
  return `${channelTitle} just started the sale of nft ${videoTitle}`
}

const nftBidOutbidText = (memberHandle: string, videoTitle: string) => {
  return `${memberHandle} placed a higher bid on NFT ${videoTitle}`
}

const openAuctionBidWonText = (videoTitle: string) => {
  return `You won an open auction for nft: ${videoTitle}`
}

const timedAuctionBidWonText = (videoTitle: string) => {
  return `You won a timed auction for nft: ${videoTitle}`
}

const openAuctionBidLostText = (videoTitle: string) => {
  return `You lost an open auction for nft: ${videoTitle}`
}

const timedAuctionBidLostText = (videoTitle: string) => {
  return `You lost an timed auction for nft: ${videoTitle}`
}

const fundsWithdrawnFromChannelText = (amount: string) => {
  return `Sucessfully transferred ${amount} JOY from your channel`
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
