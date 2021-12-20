import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { Channel, OrionContext } from '../../types'
import { getFollowsInfo } from '../followsInfo'
import { getMostFollowedChannelsIds, getMostViewedChannelsIds } from '../helpers'
import { getChannelViewsInfo } from '../viewsInfo'
import { createResolver, getDataWithIds, sortEntities } from './helpers'
import { shuffle } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const channelResolvers = (queryNodeSchema: GraphQLSchema): IResolvers<any, OrionContext> => ({
  Query: {
    discoverChannels: {
      selectionSet: '{ id }',
      resolve: async (parent, args, context, info) => {
        const resolver = createResolver(queryNodeSchema, 'channels')
        const newestChannels: Channel[] = await resolver(
          parent,
          {
            limit: 100,
            where: {
              ...(args.where || {}),
            },
            orderBy: ['createdAt_DESC'],
          },
          context,
          info
        )

        const sortedChannels = newestChannels
          .map((channel) => ({
            ...channel,
            follows: context.followsAggregate.channelFollows(channel.id),
          }))
          .filter((channel) => channel.follows)
          .sort((a, b) => (b.follows || 0) - (a.follows || 0))

        const slicedChannels = sortedChannels.slice(0, 15)
        return shuffle(slicedChannels)
      },
    },
    promisingChannels: {
      selectionSet: '{ id }',
      resolve: async (parent, args, context, info) => {
        const resolver = createResolver(queryNodeSchema, 'channels')
        const newestChannels: Channel[] = await resolver(
          parent,
          {
            limit: 100,
            where: {
              ...(args.where || {}),
            },
            orderBy: ['createdAt_DESC'],
          },
          context,
          info
        )

        const sortedChannels = newestChannels
          .map((channel) => ({
            ...channel,
            views: context.viewsAggregate.channelViews(channel.id),
          }))
          .filter((channel) => channel.views)
          .sort((a, b) => (b.views || 0) - (a.views || 0))

        const slicedChannels = sortedChannels.slice(0, 15)
        return shuffle(slicedChannels)
      },
    },
    popularChannels: {
      resolve: async (parent, args, context, info) => {
        const mostViewedChannelsIds = getMostViewedChannelsIds(context, { limit: 15, period: null })
        const resolver = createResolver(queryNodeSchema, 'channels')
        const channels = await getDataWithIds(resolver, mostViewedChannelsIds, parent, args, context, info)
        return shuffle(channels)
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
