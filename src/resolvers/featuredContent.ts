import { Arg, Args, ArgsType, Authorized, Field, ID, InputType, Mutation, Resolver } from 'type-graphql'
import { FeaturedVideo, getFeaturedContentDoc, VideoHero } from '../models/FeaturedContent'

@InputType()
class FeaturedVideoInput implements FeaturedVideo {
  @Field(() => ID)
  videoId!: string

  @Field({ nullable: true })
  videoCutUrl?: string
}

@InputType()
class VideoHeroInput implements VideoHero {
  @Field(() => ID)
  videoId!: string

  @Field()
  heroPosterUrl!: string

  @Field()
  heroTitle!: string

  @Field()
  heroVideoCutUrl!: string
}

@ArgsType()
class SetCategoryFeaturedVideoArgs {
  @Field(() => ID)
  categoryId!: string

  @Field(() => [FeaturedVideoInput])
  videos!: FeaturedVideoInput[]
}

@Resolver()
export class FeaturedContentResolver {
  @Mutation(() => VideoHero, { nullable: false })
  @Authorized()
  async setVideoHero(@Arg('newVideoHero', () => VideoHeroInput) newVideoHero: VideoHeroInput) {
    const featuredContent = await getFeaturedContentDoc()
    featuredContent.videoHero = newVideoHero
    await featuredContent.save()

    return newVideoHero
  }

  @Mutation(() => [FeaturedVideo], { nullable: false })
  @Authorized()
  async setCategoryFeaturedVideos(@Args() { categoryId, videos }: SetCategoryFeaturedVideoArgs) {
    const featuredContent = await getFeaturedContentDoc()
    featuredContent.featuredVideosPerCategory.set(categoryId, videos)
    await featuredContent.save()

    return videos
  }
}
