import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { CategoryFeaturedVideos } from '../../entities/CategoryFeaturedVideos'
import { getFeaturedContentDoc } from '../../models/FeaturedContent'
import { createResolverWithTransforms } from './helpers'

export const featuredContentResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    videoHero: async () => {
      return (await getFeaturedContentDoc()).videoHero
    },
    allCategoriesFeaturedVideos: async () => {
      const featuredContent = await getFeaturedContentDoc()

      const categoriesList: CategoryFeaturedVideos[] = []
      featuredContent.featuredVideosPerCategory.forEach((videos, categoryId) => {
        categoriesList.push({
          categoryId,
          videos,
        })
      })

      return categoriesList
    },
    categoryFeaturedVideos: async (parent, args) => {
      const featuredContent = await getFeaturedContentDoc()
      return {
        categoryId: args.categoryId,
        videos: featuredContent.featuredVideosPerCategory.get(args.categoryId) || [],
      }
    },
  },
  VideoHero: {
    video: async (parent, args, context, info) => {
      const videoResolver = createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput')
      return videoResolver(
        parent,
        {
          where: {
            id: parent.videoId,
          },
        },
        context,
        info
      )
    },
  },
  FeaturedVideo: {
    video: async (parent, args, context, info) => {
      const videoResolver = createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput')
      return videoResolver(
        parent,
        {
          where: {
            id: parent.videoId,
          },
        },
        context,
        info
      )
    },
  },
  CategoryFeaturedVideos: {
    category: async (parent, args, context, info) => {
      const channelResolver = createResolverWithTransforms(queryNodeSchema, 'videoCategoryByUniqueInput')
      return channelResolver(
        parent,
        {
          where: {
            id: parent.categoryId,
          },
        },
        context,
        info
      )
    },
  },
})
