module.exports = class Data1719855101866 {
    name = 'Data1719855101866'

    async up(db) {
        await db.query(`CREATE TABLE "admin"."user_interaction_count" ("id" character varying NOT NULL, "type" text, "entity_id" text, "day_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_8e334a51febcf02c54dff48147d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b5261af5f3fe48d77086ebc602" ON "admin"."user_interaction_count" ("day_timestamp") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "admin"."user_interaction_count"`)
        await db.query(`DROP INDEX "admin"."IDX_b5261af5f3fe48d77086ebc602"`)
    }
}
