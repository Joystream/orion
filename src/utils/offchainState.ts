import { EntityManager } from 'typeorm'
import { withHiddenEntities } from './sql'
import fs from 'fs'
import path from 'path'
import { createLogger } from '@subsquid/logger'
import assert from 'assert'

const DEFAULT_EXPORT_PATH = path.resolve(__dirname, '../../db/export.json')

const exportedStateMap = {
  VideoViewEvent: true,
  ChannelFollow: true,
  Report: true,
  GatewayConfig: true,
  NftFeaturingRequest: true,
  VideoHero: true,
  VideoFeaturedInCategory: true,
  Channel: ['is_excluded', 'video_views_num'],
  Video: ['is_excluded', 'views_num'],
  Comment: ['is_excluded'],
  OwnedNft: ['is_featured'],
  VideoCategory: ['is_supported'],
}

type ExportedData = {
  [K in keyof typeof exportedStateMap]: {
    type: 'insert' | 'update'
    values: Record<string, unknown>[]
  }
}

type ExportedState = {
  data: ExportedData
  blockNumber: number
}

export class OffchainState {
  private logger = createLogger('offchainState')
  private _isImported = false

  public get isImported(): boolean {
    return this._isImported
  }

  public async export(em: EntityManager, exportFilePath = DEFAULT_EXPORT_PATH): Promise<void> {
    this.logger.info('Exporting offchain state')
    const exportedState: ExportedState = await em.transaction(async (em) => {
      const blockNumberPre: number = (
        await em.query('SELECT height FROM squid_processor.status WHERE id = 0')
      )[0].height
      this.logger.info(`Export block number: ${blockNumberPre}`)
      const data = await withHiddenEntities(em, async () => {
        return Object.fromEntries(
          await Promise.all(
            Object.entries(exportedStateMap).map(async ([entityName, fields]) => {
              const type = Array.isArray(fields) ? 'update' : 'insert'
              const values = Array.isArray(fields)
                ? await em
                    .getRepository(entityName)
                    .createQueryBuilder()
                    .select(['id', ...fields])
                    .getRawMany()
                : await em.getRepository(entityName).find({})
              this.logger.info(
                `Exporting ${values.length} ${entityName} entities ` +
                  `(type: ${type}` +
                  (Array.isArray(fields) ? `, fields: ${fields.join(', ')})` : ')')
              )
              return [entityName, { type, values }]
            })
          )
        )
      })
      const blockNumberPost: number = (
        await em.query('SELECT height FROM squid_processor.status WHERE id = 0')
      )[0].height
      assert(blockNumberPre === blockNumberPost, 'Block number changed during export')
      return { data, blockNumber: blockNumberPost }
    })

    this.logger.info(`Saving export data to ${exportFilePath}`)
    fs.writeFileSync(exportFilePath, JSON.stringify(exportedState))
    this.logger.info('Done')
  }

  public async import(em: EntityManager, exportFilePath = DEFAULT_EXPORT_PATH): Promise<void> {
    if (!fs.existsSync(exportFilePath)) {
      throw new Error(
        `Cannot perform offchain data import! Export file ${exportFilePath} does not exist!`
      )
    }
    const { data }: ExportedState = JSON.parse(fs.readFileSync(exportFilePath, 'utf-8'))
    this.logger.info('Importing offchain state')
    for (const [entityName, { type, values }] of Object.entries(data)) {
      if (!values.length) {
        continue
      }
      this.logger.info(
        `${type === 'update' ? 'Updating' : 'Inserting'} ${values.length} ${entityName} entities...`
      )
      if (type === 'update') {
        // We're using "batched" updates, because otherwise the process becomes extremely slow
        const meta = em.connection.getMetadata(entityName)
        const batchSize = 1000
        let batchNumber = 0
        const fieldNames = Object.keys(values[0])
        const fieldTypes = Object.fromEntries(
          fieldNames.map((fieldName) => {
            const metaType = meta.columns.find(
              (c) => c.databaseNameWithoutPrefixes === fieldName
            )?.type
            return [fieldName, metaType === String ? 'text' : metaType]
          })
        )
        while (values.length) {
          const batch = values.splice(0, batchSize)
          this.logger.info(
            `Executing batch #${++batchNumber} of ${batch.length} entities (${
              values.length
            } entities left)...`
          )
          let paramCounter = 1
          await em.query(
            `UPDATE "${meta.tableName}"
            SET ${fieldNames
              .filter((f) => f !== 'id')
              .map((f) => `"${f}" = "data"."${f}"`)
              .join(', ')}
            FROM (
              SELECT
              ${fieldNames
                .map((fieldName) => {
                  return `unnest($${paramCounter++}::${fieldTypes[fieldName]}[])
                  AS "${fieldName}"`
                })
                .join(', ')}
            ) AS "data"
            WHERE "${meta.tableName}"."id" = "data"."id"`,
            fieldNames.map((fieldName) => batch.map((v) => v[fieldName]))
          )
        }
      } else {
        // For inserts we also use batches, but this is because otherwise the query may fail
        // if the number of entities is very large
        const batchSize = 1000
        let batchNumber = 0
        while (values.length) {
          const batch = values.splice(0, batchSize)
          this.logger.info(
            `Executing batch #${++batchNumber} of ${batch.length} entities (${
              values.length
            } entities left)...`
          )
          await em.getRepository(entityName).insert(batch)
        }
      }
      this.logger.info(
        `Done ${type === 'update' ? 'updating' : 'inserting'} ${entityName} entities`
      )
    }
    const renamedExportFilePath = `${exportFilePath}.imported`
    this.logger.info(`Renaming export file to ${renamedExportFilePath})...`)
    fs.renameSync(exportFilePath, renamedExportFilePath)
    this._isImported = true
    this.logger.info('Done')
  }

  public getExportBlockNumber(exportFilePath = DEFAULT_EXPORT_PATH): number {
    if (!fs.existsSync(exportFilePath)) {
      this.logger.warn(`Export file ${exportFilePath} does not exist`)
      this._isImported = true
      return -1
    }
    const { blockNumber }: ExportedState = JSON.parse(fs.readFileSync(exportFilePath, 'utf-8'))
    this.logger.info(`Last export block number established: ${blockNumber}`)
    return blockNumber
  }
}
