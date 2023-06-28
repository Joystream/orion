import { Field, ObjectType, ArgsType } from 'type-graphql'
import { NotificationPreferences } from '../../../model'

@ObjectType()
export class FollowedChannel {
  @Field(() => String, { nullable: false })
  channelId!: string

  @Field(() => String, { nullable: false })
  timestamp!: string
}

@ObjectType()
export class AccountData {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => String, { nullable: false })
  email!: string

  @Field(() => String, { nullable: false })
  joystreamAccount!: string

  @Field(() => Boolean, { nullable: false })
  isEmailConfirmed!: boolean

  @Field(() => String, { nullable: false })
  membershipId: string

  @Field(() => [FollowedChannel], { nullable: false })
  followedChannels: FollowedChannel[]
}

@ArgsType()
export class SetNotificationPreferencesArgs {
  @Field(() => Boolean, { nullable: false })
  commentCreatedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  commentTextUpdatedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  openAuctionStartedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  englishAuctionStartedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  nftIssuedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  auctionBidMadeInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  auctionBidCanceledInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  auctionCanceledInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  englishAuctionSettledInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  bidMadeCompletingAuctionInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  openAuctionBidAcceptedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  nftSellOrderMadeInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  nftBoughtInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  buyNowCanceledInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  buyNowPriceUpdatedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  metaprotocolTransactionStatusInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelRewardClaimedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelRewardClaimedAndWithdrawnInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelFundsWithdrawnInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelPayoutsUpdatedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelPaymentMadeInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  memberBannedFromChannelInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelCreatedInAppNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  commentCreatedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  commentTextUpdatedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  openAuctionStartedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  englishAuctionStartedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  nftIssuedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  auctionBidMadeMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  auctionBidCanceledMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  auctionCanceledMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  englishAuctionSettledMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  bidMadeCompletingAuctionMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  openAuctionBidAcceptedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  nftSellOrderMadeMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  nftBoughtMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  buyNowCanceledMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  buyNowPriceUpdatedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  metaprotocolTransactionStatusMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelRewardClaimedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelRewardClaimedAndWithdrawnMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelFundsWithdrawnMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelPayoutsUpdatedMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelPaymentMadeMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  memberBannedFromChannelMailNotificationEnabled!: boolean
  @Field(() => Boolean, { nullable: false })
  channelCreatedMailNotificationEnabled!: boolean
}

@ObjectType()
export class AccountAndNotificationPreferences {
  @Field(() => String, { nullable: false })
  accountId: string

  @Field(() => NotificationPreferences, { nullable: false })
  preferences: NotificationPreferences
}
