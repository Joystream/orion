const noCategoryVideosSupportedByDefault =
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === 'true' ||
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === '1'

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
  }
}

module.exports = { getViewDefinitions }
