import { DataSource } from 'typeorm'
import path from 'path'
import { createOrmConfig } from '@subsquid/typeorm-config'
import { createLogger } from '@subsquid/logger'

const globalEmLogger = createLogger('globalEm')

const config = {
  ...createOrmConfig({ projectDir: path.resolve(__dirname, '../..') }),
  entities: [path.join(__dirname, '../model/*.{ts,js}')],
  username: process.env.DB_ADMIN_USER,
  password: process.env.DB_ADMIN_PASS,
}

const source = new DataSource(config)

async function initGlobalEm() {
  try {
    await source.initialize()
  } catch (e) {
    globalEmLogger.error(`Error during database connection initialization: ${String(e)}`)
    process.exit(-1) // Exit to trigger docker service restart an re-attempt to connect
  }
  const em = source.manager
  return em
}

export const globalEm = initGlobalEm()
