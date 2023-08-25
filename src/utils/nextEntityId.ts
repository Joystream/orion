import { EntityManager } from 'typeorm'
import { NextEntityId } from '../model'

// used to retrieve the next id for an entity
export async function getNextIdForEntity(em: EntityManager, entityName: string): Promise<number> {
  const id = parseInt(
    (
      await em.getRepository(NextEntityId).findOne({
        where: { entityName },
        lock: { mode: 'pessimistic_write' },
      })
    )?.nextId.toString() || '1'
  )
  return id
}
