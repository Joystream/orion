import { delegateToSchema, Transform } from '@graphql-tools/delegate'
import type { ISchemaLevelResolver } from '@graphql-tools/utils'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { OrionContext } from '../../types'

export const createResolverWithTransforms = (
  schema: GraphQLSchema,
  fieldName: string,
  transforms: Array<Transform> = []
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
      transforms,
    })
}

type Entity = {
  id: string
}
export const getSortedEntitiesBasedOnOrion = async (
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

export const getSortedEntitiesConnectionBasedOnOrion = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parent: any,
  ids: string[],
  context: OrionContext,
  info: GraphQLResolveInfo,
  schema: GraphQLSchema,
  queryName: 'videosConnection'
) => {
  const resolver = createResolverWithTransforms(schema, queryName, [])
  const videosConnection = await resolver(
    parent,
    {
      where: {
        id_in: ids,
      },
    },
    context,
    info
  )
  const edges = videosConnection.edges
    ? {
        edges: [...videosConnection.edges]?.sort((a, b) => {
          return ids.indexOf(a.node.id) - ids.indexOf(b.node.id)
        }),
      }
    : undefined

  return {
    ...videosConnection,
    ...edges,
  }
}
