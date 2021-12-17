import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { stitchSchemas } from '@graphql-tools/stitch'
import { ApolloServerPluginLandingPageGraphQLPlayground, ContextFunction, PluginDefinition } from 'apollo-server-core'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import type { GraphQLRequestContext } from 'apollo-server-types'
import type { GraphQLRequestListener } from 'apollo-server-plugin-base'

import { connect, Mongoose } from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { FollowsAggregate, ViewsAggregate } from './aggregates'
import { customAuthChecker } from './helpers'
import { ChannelFollowsInfosResolver, VideoViewsInfosResolver } from './resolvers'
import { FeaturedContentResolver } from './resolvers/featuredContent'
import { queryNodeStitchingResolvers } from './resolvers/queryNodeStitchingResolvers'
import { Aggregates, OrionContext } from './types'
import config from './config'
import { UrlLoader } from '@graphql-tools/url-loader'

export const createServer = async (mongoose: Mongoose, aggregates: Aggregates, queryNodeUrl: string) => {
  await mongoose.connection

  const remoteQueryNodeSchema = await loadSchema(queryNodeUrl, {
    loaders: [new UrlLoader()],
  })

  const orionSchema = await buildSchema({
    resolvers: [VideoViewsInfosResolver, ChannelFollowsInfosResolver, FeaturedContentResolver],
    authChecker: customAuthChecker,
    emitSchemaFile: 'schema.graphql',
    validate: true,
  })

  const queryNodeSchemaExtension = await loadSchema('./queryNodeSchemaExtension.graphql', {
    loaders: [new GraphQLFileLoader()],
    schemas: [remoteQueryNodeSchema, orionSchema],
  })

  const schema = stitchSchemas({
    subschemas: [orionSchema, remoteQueryNodeSchema, queryNodeSchemaExtension],
    resolvers: queryNodeStitchingResolvers(remoteQueryNodeSchema),
  })

  const contextFn: ContextFunction<ExpressContext, OrionContext> = ({ req }) => ({
    ...aggregates,
    remoteHost: req?.ip,
    authorization: req?.header('Authorization'),
  })

  return new ApolloServer({
    schema,
    context: contextFn,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground, config.isDebugging ? graphQLLoggingPlugin : {}],
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

const graphQLLoggingPlugin: PluginDefinition = {
  async requestDidStart(requestContext: GraphQLRequestContext): Promise<GraphQLRequestListener | void> {
    console.log('Request started: ' + requestContext.request.operationName)
    return {
      async executionDidStart() {
        return {
          willResolveField({ info }) {
            const start = process.hrtime.bigint()
            return () => {
              const end = process.hrtime.bigint()
              const time = end - start
              // log only fields that took longer than 1ms to resolve
              if (time > 1000 * 1000) {
                console.log(`Field ${info.parentType.name}.${info.fieldName} took ${time / 1000n / 1000n}ms`)
              }
            }
          },
        }
      },
    }
  },
}
