const fs = require('fs')
const path = require('path')
module.exports = class PersistedData2200000000000 {
    name = 'PersistedData2200000000000'
  
    tablesToImport = [
      'video_view_event',
      'report',
      'channel_follow',
      'gateway_config'
    ]

    async up(db) {
      if (process.env.SKIP_IMPORT === '1' || process.env.SKIP_IMPORT === 'true') {
        return
      }
      await db.query('SET LOCAL search_path TO processor,public')
      for (const tableName of this.tablesToImport) {
        const sourcePath = path.resolve(__dirname, `../persisted/${tableName}`)
        const containerPath = `/persisted_data/${tableName}`
        if (fs.existsSync(sourcePath)) {
          await db.query(`COPY ${tableName} FROM '${containerPath}' DELIMITER ',' CSV;`)
        }
      }
      await db.query('SET LOCAL search_path TO DEFAULT')
    }
  
    async down() {
        // Do nothing
    }
  }
  