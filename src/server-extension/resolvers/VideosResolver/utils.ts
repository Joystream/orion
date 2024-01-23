import { GraphQLResolveInfo } from 'graphql'
import { model } from '../model'
import { parseAnyTree, parseSqlArguments } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { Context } from '../../check'
import { CommonVideoQueryArgs } from './types'

export function buildRecommendationsVideoQuery(
  args: CommonVideoQueryArgs,
  info: GraphQLResolveInfo,
  ctx: Context
) {
  const tree = getResolveTree(info)

  const sqlArgs = parseSqlArguments(model, 'Video', { ...args })
  // Extract subsquid-supported Video fields
  const videoSubTree = tree.fieldsByTypeName.RecommendedVideosQuery.video
  const videoFields = parseAnyTree(model, 'Video', info.schema, videoSubTree)

  // Generate query using subsquid's ListQuery
  return new ListQuery(model, ctx.openreader.dialect, 'Video', videoFields, sqlArgs)
}

export function convertVideoWhereIntoReQlQuery(where: Record<string, any>) {
  let reQlString = ''

  if (where.category?.id_in) {
    reQlString += `'category_id' in { ${where.category.id_in
      .map((id: string) => `"${id}"`)
      .join(', ')} }`
  }

  return reQlString
}
