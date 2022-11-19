module.exports = class Views2000000000000 {
  name = 'Views2000000000000'

  async up(db) {
    await db.query(`ALTER TABLE "channel" RENAME TO "channel_raw"`)
    await db.query(`CREATE VIEW "channel" AS SELECT * FROM "channel_raw" WHERE "is_censored" = '0'`)
  }

  async down(db) {
    await db.query(`DROP VIEW "channel"`)
    await db.query(`ALTER TABLE "channel_raw" RENAME TO "channel`)
  }
}
