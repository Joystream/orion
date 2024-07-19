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
      WITH trading_volumes AS
          (SELECT ac.token_id,
                  SUM(tr.price_paid) as amm_volume
          FROM amm_transaction tr
          JOIN amm_curve ac ON ac.id = tr.amm_id
          GROUP BY token_id),

      base_price_transaction AS (
          WITH oldest_transactions AS (
              SELECT DISTINCT ON (ac.token_id) 
                  tr.amm_id,
                  ac.token_id,
                  tr.price_per_unit AS oldest_price_paid,
                  tr.created_in
              FROM amm_transaction tr
              JOIN amm_curve ac ON tr.amm_id = ac.id
              WHERE tr.created_in < (SELECT height FROM squid_processor.status) - ${
                BLOCKS_PER_DAY * 30
              }
              ORDER BY ac.token_id, tr.created_in DESC
          ),
          fallback_transactions AS (
              SELECT DISTINCT ON (ac.token_id) 
                  tr.amm_id,
                  ac.token_id,
                  tr.price_per_unit AS oldest_price_paid,
                  tr.created_in
              FROM amm_transaction tr
              JOIN amm_curve ac ON tr.amm_id = ac.id
              WHERE tr.created_in > (SELECT height FROM squid_processor.status) - ${
                BLOCKS_PER_DAY * 30
              }
              ORDER BY ac.token_id, tr.created_in ASC
          )
          SELECT * FROM oldest_transactions
          UNION ALL
          SELECT * FROM fallback_transactions
          WHERE NOT EXISTS (SELECT 1 FROM oldest_transactions)
      )

      SELECT 
            COALESCE(ac.total_liq, 0) as liquidity,
            COALESCE((ct.last_price * ct.total_supply), 0) as market_cap,
            c.cumulative_revenue,
            c.id as channel_id,
            COALESCE(tv.amm_volume, 0) as amm_volume,
            CASE
                WHEN ldt_o.oldest_price_paid = 0
                      OR ldt_o.oldest_price_paid IS NULL THEN 0
                ELSE ((ct.last_price - ldt_o.oldest_price_paid) * 100.0 / ldt_o.oldest_price_paid)
            END AS price_change,
            CASE
                WHEN liq_until.quantity IS NULL THEN 0
                ELSE ((ac.total_liq - liq_until.quantity) * 100 / GREATEST(liq_until.quantity, 1))
            END as liquidity_change,
            ct.*
      FROM creator_token ct
      LEFT JOIN token_channel tc ON tc.token_id = ct.id
      LEFT JOIN channel c ON c.id = tc.channel_id
      LEFT JOIN base_price_transaction ldt_o ON ldt_o.token_id = ct.id
      LEFT JOIN

          (SELECT token_id,
                  SUM(CASE
                          WHEN transaction_type = 'BUY' THEN quantity
                          ELSE quantity * -1
                      END) AS total_liq
          FROM
              (SELECT ac.token_id,
                      tr.transaction_type,
                      tr.quantity
                FROM amm_transaction tr
                JOIN amm_curve ac ON tr.amm_id = ac.id) as tr
          GROUP BY token_id) as ac ON ac.token_id = ct.id

      LEFT JOIN

          (SELECT token_id,
                  SUM(CASE
                          WHEN transaction_type = 'BUY' THEN quantity
                          ELSE quantity * -1
                      END) AS quantity
          FROM
              (SELECT ac.token_id,
                      tr.transaction_type,
                      tr.quantity
                FROM amm_transaction tr
                JOIN amm_curve ac ON tr.amm_id = ac.id
                WHERE tr.created_in <
                        (SELECT height
                        FROM squid_processor.status) - ${BLOCKS_PER_DAY * 30}) as tr
          GROUP BY token_id) as liq_until ON liq_until.token_id = ct.id

      LEFT JOIN trading_volumes tv ON tv.token_id = ct.id
      `,
  }
}

module.exports = { getViewDefinitions }
