import { GraphQLResolveInfo } from 'graphql'
import { model } from '../model'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { Context } from '../../check'

export function buildRecommendationsVideoQuery(info: GraphQLResolveInfo, ctx: Context) {
  const tree = getResolveTree(info)

  // Extract subsquid-supported Channel fields
  const videoSubTree = tree.fieldsByTypeName.RecommendedVideosQuery.video
  const videoFields = parseAnyTree(model, 'Video', info.schema, videoSubTree)

  // Generate query using subsquid's ListQuery
  return new ListQuery(model, ctx.openreader.dialect, 'Video', videoFields, {})
}
