import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { stitchSchemas } from '@graphql-tools/stitch'
import { UrlLoader } from '@graphql-tools/url-loader'
import { MapperKind, mapSchema } from '@graphql-tools/utils'
import { ApolloServerPluginLandingPageGraphQLPlayground, ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { GraphQLSchema } from 'graphql'
import { connect, Mongoose } from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { FollowsAggregate, ViewsAggregate } from './aggregates'
import { customAuthChecker } from './helpers'
import { ChannelFollowsInfosResolver, queryNodeStitchingResolvers, VideoViewsInfosResolver } from './resolvers'
import { FeaturedContentResolver } from './resolvers/featuredContent'
import { createResolverWithTransforms } from './resolvers/queryNodeStitchingResolvers'
import { Aggregates, OrionContext } from './types'

const getVideoDirective = () => {
  return {
    getVideoTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          if (fieldConfig.astNode?.name.value === 'video') {
            console.log(fieldConfig)
            fieldConfig.resolve = async (parent, args, context, info) => {
              const videoResolver = createResolverWithTransforms(schema, 'videoByUniqueInput', [])
              const video = await videoResolver(
                parent,
                {
                  where: {
                    id: parent.videoId,
                  },
                },
                context,
                info
              )
              return video
            }
          }
          return fieldConfig
        },
      }),
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

  const { getVideoTransformer } = getVideoDirective()

  const extendedQueryNodeSchema = await loadSchema('./extendedQueryNodeSchema.graphql', {
    loaders: [new GraphQLFileLoader()],
  })

  const remoteQueryNodeSchema = await loadSchema(queryNodeUrl, {
    loaders: [new UrlLoader()],
  })

  let schema = stitchSchemas({
    subschemas: [extendedQueryNodeSchema, orionSchema, remoteQueryNodeSchema],
    resolvers: queryNodeStitchingResolvers(remoteQueryNodeSchema, orionSchema),
  })

  schema = getVideoTransformer(schema)

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
