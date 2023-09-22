import { Field, ObjectType, ArgsType, InputType, ObjectType } from 'type-graphql'
import { AccountNotificationPreferences, NotificationPreference } from '../../../model'
import { DateTime } from '@subsquid/graphql-server'
import { createUnionType } from 'type-graphql'

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
  videoFeaturedAsHero: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  videoFeaturedOnCategoryPage: NotificationPreference

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
  yppChannelSuspended: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  yppChannelVerified: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  nftBought: NotificationPreference

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
  higherBidThanYoursMade: NotificationPreference

  @Field(() => NotificationPreferenceGQL, { nullable: true })
  auctionExpired: NotificationPreference

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
  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelExcludedFromApp: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoExcludedFromApp: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoFeaturedAsHero: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoFeaturedOnCategoryPage: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  nftFeaturedOnMarketPlace: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newChannelFollower: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoCommentCreated: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoLiked: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoDisliked: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  yppSignupSuccessful: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  yppChannelVerified: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  nftBought: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  bidMadeOnNft: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  royaltyReceived: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelPaymentReceived: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelReceivedFundsFromWg: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newPayoutUpdatedByCouncil: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelFundsWithdrawn: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  channelCreated: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  replyToComment: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  reactionToComment: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  videoPosted: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newNftOnAuction: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  newNftOnSale: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  higherBidThanYoursMade: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  auctionExpired: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  auctionWon: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  auctionLost: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  openAuctionBidCanBeWithdrawn: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  fundsFromCouncilReceived: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
  fundsToExternalWalletSent: NotificationPreference

  @Field(() => NotificationPreferenceOutput, { nullable: false })
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
    videoFeaturedAsHero: preferences.videoFeaturedAsHero,
    videoFeaturedOnCategoryPage: preferences.videoFeaturedOnCategoryPage,
    nftFeaturedOnMarketPlace: preferences.nftFeaturedOnMarketPlace,
    newChannelFollower: preferences.newChannelFollower,
    videoCommentCreated: preferences.videoCommentCreated,
    videoLiked: preferences.videoLiked,
    videoDisliked: preferences.videoDisliked,
    yppSignupSuccessful: preferences.yppChannelSuspended,
    yppChannelVerified: preferences.yppChannelVerified,
    nftBought: preferences.nftBought,
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
    newNftOnSale: preferences.newNftOnSale,
    higherBidThanYoursMade: preferences.higherBidThanYoursMade,
    auctionExpired: preferences.timedAuctionExpired,
    auctionWon: preferences.auctionWon,
    auctionLost: preferences.auctionLost,
    openAuctionBidCanBeWithdrawn: preferences.openAuctionBidCanBeWithdrawn,
    fundsFromCouncilReceived: preferences.fundsFromCouncilReceived,
    fundsToExternalWalletSent: preferences.fundsToExternalWalletSent,
    fundsFromWgReceived: preferences.fundsFromWgReceived,
  }
}

const Recipient = createUnionType({
  name: 'Recipient', // Name of the GraphQL union
  types: () => [MemberRecipientGql, CreatorRecipientGql] as const, // function that returns tuple of object types classes
})

@ObjectType()
export class MemberRecipientGql {
  @Field(() => MemberNotification, { nullable: false })
  notification!: MemberNotification
}

@ObjectType()
export class CreatorRecipientGql {
  @Field(() => CreatorNotification, { nullable: false })
  notification!: CreatorNotification
}

@ObjectType()
export class NotificationQueryOut {
  @Field(() => String, { nullable: false })
  notificationId!: string

  @Field(() => String, { nullable: false })
  accountId!: string

  @Field(() => DateTime, { nullable: false })
  createdAt!: Date

  @Field(() => Recipient, { nullable: false })
  recipient: typeof Recipient
}

@ObjectType()
export class NotificationsResult {
  @Field(() => [NotificationQueryOut], { nullable: false })
  notifications!: NotificationQueryOut[]
}

@ObjectType()
export class ChannelSuspendedGql {
  @Field(() => Number, { nullable: true })
  phantom: number
}

@ObjectType()
export class ChannelVerifiedGql {
  @Field(() => Number, { nullable: true })
  phantom: number
}

@ObjectType()
export class ChannelExcludedGql {
  @Field(() => Number, { nullable: true })
  phantom: number
}

@ObjectType()
export class VideoExcludedGql {
  @Field(() => String, { nullable: false })
  videoTitle!: string
}

@ObjectType()
export class ChannelFollowerGql {
  @Field(() => String, { nullable: false })
  followerHandle!: string
}

@ObjectType()
export class VideoFeaturedOnCategoryPageGql {
  @Field(() => String, { nullable: false })
  videoTitle!: string

  @Field(() => String, { nullable: false })
  categoryName!: string

  @Field(() => String, { nullable: false })
  categoryId!: string
}

@ObjectType()
export class VideoFeaturedAsCategoryHeroGql {
  @Field(() => String, { nullable: false })
  videoTitle!: string

  @Field(() => String, { nullable: false })
  categoryName!: string

  @Field(() => String, { nullable: false })
  categoryId!: string
}

@ObjectType()
export class NewAuctionBidGql {
  @Field(() => String, { nullable: false })
  videoTitle!: string

  @Field(() => String, { nullable: false })
  videoId!: string

  @Field(() => String, { nullable: false })
  bidderHandle!: string

  @Field(() => String, { nullable: false })
  amount!: string
}
