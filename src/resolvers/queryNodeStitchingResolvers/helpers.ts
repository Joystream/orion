import { delegateToSchema, Transform } from '@graphql-tools/delegate'
import type { ISchemaLevelResolver } from '@graphql-tools/utils'
import { WrapQuery } from '@graphql-tools/wrap'
import { GraphQLResolveInfo, GraphQLSchema, Kind, SelectionSetNode } from 'graphql'
import { OrionContext } from '../../types'

// found here: https://gist.github.com/Jalle19/1ca5081f220e83e1015fd661ee4e877c
const createSelectionSetAppendingTransform = (parentFieldName: string, appendedFieldName: string) => {
  return new WrapQuery(
    // Modify the specified field's selection set
    [parentFieldName],
    (selectionSet: SelectionSetNode) => {
      const newSelection = {
        kind: Kind.FIELD,
        name: {
          kind: Kind.NAME,
          value: appendedFieldName,
        },
      }

      return { ...selectionSet, selections: [...selectionSet.selections, newSelection] }
    },
    (result) => result
  )
}

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
      // createSelectionSetAppendingTransform will allow getting views and follows without passing id field
      transforms: [...transforms, createSelectionSetAppendingTransform(fieldName, 'id')],
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
