import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { mapPeriods } from '../../helpers'
import { getVideoViewsInfo, limitViews } from '../viewsInfo'
import { getSortedEntitiesConnectionBasedOnOrion } from './helpers'

export const videoResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    mostViewedVideos: async (parent, args, context, info) => {
      context.viewsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostViewedVideosIds = limitViews(
        context.viewsAggregate.getTimePeriodVideoViews()[mapPeriods(args.timePeriodDays)],
        args.limit
      )
        .filter((entity) => entity.views)
        .map((entity) => entity.id)

      return getSortedEntitiesConnectionBasedOnOrion(
        parent,
        mostViewedVideosIds,
        context,
        info,
        queryNodeSchema,
        'videosConnection'
      )
    },
    mostViewedVideosAllTime: async (parent, args, context, info) => {
      const mostViewedVideosIds = limitViews(context.viewsAggregate.getAllVideoViews(), args.limit)
        .filter((entity) => entity.views)
        .map((entity) => entity.id)

      return getSortedEntitiesConnectionBasedOnOrion(
        parent,
        mostViewedVideosIds,
        context,
        info,
        queryNodeSchema,
        'videosConnection'
      )
    },
  },
  Video: {
    views: {
      selectionSet: `{ id }`,
      resolve: async (parent, args, context) => getVideoViewsInfo(parent.id, context)?.views,
    },
  },
})
