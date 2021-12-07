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

      const followsSort = args.orderBy?.find(
        (orderByArg: string) => orderByArg === 'followsNumber_ASC' || orderByArg === 'followsNumber_DESC'
      )

      if (followsSort) {
        const channelWithFollows = channels.map((channel: Channel) => ({
          ...channel,
          follows: getFollowsInfo(channel.id, context)?.follows,
        }))
        return [...channelWithFollows].sort((a, b) => {
          return followsSort === 'followsNumber_DESC'
            ? (b.follows || 0) - (a.follows || 0)
            : (a.follows || 0) - (b.follows || 0)
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
          (orderBy: string) => orderBy !== 'followsNumber_ASC' && orderBy !== 'followsNumber_DESC'
        ),
      }
      const channelsConnection = await channelsConnectionResolver(parent, filterOrderByArgs, context, info)

      const followsSort = args.orderBy?.find(
        (orderByArg: string) => orderByArg === 'followsNumber_ASC' || orderByArg === 'followsNumber_DESC'
      )

      if (followsSort) {
        const nodesWithFollows = channelsConnection.edges.map((edge: ChannelEdge) => ({
          ...edge,
          node: {
            ...edge.node,
            follows: getFollowsInfo(edge.node.id, context)?.follows,
          },
        }))
        return {
          ...channelsConnection,
          edges: [...nodesWithFollows].sort((a, b) => {
            return followsSort === 'followsNumber_DESC'
              ? (b.node.follows || 0) - (a.node.follows || 0)
              : (a.node.follows || 0) - (b.node.follows || 0)
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
