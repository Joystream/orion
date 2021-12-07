import { GraphQLSchema } from 'graphql'
import type { IResolvers } from '@graphql-tools/utils'
import { mergeResolvers } from '@graphql-tools/merge'
import { channelResolvers } from './channelResolvers'
import { featuredContentResolvers } from './featuredContentResolvers'
import { videoResolvers } from './videoResolvers'

export const queryNodeStitchingResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => {
  return mergeResolvers([
    channelResolvers(queryNodeSchema),
    featuredContentResolvers(queryNodeSchema),
    videoResolvers(queryNodeSchema),
  ])
}
