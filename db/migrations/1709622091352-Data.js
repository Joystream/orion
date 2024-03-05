module.exports = class Data1709622091352 {
    name = 'Data1709622091352'

    async up(db) {
        await db.query(`ALTER TABLE "admin"."video" ADD "is_short_derived" boolean`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "admin"."video" DROP COLUMN "is_short_derived"`)
    }
}
