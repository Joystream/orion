module.exports = class Data1708791753999 {
    name = 'Data1708791753999'

    async up(db) {
        await db.query(`ALTER TABLE "admin"."video" ADD "include_in_home_feed" boolean`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "admin"."video" DROP COLUMN "include_in_home_feed"`)
    }
}
