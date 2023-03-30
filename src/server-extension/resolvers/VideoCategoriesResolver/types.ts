import { Field, ObjectType, Int } from 'type-graphql'
import { VideoCategory } from '../baseTypes'

@ObjectType()
export class ExtendedVideoCategory {
  @Field(() => VideoCategory, { nullable: false })
  category!: VideoCategory

  @Field(() => Int, { nullable: false })
  activeVideosCount!: number
}
