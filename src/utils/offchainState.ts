import { createLogger } from '@subsquid/logger'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { EntityManager } from 'typeorm'
import * as model from '../model'
import { uniqueId } from './crypto'
import { defaultNotificationPreferences } from './notification/helpers'

const DEFAULT_EXPORT_PATH = path.resolve(__dirname, '../../db/export/export.json')

type CamelToSnakeCase<S> = S extends `${infer T}${infer U}`
  ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${T}${CamelToSnakeCase<U>}`
  : S

type SnakeCaseKeys<T> = {
  [K in keyof T as CamelToSnakeCase<K>]: T[K]
}

type ClassConstructors<T> = {
  [K in keyof T]: T[K] extends new (...args: any[]) => any ? T[K] : never
}

type ExportedStateMap = {
  [K in keyof ClassConstructors<typeof model>]?:
    | true
    | (keyof SnakeCaseKeys<InstanceType<ClassConstructors<typeof model>[K]>>)[]
}

const exportedStateMap: ExportedStateMap = {
  VideoViewEvent: true,
  ChannelFollow: true,
  Report: true,
  Exclusion: true,
  ChannelVerification: true,
  ChannelSuspension: true,
  GatewayConfig: true,
  NftFeaturingRequest: true,
  VideoHero: true,
  VideoFeaturedInCategory: true,
  EncryptionArtifacts: true,
  SessionEncryptionArtifacts: true,
  Session: true,
  User: true,
  Account: true,
  Notification: true,
  NotificationEmailDelivery: true,
  EmailDeliveryAttempt: true,
  Token: true,
  NextEntityId: true,
  Channel: ['is_excluded', 'video_views_num', 'follows_num', 'ypp_status', 'channel_weight'],
  Video: ['is_excluded', 'views_num'],
  Comment: ['is_excluded'],
  OwnedNft: ['is_featured'],
  VideoCategory: ['is_supported'],
}

type ExportedData = {
  [K in keyof typeof exportedStateMap]?: {
    type: 'insert' | 'update'
    values: Record<string, unknown>[]
  }
}

type ExportedState = {
  data: ExportedData
  blockNumber: number
  orionVersion?: string
}

type MigrationFunction = (data: ExportedData, em: EntityManager) => ExportedData
type Migrations = Record<string, MigrationFunction>

export const V2_MIGRATION_USER_PREFIX = 'v2-migration-'
function migrateExportDataToV300(data: ExportedData): ExportedData {
  const migrationUser = {
    id: `${V2_MIGRATION_USER_PREFIX}${uniqueId()}`,
    isRoot: false,
  }
  data.User = { type: 'insert', values: [migrationUser] }
  const replaceIpWithUserId = (v: Record<string, unknown>) => {
    delete v.ip
    v.userId = migrationUser.id
  }
  data.VideoViewEvent?.values.forEach(replaceIpWithUserId)
  data.Report?.values.forEach(replaceIpWithUserId)
  data.NftFeaturingRequest?.values.forEach(replaceIpWithUserId)

  // We don't migrate channel follows from v2, because in v3
  // an account is required in order to follow a channel
  delete data.ChannelFollow
  data.Channel?.values.forEach((v) => {
    v.follows_num = 0
  })

  return data
}

function migrateExportDataToV320(data: ExportedData): ExportedData {
  data.Account?.values.forEach((account) => {
    // account will find himself with all notification pref. enabled by default
    account.notificationPreferences = defaultNotificationPreferences()
    // referrer channel id is set to null
    account.referrerChannelId = null
  })

  // all channels will start as unverified because they are re-synched from mappings

  return data
}

export class OffchainState {
  private logger = createLogger('offchainState')
  private _isImported = false

  private migrations: Migrations = {
    '3.2.0': migrateExportDataToV320,
    '3.0.0': migrateExportDataToV300,
  }

  public get isImported(): boolean {
    return this._isImported
  }

  public async export(em: EntityManager, exportFilePath = DEFAULT_EXPORT_PATH): Promise<void> {
    if (!fs.existsSync(path.dirname(exportFilePath))) {
      this.logger.info(`Creating exports directory: ${path.dirname(exportFilePath)}`)
      fs.mkdirSync(path.dirname(exportFilePath), { recursive: true })
    }
    const packageJsonPath = path.join(__dirname, '../../package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const orionVersion = packageJson.version
    this.logger.info('Exporting offchain state')
    const exportedState: ExportedState = await em.transaction(async (em) => {
      const blockNumberPre: number = (
        await em.query('SELECT height FROM squid_processor.status WHERE id = 0')
      )[0].height
      this.logger.info(`Export orion version: ${orionVersion}`)
      this.logger.info(`Export block number: ${blockNumberPre}`)
      const data = Object.fromEntries(
        (
          await Promise.all(
            Object.entries(exportedStateMap).map(async ([entityName, fields]) => {
              const type = Array.isArray(fields) ? 'update' : 'insert'
              const values = Array.isArray(fields)
                ? await em
                    .getRepository(entityName)
                    .createQueryBuilder()
                    .select(['id', ...(fields as unknown as string)])
                    .getRawMany()
                : await em.getRepository(entityName).find({})
              if (!values.length) {
                return []
              }
              this.logger.info(
                `Exporting ${values.length} ${entityName} entities ` +
                  `(type: ${type}` +
                  (Array.isArray(fields) ? `, fields: ${fields.join(', ')})` : ')')
              )
              return [[entityName, { type, values }]]
            })
          )
        ).flat()
      )
      const blockNumberPost: number = (
        await em.query('SELECT height FROM squid_processor.status WHERE id = 0')
      )[0].height
      assert(blockNumberPre === blockNumberPost, 'Block number changed during export')
      return { data, blockNumber: blockNumberPost, orionVersion }
    })

    this.logger.info(`Saving export data to ${exportFilePath}`)
    fs.writeFileSync(exportFilePath, JSON.stringify(exportedState))
    this.logger.info('Done')
  }

  private versionToNumber(version: string): number {
    const [major = '0', minor = '0', patch = '0'] = version.split('.')
    return parseInt(major) * (1000 * 1000) + parseInt(minor) * 1000 + parseInt(patch)
  }

  public prepareExportData(exportState: ExportedState, em: EntityManager): ExportedData {
    let { data } = exportState
    Object.entries(this.migrations)
      .sort(([a], [b]) => this.versionToNumber(a) - this.versionToNumber(b)) // sort in increasing order
      .forEach(([version, fn]) => {
        if (this.versionToNumber(exportState.orionVersion || '0') < this.versionToNumber(version)) {
          this.logger.info(`Migrating export data to version ${version}`)
          data = fn(data, em)
        }
      })
    return data
  }

  public async import(em: EntityManager, exportFilePath = DEFAULT_EXPORT_PATH): Promise<void> {
    if (!fs.existsSync(exportFilePath)) {
      throw new Error(
        `Cannot perform offchain data import! Export file ${exportFilePath} does not exist!`
      )
    }
    const exportFile = JSON.parse(fs.readFileSync(exportFilePath, 'utf-8'))
    const data = this.prepareExportData(exportFile, em)
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
            ORDER BY "id"
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
