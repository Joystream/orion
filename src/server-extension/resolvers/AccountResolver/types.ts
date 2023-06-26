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
  councilElectionUpdates: boolean

  @Field(() => Boolean, { nullable: false })
  updatesInProposalCreated: boolean

  @Field(() => Boolean, { nullable: false })
  discussionThreadPosted: boolean

  @Field(() => Boolean, { nullable: false })
  postDirectMention: boolean

  @Field(() => Boolean, { nullable: false })
  notificationWithRole: boolean

  @Field(() => Boolean, { nullable: false })
  notificationWithoutRole: boolean

  @Field(() => Boolean, { nullable: false })
  forumDirectMention: boolean

  @Field(() => Boolean, { nullable: false })
  forumReplyToPost: boolean

  @Field(() => Boolean, { nullable: false })
  councilElectionUpdatesMail: boolean

  @Field(() => Boolean, { nullable: false })
  updatesInProposalCreatedMail: boolean

  @Field(() => Boolean, { nullable: false })
  discussionThreadPostedMail: boolean

  @Field(() => Boolean, { nullable: false })
  postDirectMentionMail: boolean

  @Field(() => Boolean, { nullable: false })
  notificationWithRoleMail: boolean

  @Field(() => Boolean, { nullable: false })
  notificationWithoutRoleMail: boolean

  @Field(() => Boolean, { nullable: false })
  forumDirectMentionMail: boolean

  @Field(() => Boolean, { nullable: false })
  forumReplyToPostMail: boolean
}

@ObjectType()
export class AccountAndNotificationPreferences {
  @Field(() => String, { nullable: false })
  accountId: string 

  @Field(() => NotificationPreferences, { nullable: false })
  preferences: NotificationPreferences
}
