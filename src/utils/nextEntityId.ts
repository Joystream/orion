import { EntityManager } from 'typeorm'
import { NextEntityId } from '../model'

// used to retrieve the next id for an entity
export async function getNextIdForEntity(em: EntityManager, entityName: string): Promise<number> {
  let row: NextEntityId | null
  if (process.env.TESTING === 'true' || process.env.TESTING === '1') {
    row = await em.getRepository(NextEntityId).findOne({
      where: { entityName },
    })
  } else {
    row = await em.getRepository(NextEntityId).findOne({
      where: { entityName },
      lock: { mode: 'pessimistic_write' },
    })
  }
  const id = parseInt(row?.nextId.toString() || '1')
  return id
}
