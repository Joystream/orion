import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { ArgsType, Field, ID, ObjectType } from 'type-graphql'
import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants'

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

@ObjectType()
export class FeaturedVideo {
  @prop({ required: true })
  @Field(() => ID)
  videoId!: string

  @prop()
  @Field({ nullable: true })
  videoCutUrl?: string
}

export class FeaturedContent {
  @prop({ required: true })
  videoHero!: VideoHero

  @prop({ required: true, type: () => [FeaturedVideo], _id: false }, WhatIsIt.MAP)
  featuredVideosPerCategory!: Map<string, FeaturedVideo[]>
}

export const FeaturedContentModel = getModelForClass(FeaturedContent, {
  schemaOptions: { collection: 'featuredContent' },
})

const DEFAULT_FEATURED_CONTENT_DOC: FeaturedContent = {
  videoHero: {
    videoId: '0',
    heroTitle: 'Change Me',
    heroVideoCutUrl: 'https://google.com',
  },
  featuredVideosPerCategory: new Map<string, FeaturedVideo[]>(),
}

export const getFeaturedContentDoc = async (): Promise<DocumentType<FeaturedContent>> => {
  const document = await FeaturedContentModel.findOne()
  if (!document) {
    return await FeaturedContentModel.create(DEFAULT_FEATURED_CONTENT_DOC)
  }
  return document
}
