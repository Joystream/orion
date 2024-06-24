module.exports = class Data1719233585592 {
    name = 'Data1719233585592'

    async up(db) {
        await db.query(`CREATE TABLE "orion_offchain_cursor" ("cursor_name" character varying NOT NULL, "value" bigint NOT NULL, CONSTRAINT "PK_7083797352af5a21224b6c8ccbc" PRIMARY KEY ("cursor_name"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "orion_offchain_cursor"`)
    }
}
