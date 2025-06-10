import { createLogger } from '@subsquid/logger'
import assert from 'assert'
import { createParseStream, createStringifyStream } from 'big-json'
import fs from 'fs'
import { snakeCase } from 'lodash'
import path from 'path'
import { EntityManager, EntityMetadata, ValueTransformer } from 'typeorm'
import * as model from '../model'
import {
  AccountNotificationPreferences,
  fromJsonDeliveryStatus,
  fromJsonNotificationType,
  fromJsonReadOrUnread,
  fromJsonRecipientType,
} from '../model'
import { uniqueId } from './crypto'
import { defaultNotificationPreferences, notificationPrefAllTrue } from './notification/helpers'
import { EntityManagerOverlay } from './overlay'

const DEFAULT_EXPORT_PATH = path.resolve(__dirname, '../../db/export/export.json')

type ClassConstructors<T> = {
  [K in keyof T]: T[K] extends new (...args: any[]) => any ? T[K] : never
}

type ExportedStateMap = {
  [K in keyof ClassConstructors<typeof model>]?:
    | true
    | (keyof InstanceType<ClassConstructors<typeof model>[K]>)[]
}

const exportedStateMap: ExportedStateMap = {
  VideoViewEvent: true,
  ChannelFollow: true,
  Report: true,
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
  OrionOffchainCursor: true,
  UserInteractionCount: true,
  Channel: ['isExcluded', 'videoViewsNum', 'followsNum', 'yppStatus', 'isYtSyncEnabled'],
  Video: ['isExcluded', 'viewsNum', 'orionLanguage', 'includeInHomeFeed'],
  Comment: ['isExcluded'],
  OwnedNft: ['isFeatured'],
  VideoCategory: ['isSupported'],
  CreatorToken: ['isFeatured'],
}

