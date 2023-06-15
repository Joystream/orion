import { DataSource } from 'typeorm'
import path from 'path'
import { createOrmConfig } from '@subsquid/typeorm-config'

const source = new DataSource({
  ...createOrmConfig({ projectDir: path.resolve(__dirname, '../..') }),
})

export async function getEm() {
  await source.initialize()
  return source.createEntityManager()
}
