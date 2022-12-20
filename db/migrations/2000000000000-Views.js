module.exports = class Views2000000000000 {
  name = 'Views2000000000000'

  async up(db) {
    // Create new schema for the processor in order to be easily able to access "hidden" entities
    await db.query(`CREATE SCHEMA "processor"`)
    // Channel view: All channels except censored ones
    await db.query(`ALTER TABLE "channel" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "channel" AS
        SELECT *
        FROM "processor"."channel"
        WHERE "is_censored" = '0'
    `)
    // Videos view: All videos except:
    // - those that are censored,
    // - those belonging to channels that are not part of channels view or
    // - those belonging to categories not supported by the Gateway
    await db.query(`ALTER TABLE "video" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video" AS
        SELECT *
        FROM "processor"."video"
        WHERE
          EXISTS(SELECT 1 FROM "channel" WHERE "id"="channel_id")
          AND EXISTS(SELECT 1 FROM "video_category" WHERE "id"="category_id" AND "is_supported"='1')
          AND "is_censored"='0'
    `)
    // Categories view: All categories except those not supported by the Gateway
    await db.query(`ALTER TABLE "video_category" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video_category" AS
        SELECT *
        FROM "processor"."video_category"
        WHERE "is_supported" = '1'
    `)
    // Nfts view: All nfts except those belonging to videos that are not part of videos view
    await db.query(`ALTER TABLE "owned_nft" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "owned_nft" AS
        SELECT *
        FROM "processor"."owned_nft"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
    `)
  }

  async down(db) {
    await db.query(`DROP VIEW "channel"`)
    await db.query(`ALTER TABLE "processor"."channel" SET SCHEMA "public"`)
    await db.query(`DROP VIEW "video"`)
    await db.query(`ALTER TABLE "processor"."video" SET SCHEMA "public"`)
    await db.query(`DROP VIEW "video_category"`)
    await db.query(`ALTER TABLE "processor"."video_category" SET SCHEMA "public"`)
    await db.query(`DROP VIEW "owned_nft"`)
    await db.query(`ALTER TABLE "processor"."owned_nft" SET SCHEMA "public"`)
    await db.query(`DROP SCHEMA "processor"`)
  }
}
