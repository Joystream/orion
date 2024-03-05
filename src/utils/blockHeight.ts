import { isObject } from 'lodash'
import { EntityManager } from 'typeorm'
import { has } from './misc'

export async function getCurrentBlockHeight(
  em: EntityManager
): Promise<{ lastProcessedBlock: number }> {
  const dbResult: unknown = await em.query('SELECT "height" FROM "squid_processor"."status";')
  return {
    lastProcessedBlock:
      Array.isArray(dbResult) &&
      isObject(dbResult[0]) &&
      has(dbResult[0], 'height') &&
      typeof dbResult[0].height === 'number'
        ? dbResult[0].height
        : -1,
  }
}
