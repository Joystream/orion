import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class ChannelFollowsInfo {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  follows: number
}
