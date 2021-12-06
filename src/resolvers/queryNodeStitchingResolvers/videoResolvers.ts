import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { createLookup, mapPeriods } from '../../helpers'
import { Video, VideoEdge } from '../../types'
import { getVideoViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms, getSortedEntitiesBasedOnOrion } from './helpers'
import { ORION_BATCHED_VIEWS_QUERY_NAME, TransformBatchedOrionVideoViewsField } from './transforms'

export const videoResolvers = (queryNodeSchema: GraphQLSchema, orionSchema: GraphQLSchema): IResolvers => ({
  Query: {
    videoByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput'),
    videos: async (parent, args, context, info) => {
      const videosResolver = createResolverWithTransforms(queryNodeSchema, 'videos', [])
      const videos = await videosResolver(parent, args, context, info)
      try {
        const batchedVideoViewsResolver = createResolverWithTransforms(orionSchema, ORION_BATCHED_VIEWS_QUERY_NAME, [
          TransformBatchedOrionVideoViewsField,
        ])
        const batchedVideoViews = await batchedVideoViewsResolver(
          parent,
          {
            videoIdList: videos.map((video: Video) => video.id),
          },
          context,
          info
        )

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])
        return videos.map((video: Video) => ({ ...video, views: viewsLookup[video.id]?.views || 0 }))
      } catch (error) {
        console.error('Failed to resolve video views', 'videos resolver', error)
        return videos
      }
    },
    videosConnection: createResolverWithTransforms(queryNodeSchema, 'videosConnection'),
    mostViewedVideos: async (parent, args, context, info) => {
      context.viewsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostViewedVideosIds = limitViews(
        context.viewsAggregate.getTimePeriodVideoViews()[mapPeriods(args.timePeriodDays)],
        args.limit
      ).map((entity) => entity.id)
      return getSortedEntitiesBasedOnOrion(parent, mostViewedVideosIds, context, info, queryNodeSchema, 'videos')
    },
    mostViewedVideosAllTime: async (parent, args, context, info) => {
      const mostViewedVideosIds = limitViews(context.viewsAggregate.getAllVideoViews(), args.limit).map(
        (entity) => entity.id
      )
      return getSortedEntitiesBasedOnOrion(parent, mostViewedVideosIds, context, info, queryNodeSchema, 'videos')
    },
  },
  Video: {
    views: async (parent, args, context) => getVideoViewsInfo(parent.id, context)?.views,
  },
  VideoConnection: {
    edges: async (parent, args, context, info) => {
      const batchedVideoViewsResolver = createResolverWithTransforms(orionSchema, ORION_BATCHED_VIEWS_QUERY_NAME, [
        TransformBatchedOrionVideoViewsField,
      ])

      try {
        const batchedVideoViews = await batchedVideoViewsResolver(
          parent,
          { videoIdList: parent.edges.map((edge: VideoEdge) => edge.node.id) },
          context,
          info
        )

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

        return parent.edges.map((edge: VideoEdge) => ({
          ...edge,
          node: {
            ...edge.node,
            views: viewsLookup[edge.node.id]?.views || 0,
          },
        }))
      } catch (error) {
        console.error('Failed to resolve video views', 'VideoConnection.edges resolver', error)
        return parent.edges
      }
    },
  },
})
