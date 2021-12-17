import { delegateToSchema } from '@graphql-tools/delegate'
import type { ISchemaLevelResolver } from '@graphql-tools/utils'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { OrionContext } from '../../types'

export const createResolver = (
  schema: GraphQLSchema,
  fieldName: string
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
    })
}

export const getDataWithIds = (
  resolver: ReturnType<typeof createResolver>,
  ids: string[],
  parent: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  context: OrionContext,
  info: GraphQLResolveInfo
) => {
  return resolver(
    parent,
    {
      ...args,
      where: {
        ...args.where,
        id_in: ids,
      },
    },
    context,
    info
  )
}

type Entity = {
  id: string
}
export const sortEntities = (entities: Entity[], ids: string[]) => {
  return [...entities].sort((a: Entity, b: Entity) => {
    return ids.indexOf(a.id) - ids.indexOf(b.id)
  })
}
