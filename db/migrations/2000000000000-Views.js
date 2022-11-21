module.exports = class Views2000000000000 {
  name = 'Views2000000000000'

  async up(db) {
    await db.query(`ALTER TABLE "channel" RENAME TO "channel_raw"`)
    await db.query(`CREATE VIEW "channel" AS SELECT * FROM "channel_raw" WHERE "is_censored" = '0'`)
    await db.query(`ALTER TABLE "video" RENAME TO "video_raw"`)
    await db.query(`
      CREATE VIEW "video" AS
        SELECT *
        FROM "video_raw"
        WHERE
          EXISTS(SELECT 1 FROM "channel" WHERE "id"="video_raw"."channel_id")
          AND "is_censored"='0'
    `)
  }

  async down(db) {
    await db.query(`DROP VIEW "channel"`)
    await db.query(`ALTER TABLE "channel_raw" RENAME TO "channel"`)
    await db.query(`DROP VIEW "video"`)
    await db.query(`ALTER TABLE "video_raw" RENAME TO "video"`)
  }
}
