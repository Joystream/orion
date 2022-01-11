import { Field, ID, ObjectType } from 'type-graphql'
import { FeaturedVideo } from '../models/FeaturedContent'

@ObjectType()
export class CategoryFeaturedVideos {
  @Field(() => ID)
  categoryId!: string

  @Field(() => [FeaturedVideo])
  categoryFeaturedVideos!: FeaturedVideo[]
}
