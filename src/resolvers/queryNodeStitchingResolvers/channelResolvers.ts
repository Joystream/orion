import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { getFollowsInfo } from '../followsInfo'
import { getChannelViewsInfo } from '../viewsInfo'
import { createResolver, getDataWithIds, sortEntities } from './helpers'
import { getMostFollowedChannelsIds, getMostViewedChannelsIds } from '../helpers'

export const channelResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    discoverChannels: async (parent, args, context, info) => {
      // TODO: figure out the logic
      const resolver = createResolver(queryNodeSchema, 'channels')
      return resolver(parent, args, context, info)
    },
    promisingChannels: async (parent, args, context, info) => {
      // TODO: figure out the logic
      const resolver = createResolver(queryNodeSchema, 'channels')
      return resolver(parent, args, context, info)
    },
    top10Channels: async (parent, args, context, info) => {
      const mostFollowedChannelsIds = getMostFollowedChannelsIds(context, { limit: 10, period: null })
      const resolver = createResolver(queryNodeSchema, 'channels')
      const channels = await getDataWithIds(resolver, mostFollowedChannelsIds, parent, args, context, info)
      return sortEntities(channels, mostFollowedChannelsIds)
    },
    mostViewedChannelsConnection: async (parent, args, context, info) => {
      const mostViewedChannelsIds = getMostViewedChannelsIds(context, {
        limit: args.limit,
        period: args.periodDays || null,
      })
      const resolver = createResolver(queryNodeSchema, 'channelsConnection')
      return getDataWithIds(resolver, mostViewedChannelsIds, parent, args, context, info)
    },
    mostFollowedChannelsConnection: async (parent, args, context, info) => {
      const mostFollowedChannelsIds = getMostFollowedChannelsIds(context, {
        limit: args.limit,
        period: args.periodDays || null,
      })
      const resolver = createResolver(queryNodeSchema, 'channelsConnection')
      return getDataWithIds(resolver, mostFollowedChannelsIds, parent, args, context, info)
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
