import { Arg, Args, ArgsType, Authorized, Field, ID, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { FeaturedVideo, getFeaturedContentDoc, VideoHero } from '../models/FeaturedContent'
import { CategoryFeaturedVideos } from '../entities/CategoryFeaturedVideos'

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
  @Query(() => VideoHero, { nullable: false, description: 'Get current video hero' })
  async videoHero() {
    return (await getFeaturedContentDoc()).videoHero
  }

  @Query(() => [FeaturedVideo], { nullable: false, description: 'Get featured videos for a given video category' })
  async categoryFeaturedVideos(@Arg('categoryId', () => ID) categoryId: string) {
    const featuredContent = await getFeaturedContentDoc()
    return featuredContent.featuredVideosPerCategory.get(categoryId) || []
  }

  @Query(() => [CategoryFeaturedVideos], { nullable: false, description: 'Get featured videos for all categories' })
  async allCategoriesFeaturedVideos() {
    const featuredContent = await getFeaturedContentDoc()

    const categoriesList: CategoryFeaturedVideos[] = []
    featuredContent.featuredVideosPerCategory.forEach((videos, categoryId) => {
      categoriesList.push({
        categoryId,
        videos,
      })
    })

    return categoriesList
  }

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
