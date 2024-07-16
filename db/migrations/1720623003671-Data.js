module.exports = class Data1720623003671 {
    name = 'Data1720623003671'

    async up(db) {
        await db.query(`CREATE TABLE "admin"."orion_offchain_cursor" ("cursor_name" character varying NOT NULL, "value" bigint NOT NULL, CONSTRAINT "PK_7083797352af5a21224b6c8ccbc" PRIMARY KEY ("cursor_name"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "admin"."orion_offchain_cursor"`)
    }
}
