module.exports = class Admin1000000000000 {
  name = 'Admin1000000000000'

  async up(db) {
    // Create a new "admin" schema through which the "hidden" entities can be accessed
    await db.query(`CREATE SCHEMA "admin"`)
    // Create admin user with "admin" schema in default "search_path"
    await db.query(
      `CREATE USER "${process.env.DB_ADMIN_USER}" WITH PASSWORD '${process.env.DB_ADMIN_PASS}'`
    )
    await db.query(`GRANT pg_read_all_data TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`GRANT pg_write_all_data TO "${process.env.DB_ADMIN_USER}"`)
    await db.query(`ALTER USER "${process.env.DB_ADMIN_USER}" SET search_path TO admin,public`)
  }

  async down(db) {
    await db.query(`DROP SCHEMA "admin"`)
  }
}
