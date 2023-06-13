/**
 * An overlay layer which allows persisting entities in a memory cache,
 * retrieving them (based on id or relations) and performing updates
 * on them, before "flushing" the final state into the database.
 */
import { Store } from '@subsquid/typeorm-store'
import { EntityManager, FindOptionsWhere, In, Not, Repository } from 'typeorm'
import _, { isObject } from 'lodash'
import { NextEntityId } from '../model/NextEntityId'
import { criticalError } from './misc'
import { Logger } from '../logger'

// A stub which can represent any entity type
export type AnyEntity = { id: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<E> = { new (...args: any[]): E; name: string }

// State of an entity which is persisted in the cache (memory) layer
enum CachedEntityState {
  UpToDate, // the entity is up to date with the stored (database) state
  ToBeSaved, // the entity has been updated in the cache and is scheduled for saving
  ToBeRemoved, // the entity is scheduled for removal
}

// Represents a single cached entity
type Cached<E> = {
  entity?: E
  state: CachedEntityState
}

// Represents a "flat" entity of given type.
// "Flat" means the entity is stripped of any references to other entities.
// Only the ids of releated entities are preserved,
// provided that the entity is the owning-side of given relation.
export type Flat<E> = Omit<
  E,
  {
    [K in keyof E]: E[K] extends AnyEntity | null | undefined
      ? K
      : E[K] extends AnyEntity[]
      ? K
      : never
  }[keyof E]
>

// Union of entity keys that store the ids of related entities
// (provided the entity is the owning-side of given relation)
type OwnedRelations<E> = {
  [K in keyof E & string]: `${K}Id` extends keyof E ? `${K}Id` : never
}[keyof E & string]

export type FlatRelationless<E> = Omit<Flat<E>, OwnedRelations<E>>

// The entity repository overlay
export class RepositoryOverlay<E extends AnyEntity = AnyEntity> {
  // All currently cached entities of given type
  private cached: Map<string, Cached<E>> = new Map()
  // Name of the entity class
  public readonly entityName: string

  public constructor(
    public readonly EntityClass: Constructor<E>,
    private repository: Repository<E>,
    private nextId: number
  ) {
    this.entityName = this.repository.metadata.name
  }

  public cacheSize() {
    return this.cached.size
  }

  // Converts id as number to id as string (radix 36, with leading zeros)
  private asIdString(idNum: number) {
    const idStr = idNum.toString(36)
    // Add leading zeros to simplify sorting
    return _.repeat('0', 8 - idStr.length) + idStr
  }

  // Get id of the new entity of given type and increment `this.nextId`
  getNewEntityId(): string {
    return this.asIdString(this.nextId++)
  }

  // Get current value of `this.nextId` number
  getNextIdNumber(): number {
    return this.nextId
  }

  // Prevents inserting strings that contain null character into the postgresql table
  // (as this would cause an error)
  private normalizeString(s: string) {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\u0000/g, '')
  }

  // Makes use of `normalizeString` to prevent inserting null character into the postgresql table
  private normalizeInput(e: Record<string, unknown>) {
    for (const [k, v] of Object.entries(e)) {
      if (isObject(v) && `isTypeOf` in v) {
        this.normalizeInput(v as Record<string, unknown>)
      }
      if (typeof v === 'string') {
        e[k] = this.normalizeString(v)
      }
    }
  }

  // Returns a proxy to given cached entity.
  // The proxy allows updating the entity state from `CachedEntityState.UpToDate`
  // to `CachedEntityState.ToBeSaved` in case any of the entity properties have
  // been updated (`set`)
  private asCachedProxy(e: E): E {
    return new Proxy(e, {
      set: (obj, prop, value, receiver) => {
        const cached = this.cached.get(e.id)
        if (cached?.state === CachedEntityState.UpToDate) {
          cached.state = CachedEntityState.ToBeSaved
        }
        return Reflect.set(obj, prop, value, receiver)
      },
    })
  }

  // Schedules provided entities for later removal.
  remove(...items: (E | Flat<E> | string)[]): this {
    items.forEach((entityOrId) => {
      const entityId = typeof entityOrId === 'string' ? entityOrId : (entityOrId as E).id
      Logger.get().debug(`Scheduling ${this.entityName}:${entityId} for removal`)
      this.cached.set(entityId, { state: CachedEntityState.ToBeRemoved })
    })
    return this
  }

  // Checks if an entity matches a simple where condition
  // (ie. the speficied non-relational fields have exactly matching values)
  matches(
    entity: FlatRelationless<E>,
    where: { [K in keyof FlatRelationless<E>]?: E[K] }
  ): boolean {
    return Object.entries(where).every(
      ([key, value]) => entity[key as keyof FlatRelationless<E>] === value
    )
  }

  // Retrieves a (flat) entity by any non-relational field(s)
  async getOneBy(where: { [K in keyof FlatRelationless<E>]?: E[K] }): Promise<Flat<E> | undefined> {
    const allCached = Array.from(this.cached.values())
    const cachedFound = allCached.find(
      (e) => e.state !== CachedEntityState.ToBeRemoved && e.entity && this.matches(e.entity, where)
    )
    if (cachedFound) {
      return cachedFound.entity
    }

    const stored = await this.repository.findBy(where as FindOptionsWhere<E>)
    for (const storedEntity of stored) {
      // See if we have a cached version of this entity. If yes - prioritize the cached one!
      const cached = this.cached.get(storedEntity.id)
      if (cached?.state === CachedEntityState.ToBeRemoved) {
        continue
      }
      if (cached?.entity && this.matches(cached.entity, where)) {
        return cached.entity
      }
      if (!cached && this.matches(storedEntity, where)) {
        return this.cache(storedEntity)
      }
    }

    return undefined
  }

  // Retrieves a (flat) entity by id.
  // Cached version of the entity has a priority.
  // If not found in cache - the entity is retrieved from the database and then cached (if existing).
  async getById(id: string): Promise<Flat<E> | undefined> {
    const cached = this.cached.get(id)

    if (cached?.state === CachedEntityState.ToBeRemoved) {
      return undefined
    }

    if (cached?.entity) {
      return cached.entity
    }

    const stored = await this.repository.findOneBy({ id } as FindOptionsWhere<E>)

    if (stored) {
      // Update cache if entity found
      return this.cache(stored)
    }

    return undefined
  }

  // Get all entities of given type that satisfy given relation condition (e[relation] = id).
  // This is achieved by inspecting both cached and stored state.
  // The entity must be the owning-side of the relation.
  async getManyByRelation(relation: OwnedRelations<E>, id: string): Promise<Flat<E>[]> {
    const cachedIds = Array.from(this.cached.keys())
    // Get all managed child entities (excluding those scheduled for removal) where child.parent_id = parent.id
    const cachedChildren = Array.from(this.cached.values())
      .filter(
        (e) => e.state !== CachedEntityState.ToBeRemoved && e.entity && e.entity[relation] === id
      )
      .flatMap((e) => (e.entity ? [e.entity] : []))
    // Get all stored child entities where child.parent_id = parent.id and child.id is NOT IN(cachedIds)
    const storedChildren = await this.repository.findBy({
      id: Not(In(cachedIds)),
      [relation]: id,
    } as FindOptionsWhere<E>)
    // Cache loaded entities
    const storedChildrenCached = storedChildren.map((c) => this.cache(c))
    // Return concatinated result
    return cachedChildren.concat(storedChildrenCached)
  }

  // Get a single entity of given type that satisfied given relation condition.
  // Throws in case there is more than 1 entity that satisfies the condition.
  async getOneByRelation(relation: OwnedRelations<E>, id: string): Promise<Flat<E> | undefined> {
    const related = await this.getManyByRelation(relation, id)
    if (related.length > 1) {
      criticalError(
        `Expected one entity related through ${this.entityName}.${relation}=${id}. ` +
          `Got ${related.length}.`
      )
    }
    return related[0]
  }

  // Same as getById, but fails if no entity found.
  async getByIdOrFail(id: string): Promise<Flat<E>> {
    const result = await this.getById(id)
    if (!result) {
      criticalError(`${this.entityName} entity not found by id ${id}`)
    }
    return result
  }

  // Same as getOneByRelation, but fails if no entity found.
  async getOneByRelationOrFail(relation: OwnedRelations<E>, id: string): Promise<Flat<E>> {
    const result = await this.getOneByRelation(relation, id)
    if (!result) {
      criticalError(
        `Expected to find entity by ${this.entityName}.${relation}=${id}. ` + `None found.`
      )
    }
    return result
  }

  // Creates a new entity of given type and schedules it for insertion.
  new(entityFields: Partial<Flat<E>>): Flat<E> {
    const entity = new this.EntityClass(entityFields)
    // normalize the input (remove UTF-8 null characters)
    this.normalizeInput(entity)
    Logger.get().debug(`Creating new ${this.entityName}: ${entity.id}`)
    // Entities with the same id will override existing ones (!)
    this.cached.set(entity.id, { entity, state: CachedEntityState.ToBeSaved })
    return entity
  }

  // Caches given entity without scheduling it for update.
  // Returns a proxy which updated entity state to "CachedEntityState.ToBeSaved"
  // in case any of the entity properties are modified (`set`)
  private cache(entity: E): E {
    const proxy = this.asCachedProxy(entity)
    this.cached.set(entity.id, {
      entity: proxy,
      state: CachedEntityState.UpToDate,
    })
    return proxy
  }

  // Returns all entities scheduled for saving
  private getAllToBeSaved(): E[] {
    return [...this.cached.values()]
      .filter(({ state }) => state === CachedEntityState.ToBeSaved)
      .flatMap(({ entity }) => (entity ? [entity] : []))
  }

  // Returns all entities scheduled for removal
  private getAllIdsToBeRemoved(): string[] {
    return [...this.cached.entries()]
      .filter(([, { state }]) => state === CachedEntityState.ToBeRemoved)
      .map(([id]) => id)
  }

  // Execute all scheduled entity inserts/updates
  async executeScheduledUpdates(): Promise<void> {
    const logger = Logger.get()
    const toBeSaved = this.getAllToBeSaved()
    if (toBeSaved.length) {
      logger.info(`Saving ${toBeSaved.length} ${this.entityName} entities...`)
      logger.debug(
        `Ids of ${this.entityName} entities to save: ${toBeSaved.map((e) => e.id).join(', ')}`
      )
      await this.repository.save(toBeSaved)
    }
  }

  // Execute all scheduled entity removals
  async executeScheduledRemovals(): Promise<void> {
    const logger = Logger.get()
    const toBeRemoved = this.getAllIdsToBeRemoved().map((id) => new this.EntityClass({ id }))
    if (toBeRemoved.length) {
      logger.info(`Removing ${toBeRemoved.length} ${this.entityName} entities...`)
      logger.debug(
        `Ids of ${this.entityName} entities to remove: ${toBeRemoved.map((e) => e.id).join(', ')}`
      )
      await this.repository.remove(_.cloneDeep(toBeRemoved))
    }
  }

  cleanCache(): void {
    this.cached.clear()
  }
}

