import { ApolloServer } from 'apollo-server-express'
import { GraphQLResponse } from 'apollo-server-core'

type TypedGraphQLResponse<TResult> = GraphQLResponse & {
  data?: TResult | null
}

export const createQueryFn = (server: ApolloServer) => {
  type QueryOpts<TVars> = {
    query: Parameters<typeof server.executeOperation>[0]['query']
    variables: TVars
  }

  return async <TResult, TVars>(opts: QueryOpts<TVars>) => {
    const result = await server.executeOperation(opts)
    return result as TypedGraphQLResponse<TResult>
  }
}

export const createMutationFn = (server: ApolloServer) => {
  type MutationOpts<TVars> = {
    mutation: Parameters<typeof server.executeOperation>[0]['query']
    variables: TVars
  }

  return async <TResult, TVars>(opts: MutationOpts<TVars>) => {
    const result = await server.executeOperation({ ...opts, query: opts.mutation })
    return result as TypedGraphQLResponse<TResult>
  }
}

export type QueryFn = ReturnType<typeof createQueryFn>
export type MutationFn = ReturnType<typeof createMutationFn>
