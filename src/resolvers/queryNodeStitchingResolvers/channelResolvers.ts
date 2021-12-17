import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { Channel } from '../../types'
import { getFollowsInfo } from '../followsInfo'
import { getMostFollowedChannelsIds, getMostViewedChannelsIds } from '../helpers'
import { getChannelViewsInfo } from '../viewsInfo'
import { createResolver, getDataWithIds, sortEntities } from './helpers'

export const channelResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    discoverChannels: async (parent, args, context, info) => {
      // TODO: figure out the logic
      const resolver = createResolver(queryNodeSchema, 'channels')
      return resolver(parent, args, context, info)
    },
    promisingChannels: {
      selectionSet: '{ id }',
      resolve: async (parent, args, context, info) => {
        const resolver = createResolver(queryNodeSchema, 'channels')
        const channels: Channel[] = await resolver(
          parent,
          {
            args: {
              limit: 50,
              where: {
                ...args.where,
              },
            },
          },
          context,
          info
        )

        return channels
          .map((channel) => ({
            ...channel,
            views: getChannelViewsInfo(channel.id, context)?.views,
          }))
          .filter((channel) => channel.views)
          .sort((a, b) => (b.views || 0) - (a.views || 0))
      },
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
