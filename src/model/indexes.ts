import _ from 'lodash'
import { EntityManager } from 'typeorm'

/**
 * Utilities for creating PostgreSQL indexes.
 * Reasons for chosing this approach over @index decorators in the schema:
 * - More flexibility (support for expression indexes, different index types etc.)
 * - Indexes can be created once Orion is fully synced, which makes a big difference in
 *   initial processing speed.
 */

// TODO: Move other indexes from schema here

type IndexDefinition = {
  type?: 'BTREE'
  name?: string
  on: string
  target: string
  expression?: string
}

export const INDEX_DEFS: IndexDefinition[] = [
  // Event
  { on: `"curator"."event"`, target: `(("data"->>'video'))` },
  { on: `"curator"."event"`, target: `(("data"->>'comment'))` },
  { on: `"curator"."event"`, target: `(("data"->'nftOwner'->>'member'))` },
  { on: `"curator"."event"`, target: `(("data"->'nftOwner'->>'channel'))` },
  { on: `"curator"."event"`, target: `(("data"->>'auction'))` },
  { on: `"curator"."event"`, target: `(("data"->>'isTypeOf'))` },
  { on: `"curator"."event"`, target: `(("data"->>'nft'))` },
  { on: `"curator"."event"`, target: `(("data"->>'bid'))` },
  { on: `"curator"."event"`, target: `(("data"->>'member'))` },
  { on: `"curator"."event"`, target: `(("data"->>'winningBid'))` },
  { on: `"curator"."event"`, target: `(("data"->'previousNftOwner'->>'member'))` },
  { on: `"curator"."event"`, target: `(("data"->'previousNftOwner'->>'channel'))` },
  { on: `"curator"."event"`, target: `(("data"->>'buyer'))` },
  // Auction
  { on: `"curator"."auction"`, target: `(("auction_type"->>'isTypeOf'))` },
  // OwnedNFT
  { on: `"curator"."owned_nft"`, target: `(("transactional_status"->>'auction'))` },
  // MemberMetadata
  { on: `"member_metadata"`, target: `(("avatar"->>'avatarObject'))` },
  // Video
  { on: `"curator"."video"`, target: `("created_at")` },
  { on: `"curator"."video"`, target: `("language")` },
  { on: `"curator"."video"`, target: `("orion_language")` },
  { on: `"curator"."video"`, target: `("video_relevance")` },
  { on: `"curator"."video"`, target: `("yt_video_id")` },
  { on: `"curator"."video"`, target: `("views_num")` },
  { on: `"curator"."video"`, target: `("reactions_count")` },
  { on: `"curator"."video"`, target: `("comments_count")` },
  { on: `"curator"."video"`, target: `("is_censored")` },
  { on: `"curator"."video"`, target: `("is_public")` },
  { on: `"curator"."video"`, target: `("is_excluded")` },
  { on: `"curator"."video"`, target: `("include_in_home_feed")` },
  { on: `"curator"."video"`, target: `("is_short")` },
  { on: `"curator"."video"`, target: `("is_short_derived")` },
  // Channel
  { on: `"curator"."channel"`, target: `("created_at")` },
  { on: `"curator"."channel"`, target: `("language")` },
  { on: `"curator"."channel"`, target: `("channel_weight")` },
  { on: `"curator"."channel"`, target: `("video_views_num")` },
  { on: `"curator"."channel"`, target: `("total_videos_created")` },
  { on: `"curator"."channel"`, target: `("cumulative_revenue")` },
  { on: `"curator"."channel"`, target: `(("ypp_status"->>'isTypeOf'))` },
  { on: `"curator"."channel"`, target: `(("ypp_status"->>'tier'))` },
  { on: `"curator"."channel"`, target: `("is_censored")` },
  { on: `"curator"."channel"`, target: `("is_public")` },
  { on: `"curator"."channel"`, target: `("is_excluded")` },
]

function normalizePsqlName(name: string): string {
  return name
    .replace(/->/g, '_')
    .replace(/\./g, '_')
    .replace(/[^A-Za-z0-9_]/g, '')
}

export function indexName(index: IndexDefinition) {
  return index.name || generateIndexName(index)
}

function generateIndexName({ on, target }: Pick<IndexDefinition, 'on' | 'target'>): string {
  return `"idx__${normalizePsqlName(on)}__${normalizePsqlName(target)}"`
}

function createIndexQuery({ type = 'BTREE', name, on, target }: IndexDefinition): string {
  name = name || generateIndexName({ on, target })
  return `CREATE INDEX IF NOT EXISTS ${name} ON ${on} USING ${type} ${target};`
}

export async function createIndexes(
  db: EntityManager,
  defs: IndexDefinition[] = INDEX_DEFS
): Promise<void> {
  for (const index of defs) {
    const query = createIndexQuery(index)
    await db.query(query)
  }
}

export async function dropIndexes(db: EntityManager): Promise<void> {
  for (const index of INDEX_DEFS) {
    const query = `DROP INDEX IF EXISTS ${indexName(index)};`
    await db.query(query)
  }
}

export async function getMissingIndexes(db: EntityManager): Promise<IndexDefinition[]> {
  const existingIndexNames: string[] = (await db.query(`SELECT indexname FROM pg_indexes`)).map(
    (r: { indexname: string }) => r.indexname
  )
  return _.differenceBy(INDEX_DEFS, existingIndexNames, (v) =>
    (typeof v === 'string' ? v : indexName(v)).replace(/(\\|")/g, '')
  )
}
