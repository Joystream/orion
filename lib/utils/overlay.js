"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManagerOverlay = exports.RepositoryOverlay = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const lodash_1 = __importStar(require("lodash"));
const typeorm_1 = require("typeorm");
const logger_1 = require("../logger");
const NextEntityId_1 = require("../model/NextEntityId");
const misc_1 = require("./misc");
// State of an entity which is persisted in the cache (memory) layer
var CachedEntityState;
(function (CachedEntityState) {
    CachedEntityState[CachedEntityState["UpToDate"] = 0] = "UpToDate";
    CachedEntityState[CachedEntityState["ToBeSaved"] = 1] = "ToBeSaved";
    CachedEntityState[CachedEntityState["ToBeRemoved"] = 2] = "ToBeRemoved";
})(CachedEntityState || (CachedEntityState = {}));
// The entity repository overlay
class RepositoryOverlay {
    constructor(EntityClass, repository, nextId) {
        this.EntityClass = EntityClass;
        this.repository = repository;
        this.nextId = nextId;
        // All currently cached entities of given type
        this.cached = new Map();
        // Locking construct to prevent multiple asynchronous reads of same
        // "uncached" entity from overlay, which could lead to one operation
        // rewriting the cached state of other operation (i.e. lost updates)
        this.asyncLock = new async_lock_1.default({ maxPending: Number.MAX_SAFE_INTEGER });
        this.entityName = this.repository.metadata.name;
    }
    cacheSize() {
        return this.cached.size;
    }
    // Get id of the new entity of given type and increment `this.nextId`
    getNewEntityId() {
        return (0, misc_1.idStringFromNumber)(this.nextId++);
    }
    // Get current value of `this.nextId` number
    getNextIdNumber() {
        return this.nextId;
    }
    // Prevents inserting strings that contain null character into the postgresql table
    // (as this would cause an error)
    normalizeString(s) {
        // eslint-disable-next-line no-control-regex
        return s.replace(/\u0000/g, '');
    }
    // Makes use of `normalizeString` to prevent inserting null character into the postgresql table
    normalizeInput(e) {
        for (const [k, v] of Object.entries(e)) {
            if ((0, lodash_1.isObject)(v) && `isTypeOf` in v) {
                this.normalizeInput(v);
            }
            if (typeof v === 'string') {
                e[k] = this.normalizeString(v);
            }
        }
    }
    // Returns a proxy to given cached entity.
    // The proxy allows updating the entity state from `CachedEntityState.UpToDate`
    // to `CachedEntityState.ToBeSaved` in case any of the entity properties have
    // been updated (`set`)
    asCachedProxy(e) {
        return new Proxy(e, {
            set: (obj, prop, value, receiver) => {
                const cached = this.cached.get(e.id);
                if (cached?.state === CachedEntityState.UpToDate) {
                    cached.state = CachedEntityState.ToBeSaved;
                }
                return Reflect.set(obj, prop, value, receiver);
            },
        });
    }
    // Schedules provided entities for later removal.
    remove(...items) {
        items.forEach((entityOrId) => {
            const entityId = typeof entityOrId === 'string' ? entityOrId : entityOrId.id;
            logger_1.Logger.get().debug(`Scheduling ${this.entityName}:${entityId} for removal`);
            this.cached.set(entityId, { state: CachedEntityState.ToBeRemoved });
        });
        return this;
    }
    // Checks if an entity matches a simple where condition
    // (ie. the speficied non-relational fields have exactly matching values)
    matches(entity, where) {
        return Object.entries(where).every(([key, value]) => entity[key] === value);
    }
    // Retrieves a (flat) entity by any non-relational field(s)
    async getOneBy(where) {
        // Lock complete table
        return this.asyncLock.acquire(`${this.entityName}`, async () => {
            const allCached = Array.from(this.cached.values());
            const cachedFound = allCached.find((e) => e.state !== CachedEntityState.ToBeRemoved && e.entity && this.matches(e.entity, where));
            if (cachedFound) {
                return cachedFound.entity;
            }
            const stored = await this.repository.findBy(where);
            for (const storedEntity of stored) {
                // See if we have a cached version of this entity. If yes - prioritize the cached one!
                const cached = this.cached.get(storedEntity.id);
                if (cached?.state === CachedEntityState.ToBeRemoved) {
                    continue;
                }
                if (cached?.entity && this.matches(cached.entity, where)) {
                    return cached.entity;
                }
                if (!cached && this.matches(storedEntity, where)) {
                    return this.cache(storedEntity);
                }
            }
            return undefined;
        });
    }
    // Retrieves a (flat) entity by id.
    // Cached version of the entity has a priority.
    // If not found in cache - the entity is retrieved from the database and then cached (if existing).
    async getById(id) {
        // Lock single entity by given ID
        return this.asyncLock.acquire(`${this.entityName}-${id}`, async () => {
            const cached = this.cached.get(id);
            if (cached?.state === CachedEntityState.ToBeRemoved) {
                return undefined;
            }
            if (cached?.entity) {
                return cached.entity;
            }
            const stored = await this.repository.findOneBy({ id });
            if (stored) {
                // Update cache if entity found
                return this.cache(stored);
            }
            return undefined;
        });
    }
    // Get all entities of given type that satisfy given relation condition (e[relation] = id).
    // This is achieved by inspecting both cached and stored state.
    // The entity must be the owning-side of the relation.
    async getManyByRelation(relation, id) {
        // Lock complete table
        return this.asyncLock.acquire(`${this.entityName}`, async () => {
            const cachedIds = Array.from(this.cached.keys());
            // Get all managed child entities (excluding those scheduled for removal) where child.parent_id = parent.id
            const cachedChildren = Array.from(this.cached.values())
                .filter((e) => e.state !== CachedEntityState.ToBeRemoved && e.entity && e.entity[relation] === id)
                .flatMap((e) => (e.entity ? [e.entity] : []));
            // Get all stored child entities where child.parent_id = parent.id and child.id is NOT IN(cachedIds)
            const storedChildren = await this.repository.findBy({
                id: (0, typeorm_1.Not)((0, typeorm_1.In)(cachedIds)),
                [relation]: id,
            });
            // Cache loaded entities
            const storedChildrenCached = storedChildren.map((c) => this.cache(c));
            // Return concatinated result
            return cachedChildren.concat(storedChildrenCached);
        });
    }
    // Get a single entity of given type that satisfied given relation condition.
    // Throws in case there is more than 1 entity that satisfies the condition.
    async getOneByRelation(relation, id) {
        const related = await this.getManyByRelation(relation, id);
        if (related.length > 1) {
            (0, misc_1.criticalError)(`Expected one entity related through ${this.entityName}.${relation}=${id}. ` +
                `Got ${related.length}.`);
        }
        return related[0];
    }
    // Same as getById, but fails if no entity found.
    async getByIdOrFail(id) {
        const result = await this.getById(id);
        if (!result) {
            (0, misc_1.criticalError)(`${this.entityName} entity not found by id ${id}`);
        }
        return result;
    }
    // Same as getOneByRelation, but fails if no entity found.
    async getOneByRelationOrFail(relation, id) {
        const result = await this.getOneByRelation(relation, id);
        if (!result) {
            (0, misc_1.criticalError)(`Expected to find entity by ${this.entityName}.${relation}=${id}. ` + `None found.`);
        }
        return result;
    }
    // Creates a new entity of given type and schedules it for insertion.
    new(entityFields) {
        const entity = new this.EntityClass(entityFields);
        // normalize the input (remove UTF-8 null characters)
        this.normalizeInput(entity);
        logger_1.Logger.get().debug(`Creating new ${this.entityName}: ${entity.id}`);
        // Entities with the same id will override existing ones (!)
        this.cached.set(entity.id, { entity, state: CachedEntityState.ToBeSaved });
        return entity;
    }
    // Caches given entity without scheduling it for update.
    // Returns a proxy which updated entity state to "CachedEntityState.ToBeSaved"
    // in case any of the entity properties are modified (`set`)
    cache(entity) {
        const proxy = this.asCachedProxy(entity);
        this.cached.set(entity.id, {
            entity: proxy,
            state: CachedEntityState.UpToDate,
        });
        return proxy;
    }
    // Returns all entities scheduled for saving
    getAllToBeSaved() {
        return [...this.cached.values()]
            .filter(({ state }) => state === CachedEntityState.ToBeSaved)
            .flatMap(({ entity }) => (entity ? [entity] : []));
    }
    // Returns all entities scheduled for removal
    getAllIdsToBeRemoved() {
        return [...this.cached.entries()]
            .filter(([, { state }]) => state === CachedEntityState.ToBeRemoved)
            .map(([id]) => id);
    }
    // Execute all scheduled entity inserts/updates
    async executeScheduledUpdates() {
        const logger = logger_1.Logger.get();
        const toBeSaved = this.getAllToBeSaved();
        if (toBeSaved.length) {
            logger.info(`Saving ${toBeSaved.length} ${this.entityName} entities...`);
            logger.debug(`Ids of ${this.entityName} entities to save: ${toBeSaved.map((e) => e.id).join(', ')}`);
            await this.repository.save(toBeSaved);
        }
    }
    // Execute all scheduled entity removals
    async executeScheduledRemovals() {
        const logger = logger_1.Logger.get();
        const toBeRemoved = this.getAllIdsToBeRemoved().map((id) => new this.EntityClass({ id }));
        if (toBeRemoved.length) {
            logger.info(`Removing ${toBeRemoved.length} ${this.entityName} entities...`);
            logger.debug(`Ids of ${this.entityName} entities to remove: ${toBeRemoved.map((e) => e.id).join(', ')}`);
            await this.repository.remove(lodash_1.default.cloneDeep(toBeRemoved));
        }
    }
    cleanCache() {
        this.cached.clear();
    }
}
exports.RepositoryOverlay = RepositoryOverlay;
// The entity manager overlay
class EntityManagerOverlay {
    constructor(em, nextEntityIds, afterDbUpdte) {
        this.em = em;
        this.nextEntityIds = nextEntityIds;
        this.afterDbUpdte = afterDbUpdte;
        // Map of already created entity repositories
        this.repositories = new Map();
    }
    static async create(store, afterDbUpdte) {
        // FIXME: This is a little hacky, but we really need to access the underlying EntityManager
        const em = await store.em();
        // Add "admin" schema to search path in order to be able to access "hidden" entities
        await em.query('SET search_path TO admin,public');
        const nextEntityIds = await em.find(NextEntityId_1.NextEntityId, {});
        return new EntityManagerOverlay(em, nextEntityIds, afterDbUpdte);
    }
    totalCacheSize() {
        return Array.from(this.repositories.values()).reduce((a, b) => a + b.cacheSize(), 0);
    }
    getEm() {
        return this.em;
    }
    // Create an entity repository overlay or load already cached one
    getRepository(entityClass) {
        const loadedRepository = this.repositories.get(entityClass.name);
        if (loadedRepository) {
            // FIXME: Ideally `any` should be avoided, but it's tricky to achieve that here
            return loadedRepository;
        }
        const originalRepository = this.em.getRepository(entityClass);
        const nextEntityId = this.nextEntityIds.find((v) => v.entityName === entityClass.name);
        const repositoryOverlay = new RepositoryOverlay(entityClass, originalRepository, nextEntityId?.nextId || 1);
        this.repositories.set(entityClass.name, repositoryOverlay);
        return repositoryOverlay;
    }
    // Update database - "flush" the cached state
    async updateDatabase() {
        await Promise.all(Array.from(this.repositories.values()).map(async (r) => {
            await r.executeScheduledUpdates();
            await r.executeScheduledRemovals();
            r.cleanCache();
        }));
        const nextIds = Array.from(this.repositories.values()).map((r) => new NextEntityId_1.NextEntityId({
            entityName: r.entityName,
            nextId: r.getNextIdNumber(),
        }));
        await this.em.save(nextIds);
        await this.afterDbUpdte(this.em);
    }
}
exports.EntityManagerOverlay = EntityManagerOverlay;
//# sourceMappingURL=overlay.js.map