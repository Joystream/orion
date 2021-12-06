import { GraphQLSchema } from 'graphql'
import type { IResolvers } from '@graphql-tools/utils'
import { mergeResolvers } from '@graphql-tools/merge'
import { searchResolvers } from './searchResolvers'
import { channelResolvers } from './channelResolvers'
import { featuredContentResolvers } from './featuredContentResolvers'
import { videoResolvers } from './videoResolvers'

export const queryNodeStitchingResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => {
  return mergeResolvers([
    searchResolvers(queryNodeSchema),
    channelResolvers(queryNodeSchema),
    featuredContentResolvers(queryNodeSchema),
    videoResolvers(queryNodeSchema),
  ])
}
