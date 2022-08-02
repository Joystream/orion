import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class KillSwitch {
  @Field(() => Boolean)
  isKilled: boolean
}
