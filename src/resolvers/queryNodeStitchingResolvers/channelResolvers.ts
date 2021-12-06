import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { createLookup, mapPeriods } from '../../helpers'
import { Channel, ChannelEdge } from '../../types'
import { getFollowsInfo, limitFollows } from '../followsInfo'
import { getChannelViewsInfo, limitViews } from '../viewsInfo'
import { createResolverWithTransforms, getSortedEntitiesBasedOnOrion } from './helpers'
import {
  ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
  ORION_BATCHED_FOLLOWS_QUERY_NAME,
  TransformBatchedChannelOrionViewsField,
  TransformBatchedOrionFollowsField,
} from './transforms'

export const channelResolvers = (queryNodeSchema: GraphQLSchema, orionSchema: GraphQLSchema): IResolvers => ({
  Query: {
    channelByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'channelByUniqueInput'),
    channels: async (parent, args, context, info) => {
      const channelsResolver = createResolverWithTransforms(queryNodeSchema, 'channels')
      const channels = await channelsResolver(parent, args, context, info)
      try {
        const batchedChannelFollowsResolver = createResolverWithTransforms(
          orionSchema,
          ORION_BATCHED_FOLLOWS_QUERY_NAME,
          [TransformBatchedOrionFollowsField]
        )
        const batchedChannelFollowsPromise = batchedChannelFollowsResolver(
          parent,
          {
            channelIdList: channels.map((channel: Channel) => channel.id),
          },
          context,
          info
        )

        const batchedChannelViewsResolver = createResolverWithTransforms(
          orionSchema,
          ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
          [TransformBatchedChannelOrionViewsField]
        )
        const batchedChannelViewsPromise = batchedChannelViewsResolver(
          parent,
          {
            channelIdList: channels.map((channel: Channel) => channel.id),
          },
          context,
          info
        )

        const [batchedChannelFollows, batchedChannelViews] = await Promise.all([
          batchedChannelFollowsPromise,
          batchedChannelViewsPromise,
        ])

        const followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
        const viewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])

        return channels.map((channel: Channel) => ({
          ...channel,
          follows: followsLookup[channel.id]?.follows || 0,
          views: viewsLookup[channel.id]?.views || 0,
        }))
      } catch (error) {
        console.error('Failed to resolve channel views or follows', 'channels resolver', error)
        return channels
      }
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
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection'),
  },
  Channel: {
    views: async (parent, args, context) => getChannelViewsInfo(parent.id, context)?.views,
    follows: async (parent, args, context) => getFollowsInfo(parent.id, context),
  },
  ChannelConnection: {
    edges: async (parent, args, context, info) => {
      const batchedChannelFollowsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_FOLLOWS_QUERY_NAME,
        [TransformBatchedOrionFollowsField]
      )
      const batchedChannelFollowsPromise = batchedChannelFollowsResolver(
        parent,
        {
          channelIdList: parent.edges.map((edge: ChannelEdge) => edge.node.id),
        },
        context,
        info
      )

      const batchedChannelViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
        [TransformBatchedChannelOrionViewsField]
      )
      try {
        const batchedChannelViewsPromise = batchedChannelViewsResolver(
          parent,
          {
            channelIdList: parent.edges.map((edge: ChannelEdge) => edge.node.id),
          },
          context,
          info
        )

        const [batchedChannelFollows, batchedChannelViews] = await Promise.all([
          batchedChannelFollowsPromise,
          batchedChannelViewsPromise,
        ])

        const followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
        const viewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])
        return parent.edges.map((edge: ChannelEdge) => ({
          ...edge,
          node: {
            ...edge.node,
            follows: followsLookup[edge.node.id]?.follows || 0,
            views: viewsLookup[edge.node.id]?.views || 0,
          },
        }))
      } catch (error) {
        console.error('Failed to resolve channel views or follows', 'ChannelConnection.edges resolver', error)
      }
    },
  },
})
