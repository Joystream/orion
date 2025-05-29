module.exports = class Indexes2200000000000 {
  name = 'Indexes2200000000000'

  async up(db) {
    await db.query(
      `CREATE INDEX "events_video" ON "curator"."event" USING BTREE (("data"->>'video'));`
    )
    await db.query(
      `CREATE INDEX "events_comment" ON "curator"."event" USING BTREE (("data"->>'comment'));`
    )
    await db.query(
      `CREATE INDEX "events_nft_owner_member" ON "curator"."event" USING BTREE (("data"->'nftOwner'->>'member'));`
    )
    await db.query(
      `CREATE INDEX "events_nft_owner_channel" ON "curator"."event" USING BTREE (("data"->'nftOwner'->>'channel'));`
    )
    await db.query(
      `CREATE INDEX "events_auction" ON "curator"."event" USING BTREE (("data"->>'auction'));`
    )
    await db.query(
      `CREATE INDEX "events_type" ON "curator"."event" USING BTREE (("data"->>'isTypeOf'));`
    )
    await db.query(`CREATE INDEX "events_nft" ON "curator"."event" USING BTREE (("data"->>'nft'));`)
    await db.query(`CREATE INDEX "events_bid" ON "curator"."event" USING BTREE (("data"->>'bid'));`)
    await db.query(
      `CREATE INDEX "events_member" ON "curator"."event" USING BTREE (("data"->>'member'));`
    )
    await db.query(
      `CREATE INDEX "events_winning_bid" ON "curator"."event" USING BTREE (("data"->>'winningBid'));`
    )
    await db.query(
      `CREATE INDEX "events_previous_nft_owner_member" ON "curator"."event" USING BTREE (("data"->'previousNftOwner'->>'member'));`
    )
    await db.query(
      `CREATE INDEX "events_previous_nft_owner_channel" ON "curator"."event" USING BTREE (("data"->'previousNftOwner'->>'channel'));`
    )
    await db.query(
      `CREATE INDEX "events_buyer" ON "curator"."event" USING BTREE (("data"->>'buyer'));`
    )
    await db.query(
      `CREATE INDEX "auction_type" ON "curator"."auction" USING BTREE (("auction_type"->>'isTypeOf'));`
    )
    await db.query(
      `CREATE INDEX "member_metadata_avatar" ON "member_metadata" USING BTREE (("avatar"->>'avatarObject'));`
    )
    await db.query(
      `CREATE INDEX "owned_nft_auction" ON "curator"."owned_nft" USING BTREE (("transactional_status"->>'auction'));`
    )
    await db.query(
      `CREATE INDEX video_include_in_home_feed_idx ON curator.video (include_in_home_feed) WHERE include_in_home_feed = true;`
    )
    await db.query(
      `CREATE INDEX idx_video_is_short_false ON curator.video (is_short) WHERE is_short = FALSE;`
    )
    await db.query(
      `CREATE INDEX idx_video_is_short_derived_false ON curator.video (is_short_derived) WHERE is_short_derived = FALSE;`
    )
  }

  async down(db) {
    await db.query(`DROP INDEX "events_video"`)
    await db.query(`DROP INDEX "events_comment"`)
    await db.query(`DROP INDEX "events_nft_owner_member"`)
    await db.query(`DROP INDEX "events_nft_owner_channel"`)
    await db.query(`DROP INDEX "events_auction"`)
    await db.query(`DROP INDEX "events_type"`)
    await db.query(`DROP INDEX "events_nft"`)
    await db.query(`DROP INDEX "events_bid"`)
    await db.query(`DROP INDEX "events_member"`)
    await db.query(`DROP INDEX "events_winning_bid"`)
    await db.query(`DROP INDEX "events_previous_nft_owner_member"`)
    await db.query(`DROP INDEX "events_previous_nft_owner_channel"`)
    await db.query(`DROP INDEX "events_buyer"`)
    await db.query(`DROP INDEX "video_include_in_home_feed_idx"`)
  }
}
