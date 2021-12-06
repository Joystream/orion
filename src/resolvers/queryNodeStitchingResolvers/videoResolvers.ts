import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { mapPeriods } from '../../helpers'
import { getVideoViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms, getSortedEntitiesBasedOnOrion } from './helpers'

export const videoResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    videoByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput'),
    videos: createResolverWithTransforms(queryNodeSchema, 'videos'),
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
})
