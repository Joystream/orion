import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { mapPeriods } from '../../helpers'
import { ChannelEdge } from '../../types'
import { getFollowsInfo, limitFollows } from '../followsInfo'
import { getChannelViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms } from './helpers'

export const channelResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    mostFollowedChannels: async (parent, args, context, info) => {
      context.followsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostFollowedChannelIds = limitFollows(
        context.followsAggregate.getTimePeriodChannelFollows()[mapPeriods(args.timePeriodDays)],
        args.limit
      )
        .filter((entity) => entity.follows)
        .map((entity) => entity.id)

      const resolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [])

      return resolver(
        parent,
        {
          ...args,
          where: {
            ...args.where,
            id_in: mostFollowedChannelIds,
          },
        },
        context,
        info
      )
    },
    mostFollowedChannelsAllTime: async (parent, args, context, info) => {
      const mostFollowedChannelIds = limitFollows(context.followsAggregate.getAllChannelFollows(), args.limit)
        .filter((entity) => entity.follows)
        .map((entity) => entity.id)

      const resolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [])

      return resolver(
        parent,
        {
          ...args,
          where: {
            ...args.where,
            id_in: mostFollowedChannelIds,
          },
        },
        context,
        info
      )
    },
    mostViewedChannels: async (parent, args, context, info) => {
      context.viewsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostViewedChannelIds = limitViews(
        context.viewsAggregate.getTimePeriodChannelViews()[mapPeriods(args.timePeriodDays)],
        args.limit
      )
        .filter((entity) => entity.views)
        .map((entity) => entity.id)

      const resolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [])

      return resolver(
        parent,
        {
          ...args,
          where: {
            ...args.where,
            id_in: mostViewedChannelIds,
          },
        },
        context,
        info
      )
    },
    mostViewedChannelsAllTime: async (parent, args, context, info) => {
      const mostViewedChannelIds = limitViews(context.viewsAggregate.getAllChannelViews(), args.limit)
        .filter((entity) => entity.views)
        .map((entity) => entity.id)

      const resolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [])

      return resolver(
        parent,
        {
          ...args,
          where: {
            ...args.where,
            id_in: mostViewedChannelIds,
          },
        },
        context,
        info
      )
    },
    promisingNewChannels: async (parent, args, context, info) => {
      const channelsConnectionResolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection')
      const channelsConnection = await channelsConnectionResolver(parent, args, context, info)

      const nodesWithViews = channelsConnection.edges.map((edge: ChannelEdge) => ({
        ...edge,
        node: {
          ...edge.node,
          views: getChannelViewsInfo(edge.node.id, context)?.views || null,
        },
      }))

      return {
        ...channelsConnection,
        edges: [...nodesWithViews].sort((a, b) => {
          return b.node.views - a.node.views
        }),
      }
    },
    discoverNewChannels: async (parent, args, context, info) => {
      const channelsConnectionResolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection')
      const channelsConnection = await channelsConnectionResolver(parent, args, context, info)

      const nodesWithFollows = channelsConnection.edges.map((edge: ChannelEdge) => ({
        ...edge,
        node: {
          ...edge.node,
          follows: getFollowsInfo(edge.node.id, context)?.follows || null,
        },
      }))

      return {
        ...channelsConnection,
        edges: [...nodesWithFollows].sort((a, b) => {
          return b.node.follows - a.node.follows
        }),
      }
    },
  },
  Channel: {
    views: {
      selectionSet: '{ id }',
      resolve: (parent, args, context) => getChannelViewsInfo(parent.id, context)?.views,
    },
    follows: {
      selectionSet: '{ id }',
      resolve: (parent, args, context) => getFollowsInfo(parent.id, context)?.follows,
    },
  },
})
