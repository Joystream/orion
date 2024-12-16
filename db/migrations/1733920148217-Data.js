module.exports = class Data1733920148217 {
    name = 'Data1733920148217'

    async up(db) {
        await db.query(`ALTER TABLE "admin"."comment" ADD "tip_tier" character varying(7)`)
        await db.query(`ALTER TABLE "admin"."comment" ADD "tip_amount" numeric NOT NULL DEFAULT 0`)
        await db.query(`ALTER TABLE "admin"."comment" ADD "sort_priority" integer NOT NULL DEFAULT 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "admin"."comment" DROP COLUMN "tip_tier"`)
        await db.query(`ALTER TABLE "admin"."comment" DROP COLUMN "tip_amount"`)
        await db.query(`ALTER TABLE "admin"."comment" DROP COLUMN "sort_priority"`)
    }
}
