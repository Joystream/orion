
const { createViews } = require('../../lib/model/views')

module.exports = class Views1749123353715 {
  name = 'Views1749123353715'

  async up(db) {
    // these two queries will be invoked and the cleaned up by the squid itself
    // we only do this to be able to reference processor height in mappings 
    await db.query(`CREATE SCHEMA IF NOT EXISTS squid_processor;`)
    await db.query(`CREATE TABLE IF NOT EXISTS squid_processor.status (
      id SERIAL PRIMARY KEY,
      height INT
    );`)
    await createViews(db);
  }

  async down(db) {
    await dropViews(db);
  }
}
