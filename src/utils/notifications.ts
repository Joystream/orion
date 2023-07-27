import { Flat } from 'lodash'
import { EntityManager } from 'typeorm'
import {
  Account,
  AccountNotificationPreferences,
  DeliveryStatus,
  EventData,
  NextEntityId,
  NotificationPreference,
  Event,
  OffChainNotification,
  OffChainNotificationData,
  ReadOrUnread,
  RuntimeNotification,
} from '../model'
import { ConfigVariable, config } from './config'
import { MailNotifier } from './mail'
import { getNextIdForEntity } from './nextEntityId'
import { EntityManagerOverlay } from './overlay'

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
      return preferences.newChannelFollowerNotificationEnabled
    case 'ChannelExcludedNotificationData':
      return preferences.channelExcludedFromAppNotificationEnabled
    case 'VideoExcludedNotificationData':
      return preferences.videoExcludedFromAppNotificationEnabled
    default:
      return new NotificationPreference({ inAppEnabled: false, emailEnabled: false })
  }
}

export async function addNotification(
  accounts: (Account | null)[],
  params: NotificationParams,
) {
  const em = params.getEm()

  const mailNotifier = new MailNotifier()
  mailNotifier.setSender(await config.get(ConfigVariable.SendgridFromEmail, em))
  mailNotifier.setSubject(params.getDataForEmail())
  mailNotifier.setContentUsingTemplate('test')

  for (const account of accounts.filter((account) => account)) {
    const notificationEntity = await params.createNotification(account!)
    if (notificationEntity.shouldSendEmail) {
      mailNotifier.setReciever(account!.email)
      await mailNotifier.send()
      if (mailNotifier.mailHasBeenSent()) {
        notificationEntity.markEmailAsSent()
      }
    }
    await notificationEntity.saveToDb()
  }
  return
}

export abstract class NotificationParams {
  public abstract createNotification(
    account: Account,
  ): Promise<NewNotificationEntity>
  public abstract getDataForEmail(): string
  public abstract getEm(): EntityManager
}

abstract class NewNotificationEntity {
  private _shouldSendEmail: boolean = false

  public abstract saveToDb(): Promise<void>
  public markEmailAsSent() {
    // TODO: (not.v1) implement
  }
  get shouldSendEmail(): boolean {
    return this._shouldSendEmail
  }
  constructor(shouldSendEmail: boolean = false) {
    this._shouldSendEmail = shouldSendEmail
  }
}

class NewRuntimeNotificationEntity extends NewNotificationEntity {
  private _notification: RuntimeNotification

  constructor(notification: RuntimeNotification, shouldSendEmail: boolean) {
    super(shouldSendEmail)
    this._notification = notification
  }
  public async saveToDb(): Promise<void> {
    return Promise.resolve()
  }
}

class NewOffchainNotificationEntity extends NewNotificationEntity {
  private _notification: OffChainNotification
  private _nextOffchainNotificationId: number
  private _em: EntityManager

  constructor(
    notification: OffChainNotification,
    nextOffchainNotificationId: number,
    em: EntityManager,
    shouldSendEmail: boolean
  ) {
    super(shouldSendEmail)
    this._em = em
    this._notification = notification
    this._nextOffchainNotificationId = nextOffchainNotificationId
  }

  public async saveToDb(): Promise<void> {
    await this._em.save([
      this._notification,
      new NextEntityId({
        entityName: 'OffChainNotification',
        nextId: this._nextOffchainNotificationId + 1,
      }),
    ])
  }
}

export class OffChainNotificationParams extends NotificationParams {
  private _data: OffChainNotificationData
  private _em: EntityManager

  constructor(em: EntityManager, data: OffChainNotificationData) {
    super()
    this._em = em
    this._data = data
  }

  public getEm(): EntityManager {
    return this._em
  }

  public getDataForEmail(): string {
    // TODO: (not.v1) implement this
    return JSON.stringify(this._data)
  }

  public async createNotification(
    account: Account,
  ): Promise<NewOffchainNotificationEntity> {
    const newNotificationId = await getNextIdForEntity(this._em, 'OffChainNotification')

    const pref = preferencesForNotification(account.notificationPreferences, this._data)
    const notification = new OffChainNotification({
      id: newNotificationId.toString(),
      accountId: account.id,
      status: ReadOrUnread.UNREAD,
      deliveryStatus: deliveryStatusFromPreference(pref),
      data: this._data,
    })
    return new NewOffchainNotificationEntity(
      notification,
      newNotificationId,
      this._em,
      pref.emailEnabled
    )
  }
}

export class RuntimeNotificationParams extends NotificationParams {
  private _event: Flat<Event>
  private _optionWinnerId: string | undefined
  private _overlay: EntityManagerOverlay

  constructor(overlay: EntityManagerOverlay, event: Flat<Event>, optionWinnerId?: string) {
    super()
    this._event = event
    this._overlay = overlay
    this._optionWinnerId = optionWinnerId
  }

  public getEm(): EntityManager {
    return this._overlay.getEm()
  }

  public getDataForEmail(): string {
    // TODO: (not.v1) implement this
    return JSON.stringify(this._event.data)
  }

  public async createNotification(
    account: Account,
  ): Promise<NewRuntimeNotificationEntity> {
    const repository = this._overlay.getRepository(RuntimeNotification)
    const newNotificationId = repository.getNewEntityId()

    const auctionWinner = isAuctionWinner(
      this._event.data,
      account.membershipId,
      this._optionWinnerId
    )
    const pref = preferencesForNotification(
      account.notificationPreferences,
      this._event.data,
      auctionWinner
    )
    const notification = repository.new({
      id: newNotificationId,
      accountId: account.id,
      eventId: this._event.id,
      status: ReadOrUnread.UNREAD,
      deliveryStatus: deliveryStatusFromPreference(pref),
    })
    return new NewRuntimeNotificationEntity(notification as RuntimeNotification, pref.emailEnabled)
  }
}

function isAuctionWinner(
  data: EventData,
  memberId: string,
  auctionWinnerId?: string
): boolean | undefined {
  if (data.isTypeOf === 'EnglishAuctionSettledEventData') {
    return memberId === auctionWinnerId!
  } else {
    return undefined
  }
}

export function deliveryStatusFromPreference(pref: NotificationPreference): DeliveryStatus {
  // match the delivery status to the preference
  if (pref.inAppEnabled && pref.emailEnabled) {
    return DeliveryStatus.EMAIL_AND_IN_APP
  } else if (pref.inAppEnabled && !pref.emailEnabled) {
    return DeliveryStatus.IN_APP_ONLY
  } else if (!pref.inAppEnabled && pref.emailEnabled) {
    return DeliveryStatus.EMAIL_ONLY
  } else {
    return DeliveryStatus.UNDELIVERED
  }
}
