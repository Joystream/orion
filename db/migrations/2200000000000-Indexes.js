module.exports = class Indexes2200000000000 {
  name = 'Indexes2200000000000'

  async up(db) {
    await db.query(`CREATE INDEX "events_video" ON "admin"."event" USING BTREE (("data"->>'video'));`)
    await db.query(`CREATE INDEX "events_comment" ON "admin"."event" USING BTREE (("data"->>'comment'));`)
    await db.query(
      `CREATE INDEX "events_nft_owner_member" ON "admin"."event" USING BTREE (("data"->'nftOwner'->>'member'));`
    )
    await db.query(
      `CREATE INDEX "events_nft_owner_channel" ON "admin"."event" USING BTREE (("data"->'nftOwner'->>'channel'));`
    )
    await db.query(`CREATE INDEX "events_auction" ON "admin"."event" USING BTREE (("data"->>'auction'));`)
    await db.query(`CREATE INDEX "events_type" ON "admin"."event" USING BTREE (("data"->>'isTypeOf'));`)
    await db.query(`CREATE INDEX "events_nft" ON "admin"."event" USING BTREE (("data"->>'nft'));`)
    await db.query(`CREATE INDEX "events_bid" ON "admin"."event" USING BTREE (("data"->>'bid'));`)
    await db.query(`CREATE INDEX "events_member" ON "admin"."event" USING BTREE (("data"->>'member'));`)
    await db.query(
      `CREATE INDEX "events_winning_bid" ON "admin"."event" USING BTREE (("data"->>'winningBid'));`
    )
    await db.query(
      `CREATE INDEX "events_previous_nft_owner_member" ON "admin"."event" USING BTREE (("data"->'previousNftOwner'->>'member'));`
    )
    await db.query(
      `CREATE INDEX "events_previous_nft_owner_channel" ON "admin"."event" USING BTREE (("data"->'previousNftOwner'->>'channel'));`
    )
    await db.query(`CREATE INDEX "events_buyer" ON "admin"."event" USING BTREE (("data"->>'buyer'));`)
    await db.query(`CREATE INDEX "auction_type" ON "admin"."auction" USING BTREE (("auction_type"->>'isTypeOf'));`)
    await db.query(`CREATE INDEX "member_metadata_avatar" ON "member_metadata" USING BTREE (("avatar"->>'avatarObject'));`)
    await db.query(`CREATE INDEX "owned_nft_auction" ON "admin"."owned_nft" USING BTREE (("transactional_status"->>'auction'));`)
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
  }
}
