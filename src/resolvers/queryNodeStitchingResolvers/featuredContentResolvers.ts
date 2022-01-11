import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema, SelectionSetNode } from 'graphql'
import { createResolver } from './helpers'
import { delegateToSchema } from '@graphql-tools/delegate'
import { WrapQuery } from '@graphql-tools/wrap'
import { Video } from '../../types'
import { FeaturedVideo } from '../../models/FeaturedContent'

export const featuredContentResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  VideoHero: {
    video: async (parent, args, context, info) => {
      const videoResolver = createResolver(queryNodeSchema, 'videoByUniqueInput')
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
      resolve: async (parent, args, context, info) => {
        if (parent.video) {
          return parent.video
        }
        const videoResolver = createResolver(queryNodeSchema, 'videoByUniqueInput')
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
    categoryFeaturedVideos: {
      selectionSet: '{ videos { videoId } }',
      resolve: async (parent, args, context, info) => {
        const videosIds = parent.videos.map((video: FeaturedVideo) => video.videoId)
        const videoResolver = () =>
          delegateToSchema({
            schema: queryNodeSchema,
            operation: 'query',
            fieldName: 'videos',
            args: {
              where: {
                id_in: videosIds,
              },
            },
            context,
            info,
            transforms: [
              new WrapQuery(
                ['videos'],
                (subtree: SelectionSetNode) => {
                  const videoSubTree = subtree.selections.find(
                    (selection) => selection.kind === 'Field' && selection.name.value === 'video'
                  )
                  if (videoSubTree?.kind === 'Field' && videoSubTree.selectionSet) {
                    return videoSubTree.selectionSet
                  }
                  return subtree
                },
                (result) => result && result
              ),
            ],
          })

        const videos = await videoResolver()
        return parent.videos.map((v: FeaturedVideo) => ({
          ...v,
          categoryFeaturedVideos: videos.find((video: Video) => video.id === v.videoId),
        }))
      },
    },
    category: {
      selectionSet: '{ categoryId }',
      resolve: async (parent, args, context, info) => {
        const categoryResolver = createResolver(queryNodeSchema, 'videoCategoryByUniqueInput')
        return categoryResolver(
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
