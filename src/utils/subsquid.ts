import { UserInputError } from 'apollo-server-core'
import { model } from '../server-extension/resolvers/model'
import { Context } from '../server-extension/check'
import { ensureArray } from '@subsquid/openreader/lib/util/util'
import { parseOrderBy } from '@subsquid/openreader/lib/opencrud/orderBy'
import { parseWhere } from '@subsquid/openreader/lib/opencrud/where'
import {
  getResolveTree,
  getTreeRequest,
  hasTreeRequest,
  simplifyResolveTree,
} from '@subsquid/openreader/lib/util/resolve-tree'
import {
  decodeRelayConnectionCursor,
  RelayConnectionRequest,
} from '@subsquid/openreader/lib/ir/connection'
import { AnyFields } from '@subsquid/openreader/lib/ir/fields'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getConnectionSize } from '@subsquid/openreader/lib/limit.size'
import { GraphQLResolveInfo } from 'graphql'
import { ConnectionQuery } from '@subsquid/openreader/lib//sql/query'

type CreateConnectionQueryFromParamsParams<T> = {
  typeName: string
  outputType: string
  edgeType: string
  ctx: Context
  info: GraphQLResolveInfo
  args: T
}

export const createConnectionQueryFromParams = <
  T extends {
    orderBy: unknown[]
    first?: number
    after?: string
    where?: Record<string, unknown>
  }
>({
  ctx,
  typeName,
  outputType,
  edgeType,
  args,
  info,
}: CreateConnectionQueryFromParamsParams<T>) => {
  args.first = args.first ?? 10
  if (args.first > 1000) {
    throw new Error('The limit cannot exceed 1000')
  }

  // Validation based on '@subsquid/openreader/src/opencrud/schema.ts'
  const orderByArg = ensureArray(args.orderBy)
  if (orderByArg.length === 0) {
    throw new UserInputError('orderBy argument is required for connection')
  }

  const req: RelayConnectionRequest<AnyFields> = {
    orderBy: parseOrderBy(model, typeName, orderByArg as unknown[] as string[]),
    where: parseWhere(args.where),
  }

  if (args.first !== null && args.first !== undefined) {
    if (args.first < 0) {
      throw new UserInputError("'first' argument of connection can't be less than 0")
    } else {
      req.first = args.first
    }
  }

  if (args.after !== null && args.after !== undefined) {
    if (decodeRelayConnectionCursor(args.after) == null) {
      throw new UserInputError(`invalid cursor value: ${args.after}`)
    } else {
      req.after = args.after
    }
  }

  const tree = getResolveTree(info, outputType)

  req.totalCount = hasTreeRequest(tree.fields, 'totalCount')
  req.pageInfo = hasTreeRequest(tree.fields, 'pageInfo')

  const edgesTree = getTreeRequest(tree.fields, 'edges')
  if (edgesTree) {
    const edgeFields = simplifyResolveTree(info.schema, edgesTree, edgeType).fields
    req.edgeCursor = hasTreeRequest(edgeFields, 'cursor')
    const nodeTree = getTreeRequest(edgeFields, 'node')
    if (nodeTree) {
      req.edgeNode = parseAnyTree(model, typeName, info.schema, nodeTree)
    }
  }

  ctx.openreader.responseSizeLimit?.check(() => getConnectionSize(model, typeName, req) + 1)

  return {
    connectionQuery: new ConnectionQuery(model, ctx.openreader.dialect, typeName, req),
    req,
  }
}
