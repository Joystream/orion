import { Field, ObjectType } from 'type-graphql'

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
