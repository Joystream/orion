import { GraphQLSchema } from 'graphql'
import type { IResolvers } from '@graphql-tools/utils'
import { mergeResolvers } from '@graphql-tools/merge'
import { searchResolvers } from './searchResolvers'
import { channelResolvers } from './channelResolvers'
import { featuredContentResolvers } from './featuredContentResolvers'
import { videoResolvers } from './videoResolvers'

export const queryNodeStitchingResolvers = (queryNodeSchema: GraphQLSchema, orionSchema: GraphQLSchema): IResolvers => {
  return mergeResolvers([
    searchResolvers(queryNodeSchema, orionSchema),
    channelResolvers(queryNodeSchema, orionSchema),
    featuredContentResolvers(queryNodeSchema, orionSchema),
    videoResolvers(queryNodeSchema, orionSchema),
  ])
}
