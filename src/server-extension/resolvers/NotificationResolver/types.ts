import { Field, ArgsType, InputType, ObjectType } from 'type-graphql'
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
  channelExcludedFromApp: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoExcludedFromApp: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  nftFeaturedOnMarketPlace: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newChannelFollower: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoCommentCreated: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoLiked: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoDisliked: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  yppChannelVerified: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  yppSignupSuccessful: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  yppChannelSuspended: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  nftBought: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  creatorTimedAuctionExpired: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  bidMadeOnNft: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  royaltyReceived: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelPaymentReceived: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelReceivedFundsFromWg: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newPayoutUpdatedByCouncil: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelFundsWithdrawn: NotificationPreference

  // member

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  channelCreated: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  replyToComment: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  reactionToComment: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoPosted: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newNftOnAuction: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  newNftOnSale: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  timedAuctionExpired: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  higherBidThanYoursMade: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  auctionWon: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  auctionLost: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  openAuctionBidCanBeWithdrawn: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  fundsFromCouncilReceived: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  fundsToExternalWalletSent: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  fundsFromWgReceived: NotificationPreference
}

@ObjectType()
export class AccountNotificationPreferencesOutput
  implements Partial<AccountNotificationPreferences>
{
  @Field(() => NotificationPreferenceOutput, { nullable: true })
  channelExcludedFromApp: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  videoExcludedFromApp: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  nftFeaturedOnMarketPlace: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  newChannelFollower: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  videoCommentCreated: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  videoLiked: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  videoDisliked: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  yppChannelVerified: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  yppSignupSuccessful: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  yppChannelSuspended: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  nftBought: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  creatorTimedAuctionExpired: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  bidMadeOnNft: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  royaltyReceived: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  channelPaymentReceived: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  channelReceivedFundsFromWg: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  newPayoutUpdatedByCouncil: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  channelFundsWithdrawn: NotificationPreference

  // member

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  channelCreated: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  replyToComment: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  reactionToComment: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  videoPosted: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  newNftOnAuction: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  newNftOnSale: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  timedAuctionExpired: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  higherBidThanYoursMade: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  auctionWon: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  auctionLost: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  openAuctionBidCanBeWithdrawn: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  fundsFromCouncilReceived: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  fundsToExternalWalletSent: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: true })
  fundsFromWgReceived: NotificationPreference
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
    channelExcludedFromApp: preferences.channelExcludedFromApp,
    videoExcludedFromApp: preferences.videoExcludedFromApp,
    nftFeaturedOnMarketPlace: preferences.nftFeaturedOnMarketPlace,
    newChannelFollower: preferences.newChannelFollower,
    videoCommentCreated: preferences.videoCommentCreated,
    videoLiked: preferences.videoLiked,
    videoDisliked: preferences.videoDisliked,
    yppSignupSuccessful: preferences.yppSignupSuccessful,
    yppChannelVerified: preferences.yppChannelVerified,
    yppChannelSuspended: preferences.yppChannelSuspended,
    nftBought: preferences.nftBought,
    creatorTimedAuctionExpired: preferences.creatorTimedAuctionExpired,
    bidMadeOnNft: preferences.bidMadeOnNft,
    royaltyReceived: preferences.royaltyReceived,
    channelPaymentReceived: preferences.channelPaymentReceived,
    channelReceivedFundsFromWg: preferences.channelReceivedFundsFromWg,
    newPayoutUpdatedByCouncil: preferences.newPayoutUpdatedByCouncil,
    channelFundsWithdrawn: preferences.channelFundsWithdrawn,
    channelCreated: preferences.channelCreated,
    replyToComment: preferences.replyToComment,
    reactionToComment: preferences.reactionToComment,
    videoPosted: preferences.videoPosted,
    newNftOnAuction: preferences.newNftOnAuction,
    timedAuctionExpired: preferences.timedAuctionExpired,
    newNftOnSale: preferences.newNftOnSale,
    higherBidThanYoursMade: preferences.higherBidThanYoursMade,
    auctionWon: preferences.auctionWon,
    auctionLost: preferences.auctionLost,
    openAuctionBidCanBeWithdrawn: preferences.openAuctionBidCanBeWithdrawn,
    fundsFromCouncilReceived: preferences.fundsFromCouncilReceived,
    fundsToExternalWalletSent: preferences.fundsToExternalWalletSent,
    fundsFromWgReceived: preferences.fundsFromWgReceived,
  }
}
