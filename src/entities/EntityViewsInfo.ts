import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class EntityViewsInfo {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  views: number
}
