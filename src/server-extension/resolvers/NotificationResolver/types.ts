import { Field, ObjectType, ArgsType, InputType } from 'type-graphql'
import { AccountNotificationPreferences, NotificationPreference } from '../../../model'

@ArgsType()
export class NotificationArgs {
  @Field(() => [String])
  notificationIds!: string[]
}

@ObjectType()
export class MarkNotificationsAsReadResult {
  @Field(() => [String], { nullable: false })
  notificationsReadIds!: string[]
}

@InputType()
export class NotificationPreferenceGQL implements Partial<NotificationPreference> {
  @Field({ nullable: true })
  inAppEnabled: boolean

  @Field({ nullable: true })
  emailEnabled: boolean
}

@ObjectType()
export class NotificationPreferenceOutput {
  @Field({ nullable: false })
  inAppEnabled: boolean

  @Field({ nullable: false })
  emailEnabled: boolean
}

@InputType()
export class AccountNotificationPreferencesInput {
  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelExcludedFromAppNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoExcludedFromAppNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoFeaturedAsHeroNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoFeaturedOnCategoryPageNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  nftFeaturedOnMarketPlaceNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newChannelFollowerNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoCommentCreatedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoLikedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoDislikedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  yppSignupSuccessfulNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  yppChannelVerifiedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  nftBoughtNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  bidMadeOnNftNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  royaltyReceivedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelPaymentReceivedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelReceivedFundsFromWgNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newPayoutUpdatedByCouncilNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelFundsWithdrawnNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelCreatedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  replyToCommentNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  reactionToCommentNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoPostedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newNftOnAuctionNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newNftOnSaleNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  higherBidThanYoursMadeNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  auctionExpiredNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  auctionWonNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  auctionLostNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  openAuctionBidCanBeWithdrawnNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  fundsFromCouncilReceivedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  fundsToExternalWalletSentNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  fundsFromWgReceivedNotificationEnabled: NotificationPreference
}

@ObjectType()
export class AccountNotificationPreferencesOutput
  implements Partial<AccountNotificationPreferences>
{
  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelExcludedFromAppNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoExcludedFromAppNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoFeaturedAsHeroNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoFeaturedOnCategoryPageNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  nftFeaturedOnMarketPlaceNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newChannelFollowerNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoCommentCreatedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoLikedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoDislikedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  yppSignupSuccessfulNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  yppChannelVerifiedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  nftBoughtNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  bidMadeOnNftNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  royaltyReceivedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelPaymentReceivedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelReceivedFundsFromWgNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newPayoutUpdatedByCouncilNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelFundsWithdrawnNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelCreatedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  replyToCommentNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  reactionToCommentNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoPostedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newNftOnAuctionNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newNftOnSaleNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  higherBidThanYoursMadeNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  auctionExpiredNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  auctionWonNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  auctionLostNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  openAuctionBidCanBeWithdrawnNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  fundsFromCouncilReceivedNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  fundsToExternalWalletSentNotificationEnabled: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  fundsFromWgReceivedNotificationEnabled: NotificationPreference
}

@ObjectType()
export class AccountNotificationPreferencesResult {
  @Field()
  newPreferences: AccountNotificationPreferencesOutput
}

export function toOutputGQL(
  preferences: AccountNotificationPreferences
): AccountNotificationPreferencesOutput {
  return {
    channelExcludedFromAppNotificationEnabled:
      preferences.channelExcludedFromAppNotificationEnabled,
    videoExcludedFromAppNotificationEnabled: preferences.videoExcludedFromAppNotificationEnabled,
    videoFeaturedAsHeroNotificationEnabled: preferences.videoFeaturedAsHeroNotificationEnabled,
    videoFeaturedOnCategoryPageNotificationEnabled:
      preferences.videoFeaturedOnCategoryPageNotificationEnabled,
    nftFeaturedOnMarketPlaceNotificationEnabled:
      preferences.nftFeaturedOnMarketPlaceNotificationEnabled,
    newChannelFollowerNotificationEnabled: preferences.newChannelFollowerNotificationEnabled,
    videoCommentCreatedNotificationEnabled: preferences.videoCommentCreatedNotificationEnabled,
    videoLikedNotificationEnabled: preferences.videoLikedNotificationEnabled,
    videoDislikedNotificationEnabled: preferences.videoDislikedNotificationEnabled,
    yppSignupSuccessfulNotificationEnabled: preferences.yppSignupSuccessfulNotificationEnabled,
    yppChannelVerifiedNotificationEnabled: preferences.yppChannelVerifiedNotificationEnabled,
    nftBoughtNotificationEnabled: preferences.nftBoughtNotificationEnabled,
    bidMadeOnNftNotificationEnabled: preferences.bidMadeOnNftNotificationEnabled,
    royaltyReceivedNotificationEnabled: preferences.royaltyReceivedNotificationEnabled,
    channelPaymentReceivedNotificationEnabled:
      preferences.channelPaymentReceivedNotificationEnabled,
    channelReceivedFundsFromWgNotificationEnabled:
      preferences.channelReceivedFundsFromWgNotificationEnabled,
    newPayoutUpdatedByCouncilNotificationEnabled:
      preferences.newPayoutUpdatedByCouncilNotificationEnabled,
    channelFundsWithdrawnNotificationEnabled: preferences.channelFundsWithdrawnNotificationEnabled,
    channelCreatedNotificationEnabled: preferences.channelCreatedNotificationEnabled,
    replyToCommentNotificationEnabled: preferences.replyToCommentNotificationEnabled,
    reactionToCommentNotificationEnabled: preferences.reactionToCommentNotificationEnabled,
    videoPostedNotificationEnabled: preferences.videoPostedNotificationEnabled,
    newNftOnAuctionNotificationEnabled: preferences.newNftOnAuctionNotificationEnabled,
    newNftOnSaleNotificationEnabled: preferences.newNftOnSaleNotificationEnabled,
    higherBidThanYoursMadeNotificationEnabled:
      preferences.higherBidThanYoursMadeNotificationEnabled,
    auctionExpiredNotificationEnabled: preferences.auctionExpiredNotificationEnabled,
    auctionWonNotificationEnabled: preferences.auctionWonNotificationEnabled,
    auctionLostNotificationEnabled: preferences.auctionLostNotificationEnabled,
    openAuctionBidCanBeWithdrawnNotificationEnabled:
      preferences.openAuctionBidCanBeWithdrawnNotificationEnabled,
    fundsFromCouncilReceivedNotificationEnabled:
      preferences.fundsFromCouncilReceivedNotificationEnabled,
    fundsToExternalWalletSentNotificationEnabled:
      preferences.fundsToExternalWalletSentNotificationEnabled,
    fundsFromWgReceivedNotificationEnabled: preferences.fundsFromWgReceivedNotificationEnabled,
  }
}
