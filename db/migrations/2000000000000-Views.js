const noCategoryVideosSupportedByDefault =
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === 'true' ||
  process.env.SUPPORT_NO_CATEGORY_VIDEOS === '1'

module.exports = class Views2000000000000 {
  name = 'Views2000000000000'

  viewDefinitions = {
    channel: [`is_excluded='0'`, `is_censored='0'`],
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
    comment: [`is_excluded='0'`, `EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    comment_reaction: [`EXISTS(SELECT 1 FROM "comment" WHERE "id"="comment_id")`],
    license: [`EXISTS(SELECT 1 FROM "video" WHERE "license_id"="this"."id")`],
    video_media_metadata: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    video_media_encoding: [`EXISTS(SELECT 1 FROM "video_media_metadata" WHERE "encoding_id"="this"."id")`],
    video_reaction: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    video_subtitle: [`EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")`],
    // TODO: Consider all events having ref to a video they're related to - this will make filtering much easier
    event: [
      `("data"->>'channel' IS NULL OR EXISTS(SELECT 1 FROM "channel" WHERE "id"="data"->>'channel'))`,
      `("data"->>'video' IS NULL OR EXISTS(SELECT 1 FROM "video" WHERE "id"="data"->>'video'))`,
      `("data"->>'nft' IS NULL OR EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="data"->>'nft'))`,
      `("data"->>'auction' IS NULL OR EXISTS(SELECT 1 FROM "auction" WHERE "id"="data"->>'auction'))`,
      `("data"->>'bid' IS NULL OR EXISTS(SELECT 1 FROM "bid" WHERE "id"="data"->>'bid'))`,
      `("data"->>'comment' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->>'comment'))`
    ],
    notification: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
    nft_history_entry: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
    nft_activity: [`EXISTS(SELECT 1 FROM "event" WHERE "id"="event_id")`],
    // HIDDEN entities
    video_view_event: ['FALSE'],
    channel_follow: ['FALSE'],
    report: ['FALSE'],
    session: ['FALSE'],
    user: ['FALSE'],
    account: ['FALSE'],
    token: ['FALSE']
  }


  async up(db) {
    // Create a new "admin" schema through which the "hidden" entities can be accessed
    await db.query(`CREATE SCHEMA "admin"`)
    // Create admin user with "admin" schema in default "search_path"
    await db.query(`CREATE USER "${process.env.DB_ADMIN_USER}" WITH PASSWORD '${process.env.DB_ADMIN_PASS}'`)
    await db.query(`GRANT ALL PRIVILEGES ON DATABASE "${process.env.DB_NAME}" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT USAGE ON SCHEMA "public" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT USAGE ON SCHEMA "admin" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "public" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "admin" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "public" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "admin" TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(
      `ALTER DEFAULT PRIVILEGES
      IN SCHEMA "public"
      GRANT ALL PRIVILEGES ON TABLES TO "${process.env.DB_ADMIN_USER}"`
    )
    await db.query(
      `ALTER DEFAULT PRIVILEGES
      IN SCHEMA "admin"
      GRANT ALL PRIVILEGES ON TABLES TO "${process.env.DB_ADMIN_USER}"`
    )
    await db.query(`ALTER USER "${process.env.DB_ADMIN_USER}" SET search_path TO admin,public`) 
    for (const [tableName, viewConditions] of Object.entries(this.viewDefinitions)) {
      await db.query(`ALTER TABLE "${tableName}" SET SCHEMA "admin"`)
      await db.query(`
        CREATE VIEW "${tableName}" AS
          SELECT *
          FROM "admin"."${tableName}" AS "this"
          WHERE ${viewConditions.map(cond => `(${cond})`).join(" AND\n")}
      `)
    }
  }

  async down(db) {
    for (const viewName of Object.keys(this.viewDefinitions)) {
      await db.query(`DROP VIEW "${viewName}"`)
      await db.query(`ALTER TABLE "admin"."${viewName}" SET SCHEMA "public"`)
    }
    await db.query(`DROP SCHEMA "admin"`)
  }
}