// The entity manager overlay
export class EntityManagerOverlay {
  // Map of already created entity repositories
  private repositories: Map<string, RepositoryOverlay> = new Map()

  constructor(
    private em: EntityManager,
    private nextEntityIds: NextEntityId[],
    private afterDbUpdte: (em: EntityManager) => Promise<void>
  ) {}

  public static async create(store: Store, afterDbUpdte: (em: EntityManager) => Promise<void>) {
    // FIXME: This is a little hacky, but we really need to access the underlying EntityManager
    const em = await (store as unknown as { em: () => Promise<EntityManager> }).em()
    // Add "processor" schema to search path in order to be able to access "hidden" entities
    await em.query('SET search_path TO processor,public')
    const nextEntityIds = await em.find(NextEntityId, {})
    return new EntityManagerOverlay(em, nextEntityIds, afterDbUpdte)
  }

  public totalCacheSize() {
    return Array.from(this.repositories.values()).reduce((a, b) => a + b.cacheSize(), 0)
  }

  public getEm() {
    return this.em
  }

  // Create an entity repository overlay or load already cached one
  public getRepository<E extends AnyEntity>(entityClass: Constructor<E>): RepositoryOverlay<E> {
    const loadedRepository = this.repositories.get(entityClass.name)
    if (loadedRepository) {
      // FIXME: Ideally `any` should be avoided, but it's tricky to achieve that here
      return loadedRepository as RepositoryOverlay<any>
    }
    const originalRepository = this.em.getRepository(entityClass)
    const nextEntityId = this.nextEntityIds.find((v) => v.entityName === entityClass.name)
    const repositoryOverlay = new RepositoryOverlay(
      entityClass,
      originalRepository,
      nextEntityId?.nextId || 1
    )
    this.repositories.set(entityClass.name, repositoryOverlay as RepositoryOverlay<any>)
    return repositoryOverlay
  }

  // Update database - "flush" the cached state
  async updateDatabase() {
    await Promise.all(
      Array.from(this.repositories.values()).map(async (r) => {
        await r.executeScheduledUpdates()
        await r.executeScheduledRemovals()
        r.cleanCache()
      })
    )
    const nextIds = Array.from(this.repositories.values()).map(
      (r) =>
        new NextEntityId({
          entityName: r.entityName,
          nextId: r.getNextIdNumber(),
        })
    )
    await this.em.save(nextIds)
    await this.afterDbUpdte(this.em)
  }
}
