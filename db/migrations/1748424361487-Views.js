
const { getPublicViewDefinitions } = require('../viewDefinitions')

module.exports = class Views1748424361487 {
  name = 'Views1748424361487'

  async up(db) {
    // these two queries will be invoked and the cleaned up by the squid itself
    // we only do this to be able to reference processor height in mappings 
    await db.query(`CREATE SCHEMA IF NOT EXISTS squid_processor;`)
    await db.query(`CREATE TABLE IF NOT EXISTS squid_processor.status (
      id SERIAL PRIMARY KEY,
      height INT
    );`)
    const viewDefinitions = getPublicViewDefinitions(db);
    for (const [schemaName, schemaViews] of Object.entries(viewDefinitions)) {
      for (const [tableName, viewConditions] of Object.entries(schemaViews)) {
        if (Array.isArray(viewConditions)) {
          await db.query(`
            DROP VIEW IF EXISTS "${tableName}" CASCADE
          `)
          await db.query(`
            CREATE OR REPLACE VIEW "${tableName}" AS
              SELECT *
              FROM "${schemaName}"."${tableName}" AS "this"
              WHERE ${viewConditions.map(cond => `(${cond})`).join(' AND ')}
          `);
        } else {
          await db.query(`
            CREATE OR REPLACE VIEW "${tableName}" AS (${viewConditions})
          `);
        }
      }
    }
  }  

  async down(db) {
    const viewDefinitions = this.getViewDefinitions(db)
    for (const viewName of Object.keys(viewDefinitions)) {
      await db.query(`DROP VIEW "${viewName}"`)
    }
  }
}
