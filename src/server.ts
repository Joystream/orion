import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchSchemas } from '@graphql-tools/stitch'
import type { ExecutionRequest } from '@graphql-tools/utils'
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap'
import { ApolloServerPluginLandingPageGraphQLPlayground, ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import fetch from 'cross-undici-fetch'
import { readFileSync } from 'fs'
import { print } from 'graphql'
import { connect, Mongoose } from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { FollowsAggregate, ViewsAggregate } from './aggregates'
import { customAuthChecker } from './helpers'
import { queryNodeStitchingResolvers, ChannelFollowsInfosResolver, VideoViewsInfosResolver } from './resolvers'

import { FeaturedContentResolver } from './resolvers/featuredContent'
import { Aggregates, OrionContext } from './types'

const createExecutor = (nodeUrl: string) => {
  return async ({ document, variables }: ExecutionRequest) => {
    const query = print(document)
    const fetchResult = await fetch(nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })
    return fetchResult.json()
  }
}

export const createServer = async (mongoose: Mongoose, aggregates: Aggregates, queryNodeUrl: string) => {
  await mongoose.connection

  const orionSchema = await buildSchema({
    resolvers: [VideoViewsInfosResolver, ChannelFollowsInfosResolver, FeaturedContentResolver],
    authChecker: customAuthChecker,
    emitSchemaFile: 'schema.graphql',
    validate: true,
  })

  const executor = createExecutor(queryNodeUrl)

  const remoteQueryNodeSchema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  })

  const extendedQueryNodeSchema = makeExecutableSchema({
    typeDefs: readFileSync('./extendedQueryNodeSchema.graphql', { encoding: 'utf-8' }),
  })

  const schema = stitchSchemas({
    subschemas: [orionSchema, remoteQueryNodeSchema, extendedQueryNodeSchema],
    resolvers: queryNodeStitchingResolvers(remoteQueryNodeSchema, orionSchema),
  })

  const contextFn: ContextFunction<ExpressContext, OrionContext> = ({ req }) => ({
    ...aggregates,
    remoteHost: req?.ip,
    authorization: req?.header('Authorization'),
  })

  return new ApolloServer({
    schema,
    context: contextFn,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })
}

export const connectMongoose = async (connectionUri: string) => {
  const mongoose = await connect(connectionUri)
  await mongoose.connection
  return mongoose
}

export const buildAggregates = async (): Promise<Aggregates> => {
  const viewsAggregate = await ViewsAggregate.Build()
  const followsAggregate = await FollowsAggregate.Build()

  return { viewsAggregate, followsAggregate }
}
