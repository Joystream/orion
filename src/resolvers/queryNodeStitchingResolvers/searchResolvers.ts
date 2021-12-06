import type { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import { createResolverWithTransforms } from './helpers'

export const searchResolvers = (queryNodeSchema: GraphQLSchema): IResolvers => ({
  Query: {
    search: createResolverWithTransforms(queryNodeSchema, 'search'),
  },
})
