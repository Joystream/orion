import { EntityManager } from 'typeorm'
import {
  Account,
  AccountNotificationPreferences,
  NextEntityId,
  NotificationPreference,
  Notification,
  Event,
  Unread,
  NotificationInAppDelivery,
  CreatorNotificationData,
  MemberNotificationData,
  NotificationEmailDelivery,
  EmailDeliveryStatus,
  CreatorRecipient,
  MemberRecipient,
} from '../../model'
import { getNextIdForEntity } from '../nextEntityId'
import { Flat } from 'lodash'
import { EntityManagerOverlay } from '../overlay'
import { uniqueId } from '../crypto'

export const RUNTIME_NOTIFICATION_ID_TAG = 'RuntimeNotification'
export const OFFCHAIN_NOTIFICATION_ID_TAG = 'OffchainNotification'

export class CreatorRecipientParams {
  constructor(data: CreatorNotificationData, channelId: string) {
    this.data = data
    this.channelId = channelId
  }

  public data: CreatorNotificationData
  public channelId: string
}

export class MemberRecipientParams {
  constructor(data: MemberNotificationData, memberId: string) {
    this.data = data
    this.memberId = memberId
  }

  public data: MemberNotificationData
  public memberId: string
}

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
  notificationType: CreatorNotificationData | MemberNotificationData
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

async function addOffChainNotification(
  em: EntityManager,
  account: Flat<Account>,
  notificationType: CreatorRecipientParams | MemberRecipientParams
) {
  // get notification Id from orion_db in any case
  const nextNotificationId = await getNextIdForEntity(em, OFFCHAIN_NOTIFICATION_ID_TAG)

  const notification = createNotification(nextNotificationId.toString(), account.id)

  await createNotificationRecipient(em, notification.id, notificationType)

  const pref = preferencesForNotification(account.notificationPreferences, notificationType.data)
  await deliverNotifications(em, notification, pref)

  await saveNextNotificationId(em, nextNotificationId + 1, OFFCHAIN_NOTIFICATION_ID_TAG)

  await em.save(notification)
}

async function addRuntimeNotification(
  overlay: EntityManagerOverlay,
  account: Flat<Account>,
  notificationType: CreatorRecipientParams | MemberRecipientParams,
  event: Event
) {
  // get notification Id from orion_db in any case
  const em = overlay.getEm()
  const nextNotificationId = await getNextIdForEntity(em, RUNTIME_NOTIFICATION_ID_TAG)

  // check that on-notification is not already present in orion_db in case the processor has been restarted (but not orion_db)
  const existingNotification = await overlay
    .getRepository(Notification)
    .getById(nextNotificationId.toString())

  if (existingNotification) {
    return
  }

  const notification = createNotification(nextNotificationId.toString(), account.id, event)
  overlay.getRepository(Notification).new(notification)

  await createNotificationRecipient(em, notification.id, notificationType)

  const pref = preferencesForNotification(account.notificationPreferences, notificationType.data)
  await deliverNotifications(overlay, notification as Flat<Notification>, pref)

  await saveNextNotificationId(em, nextNotificationId + 1, RUNTIME_NOTIFICATION_ID_TAG)

  return notification.id
}

// notification in app delivery is also created once and then migrated
async function createInAppNotification(
  store: EntityManagerOverlay | EntityManager,
  notification: Flat<Notification>
) {
  const notificationDelivery = new NotificationInAppDelivery({
    id: uniqueId(32),
    notificationId: notification.id,
  })
  if (store instanceof EntityManagerOverlay) {
    ;(store as EntityManagerOverlay).getRepository(NotificationInAppDelivery).new({
      ...notificationDelivery,
    })
  } else {
    const inAppNotification = new NotificationInAppDelivery({
      ...notificationDelivery,
    })
    await (store as EntityManager).save(inAppNotification)
  }
}

// notification email delivery is also created once and then migrated
async function createEmailNotification(
  store: EntityManagerOverlay | EntityManager,
  notification: Flat<Notification>
) {
  const notificationDelivery = new NotificationEmailDelivery({
    id: uniqueId(32),
    notificationId: notification.id,
    deliveryStatus: EmailDeliveryStatus.Unsent,
  })

  if (store instanceof EntityManagerOverlay) {
    ;(store as EntityManagerOverlay).getRepository(NotificationEmailDelivery).new({
      ...notificationDelivery,
    })
  } else {
    const inAppNotification = new NotificationEmailDelivery({
      ...notificationDelivery,
    })
    await (store as EntityManager).save(inAppNotification)
  }
}

async function deliverNotifications(
  store: EntityManagerOverlay | EntityManager,
  notification: Flat<Notification>,
  { inAppEnabled, emailEnabled }: NotificationPreference
) {
  if (inAppEnabled) {
    await createInAppNotification(store, notification)
  }

  if (emailEnabled) {
    await createEmailNotification(store, notification)
  }
}

// the logic is such that the notification is created (inserted) only once in orion_db
// to keep this invariant true that when the processor is restarted we need deterministic identifiers to fetch existing notifications
const createNotification = (nextNotificationId: string, accountId: string, event?: Event) => {
  const id = event
    ? 'RuntimeNotification' + '-' + nextNotificationId.toString()
    : 'OffChainNotification' + '-' + nextNotificationId.toString()
  return new Notification({
    id: id,
    accountId: accountId,
    status: new Unread(),
    eventId: event?.id,
    createdAt: new Date(),
  })
}

export const addNotification = async (
  store: EntityManagerOverlay | EntityManager,
  account: Flat<Account> | null,
  notificationType: CreatorRecipientParams | MemberRecipientParams,
  event?: Event
) => {
  if (!account) {
    // if account is not in orion_db skip.
    // this is how we keep the invariant that notifications are created only once in orion_db during the migration step
    // since account data migration is performed after all the blocks have been synced
    return
  }
  if (event) {
    await addRuntimeNotification(store as EntityManagerOverlay, account, notificationType, event)
  } else {
    await addOffChainNotification(store as EntityManager, account, notificationType)
  }
}

async function saveNextNotificationId(
  em: EntityManager,
  nextNotificationId: number,
  entityName: string
) {
  const nextEntityId = new NextEntityId({
    entityName: entityName,
    nextId: nextNotificationId,
  })
  await em.save(nextEntityId)
}

const createNotificationRecipient = async (
  store: EntityManagerOverlay | EntityManager,
  notificationId: string,
  notificationType: CreatorRecipientParams | MemberRecipientParams
) => {
  const recipient =
    notificationType instanceof CreatorRecipientParams
      ? new CreatorRecipient({
          id: uniqueId(32),
          notificationId: notificationId,
          channelId: (notificationType as CreatorRecipientParams).channelId,
          data: (notificationType as CreatorRecipientParams).data,
        })
      : new MemberRecipient({
          id: uniqueId(32),
          notificationId: notificationId,
          membershipId: (notificationType as MemberRecipientParams).memberId,
          data: (notificationType as MemberRecipientParams).data,
        })

  if (store instanceof EntityManagerOverlay) {
    if (recipient instanceof CreatorRecipient) {
      ;(store as EntityManagerOverlay).getRepository(CreatorRecipient).new({
        ...recipient,
      })
    } else {
      ;(store as EntityManagerOverlay).getRepository(MemberRecipient).new({
        ...recipient,
      })
    }
  } else {
    await (store as EntityManager).save(recipient)
  }
}
