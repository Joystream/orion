import { IsUrl } from 'class-validator'
import { ArgsType, Field, ObjectType } from 'type-graphql'
import { BlockchainAccount } from '../../../model'
import { AccountNotificationPreferencesOutput } from '../NotificationResolver/types'

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
  joystreamAccount!: BlockchainAccount

  @Field(() => [FollowedChannel], { nullable: false })
  followedChannels: FollowedChannel[]

  @Field(() => AccountNotificationPreferencesOutput, { nullable: true })
  preferences?: AccountNotificationPreferencesOutput
}

@ArgsType()
export class CreateAccountMembershipArgs {
  @Field(() => String, { nullable: false, description: 'Membership Handle' })
  handle: string

  @Field(() => String, { description: 'Membership avatar URL' })
  @IsUrl({ require_tld: false })
  avatar: string

  @Field(() => String, { description: '`about` information to associate with new Membership' })
  about: string

  @Field(() => String, { description: 'Membership name' })
  name: string
}

@ObjectType()
export class CreateAccountMembershipResult {
  @Field(() => String, { nullable: false })
  accountId!: string

  @Field(() => Number, { nullable: false })
  memberId: number
}

export type FaucetRegisterMembershipParams = {
  address: string
  handle: string
  avatar: string
  about: string
  name: string
}

export type FaucetRegisterMembershipResponse = {
  memberId: number
  block: number
}
