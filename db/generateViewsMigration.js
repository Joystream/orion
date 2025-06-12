const fs = require('fs')
const path = require('path')

const migrationsDir = path.join(__dirname, 'migrations')

// Function to generate the new views migration file
const generateViewsMigration = (versionNumber) => {
  const className = `Views${versionNumber}`
  const fileName = `${versionNumber}-Views.js`
  const fileContent = `
const { createViews } = require('../../lib/model/views')

module.exports = class ${className} {
  name = '${className}'

  async up(db) {
    // these two queries will be invoked and the cleaned up by the squid itself
    // we only do this to be able to reference processor height in mappings 
    await db.query(\`CREATE SCHEMA IF NOT EXISTS squid_processor;\`)
    await db.query(\`CREATE TABLE IF NOT EXISTS squid_processor.status (
      id SERIAL PRIMARY KEY,
      height INT
    );\`)
    await createViews(db);
  }

  async down(db) {
    await dropViews(db);
  }
}
`

  const filePath = path.join(migrationsDir, fileName)
  fs.writeFileSync(filePath, fileContent)
  console.log(`Generated new views migration: ${filePath}`)
}

// Get the latest data migration number and generate the views migration
generateViewsMigration(Date.now())
