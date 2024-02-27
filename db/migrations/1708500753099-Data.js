module.exports = class Data1708500753099 {
    name = 'Data1708500753099'

    async up(db) {
        await db.query(`ALTER TABLE "admin"."video" ADD "is_short" boolean`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "admin"."video" DROP COLUMN "is_short"`)
    }
}
