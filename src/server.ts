import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchSchemas } from '@graphql-tools/stitch'
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
import config from './config'
import { customAuthChecker } from './helpers/auth'
import { queryNodeStitchingResolvers } from './queryNodeStiching/resolvers'
import { ChannelFollowsInfosResolver, VideoViewsInfosResolver } from './resolvers'
import { FeaturedContentResolver } from './resolvers/featuredContent'
import { Aggregates, OrionContext } from './types'
import type { ExecutionRequest } from '@graphql-tools/utils'

const executor = async ({ document, variables }: ExecutionRequest) => {
  const query = print(document)
  const fetchResult = await fetch(config.queryNodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  return fetchResult.json()
}

const extendedQueryNode = readFileSync('./extendedQueryNode.graphql', { encoding: 'utf-8' })

export const createServer = async (mongoose: Mongoose, aggregates: Aggregates) => {
  await mongoose.connection

  const orionSchema = await buildSchema({
    resolvers: [VideoViewsInfosResolver, ChannelFollowsInfosResolver, FeaturedContentResolver],
    authChecker: customAuthChecker,
    emitSchemaFile: 'schema.graphql',
    validate: true,
  })

  const queryNodeSchema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  })

  const extendedQueryNodeSchema = makeExecutableSchema({
    typeDefs: extendedQueryNode,
  })

  const schema = stitchSchemas({
    subschemas: [orionSchema, queryNodeSchema, extendedQueryNodeSchema],
    resolvers: queryNodeStitchingResolvers(queryNodeSchema, orionSchema),
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
