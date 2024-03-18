module.exports = class Data1710699134312 {
    name = 'Data1710699134312'

    async up(db) {
        await db.query(`ALTER TABLE "admin"."account" DROP CONSTRAINT "FK_601b93655bcbe73cb58d8c80cd3"`)
        await db.query(`DROP INDEX "admin"."IDX_601b93655bcbe73cb58d8c80cd"`)
        await db.query(`DROP INDEX "admin"."IDX_df4da05a7a80c1afd18b8f0990"`)
        await db.query(`ALTER TABLE "membership" RENAME COLUMN "controller_account" TO "controller_account_id"`)
        await db.query(`CREATE TABLE "blockchain_account" ("id" character varying NOT NULL, CONSTRAINT "PK_3d07d692a436bc34ef4093d9c60" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "admin"."email_confirmation_token" ("id" character varying NOT NULL, "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL, "expiry" TIMESTAMP WITH TIME ZONE NOT NULL, "email" text NOT NULL, CONSTRAINT "PK_2fa8d5586af7e96201b84492131" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "admin"."account" DROP COLUMN "is_email_confirmed"`)
        await db.query(`ALTER TABLE "admin"."account" DROP CONSTRAINT "Account_membership"`)
        await db.query(`ALTER TABLE "admin"."account" DROP COLUMN "membership_id"`)
        await db.query(`ALTER TABLE "admin"."account" DROP CONSTRAINT "Account_joystreamAccount"`)
        await db.query(`ALTER TABLE "admin"."account" DROP COLUMN "joystream_account"`)
        await db.query(`ALTER TABLE "admin"."account" DROP COLUMN "referrer_channel_id"`)
        await db.query(`ALTER TABLE "admin"."account" ADD "joystream_account_id" character varying NOT NULL`)
        await db.query(`ALTER TABLE "admin"."account" ADD CONSTRAINT "UQ_90debbc4217372d2464201c576a" UNIQUE ("joystream_account_id")`)
        await db.query(`ALTER TABLE "membership" DROP COLUMN "controller_account_id"`)
        await db.query(`ALTER TABLE "membership" ADD "controller_account_id" character varying`)
        await db.query(`CREATE INDEX "IDX_58492b909a36e6a3e4dabd4674" ON "membership" ("controller_account_id") `)
        await db.query(`CREATE INDEX "IDX_90debbc4217372d2464201c576" ON "admin"."account" ("joystream_account_id") `)
        await db.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_58492b909a36e6a3e4dabd46743" FOREIGN KEY ("controller_account_id") REFERENCES "blockchain_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`)
        await db.query(`ALTER TABLE "admin"."account" ADD CONSTRAINT "FK_90debbc4217372d2464201c576a" FOREIGN KEY ("joystream_account_id") REFERENCES "blockchain_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "admin"."account" ADD CONSTRAINT "FK_601b93655bcbe73cb58d8c80cd3" FOREIGN KEY ("membership_id") REFERENCES "membership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`)
        await db.query(`CREATE INDEX "IDX_601b93655bcbe73cb58d8c80cd" ON "admin"."account" ("membership_id") `)
        await db.query(`CREATE INDEX "IDX_df4da05a7a80c1afd18b8f0990" ON "admin"."account" ("joystream_account") `)
        await db.query(`ALTER TABLE "membership" RENAME COLUMN "controller_account_id" TO "controller_account"`)
        await db.query(`DROP TABLE "blockchain_account"`)
        await db.query(`DROP TABLE "admin"."email_confirmation_token"`)
        await db.query(`ALTER TABLE "admin"."account" ADD "is_email_confirmed" boolean NOT NULL`)
        await db.query(`ALTER TABLE "admin"."account" ADD CONSTRAINT "Account_membership" UNIQUE ("membership_id")`)
        await db.query(`ALTER TABLE "admin"."account" ADD "membership_id" character varying NOT NULL`)
        await db.query(`ALTER TABLE "admin"."account" ADD CONSTRAINT "Account_joystreamAccount" UNIQUE ("joystream_account")`)
        await db.query(`ALTER TABLE "admin"."account" ADD "joystream_account" text NOT NULL`)
        await db.query(`ALTER TABLE "admin"."account" ADD "referrer_channel_id" text`)
        await db.query(`ALTER TABLE "admin"."account" DROP COLUMN "joystream_account_id"`)
        await db.query(`ALTER TABLE "admin"."account" DROP CONSTRAINT "UQ_90debbc4217372d2464201c576a"`)
        await db.query(`ALTER TABLE "membership" ADD "controller_account_id" text NOT NULL`)
        await db.query(`ALTER TABLE "membership" DROP COLUMN "controller_account_id"`)
        await db.query(`DROP INDEX "public"."IDX_58492b909a36e6a3e4dabd4674"`)
        await db.query(`DROP INDEX "admin"."IDX_90debbc4217372d2464201c576"`)
        await db.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_58492b909a36e6a3e4dabd46743"`)
        await db.query(`ALTER TABLE "admin"."account" DROP CONSTRAINT "FK_90debbc4217372d2464201c576a"`)
    }
}
