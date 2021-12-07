import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { mapPeriods } from '../../helpers'
import { Channel, ChannelEdge } from '../../types'
import { getFollowsInfo, limitFollows } from '../followsInfo'
import { getChannelViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms, getSortedEntitiesBasedOnOrion } from './helpers'

export const channelResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    channels: async (parent, args, context, info) => {
      const chanelsResolver = createResolverWithTransforms(queryNodeSchema, 'channels')
      const filterOrderByArgs = {
        ...args,
        orderBy: args.orderBy?.filter(
          (orderBy: string) => orderBy !== 'followsNumber_ASC' && orderBy !== 'followsNumber_DESC'
        ),
      }
      const channels = await chanelsResolver(parent, filterOrderByArgs, context, info)

      const isSortedByFollows = args.orderBy?.find(
        (orderByArg: string) => orderByArg === 'followsNumber_ASC' || orderByArg === 'followsNumber_DESC'
      )

      if (isSortedByFollows) {
        const channelWithFollows = channels.map((channel: Channel) => ({
          ...channel,
          follows: getFollowsInfo(channel.id, context)?.follows || null,
        }))
        return [...channelWithFollows].sort((a, b) => {
          return isSortedByFollows === 'followsNumber_DESC' ? b.follows - a.follows : a.follows - b.follows
        })
      }

      const isSortedByViews = args.orderBy?.find(
        (orderByArg: string) => orderByArg === 'viewsNumber_ASC' || orderByArg === 'viewsNumber_DESC'
      )

      if (isSortedByViews) {
        const channelWithViews = channels.map((channel: Channel) => ({
          ...channel,
          views: getChannelViewsInfo(channel.id, context)?.views || null,
        }))
        return [...channelWithViews].sort((a, b) => {
          return isSortedByViews === 'viewsNumber_DESC' ? b.views - a.views : a.views - b.views
        })
      }
      return channels
    },
    mostFollowedChannels: async (parent, args, context, info) => {
      context.followsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostFollowedChannelIds = limitFollows(
        context.followsAggregate.getTimePeriodChannelFollows()[mapPeriods(args.timePeriodDays)],
        args.limit
      ).map((entity) => entity.id)

      return getSortedEntitiesBasedOnOrion(parent, mostFollowedChannelIds, context, info, queryNodeSchema, 'channels')
    },
    mostFollowedChannelsAllTime: async (parent, args, context, info) => {
      const mostFollowedChannelIds = limitFollows(context.followsAggregate.getAllChannelFollows(), args.limit).map(
        (entity) => entity.id
      )

      return getSortedEntitiesBasedOnOrion(parent, mostFollowedChannelIds, context, info, queryNodeSchema, 'channels')
    },
    mostViewedChannels: async (parent, args, context, info) => {
      context.viewsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostViewedChannelIds = limitViews(
        context.viewsAggregate.getTimePeriodChannelViews()[mapPeriods(args.timePeriodDays)],
        args.limit
      ).map((entity) => entity.id)

      return getSortedEntitiesBasedOnOrion(parent, mostViewedChannelIds, context, info, queryNodeSchema, 'channels')
    },
    mostViewedChannelsAllTime: async (parent, args, context, info) => {
      const mostViewedChannelIds = limitViews(context.viewsAggregate.getAllChannelViews(), args.limit).map(
        (entity) => entity.id
      )

      return getSortedEntitiesBasedOnOrion(parent, mostViewedChannelIds, context, info, queryNodeSchema, 'channels')
    },
    channelsConnection: async (parent, args, context, info) => {
      const channelsConnectionResolver = createResolverWithTransforms(queryNodeSchema, 'channelsConnection')
      const filterOrderByArgs = {
        ...args,
        orderBy: args.orderBy?.filter(
          (orderBy: string) =>
            orderBy !== 'followsNumber_ASC' &&
            orderBy !== 'followsNumber_DESC' &&
            orderBy !== 'viewsNumber_ASC' &&
            orderBy !== 'viewsNumber_DESC'
        ),
      }
      const channelsConnection = await channelsConnectionResolver(parent, filterOrderByArgs, context, info)

      const isSortedByFollows = args.orderBy?.find(
        (orderByArg: string) => orderByArg === 'followsNumber_ASC' || orderByArg === 'followsNumber_DESC'
      )

      if (isSortedByFollows) {
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
            return isSortedByFollows === 'followsNumber_DESC'
              ? b.node.follows - a.node.follows
              : a.node.follows - b.node.follows
          }),
        }
      }

      const isSortedByViews = args.orderBy?.find(
        (orderByArg: string) => orderByArg === 'viewsNumber_ASC' || orderByArg === 'viewsNumber_DESC'
      )
      if (isSortedByViews) {
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
            return isSortedByViews === 'viewsNumber_DESC' ? b.node.views - a.node.views : a.node.views - b.node.views
          }),
        }
      }

      return channelsConnection
    },
  },
  Channel: {
    views: {
      selectionSet: '{ id }',
      resolve: async (parent, args, context) => getChannelViewsInfo(parent.id, context)?.views,
    },
    follows: {
      selectionSet: '{ id }',
      resolve: async (parent, args, context) => getFollowsInfo(parent.id, context)?.follows,
    },
  },
})
