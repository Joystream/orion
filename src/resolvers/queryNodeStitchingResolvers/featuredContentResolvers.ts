import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { createResolverWithTransforms } from './helpers'

export const featuredContentResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
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
    video: {
      selectionSet: '{ videoId }',
      resolve: async (parent, args, context, info) => {
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
  },
  CategoryFeaturedVideos: {
    category: {
      selectionSet: '{ categoryId }',
      resolve: async (parent, args, context, info) => {
        console.log(parent)
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
  },
})