type ExportedData = {
  [K in keyof typeof exportedStateMap]?: {
    type: 'insert' | 'update'
    values: InstanceType<ClassConstructors<typeof model>[K]>[]
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
  data.User = { type: 'insert', values: [migrationUser as model.User] }
  const replaceIpWithUserId = (v: Record<string, unknown>) => {
    delete v.ip
    v.userId = migrationUser.id
  }
  data.VideoViewEvent?.values.forEach(replaceIpWithUserId as any)
  data.Report?.values.forEach(replaceIpWithUserId as any)
  data.NftFeaturingRequest?.values.forEach(replaceIpWithUserId as any)

  // We don't migrate channel follows from v2, because in v3
  // an account is required in order to follow a channel
  delete data.ChannelFollow
  data.Channel?.values.forEach((v) => {
    v.followsNum = 0
  })

  return data
}

function migrateExportDataToV320(data: ExportedData): ExportedData {
  data.Account?.values.forEach((account) => {
    // account will find himself with all notification pref. enabled by default
    account.notificationPreferences = defaultNotificationPreferences()
  })

  // all channels will start as unverified because they are re-synched from mappings

  return data
}

export function setCrtNotificationPreferences(
  notificationPreferencesObj: any
): AccountNotificationPreferences {
  notificationPreferencesObj.crtIssued = notificationPrefAllTrue()
  notificationPreferencesObj.crtMarketStarted = notificationPrefAllTrue()
  notificationPreferencesObj.crtMarketMint = notificationPrefAllTrue()
  notificationPreferencesObj.crtMarketBurn = notificationPrefAllTrue()
  notificationPreferencesObj.crtSaleStarted = notificationPrefAllTrue()
  notificationPreferencesObj.crtSaleMint = notificationPrefAllTrue()
  notificationPreferencesObj.crtRevenueShareStarted = notificationPrefAllTrue()
  notificationPreferencesObj.crtRevenueSharePlanned = notificationPrefAllTrue()
  notificationPreferencesObj.crtRevenueShareEnded = notificationPrefAllTrue()
  const notificationPreferences = new AccountNotificationPreferences(
    undefined,
    notificationPreferencesObj
  )
  return notificationPreferences
}

function migrateExportDataToV400(data: ExportedData): ExportedData {
  data.Account?.values.forEach((account) => {
    // account will find himself with all CRT notification pref. enabled by default
    account.notificationPreferences = setCrtNotificationPreferences(
      account.notificationPreferences as AccountNotificationPreferences
    )
  })

  data.Notification?.values.forEach((notification) => {
    notification.notificationType = fromJsonNotificationType(notification.notificationType)
    notification.status = fromJsonReadOrUnread(notification.status)
    notification.recipient = fromJsonRecipientType(notification.recipient)
  })

  data.EmailDeliveryAttempt?.values.forEach((emailDeliveryAttempt) => {
    emailDeliveryAttempt.status = fromJsonDeliveryStatus(emailDeliveryAttempt.status)
  })
  return data
}

function migrateExportDataToV500(
  data: ExportedData & {
    ChannelVerification?: unknown
    ChannelSuspension?: unknown
    Exclusion?: unknown
    NextEntityId?: unknown
  }
): ExportedData {
  // Skip entities that don't exist / should not be exported to 5.0
  delete data.ChannelSuspension
  delete data.Exclusion
  delete data.ChannelVerification
  delete data.NextEntityId
  // Skip Channel's yppStatus and channelWeight
  data.Channel?.values.forEach((v) => {
    delete v.yppStatus
    delete v.channelWeight
  })

  return data
}

export class OffchainState {
  private logger = createLogger('offchainState')
  private _isImported = false

  private migrations: Migrations = {
    '5.0.0': migrateExportDataToV500,
    '4.0.0': migrateExportDataToV400,
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
                    .select([
                      'id',
                      ...fields.map((field) => `${snakeCase(String(field))} AS "${String(field)}"`),
                    ])
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
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(exportFilePath)
      const stringifyStream = createStringifyStream({ body: exportedState })
      stringifyStream.pipe(writeStream).on('error', reject).on('finish', resolve)
    })
    this.logger.info('Done')
  }

  private versionToNumber(version: string): number {
    const [major = '0', minor = '0', patch = '0'] = version.split('.')
    return parseInt(major) * (1000 * 1000) + parseInt(minor) * 1000 + parseInt(patch)
  }

  private transformJsonbProperties(data: ExportedData, em: EntityManager): ExportedData {
    // construct proper JSONB objects from raw data
    return Object.fromEntries(
      Object.entries(data).map(([entityName, { type, values }]) => {
        let metadata: EntityMetadata
        try {
          metadata = em.connection.getMetadata(entityName)
        } catch {
          // If no metadata avilable - skip transformation
          this.logger.warn(`Metadata not available for entity ${entityName}!`)
          return [entityName, { type, values }]
        }
        const jsonbColumns = metadata.columns.filter((c) => c.type === 'jsonb')

        values = (values as any[]).map((value) => {
          jsonbColumns.forEach((column) => {
            const propertyName = column.propertyName
            const transformer = column.transformer as ValueTransformer | undefined
            if (value[propertyName] && transformer) {
              const rawValue = value[propertyName]
              try {
                const transformedValue = transformer.from(rawValue)
                value[propertyName] = transformedValue
              } catch (e) {
                this.logger.warn(`Couldn't transform ${entityName}.${propertyName} value!`)
              }
            }
          })
          return value
        })

        return [entityName, { type, values }]
      })
    )
  }

  public prepareExportData(exportState: ExportedState, em: EntityManager): ExportedData {
    let { data } = exportState

    data = this.transformJsonbProperties(data, em)

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

  public async import(
    overlay: EntityManagerOverlay,
    exportFilePath = DEFAULT_EXPORT_PATH
  ): Promise<void> {
    const em = overlay.getEm()

    if (!fs.existsSync(exportFilePath)) {
      throw new Error(
        `Cannot perform offchain data import! Export file ${exportFilePath} does not exist!`
      )
    }
    const exportFile = await this.readExportJsonFile(exportFilePath)
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
              (c) => c.databaseNameWithoutPrefixes === snakeCase(fieldName)
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
              .map((f) => `"${snakeCase(f)}" = "data"."${f}"`)
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
            fieldNames.map((fieldName) => batch.map((v) => v[fieldName as keyof typeof v]))
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

  public async getExportBlockNumber(exportFilePath = DEFAULT_EXPORT_PATH): Promise<number> {
    if (!fs.existsSync(exportFilePath)) {
      this.logger.warn(`Export file ${exportFilePath} does not exist`)
      this._isImported = true
      return -1
    }
    const { blockNumber }: ExportedState = await this.readExportJsonFile()
    this.logger.info(`Last export block number established: ${blockNumber}`)
    return blockNumber
  }

  public async readExportJsonFile(filePath = DEFAULT_EXPORT_PATH): Promise<ExportedState> {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath)
      const parseStream = createParseStream()

      let exportedState: ExportedState

      parseStream.on('data', (data: ExportedState) => (exportedState = data))

      parseStream.on('end', () => resolve(exportedState))

      parseStream.on('error', (error: Error) => reject(error))

      readStream.pipe(parseStream as any)
    })
  }
}
