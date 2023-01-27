module.exports = class Views2000000000000 {
  name = 'Views2000000000000'

  async up(db) {
    // Create new schema for the processor in order to be easily able to access "hidden" entities
    await db.query(`CREATE SCHEMA "processor"`)
    // Channel view:
    // All channels except censored ones
    await db.query(`ALTER TABLE "channel" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "channel" AS
        SELECT *
        FROM "processor"."channel"
        WHERE "is_censored" = '0' AND "is_excluded" = '0'
    `)
    // Videos view:
    // All videos except:
    // - those that are censored,
    // - those belonging to channels that are not part of channels view 
    // - those belonging to categories not supported by the Gateway
    await db.query(`ALTER TABLE "video" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video" AS
        SELECT *
        FROM "processor"."video"
        WHERE
          EXISTS(SELECT 1 FROM "channel" WHERE "id"="channel_id")
          AND (
            EXISTS(SELECT 1 FROM "video_category" WHERE "id"="category_id" AND "is_supported"='1')
            OR (
              "category_id" IS NULL
              AND COALESCE(
                (SELECT "value" FROM "gateway_config" WHERE "id"='SUPPORT_NO_CATEGORY_VIDEOS'),
                ${
                  (
                    process.env.SUPPORT_NO_CATEGORY_VIDEOS === 'true' ||
                    process.env.SUPPORT_NO_CATEGORY_VIDEOS === '1'
                  )
                    ? "'1'"
                    : "'0'"
                }
              )='1'
            )
          )
          AND "is_censored"='0'
          AND "is_excluded"='0'
    `)
    // Categories view:
    // All categories except those not supported by the Gateway
    await db.query(`ALTER TABLE "video_category" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video_category" AS
        SELECT *
        FROM "processor"."video_category"
        WHERE "is_supported" = '1'
    `)
    // Nfts view:
    // All nfts except those belonging to videos that are not part of videos view
    await db.query(`ALTER TABLE "owned_nft" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "owned_nft" AS
        SELECT *
        FROM "processor"."owned_nft"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
    `)
    // Auctions view:
    // All auctions except those related to nfts that are not part of owned_nft view
    await db.query(`ALTER TABLE "auction" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "auction" AS
        SELECT *
        FROM "processor"."auction"
        WHERE
          EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="nft_id")
    `)
    // Bids view:
    // All bids except those related to nfts that are not part of owned_nft view
    await db.query(`ALTER TABLE "bid" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "bid" AS
        SELECT *
        FROM "processor"."bid"
        WHERE
          EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="nft_id")
    `)
    // Comments view:
    // All comments expect those related to vidoes that are not part of the video view
    await db.query(`ALTER TABLE "comment" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "comment" AS
        SELECT *
        FROM "processor"."comment"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
          AND "is_excluded"='0'
    `)
    // Comments reactions view:
    // All comment reactions expect those related to comments that are not part of the comment view
    await db.query(`ALTER TABLE "comment_reaction" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "comment_reaction" AS
        SELECT *
        FROM "processor"."comment_reaction"
        WHERE
          EXISTS(SELECT 1 FROM "comment" WHERE "id"="comment_id")
    `)
    // Licenes view:
    // All licences expect those related to videos that are not part of the video view
    await db.query(`ALTER TABLE "license" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "license" AS
        SELECT *
        FROM "processor"."license"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "license_id"="processor"."license"."id")
    `)
    // Video media metadata view:
    // All video media metadata expect those related to video that are not part of the video view
    await db.query(`ALTER TABLE "video_media_metadata" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video_media_metadata" AS
        SELECT *
        FROM "processor"."video_media_metadata"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
    `)
    // Video media encoding view:
    // All video media encodings except those related to media metadata that are not part of video_media_metadata view
    await db.query(`ALTER TABLE "video_media_encoding" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video_media_encoding" AS
        SELECT *
        FROM "processor"."video_media_encoding"
        WHERE
          EXISTS(SELECT 1 FROM "video_media_metadata" WHERE "encoding_id"="processor"."video_media_encoding"."id")
    `)
    // Video reactions view:
    // All video reactions except those related to videos that are not part of video view
    await db.query(`ALTER TABLE "video_reaction" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video_reaction" AS
        SELECT *
        FROM "processor"."video_reaction"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
    `)
    // Video subtitles view:
    // All video subtitles except those related to videos that are not part of video view
    await db.query(`ALTER TABLE "video_subtitle" SET SCHEMA "processor"`)
    await db.query(`
      CREATE VIEW "video_subtitle" AS
        SELECT *
        FROM "processor"."video_subtitle"
        WHERE
          EXISTS(SELECT 1 FROM "video" WHERE "id"="video_id")
    `)
    // Events view: All events except those related to channels/videos/nfts/auctions/bid/comments
    // that are not part of owned_nft view
    await db.query(`ALTER TABLE "event" SET SCHEMA "processor"`)
    // TODO: Consider all events having ref to a video they're related to - this will make filtering much easier
    await db.query(`
      CREATE VIEW "event" AS
        SELECT *
        FROM "processor"."event"
        WHERE
          ("data"->>'channel' IS NULL OR EXISTS(SELECT 1 FROM "channel" WHERE "id"="data"->>'channel'))
          AND ("data"->>'video' IS NULL OR EXISTS(SELECT 1 FROM "video" WHERE "id"="data"->>'video'))
          AND ("data"->>'nft' IS NULL OR EXISTS(SELECT 1 FROM "owned_nft" WHERE "id"="data"->>'nft'))
          AND ("data"->>'auction' IS NULL OR EXISTS(SELECT 1 FROM "auction" WHERE "id"="data"->>'auction'))
          AND ("data"->>'bid' IS NULL OR EXISTS(SELECT 1 FROM "bid" WHERE "id"="data"->>'bid'))
          AND ("data"->>'comment' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->>'comment'))
          AND ("data"->'result'->>'commentCreated' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->'result'->>'commentCreated'))
          AND ("data"->'result'->>'commentEdited' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->'result'->>'commentEdited'))
          AND ("data"->'result'->>'commentDeleted' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->'result'->>'commentDeleted'))
          AND ("data"->'result'->>'commentModerated' IS NULL OR EXISTS(SELECT 1 FROM "comment" WHERE "id"="data"->'result'->>'commentModerated'))
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
