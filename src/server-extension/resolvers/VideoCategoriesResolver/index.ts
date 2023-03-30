import 'reflect-metadata'
import { Ctx, Info, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { ExtendedVideoCategory } from './types'
import { parseAnyTree } from '@subsquid/openreader/lib/opencrud/tree'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { ListQuery } from '@subsquid/openreader/lib/sql/query'
import { model } from '../model'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '@subsquid/openreader/lib/context'
import { extendClause } from '../../../utils/sql'

@Resolver()
export class VideoCategoriesResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [ExtendedVideoCategory])
  async extendedVideoCategories(
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<ExtendedVideoCategory[]> {
    const tree = getResolveTree(info)

    // Extract subsquid-supported VideoCategory fields
    const videoCategorySubTree = tree.fieldsByTypeName.ExtendedVideoCategory.category
    const videoCategoryFields = parseAnyTree(
      model,
      'VideoCategory',
      info.schema,
      videoCategorySubTree
    )

    // Generate query using subsquid's ListQuery
    const listQuery = new ListQuery(
      model,
      ctx.openreader.dialect,
      'VideoCategory',
      videoCategoryFields,
      {}
    )
    let listQuerySql = listQuery.sql

    // Define a subquery to fetch active videos count
    const activeVideosCountQuerySql = `
      SELECT
        "category_id",
        COUNT("video"."id") AS "activeVideosCount"
      FROM
        "video"
        INNER JOIN "storage_data_object" AS "media" ON "media"."id" = "video"."media_id"
        INNER JOIN "storage_data_object" AS "thumbnail" ON "thumbnail"."id" = "video"."thumbnail_photo_id"
      WHERE
        "video"."is_censored" = '0'
        AND "video"."is_public" = '1'
        AND "media"."is_accepted" = '1'
        AND "thumbnail"."is_accepted" = '1'
        AND "category_id" IS NOT NULL
      GROUP BY "category_id"
    `

    // Extend SELECT clause of the original query
    listQuerySql = extendClause(
      listQuerySql,
      'SELECT',
      'COALESCE("activeVideoCounter"."activeVideosCount", 0) AS "activeVideosCount"'
    )

    // Extend FROM clause of the original query
    listQuerySql = extendClause(
      listQuerySql,
      'FROM',
      `LEFT OUTER JOIN (${activeVideosCountQuerySql}) AS "activeVideoCounter"
        ON "activeVideoCounter"."category_id" = "video_category"."id"`,
      ''
    )

    // Override the raw `sql` string in `listQuery` with the modified query
    ;(listQuery as { sql: string }).sql = listQuerySql

    // Override the `listQuery.map` function
    const oldListQMap = listQuery.map.bind(listQuery)
    listQuery.map = (rows: unknown[][]) => {
      const activeVideoCounts: unknown[] = []
      for (const row of rows) {
        activeVideoCounts.push(row.pop())
      }
      const categoriesMapped = oldListQMap(rows)
      return categoriesMapped.map((category, i) => ({
        category,
        activeVideosCount: activeVideoCounts[i],
      }))
    }

    const result = await ctx.openreader.executeQuery(listQuery)
    console.log('Result', result)

    return result
  }
}
