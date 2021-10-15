import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { FeaturedVideo, getFeaturedContentDoc, VideoHero } from '../models/FeaturedContent'

@InputType()
class FeaturedVideoInput implements FeaturedVideo {
  @Field(() => ID)
  videoId!: string

  @Field({ nullable: true })
  videoCutUrl?: string
}

@ArgsType()
class SetCategoryFeaturedVideoArgs {
  @Field(() => ID)
  categoryId!: string

  @Field(() => [FeaturedVideoInput])
  videos!: FeaturedVideoInput[]
}

@ObjectType()
class CategoryFeaturedVideos {
  @Field(() => ID)
  categoryId!: string

  @Field(() => [FeaturedVideo])
  videos!: FeaturedVideo[]
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
  async setVideoHero(@Args() newVideoHero: VideoHero) {
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
