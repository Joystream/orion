module.exports = class Data1719227204374 {
    name = 'Data1719227204374'

    async up(db) {
        await db.query(`CREATE TABLE "marketplace_token" ("liquidity" integer, "market_cap" numeric, "cumulative_revenue" numeric, "amm_volume" numeric, "last_day_price_change" numeric, "weekly_liq_change" numeric, "id" character varying NOT NULL, "status" character varying(6) NOT NULL, "avatar" jsonb, "total_supply" numeric NOT NULL, "is_featured" boolean NOT NULL, "symbol" text, "is_invite_only" boolean NOT NULL, "annual_creator_reward_permill" integer NOT NULL, "revenue_share_ratio_permill" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "channel_id" text, "description" text, "whitelist_applicant_note" text, "whitelist_applicant_link" text, "accounts_num" integer NOT NULL, "number_of_revenue_share_activations" integer NOT NULL, "deissued" boolean NOT NULL, "current_amm_sale_id" text, "current_sale_id" text, "current_revenue_share_id" text, "number_of_vested_transfer_issued" integer NOT NULL, "last_price" numeric, CONSTRAINT "PK_d836a8c3d907b67099c140c4d84" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1268fd020cf195b2e8d5d85093" ON "marketplace_token" ("symbol") `)
        await db.query(`CREATE INDEX "IDX_b99bb1ecee77f23016f6ef687c" ON "marketplace_token" ("created_at") `)
        await db.query(`CREATE TABLE "orion_offchain_cursor" ("cursor_name" character varying NOT NULL, "value" bigint NOT NULL, CONSTRAINT "PK_7083797352af5a21224b6c8ccbc" PRIMARY KEY ("cursor_name"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "marketplace_token"`)
        await db.query(`DROP INDEX "public"."IDX_1268fd020cf195b2e8d5d85093"`)
        await db.query(`DROP INDEX "public"."IDX_b99bb1ecee77f23016f6ef687c"`)
        await db.query(`DROP TABLE "orion_offchain_cursor"`)
    }
}
