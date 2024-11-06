const { withPriceChange } = require('../lib/server-extension/resolvers/CreatorToken/utils')

const noCategoryVideosSupportedByDefault =
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === 'true' ||
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === '1'

const BLOCKS_PER_DAY = 10 * 60 * 24 // 10 blocs per minute, 60 mins * 24 hours

// Add public 'VIEW' definitions for hidden entities created by
// applying `@schema(name: "admin") directive to the Graphql entities
function getViewDefinitions(db) {
  return {
    channel: [`is_excluded='0'`, `is_censored='0'`],
    banned_member: [`EXISTS(SELECT 1 FROM "channel" WHERE "id"="channel_id")`],
    video: [
      `is_excluded='0'`,
      `is_censored='0'`,
      `EXISTS(SELECT 1 FROM "channel" WHERE "id"="channel_id")`,
      `EXISTS(SELECT 1 FROM "admin"."video_category" WHERE "id"="category_id" AND "is_supported"='1')
          OR (
            "category_id" IS NULL
            AND COALESCE(
              (SELECT "value" FROM "admin"."gateway_config" WHERE "id"='SUPPORT_NO_CATEGORY_VIDEOS'),
              ${noCategoryVideosSupportedByDefault ? "'1'" : "'0'"}
            )='1'
          )`,
    ],
    video_category: [`"is_supported" = '1'`],
    owned_nft: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    auction: [`EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="nft_id")`],
    bid: [`EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="nft_id")`],
    comment: `
        SELECT
            ${db.connection
              .getMetadata('Comment')
              .columns.filter((c) => c.databaseName !== 'text')
              .map((c) => `"${c.databaseName}"`)
              .join(',')},
            CASE WHEN "is_excluded" = '1' THEN '' ELSE "comment"."text" END as "text"
        FROM
            "admin"."comment"
            WHERE EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
      `,
    comment_reaction: [`EXISTS(SELECT 1 FROM "comment" WHERE "id"="comment_id")`],
    license: [`EXISTS(SELECT 1 FROM "video" WHERE "license_id"="this"."id")`],
    video_media_metadata: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    video_media_encoding: [
      `EXISTS(SELECT 1 FROM "video_media_metadata" WHERE "encoding_id"="this"."id")`,
    ],
    video_reaction: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    video_subtitle: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    video_featured_in_category: [
      `EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`,
      `EXISTS(SELECT 1 FROM "video_category" WHERE "id"="category_id")`,
    ],
    video_hero: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    // TODO: Consider all events having ref to a video they're related to - this will make filtering much easier
    event: [
      `("data"->>'channel' IS NULL OR EXISTS(SELECT 1 FROM "channel" WHERE "id"="data"->>'channel'))`,
      `("data"->>'video' IS NULL OR EXISTS(SELECT 1 FROM "video" WHERE "id"="data"->>'video'))`,
      `("data"->>'nft' IS NULL OR EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="data"->>'nft'))`,
      `("data"->>'auction' IS NULL OR EXISTS(SELECT 1 FROM "auction" WHERE "id"="data"->>'auction'))`,
      `("data"->>'bid' IS NULL OR EXISTS(SELECT 1 FROM "bid" WHERE "id"="data"->>'bid'))`,
      `("data"->>'winningBid' IS NULL OR EXISTS(SELECT 1 FROM "bid" WHERE "id"="data"->>'winningBid'))`,
      `("data"->>'comment' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->>'comment'))`,
    ],
    storage_data_object: [
      `("type"->>'channel' IS NULL OR EXISTS(SELECT 1 FROM "channel" WHERE "id"="type"->>'channel'))`,
      `("type"->>'video' IS NULL OR EXISTS(SELECT 1 FROM "video" WHERE "id"="type"->>'video'))`,
    ],
    nft_history_entry: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
    nft_activity: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
    // *** HIDDEN entities ***
    // Even though the following entities are hidden by default (because they are part of "admin" schema)
    // we still define these in the views definitions to create their VIEW in the public schema as they are
    // exposed by the GRAPHQL API, so that when querying the GRAPHQL API, the response is just empty object
    // instead of `"relation does not exist"` error.
    video_view_event: ['FALSE'],
    channel_follow: ['FALSE'],
    report: ['FALSE'],
    exclusion: ['FALSE'],
    session: ['FALSE'],
    notification_email_delivery: ['FALSE'],
    channel_verification: ['FALSE'],
    channel_suspension: ['FALSE'],
    user: ['FALSE'],
    account: ['FALSE'],
    token: ['FALSE'],
    nft_featuring_request: ['FALSE'],
    gateway_config: ['FALSE'],
    email_delivery_attempt: ['FALSE'],
    // TODO (notifications v2): make this part of the admin schema with appropriate resolver for queries
    // notification: ['FALSE'],
    marketplace_token: `
    WITH
      last_block AS (
        SELECT height FROM squid_processor.status
      ),
      tokens_with_stats AS (
        SELECT
          ac.token_id,
          SUM(CASE
            WHEN (
              transaction_type = 'BUY'
              AND tr.created_in < last_block.height - ${BLOCKS_PER_DAY * 30}
            ) THEN quantity
            WHEN (
              transaction_type = 'SELL'
              AND tr.created_in < last_block.height - ${BLOCKS_PER_DAY * 30}
            ) THEN quantity * -1
            ELSE 0
          END) AS total_liquidity_30d_ago,
          SUM (CASE
            WHEN transaction_type = 'BUY' THEN quantity
            ELSE quantity * -1
          END) AS total_liquidity,
          SUM(tr.price_paid) as amm_volume
        FROM amm_transaction tr
        JOIN amm_curve ac ON ac.id = tr.amm_id
        JOIN creator_token ct ON ct.current_amm_sale_id = ac.id
        JOIN last_block ON 1=1
        GROUP BY token_id
      ),
      ${withPriceChange({ periodDays: 30, currentBlock: 'last_block' })}
    SELECT 
      COALESCE(tws.total_liquidity, 0) as liquidity,
      (ct.last_price * ct.total_supply) as market_cap,
      c.cumulative_revenue,
      c.id as channel_id,
      COALESCE(tws.amm_volume, 0) as amm_volume,
      COALESCE(twpc.percentage_change, 0) price_change,
      CASE
        WHEN (tws.total_liquidity_30d_ago IS NULL OR tws.total_liquidity_30d_ago = 0) THEN 0
        ELSE (
          (tws.total_liquidity - tws.total_liquidity_30d_ago)
          * 100
          / tws.total_liquidity_30d_ago
        )
      END as liquidity_change,
      ct.*
    FROM creator_token ct
    LEFT JOIN token_channel tc ON tc.token_id = ct.id
    LEFT JOIN channel c ON c.id = tc.channel_id
    LEFT JOIN tokens_with_price_change twpc ON twpc.token_id = ct.id
    LEFT JOIN tokens_with_stats tws ON tws.token_id = ct.id`,
  }
}

module.exports = { getViewDefinitions }
