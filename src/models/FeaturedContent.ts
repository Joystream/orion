import { getModelForClass, prop } from '@typegoose/typegoose'
import { ArgsType, Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@ArgsType()
export class VideoHero {
  @prop({ required: true })
  @Field(() => ID)
  videoId!: string

  @prop({ required: true })
  @Field()
  heroTitle!: string

  @prop({ required: true })
  @Field()
  heroVideoCutUrl!: string
}

export class FeaturedContent {
  @prop({ required: true })
  videoHero!: VideoHero
}

export const FeaturedContentModel = getModelForClass(FeaturedContent, {
  schemaOptions: { collection: 'featuredContent' },
})
