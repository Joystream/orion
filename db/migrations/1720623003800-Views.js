
const { getViewDefinitions } = require('../viewDefinitions')

module.exports = class Views1720623003800 {
  name = 'Views1720623003800'

  async up(db) {
    const viewDefinitions = getViewDefinitions(db);
    for (const [tableName, viewConditions] of Object.entries(viewDefinitions)) {
      if (Array.isArray(viewConditions)) {
        await db.query(`
          CREATE OR REPLACE VIEW "${tableName}" AS
            SELECT *
            FROM "admin"."${tableName}" AS "this"
            WHERE ${viewConditions.map(cond => `(${cond})`).join(' AND ')}
        `);
      } else {
        await db.query(`
          CREATE OR REPLACE VIEW "${tableName}" AS (${viewConditions})
        `);
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
