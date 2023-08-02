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
  RuntimeNotification,
  RuntimeNotificationData,
  NotificationUnread,
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

export async function preferencesForNotification(
  account: Account,
  notificationType: RuntimeNotificationData | OffChainNotificationData
): Promise<NotificationPreference> {
  switch (notificationType.isTypeOf) {
    case 'ChannelExcluded':
      return account.notificationPreferences.channelExcludedFromAppNotificationEnabled
    case 'VideoExcluded':
      return account.notificationPreferences.videoExcludedFromAppNotificationEnabled
    case 'VideoFeaturedAsCategoryHero':
      return account.notificationPreferences.videoFeaturedAsHeroNotificationEnabled
    case 'VideoFeaturedOnCategoryPage':
      return account.notificationPreferences.videoFeaturedOnCategoryPageNotificationEnabled
    case 'NftFeaturedOnMarketPlace':
      return account.notificationPreferences.nftFeaturedOnMarketPlaceNotificationEnabled
    case 'NewChannelFollower':
      return account.notificationPreferences.newChannelFollowerNotificationEnabled
    case 'CommentPostedToVideo':
      return account.notificationPreferences.videoCommentCreatedNotificationEnabled
    case 'VideoLiked':
      return account.notificationPreferences.videoLikedNotificationEnabled
    case 'VideoDisliked':
      return account.notificationPreferences.videoDislikedNotificationEnabled
    case 'YppSignupSuccessful':
      return account.notificationPreferences.yppSignupSuccessfulNotificationEnabled
    case 'ChannelVerified':
      return account.notificationPreferences.yppChannelVerifiedNotificationEnabled
    case 'NftPurchased':
      return account.notificationPreferences.nftBoughtNotificationEnabled
    case 'CreatorReceivesAuctionBid':
      return account.notificationPreferences.bidMadeOnNftNotificationEnabled
    case 'RoyaltyPaid':
      return account.notificationPreferences.royaltyReceivedNotificationEnabled
    case 'DirectChannelPaymentByMember':
      return account.notificationPreferences.channelPaymentReceivedNotificationEnabled
    case 'ChannelFundsWithdrawn':
      return account.notificationPreferences.channelFundsWithdrawnNotificationEnabled
    case 'ChannelCreated':
      return account.notificationPreferences.channelCreatedNotificationEnabled
    case 'CommentReply':
      return account.notificationPreferences.replyToCommentNotificationEnabled
    case 'ReactionToComment':
      return account.notificationPreferences.reactionToCommentNotificationEnabled
    case 'VideoPosted':
      return account.notificationPreferences.videoPostedNotificationEnabled
    case 'NewAuction':
      return account.notificationPreferences.newNftOnAuctionNotificationEnabled
    case 'NewNftOnSale':
      return account.notificationPreferences.newNftOnSaleNotificationEnabled
    case 'EnglishAuctionLost':
      return account.notificationPreferences.auctionLostNotificationEnabled
    case 'EnglishAuctionWon':
      return account.notificationPreferences.auctionWonNotificationEnabled
    case 'OpenAuctionLost':
      return account.notificationPreferences.auctionLostNotificationEnabled
    case 'OpenAuctionWon':
      return account.notificationPreferences.auctionWonNotificationEnabled
    default:
      return new NotificationPreference({ inAppEnabled: false, emailEnabled: false })
  }
}

export async function addNotification(accounts: (Account | null)[], params: NotificationParams) {
  const em = params.getEm()

  const mailNotifier = new MailNotifier()
  mailNotifier.setSender(await config.get(ConfigVariable.SendgridFromEmail, em))
  mailNotifier.setSubject(params.getDataForEmail())
  // mailNotifier.setContentUsingTemplate('test')

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

){
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

  public async createNotification(account: Account): Promise<NewRuntimeNotificationEntity> {
    const repository = this._overlay.getRepository(RuntimeNotification)
    const newNotificationId = repository.getNewEntityId()

    const auctionWinner = isAuctionWinner(
      this._event.data,
      account.membershipId,
      this._optionWinnerId
    )

    const pref = await preferencesForNotification(account, this._event.data, this._overlay)
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

const nftBidReceivedText = (memberHandle: string, nftPrice: string, videoTitle: string) => {
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

const councilPayoutText = (nftPrice: string) => {
  return `You received ${nftPrice} from the council`
}

const councilPayoutTextForChannel = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} received ${nftPrice} from the council`
}

const councilPayoutTextForChannelToMember = (
  channelTitle: string,
  memberHandle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to ${memberHandle}`
}

const councilPayoutTextForChannelToExternalWallet = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} transferred ${nftPrice} to an external wallet`
}

const workingGroupPayoutText = (nftPrice: string) => {
  return `You received ${nftPrice} from the working group`
}

const workingGroupPayoutTextForChannel = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} received ${nftPrice} from the working group`
}

const workingGroupPayoutTextForChannelToMember = (
  channelTitle: string,
  memberHandle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to ${memberHandle}`
}

const workingGroupPayoutTextForChannelToExternalWallet = (
  channelTitle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to an external wallet`
}

const payoutUpdatedByCouncilText = (nftPrice: string) => {
  return `New payout of ${nftPrice} has been updated by the council`
}

const payoutUpdatedByCouncilTextForChannel = (channelTitle: string, nftPrice: string) => {
  return `New payout of ${nftPrice} has been updated by the council for ${channelTitle}`
}

const payoutUpdatedByCouncilTextForChannelToMember = (
  channelTitle: string,
  memberHandle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to ${memberHandle}`
}

const payoutUpdatedByCouncilTextForChannelToExternalWallet = (
  channelTitle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to an external wallet`
}

const payoutUpdatedByCouncilTextForChannelToWorkingGroup = (
  channelTitle: string,
  nftPrice: string
) => {
  return `${channelTitle} transferred ${nftPrice} to the working group`
}

const payoutUpdatedByCouncilTextForChannelToCouncil = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} transferred ${nftPrice} to the council`
}

const payoutUpdatedByCouncilTextForChannelToTreasury = (channelTitle: string, nftPrice: string) => {
  return `${channelTitle} transferred ${nftPrice} to the treasury`
}
