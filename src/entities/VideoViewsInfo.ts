import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class VideoViewsInfo {
  @Field(() => ID, { name: 'id' })
  videoId: string

  @Field(() => Int)
  views: number
}
