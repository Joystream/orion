import { delegateToSchema, Transform } from '@graphql-tools/delegate'
import type { IResolvers, ISchemaLevelResolver } from '@graphql-tools/utils'
import { WrapQuery } from '@graphql-tools/wrap'
import { GraphQLResolveInfo, GraphQLSchema, Kind, SelectionSetNode } from 'graphql'
import { createLookup, mapPeriods } from '../helpers'
import { getFeaturedContentDoc } from '../models/FeaturedContent'
import { Channel, ChannelEdge, OrionContext, SearchFtsOutput, Video, VideoEdge } from '../types'
import { limitFollows } from './followsInfo'
import {
  ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
  ORION_BATCHED_FOLLOWS_QUERY_NAME,
  ORION_BATCHED_VIEWS_QUERY_NAME,
  ORION_CHANNEL_VIEWS_QUERY_NAME,
  ORION_FOLLOWS_QUERY_NAME,
  ORION_VIEWS_QUERY_NAME,
  RemoveQueryNodeChannelFollowsField,
  RemoveQueryNodeViewsField,
  TransformBatchedChannelOrionViewsField,
  TransformBatchedOrionFollowsField,
  TransformBatchedOrionVideoViewsField,
  TransformOrionChannelViewsField,
  TransformOrionFollowsField,
  TransformOrionVideoViewsField,
} from './transforms'
import { limitViews } from './viewsInfo'

// found here: https://gist.github.com/Jalle19/1ca5081f220e83e1015fd661ee4e877c
const createSelectionSetAppendingTransform = (parentFieldName: string, appendedFieldName: string) => {
  return new WrapQuery(
    // Modify the specified field's selection set
    [parentFieldName],
    (selectionSet: SelectionSetNode) => {
      const newSelection = {
        kind: Kind.FIELD,
        name: {
          kind: Kind.NAME,
          value: appendedFieldName,
        },
      }

      return { ...selectionSet, selections: [...selectionSet.selections, newSelection] }
    },
    (result) => result
  )
}

export const createResolverWithTransforms = (
  schema: GraphQLSchema,
  fieldName: string,
  transforms: Array<Transform>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ISchemaLevelResolver<any, any> => {
  return async (parent, args, context, info) =>
    delegateToSchema({
      schema,
      operation: 'query',
      fieldName,
      args,
      context,
      info,
      // createSelectionSetAppendingTransform will allow getting views and follows without passing id field
      transforms: [...transforms, createSelectionSetAppendingTransform(fieldName, 'id')],
    })
}

type Entity = {
  id: string
}
const getSortedEntitiesBasedOnOrion = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parent: any,
  ids: string[],
  context: OrionContext,
  info: GraphQLResolveInfo,
  schema: GraphQLSchema,
  queryName: 'videos' | 'channels'
) => {
  const resolver = createResolverWithTransforms(schema, queryName, [])
  const entities = await resolver(
    parent,
    {
      where: {
        id_in: ids,
      },
    },
    context,
    info
  )
  const sortedEntities = [...entities].sort((a: Entity, b: Entity) => {
    return ids.indexOf(a.id) - ids.indexOf(b.id)
  })
  return sortedEntities
}

