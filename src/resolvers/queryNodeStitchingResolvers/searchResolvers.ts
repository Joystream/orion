import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { createLookup } from '../../helpers'
import { SearchFtsOutput } from '../../types'
import { createResolverWithTransforms } from './helpers'
import {
  ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
  ORION_BATCHED_FOLLOWS_QUERY_NAME,
  ORION_BATCHED_VIEWS_QUERY_NAME,
  TransformBatchedChannelOrionViewsField,
  TransformBatchedOrionFollowsField,
  TransformBatchedOrionVideoViewsField,
} from './transforms'

export const searchResolvers = (queryNodeSchema: GraphQLSchema, orionSchema: GraphQLSchema): IResolvers => ({
  Query: {
    search: async (parent, args, context, info) => {
      const searchResolver = createResolverWithTransforms(queryNodeSchema, 'search')
      const search = await searchResolver(parent, args, context, info)
      try {
        const channelIdList = search
          .filter((result: SearchFtsOutput) => result.item.__typename === 'Channel')
          .map((result: SearchFtsOutput) => result.item.id)

        const batchedChannelFollowsResolver = createResolverWithTransforms(
          orionSchema,
          ORION_BATCHED_FOLLOWS_QUERY_NAME,
          [TransformBatchedOrionFollowsField]
        )
        const batchedChannelFollowsPromise = batchedChannelFollowsResolver(
          parent,
          {
            channelIdList,
          },
          context,
          info
        )

        const batchedChannelViewsResolver = createResolverWithTransforms(
          orionSchema,
          ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
          [TransformBatchedChannelOrionViewsField]
        )
        const batchedChannelViewsPromise = batchedChannelViewsResolver(
          parent,
          {
            channelIdList,
          },
          context,
          info
        )

        const videoIdList = search
          .filter((result: SearchFtsOutput) => result.item.__typename === 'Video')
          .map((result: SearchFtsOutput) => result.item.id)

        const batchedVideoViewsResolver = createResolverWithTransforms(orionSchema, ORION_BATCHED_VIEWS_QUERY_NAME, [
          TransformBatchedOrionVideoViewsField,
        ])
        const batchedVideoViewsPromise = batchedVideoViewsResolver(
          parent,
          {
            videoIdList,
          },
          context,
          info
        )

        const [batchedChannelFollows, batchedChannelViews, batchedVideoViews] = await Promise.all([
          batchedChannelFollowsPromise,
          batchedChannelViewsPromise,
          batchedVideoViewsPromise,
        ])

        const followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
        const channelViewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])
        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

        const searchWithFollowsAndViews = search.map((searchOutput: SearchFtsOutput) => {
          if (searchOutput.item.__typename === 'Channel') {
            return {
              ...searchOutput,
              item: {
                ...searchOutput.item,
                follows: followsLookup[searchOutput.item.id]?.follows || 0,
                views: channelViewsLookup[searchOutput.item.id]?.views || 0,
              },
            }
          }
          if (searchOutput.item.__typename === 'Video') {
            return {
              ...searchOutput,
              item: {
                ...searchOutput.item,
                views: viewsLookup[searchOutput.item.id]?.views || 0,
              },
            }
          }
        })

        return searchWithFollowsAndViews
      } catch (error) {
        console.error('Failed to resolve channel views, channel follows or video views', 'search resolver', error)
        return search
      }
    },
  },
})
