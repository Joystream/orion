import { createLogger } from '@subsquid/logger'
import { NextEntityId } from '../model'
import { EntityManagerOverlay } from './overlay'

export class NextEntityIdManager {
  private _migrationDone = false
  private logger = createLogger('NextEntityIdManager')
  private entities = ['Account']

  public async migrateCounters(overlay: EntityManagerOverlay): Promise<void> {
    if (this._migrationDone) {
      return
    }
    // TODO (^3.2.0): use better migration logic for migrating Ids OFFCHAIN_NOTIFICATION_ID_TAG + nextId & RUNTIME_NOTIFICATION_ID_TAG + nextId
    const em = overlay.getEm()
    for (const entityName of this.entities) {
      // build query that gets the entityName with the highest id
      overlay.invalidateRepository(entityName)
      const rowNumber = await em.query(`SELECT COUNT(*) FROM ${entityName}`)
      const latestId = parseInt(rowNumber[0].count)
      this.logger.info(`🔄 Migrating next entity if for: ${entityName}`)
      await em.save(new NextEntityId({ entityName, nextId: latestId + 1 }))
      this._migrationDone = true
    }
  }
}
