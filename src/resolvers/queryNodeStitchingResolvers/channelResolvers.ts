import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { mapPeriods } from '../../helpers'
import { getFollowsInfo, limitFollows } from '../followsInfo'
import { getChannelViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms, getSortedEntitiesBasedOnOrion } from './helpers'

export const channelResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    channelByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'channelByUniqueInput'),
    channels: createResolverWithTransforms(queryNodeSchema, 'channels'),
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
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection'),
  },
  Channel: {
    views: async (parent, args, context) => getChannelViewsInfo(parent.id, context)?.views,
    follows: async (parent, args, context) => getFollowsInfo(parent.id, context)?.follows,
  },
  ChannelEdge: {
    views: async (parent, args, context) => getChannelViewsInfo(parent.id, context)?.views,
    follows: async (parent, args, context) => getFollowsInfo(parent.id, context)?.follows,
  },
})
