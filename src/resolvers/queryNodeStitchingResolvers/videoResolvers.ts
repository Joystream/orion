import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { getVideoViewsInfo } from '../viewsInfo'
import { createResolver, getDataWithIds, sortEntities } from './helpers'
import { getMostViewedVideosIds } from '../helpers'
import { OrionContext } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const videoResolvers = (queryNodeSchema: GraphQLSchema): IResolvers<any, OrionContext> => ({
  Query: {
    top10VideosThisWeek: async (parent, args, context, info) => {
      const mostViewedVideosIds = getMostViewedVideosIds(context, { limit: 30, period: 7 })
      const resolver = createResolver(queryNodeSchema, 'videos')
      const videos = await getDataWithIds(resolver, mostViewedVideosIds, parent, args, context, info)
      return sortEntities(videos, mostViewedVideosIds).slice(0, 10)
    },
    top10VideosThisMonth: async (parent, args, context, info) => {
      const mostViewedVideosIds = getMostViewedVideosIds(context, { limit: 30, period: 30 })
      const resolver = createResolver(queryNodeSchema, 'videos')
      const videos = await getDataWithIds(resolver, mostViewedVideosIds, parent, args, context, info)
      return sortEntities(videos, mostViewedVideosIds).slice(0, 10)
    },
    mostViewedVideosConnection: async (parent, args, context, info) => {
      const mostViewedVideosIds = getMostViewedVideosIds(context, {
        limit: args.limit,
        period: args.periodDays || null,
      })
      const resolver = createResolver(queryNodeSchema, 'videosConnection')
      return getDataWithIds(resolver, mostViewedVideosIds, parent, args, context, info)
    },
  },
  Video: {
    views: {
      selectionSet: `{ id }`,
      resolve: (parent, args, context) => getVideoViewsInfo(parent.id, context)?.views,
    },
  },
})
