import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { mapPeriods } from '../../helpers'
import { getVideoViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms } from './helpers'

export const videoResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    mostViewedVideos: async (parent, args, context, info) => {
      context.viewsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostViewedVideosIds = limitViews(
        context.viewsAggregate.getTimePeriodVideoViews()[mapPeriods(args.timePeriodDays)],
        50
      )
        .filter((entity) => entity.views)
        .map((entity) => entity.id)

      const resolver = createResolverWithTransforms(queryNodeSchema, 'videosConnection', [])

      return resolver(
        parent,
        {
          ...args,
          where: {
            ...args.where,
            id_in: mostViewedVideosIds,
          },
        },
        context,
        info
      )
    },
    mostViewedVideosAllTime: async (parent, args, context, info) => {
      const mostViewedVideosIds = limitViews(context.viewsAggregate.getAllVideoViews(), 50)
        .filter((entity) => entity.views)
        .map((entity) => entity.id)

      const resolver = createResolverWithTransforms(queryNodeSchema, 'videosConnection', [])

      return resolver(
        parent,
        {
          ...args,
          where: {
            ...args.where,
            id_in: mostViewedVideosIds,
          },
        },
        context,
        info
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
