import { EntityManager } from 'typeorm'
import { NextEntityId } from '../model'
import { AnyEntity, Constructor, EntityManagerOverlay } from './overlay'

// used to retrieve the next id for an entity from NextEntityId table using either EntityManager or Overlay
export async function getNextIdForEntity(
  store: EntityManager | EntityManagerOverlay,
  entityName: string
): Promise<number> {
  // Get next entity id from overlay (this will mostly be used in the mappings context)
  if (store instanceof EntityManagerOverlay) {
    const row = await store
      .getRepository(NextEntityId as Constructor<NextEntityId & AnyEntity>)
      .getOneBy({ entityName: entityName })

    const id = parseInt(row?.nextId.toString() || '1')

    // Update the id to be the next one in the overlay
    if (row) {
      row.nextId++
    } else {
      store
        .getRepository(NextEntityId as Constructor<NextEntityId & AnyEntity>)
        .new({ entityName, nextId: id + 1 })
    }

    return id
  }

  // Get next entity id from EntityManager (this will mostly be used in the graphql-server/auth-api context)
  let row: NextEntityId | null
  if (process.env.TESTING === 'true' || process.env.TESTING === '1') {
    row = await store.getRepository(NextEntityId).findOne({
      where: { entityName },
    })
  } else {
    row = await store.getRepository(NextEntityId).findOne({
      where: { entityName },
      lock: { mode: 'pessimistic_write' },
    })
  }
  const id = parseInt(row?.nextId.toString() || '1')
  return id
}
