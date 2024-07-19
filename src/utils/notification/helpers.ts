import { Flat } from 'lodash'
import { EntityManager } from 'typeorm'
import {
  Account,
  AccountNotificationPreferences,
  Event,
  NextEntityId,
  Notification,
  NotificationEmailDelivery,
  NotificationPreference,
  NotificationType,
  RecipientType,
  Unread,
} from '../../model'
import { getCurrentBlockHeight } from '../blockHeight'
import { uniqueId } from '../crypto'
import { getNextIdForEntity } from '../nextEntityId'
import { EntityManagerOverlay } from '../overlay'

export const RUNTIME_NOTIFICATION_ID_TAG = 'RuntimeNotification'
export const OFFCHAIN_NOTIFICATION_ID_TAG = 'OffchainNotification'

export function notificationPrefAllTrue(): NotificationPreference {
  return new NotificationPreference({ inAppEnabled: true, emailEnabled: true })
}

function notificationPrefAllFalse(): NotificationPreference {
  return new NotificationPreference({ inAppEnabled: false, emailEnabled: false })
}

export function defaultNotificationPreferences(): AccountNotificationPreferences {
  return new AccountNotificationPreferences({
    channelExcludedFromApp: notificationPrefAllTrue(),
    videoExcludedFromApp: notificationPrefAllTrue(),
    nftFeaturedOnMarketPlace: notificationPrefAllTrue(),
    newChannelFollower: notificationPrefAllTrue(),
    videoCommentCreated: notificationPrefAllTrue(),
    videoLiked: notificationPrefAllTrue(),
    videoDisliked: notificationPrefAllTrue(),
    yppChannelSuspended: notificationPrefAllTrue(),
    yppSignupSuccessful: notificationPrefAllTrue(),
    yppChannelVerified: notificationPrefAllTrue(),
    nftBought: notificationPrefAllTrue(),
    creatorTimedAuctionExpired: notificationPrefAllTrue(),
    bidMadeOnNft: notificationPrefAllTrue(),
    royaltyReceived: notificationPrefAllTrue(),
    channelPaymentReceived: notificationPrefAllTrue(),
    channelReceivedFundsFromWg: notificationPrefAllTrue(),
    newPayoutUpdatedByCouncil: notificationPrefAllTrue(),
    channelFundsWithdrawn: notificationPrefAllTrue(),

    channelCreated: notificationPrefAllTrue(),
    replyToComment: notificationPrefAllTrue(),
    reactionToComment: notificationPrefAllTrue(),
    videoPosted: notificationPrefAllFalse(),
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
    crtIssued: notificationPrefAllTrue(),
    crtMarketStarted: notificationPrefAllTrue(),
    crtMarketMint: notificationPrefAllTrue(),
    crtMarketBurn: notificationPrefAllTrue(),
    crtSaleStarted: notificationPrefAllTrue(),
    crtSaleMint: notificationPrefAllTrue(),
    crtRevenueShareStarted: notificationPrefAllTrue(),
    crtRevenueSharePlanned: notificationPrefAllTrue(),
    crtRevenueShareEnded: notificationPrefAllTrue(),
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
    case 'HigherBidPlaced':
      return preferences.higherBidThanYoursMade
    case 'AuctionWon':
      return preferences.auctionWon
    case 'AuctionLost':
      return preferences.auctionLost
    case 'CreatorTokenIssued':
      return preferences.crtIssued
    case 'CreatorTokenMarketStarted':
      return preferences.crtMarketStarted
    case 'CreatorTokenMarketMint':
      return preferences.crtMarketMint
    case 'CreatorTokenMarketBurn':
      return preferences.crtMarketBurn
    case 'CreatorTokenSaleStarted':
      return preferences.crtSaleStarted
    case 'CreatorTokenSaleMint':
      return preferences.crtSaleMint
    case 'CreatorTokenRevenueShareStarted':
      return preferences.crtRevenueShareStarted
    case 'CreatorTokenRevenueSharePlanned':
      return preferences.crtRevenueSharePlanned
    case 'CreatorTokenRevenueShareEnded':
      return preferences.crtRevenueShareEnded
    default: // all the remaining notifications (v2 scope) are not enabled by default
      return new NotificationPreference({ inAppEnabled: false, emailEnabled: false })
  }
}

async function addOffChainNotification(
  em: EntityManager,
  account: Flat<Account>,
  recipient: RecipientType,
  notificationType: NotificationType,
  dispatchBlock: number
) {
  // get notification Id from orion_db in any case
  const nextNotificationId = await getNextIdForEntity(em, OFFCHAIN_NOTIFICATION_ID_TAG)

  const notification = createNotification(
    `${OFFCHAIN_NOTIFICATION_ID_TAG}-${nextNotificationId}`,
    account.id,
    recipient,
    notificationType,
    dispatchBlock,
    undefined
  )

  const pref = preferencesForNotification(account.notificationPreferences, notificationType)
  notification.inApp = pref.inAppEnabled
  await em.save(notification)

  if (pref.emailEnabled) {
    await createEmailNotification(em, notification)
  }

  await saveNextNotificationId(em, nextNotificationId + 1, OFFCHAIN_NOTIFICATION_ID_TAG)
}

async function addRuntimeNotification(
  overlay: EntityManagerOverlay,
  account: Flat<Account>,
  recipient: RecipientType,
  notificationType: NotificationType,
  event: Event,
  dispatchBlock: number
) {
  // get notification Id from orion_db in any case
  const nextNotificationId = await getNextIdForEntity(overlay, RUNTIME_NOTIFICATION_ID_TAG)

  const runtimeNotificationId = `${RUNTIME_NOTIFICATION_ID_TAG}-${nextNotificationId}`

  // check that on-notification is not already present in orion_db in case the processor has been restarted (but not orion_db)
  const existingNotification = await overlay
    .getRepository(Notification)
    .getById(runtimeNotificationId)

  if (existingNotification) {
    return
  }

  const notification = createNotification(
    runtimeNotificationId,
    account.id,
    recipient,
    notificationType,
    dispatchBlock,
    event
  )

  const pref = preferencesForNotification(account.notificationPreferences, notificationType)
  notification.inApp = pref.inAppEnabled
  overlay.getRepository(Notification).new(notification)

  if (pref.emailEnabled) {
    await createEmailNotification(overlay, notification)
  }

  return notification.id
}

// notification email delivery is also created once and then migrated
async function createEmailNotification(
  store: EntityManagerOverlay | EntityManager,
  notification: Flat<Notification>
) {
  const notificationDelivery = new NotificationEmailDelivery({
    id: uniqueId(32),
    notificationId: notification.id,
    attempts: [],
    discard: false,
  })

  if (store instanceof EntityManagerOverlay) {
    ;(store as EntityManagerOverlay).getRepository(NotificationEmailDelivery).new({
      ...notificationDelivery,
    })
  } else {
    await (store as EntityManager).save(notificationDelivery)
  }
}

// the logic is such that the notification is created (inserted) only once in orion_db
// to keep this invariant true that when the processor is restarted we need deterministic identifiers to fetch existing notifications
const createNotification = (
  id: string,
  accountId: string,
  recipient: RecipientType,
  notificationType: NotificationType,
  dispatchBlock: number,
  event?: Event
) => {
  return new Notification({
    id,
    accountId,
    notificationType,
    recipient,
    status: new Unread(),
    eventId: event?.id,
    createdAt: event?.timestamp ?? new Date(),
    dispatchBlock,
  })
}

export const addNotification = async (
  store: EntityManagerOverlay | EntityManager,
  account: Flat<Account> | null,
  recipient: RecipientType,
  notificationType: NotificationType,
  event?: Event,
  dispatchBlock?: number
) => {
  if (!account) {
    // if account is not in orion_db skip.
    // this is how we keep the invariant that notifications are created only once in orion_db during the migration step
    // since account data migration is performed after all the blocks have been synced
    return
  }
  if (event) {
    await addRuntimeNotification(
      store as EntityManagerOverlay,
      account,
      recipient,
      notificationType,
      event,
      dispatchBlock || event.inBlock
    )
  } else {
    const { lastProcessedBlock } = await getCurrentBlockHeight(store as EntityManager)
    await addOffChainNotification(
      store as EntityManager,
      account,
      recipient,
      notificationType,
      dispatchBlock ?? lastProcessedBlock
    )
  }
}

async function saveNextNotificationId(
  em: EntityManager,
  nextNotificationId: number,
  entityName: string
) {
  const nextEntityId = new NextEntityId({
    entityName,
    nextId: nextNotificationId,
  })
  await em.save(nextEntityId)
}

const JOY_DECIMAL = 10
export const formatJOY = (hapiAmount: bigint | number): string => {
  const [intPart, decPart] = splitInt(String(hapiAmount), JOY_DECIMAL)

  const formatedIntPart = chunkFromEnd(intPart, 3).join(' ') || '0'

  const fractionDigits = (decPart.match(/[1-9]/)?.index ?? -1) + 1
  const roundedDecPart =
    fractionDigits === 0
      ? ''
      : !intPart && fractionDigits > 2
      ? roundDecPart(decPart, fractionDigits).replace(/\.?0+$/, '')
      : roundDecPart(decPart, 2).replace(/^\.00/, '')

  return `${formatedIntPart}${roundedDecPart} $JOY`
}
const splitInt = (numStr: string, decimalSize: number): [string, string] => {
  const intPart = numStr.slice(0, -decimalSize) ?? ''
  const decPart = numStr.slice(-decimalSize).padStart(decimalSize, '0') || '0'
  return [intPart, decPart]
}
const chunkFromEnd = (str: string, interval: number): string[] =>
  Array.from({ length: Math.floor((str.length - 1) / interval) }).reduce(
    ([head, ...tail]: string[]) => [head.slice(0, -interval), head.slice(-interval), ...tail],
    [str]
  )
const roundDecPart = (decPart: string, fractionDigits: number): string =>
  Number(`.${decPart}`).toFixed(fractionDigits).slice(1)
