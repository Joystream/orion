module.exports = class Data1707895492551 {
    name = 'Data1707895492551'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_75fbab42a4cb18371b6d5004b0"`)
        await db.query(`ALTER TABLE "video" ADD "orion_language" text`)
        await db.query(`CREATE INDEX "IDX_fe2b4b6aace15f1b6610830846" ON "video" ("created_at") `)
        await db.query(`CREATE INDEX "IDX_57b335fa0a960877caf6d2fc29" ON "video" ("orion_language") `)
        await db.query(`CREATE INDEX "IDX_8c7201ed7d4765dcbcc3609356" ON "owned_nft" ("created_at") `)
        await db.query(`CREATE INDEX "IDX_2c15918ff289396205521c5f3c" ON "event" ("timestamp") `)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_75fbab42a4cb18371b6d5004b0" ON "video" ("language") `)
        await db.query(`ALTER TABLE "video" DROP COLUMN "orion_language"`)
        await db.query(`DROP INDEX "public"."IDX_fe2b4b6aace15f1b6610830846"`)
        await db.query(`DROP INDEX "public"."IDX_57b335fa0a960877caf6d2fc29"`)
        await db.query(`DROP INDEX "public"."IDX_8c7201ed7d4765dcbcc3609356"`)
        await db.query(`DROP INDEX "public"."IDX_2c15918ff289396205521c5f3c"`)
    }
}
