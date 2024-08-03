module.exports = class Data1721141313646 {
    name = 'Data1721141313646'

    async up(db) {
        await db.query(`CREATE TABLE "admin"."user_interaction_count" ("id" character varying NOT NULL, "type" text, "entity_id" text, "day_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_8e334a51febcf02c54dff48147d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b5261af5f3fe48d77086ebc602" ON "admin"."user_interaction_count" ("day_timestamp") `)
        await db.query(`CREATE TABLE "admin"."marketplace_token" ("liquidity" integer, "market_cap" numeric, "cumulative_revenue" numeric, "amm_volume" numeric, "price_change" numeric, "liquidity_change" numeric, "id" character varying NOT NULL, "status" character varying(6) NOT NULL, "avatar" jsonb, "total_supply" numeric NOT NULL, "is_featured" boolean NOT NULL, "symbol" text, "is_invite_only" boolean NOT NULL, "annual_creator_reward_permill" integer NOT NULL, "revenue_share_ratio_permill" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "channel_id" text, "description" text, "whitelist_applicant_note" text, "whitelist_applicant_link" text, "accounts_num" integer NOT NULL, "number_of_revenue_share_activations" integer NOT NULL, "deissued" boolean NOT NULL, "current_amm_sale_id" text, "current_sale_id" text, "current_revenue_share_id" text, "number_of_vested_transfer_issued" integer NOT NULL, "last_price" numeric, CONSTRAINT "PK_d836a8c3d907b67099c140c4d84" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1268fd020cf195b2e8d5d85093" ON "admin"."marketplace_token" ("symbol") `)
        await db.query(`CREATE INDEX "IDX_b99bb1ecee77f23016f6ef687c" ON "admin"."marketplace_token" ("created_at") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "admin"."user_interaction_count"`)
        await db.query(`DROP INDEX "admin"."IDX_b5261af5f3fe48d77086ebc602"`)
        await db.query(`DROP TABLE "admin"."marketplace_token"`)
        await db.query(`DROP INDEX "admin"."IDX_1268fd020cf195b2e8d5d85093"`)
        await db.query(`DROP INDEX "admin"."IDX_b99bb1ecee77f23016f6ef687c"`)
    }
}
