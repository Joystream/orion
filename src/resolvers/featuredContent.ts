import { Args, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { FeaturedContentModel, VideoHero } from '../models/FeaturedContent'

@Resolver()
export class FeaturedContentResolver {
  @Query(() => VideoHero, { nullable: false, description: 'Get current video hero' })
  async videoHero() {
    const featuredContent = await FeaturedContentModel.findOne()
    return featuredContent!.videoHero
  }

  @Mutation(() => VideoHero, { nullable: true })
  @Authorized()
  async setVideoHero(@Args() newVideoHero: VideoHero) {
    const featuredContent = await FeaturedContentModel.findOne()

    if (!featuredContent) {
      return
    }

    featuredContent.videoHero = newVideoHero
    const updatedFeaturedContent = await featuredContent.save()
    return updatedFeaturedContent.videoHero
  }
}
