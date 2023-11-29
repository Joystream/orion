const noCategoryVideosSupportedByDefault =
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === 'true' ||
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === '1'

module.exports = class Views2000000000000 {
  name = 'Views2000000000000'

  getViewDefinitions(db) {
    return {
      channel: [`is_excluded='0'`, `is_censored='0'`],
      banned_member: [`EXISTS(SELECT 1 FROM "channel" WHERE "id"="channel_id")`],
      video: [
        `is_excluded='0'`,
        `is_censored='0'`,
        `EXISTS(SELECT 1 FROM "channel" WHERE "id"="channel_id")`,
        `EXISTS(SELECT 1 FROM "video_category" WHERE "id"="category_id" AND "is_supported"='1')
          OR (
            "category_id" IS NULL
            AND COALESCE(
              (SELECT "value" FROM "gateway_config" WHERE "id"='SUPPORT_NO_CATEGORY_VIDEOS'),
              ${noCategoryVideosSupportedByDefault ? "'1'" : "'0'"}
            )='1'
          )`
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
      video_media_encoding: [`EXISTS(SELECT 1 FROM "video_media_metadata" WHERE "encoding_id"="this"."id")`],
      video_reaction: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
      video_subtitle: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
      video_featured_in_category: [
        `EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`,
        `EXISTS(SELECT 1 FROM "video_category" WHERE "id"="category_id")`
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
        `("data"->>'comment' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->>'comment'))`
      ],
      storage_data_object: [
        `("type"->>'channel' IS NULL OR EXISTS(SELECT 1 FROM "channel" WHERE "id"="type"->>'channel'))`,
        `("type"->>'video' IS NULL OR EXISTS(SELECT 1 FROM "video" WHERE "id"="type"->>'video'))`
      ],
      nft_history_entry: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
      nft_activity: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
      // HIDDEN entities
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
    }
  }

  async up(db) {
    const viewDefinitions = this.getViewDefinitions(db)
    // Create a new "admin" schema through which the "hidden" entities can be accessed
    await db.query(`CREATE SCHEMA "admin"`)
    // Create admin user with "admin" schema in default "search_path"
    await db.query(`CREATE USER "${process.env.DB_ADMIN_USER}" WITH PASSWORD '${process.env.DB_ADMIN_PASS}'`)
    await db.query(`GRANT pg_read_all_data TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT pg_write_all_data TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`ALTER USER "${process.env.DB_ADMIN_USER}" SET search_path TO admin,public`)
    for (const [tableName, viewConditions] of Object.entries(viewDefinitions)) {
      await db.query(`ALTER TABLE "${tableName}" SET SCHEMA "admin"`)
      if (Array.isArray(viewConditions)) {
        await db.query(`
          CREATE VIEW "${tableName}" AS
            SELECT *
            FROM "admin"."${tableName}" AS "this"
            WHERE ${viewConditions.map(cond => `(${cond})`).join(" AND\n")}
        `)
      } else {
        await db.query(`
          CREATE VIEW "${tableName}" AS (${viewConditions})`)
      }
    }
  }

  async down(db) {
    const viewDefinitions = this.getViewDefinitions(db)
    for (const viewName of Object.keys(viewDefinitions)) {
      await db.query(`DROP VIEW "${viewName}"`)
      await db.query(`ALTER TABLE "admin"."${viewName}" SET SCHEMA "public"`)
    }
    await db.query(`DROP SCHEMA "admin"`)
  }
}