export const queryNodeStitchingResolvers = (
  queryNodeSchema: GraphQLSchema,
  orionSchema: GraphQLSchema
): IResolvers => ({
  Query: {
    // video queries
    videoByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput', [
      RemoveQueryNodeViewsField,
    ]),
    videos: async (parent, args, context, info) => {
      const videosResolver = createResolverWithTransforms(queryNodeSchema, 'videos', [RemoveQueryNodeViewsField])
      const videos = await videosResolver(parent, args, context, info)
      try {
        const batchedVideoViewsResolver = createResolverWithTransforms(orionSchema, ORION_BATCHED_VIEWS_QUERY_NAME, [
          TransformBatchedOrionVideoViewsField,
        ])
        const batchedVideoViews = await batchedVideoViewsResolver(
          parent,
          {
            videoIdList: videos.map((video: Video) => video.id),
          },
          context,
          info
        )

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])
        return videos.map((video: Video) => ({ ...video, views: viewsLookup[video.id]?.views || 0 }))
      } catch (error) {
        console.error('Failed to resolve video views', 'videos resolver', error)
        return videos
      }
    },
    videosConnection: createResolverWithTransforms(queryNodeSchema, 'videosConnection', [RemoveQueryNodeViewsField]),
    mostViewedVideos: async (parent, args, context, info) => {
      context.viewsAggregate.filterEventsByPeriod(args.timePeriodDays)
      const mostViewedVideosIds = limitViews(
        context.viewsAggregate.getTimePeriodVideoViews()[mapPeriods(args.timePeriodDays)],
        args.limit
      ).map((entity) => entity.id)
      return getSortedEntitiesBasedOnOrion(parent, mostViewedVideosIds, context, info, queryNodeSchema, 'videos')
    },
    mostViewedVideosAllTime: async (parent, args, context, info) => {
      const mostViewedVideosIds = limitViews(context.viewsAggregate.getAllVideoViews(), args.limit).map(
        (entity) => entity.id
      )
      return getSortedEntitiesBasedOnOrion(parent, mostViewedVideosIds, context, info, queryNodeSchema, 'videos')
    },
    videoHero: async () => {
      return (await getFeaturedContentDoc()).videoHero
    },
    // channel queries
    channelByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'channelByUniqueInput', [
      RemoveQueryNodeChannelFollowsField,
      RemoveQueryNodeViewsField,
    ]),
    channels: async (parent, args, context, info) => {
      const channelsResolver = createResolverWithTransforms(queryNodeSchema, 'channels', [
        RemoveQueryNodeChannelFollowsField,
        RemoveQueryNodeViewsField,
      ])
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
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [
      RemoveQueryNodeChannelFollowsField,
      RemoveQueryNodeViewsField,
    ]),
    // mixed queries
    search: async (parent, args, context, info) => {
      const searchResolver = createResolverWithTransforms(queryNodeSchema, 'search', [
        RemoveQueryNodeChannelFollowsField,
        RemoveQueryNodeViewsField,
      ])
      const search = await searchResolver(parent, args, context, info)
      try {
        const channelIdList = search
          .filter((result: SearchFtsOutput) => result.item.__typename === 'Channel')
          .map((result: SearchFtsOutput) => result.item.id)

        const batchedChannelFollowsResolver = createResolverWithTransforms(
          orionSchema,
          ORION_BATCHED_FOLLOWS_QUERY_NAME,
          [TransformBatchedOrionFollowsField]
        )
        const batchedChannelFollowsPromise = batchedChannelFollowsResolver(
          parent,
          {
            channelIdList,
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
            channelIdList,
          },
          context,
          info
        )

        const videoIdList = search
          .filter((result: SearchFtsOutput) => result.item.__typename === 'Video')
          .map((result: SearchFtsOutput) => result.item.id)

        const batchedVideoViewsResolver = createResolverWithTransforms(orionSchema, ORION_BATCHED_VIEWS_QUERY_NAME, [
          TransformBatchedOrionVideoViewsField,
        ])
        const batchedVideoViewsPromise = batchedVideoViewsResolver(
          parent,
          {
            videoIdList,
          },
          context,
          info
        )

        const [batchedChannelFollows, batchedChannelViews, batchedVideoViews] = await Promise.all([
          batchedChannelFollowsPromise,
          batchedChannelViewsPromise,
          batchedVideoViewsPromise,
        ])

        const followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
        const channelViewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])
        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

        const searchWithFollowsAndViews = search.map((searchOutput: SearchFtsOutput) => {
          if (searchOutput.item.__typename === 'Channel') {
            return {
              ...searchOutput,
              item: {
                ...searchOutput.item,
                follows: followsLookup[searchOutput.item.id]?.follows || 0,
                views: channelViewsLookup[searchOutput.item.id]?.views || 0,
              },
            }
          }
          if (searchOutput.item.__typename === 'Video') {
            return {
              ...searchOutput,
              item: {
                ...searchOutput.item,
                views: viewsLookup[searchOutput.item.id]?.views || 0,
              },
            }
          }
        })

        return searchWithFollowsAndViews
      } catch (error) {
        console.error('Failed to resolve channel views, channel follows or video views', 'search resolver', error)
        return search
      }
    },
  },
  VideoHero: {
    video: async (parent, args, context, info) => {
      const videoResolver = createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput', [
        RemoveQueryNodeViewsField,
      ])
      return videoResolver(
        parent,
        {
          where: {
            id: parent.videoId,
          },
        },
        context,
        info
      )
    },
  },
  Video: {
    views: async (parent, args, context, info) => {
      const orionViewsResolver = createResolverWithTransforms(orionSchema, ORION_VIEWS_QUERY_NAME, [
        TransformOrionVideoViewsField,
      ])
      try {
        return await orionViewsResolver(
          parent,
          {
            videoId: parent.id,
          },
          context,
          info
        )
      } catch (error) {
        console.error('Failed to resolve video views', 'Video.views resolver', error)
        return null
      }
    },
  },
  VideoConnection: {
    edges: async (parent, args, context, info) => {
      const batchedVideoViewsResolver = createResolverWithTransforms(orionSchema, ORION_BATCHED_VIEWS_QUERY_NAME, [
        TransformBatchedOrionVideoViewsField,
      ])

      try {
        const batchedVideoViews = await batchedVideoViewsResolver(
          parent,
          { videoIdList: parent.edges.map((edge: VideoEdge) => edge.node.id) },
          context,
          info
        )

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

        return parent.edges.map((edge: VideoEdge) => ({
          ...edge,
          node: {
            ...edge.node,
            views: viewsLookup[edge.node.id]?.views || 0,
          },
        }))
      } catch (error) {
        console.error('Failed to resolve video views', 'VideoConnection.edges resolver', error)
        return parent.edges
      }
    },
  },
  Channel: {
    views: async (parent, args, context, info) => {
      const orionViewsResolver = createResolverWithTransforms(orionSchema, ORION_CHANNEL_VIEWS_QUERY_NAME, [
        TransformOrionChannelViewsField,
      ])
      try {
        return await orionViewsResolver(
          parent,
          {
            channelId: parent.id,
          },
          context,
          info
        )
      } catch (error) {
        console.error('Failed to resolve channel views', 'Channel.views resolver', error)
        return null
      }
    },
    follows: async (parent, args, context, info) => {
      const orionFollowsResolver = createResolverWithTransforms(orionSchema, ORION_FOLLOWS_QUERY_NAME, [
        TransformOrionFollowsField,
      ])
      try {
        return await orionFollowsResolver(
          parent,
          {
            channelId: parent.id,
          },
          context,
          info
        )
      } catch (error) {
        console.error('Failed to resolve channel follows', 'Channel.follows resolver', error)
        return null
      }
    },
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
