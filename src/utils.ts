import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import * as models from './model'
import {
  ContentVideoCreatedEvent,
  ContentVideoUpdatedEvent,
  ContentVideoDeletedEvent,
  ContentVideoDeletedByModeratorEvent,
  ContentVideoVisibilitySetByModeratorEvent,
  ContentChannelCreatedEvent,
  ContentChannelUpdatedEvent,
  ContentChannelDeletedEvent,
  ContentChannelDeletedByModeratorEvent,
  ContentChannelVisibilitySetByModeratorEvent,
  ContentChannelOwnerRemarkedEvent,
  ContentChannelAgentRemarkedEvent,
  ContentOpenAuctionStartedEvent,
  ContentEnglishAuctionStartedEvent,
  ContentNftIssuedEvent,
  ContentAuctionBidMadeEvent,
  ContentAuctionBidCanceledEvent,
  ContentAuctionCanceledEvent,
  ContentEnglishAuctionSettledEvent,
  ContentBidMadeCompletingAuctionEvent,
  ContentOpenAuctionBidAcceptedEvent,
  ContentOfferStartedEvent,
  ContentOfferAcceptedEvent,
  ContentOfferCanceledEvent,
  ContentNftSellOrderMadeEvent,
  ContentNftBoughtEvent,
  ContentBuyNowCanceledEvent,
  ContentBuyNowPriceUpdatedEvent,
  ContentNftSlingedBackToTheOriginalArtistEvent,
  StorageStorageBucketCreatedEvent,
  StorageDynamicBagCreatedEvent,
  StorageDataObjectsUploadedEvent,
  MembersMemberCreatedEvent,
  MembersMembershipBoughtEvent,
  MembersMembershipGiftedEvent,
  MembersMemberInvitedEvent,
  MembersMemberAccountsUpdatedEvent,
  MembersMemberProfileUpdatedEvent,
  MembersMemberRemarkedEvent,
  StorageStorageBucketInvitationAcceptedEvent,
  StorageStorageBucketsUpdatedForBagEvent,
  StorageStorageOperatorMetadataSetEvent,
  StorageStorageBucketVoucherLimitsSetEvent,
  StoragePendingDataObjectsAcceptedEvent,
  StorageStorageBucketOperatorInvitedEvent,
  StorageStorageBucketOperatorRemovedEvent,
  StorageStorageBucketStatusUpdatedEvent,
  StorageStorageBucketDeletedEvent,
  StorageVoucherChangedEvent,
  StorageDynamicBagDeletedEvent,
  StorageDataObjectsUpdatedEvent,
  StorageDataObjectsMovedEvent,
  StorageDataObjectsDeletedEvent,
  StorageDistributionBucketCreatedEvent,
  StorageDistributionBucketStatusUpdatedEvent,
  StorageDistributionBucketDeletedEvent,
  StorageDistributionBucketsUpdatedForBagEvent,
  StorageDistributionBucketModeUpdatedEvent,
  StorageDistributionBucketOperatorInvitedEvent,
  StorageDistributionBucketInvitationCancelledEvent,
  StorageDistributionBucketInvitationAcceptedEvent,
  StorageDistributionBucketMetadataSetEvent,
  StorageDistributionBucketOperatorRemovedEvent,
  StorageDistributionBucketFamilyCreatedEvent,
  StorageDistributionBucketFamilyMetadataSetEvent,
  StorageDistributionBucketFamilyDeletedEvent,
  StorageStorageBucketInvitationCancelledEvent,
} from './types/events'
import { EntityManager, FindOptionsRelations, FindOptionsWhere, In, Not } from 'typeorm'
import _ from 'lodash'
import { Logger } from './logger'
import { NextEntityId } from './model/NextEntityId'
import { Auction } from './model'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'

export function assertAssignable<T>(type: T) {
  return type
}

export const eventConstructors = {
  'Content.VideoCreated': ContentVideoCreatedEvent,
  'Content.VideoUpdated': ContentVideoUpdatedEvent,
  'Content.VideoDeleted': ContentVideoDeletedEvent,
  'Content.VideoDeletedByModerator': ContentVideoDeletedByModeratorEvent,
  'Content.VideoVisibilitySetByModerator': ContentVideoVisibilitySetByModeratorEvent,
  'Content.ChannelCreated': ContentChannelCreatedEvent,
  'Content.ChannelUpdated': ContentChannelUpdatedEvent,
  'Content.ChannelDeleted': ContentChannelDeletedEvent,
  'Content.ChannelDeletedByModerator': ContentChannelDeletedByModeratorEvent,
  'Content.ChannelVisibilitySetByModerator': ContentChannelVisibilitySetByModeratorEvent,
  'Content.ChannelOwnerRemarked': ContentChannelOwnerRemarkedEvent,
  'Content.ChannelAgentRemarked': ContentChannelAgentRemarkedEvent,
  'Content.OpenAuctionStarted': ContentOpenAuctionStartedEvent,
  'Content.EnglishAuctionStarted': ContentEnglishAuctionStartedEvent,
  'Content.NftIssued': ContentNftIssuedEvent,
  'Content.AuctionBidMade': ContentAuctionBidMadeEvent,
  'Content.AuctionBidCanceled': ContentAuctionBidCanceledEvent,
  'Content.AuctionCanceled': ContentAuctionCanceledEvent,
  'Content.EnglishAuctionSettled': ContentEnglishAuctionSettledEvent,
  'Content.BidMadeCompletingAuction': ContentBidMadeCompletingAuctionEvent,
  'Content.OpenAuctionBidAccepted': ContentOpenAuctionBidAcceptedEvent,
  'Content.OfferStarted': ContentOfferStartedEvent,
  'Content.OfferAccepted': ContentOfferAcceptedEvent,
  'Content.OfferCanceled': ContentOfferCanceledEvent,
  'Content.NftSellOrderMade': ContentNftSellOrderMadeEvent,
  'Content.NftBought': ContentNftBoughtEvent,
  'Content.BuyNowCanceled': ContentBuyNowCanceledEvent,
  'Content.BuyNowPriceUpdated': ContentBuyNowPriceUpdatedEvent,
  'Content.NftSlingedBackToTheOriginalArtist': ContentNftSlingedBackToTheOriginalArtistEvent,
  'Storage.StorageBucketCreated': StorageStorageBucketCreatedEvent,
  'Storage.StorageBucketInvitationAccepted': StorageStorageBucketInvitationAcceptedEvent,
  'Storage.StorageBucketsUpdatedForBag': StorageStorageBucketsUpdatedForBagEvent,
  'Storage.StorageOperatorMetadataSet': StorageStorageOperatorMetadataSetEvent,
  'Storage.StorageBucketVoucherLimitsSet': StorageStorageBucketVoucherLimitsSetEvent,
  'Storage.PendingDataObjectsAccepted': StoragePendingDataObjectsAcceptedEvent,
  'Storage.StorageBucketInvitationCancelled': StorageStorageBucketInvitationCancelledEvent,
  'Storage.StorageBucketOperatorInvited': StorageStorageBucketOperatorInvitedEvent,
  'Storage.StorageBucketOperatorRemoved': StorageStorageBucketOperatorRemovedEvent,
  'Storage.StorageBucketStatusUpdated': StorageStorageBucketStatusUpdatedEvent,
  'Storage.StorageBucketDeleted': StorageStorageBucketDeletedEvent,
  'Storage.VoucherChanged': StorageVoucherChangedEvent,
  'Storage.DynamicBagCreated': StorageDynamicBagCreatedEvent,
  'Storage.DynamicBagDeleted': StorageDynamicBagDeletedEvent,
  'Storage.DataObjectsUploaded': StorageDataObjectsUploadedEvent,
  'Storage.DataObjectsUpdated': StorageDataObjectsUpdatedEvent,
  'Storage.DataObjectsMoved': StorageDataObjectsMovedEvent,
  'Storage.DataObjectsDeleted': StorageDataObjectsDeletedEvent,
  'Storage.DistributionBucketCreated': StorageDistributionBucketCreatedEvent,
  'Storage.DistributionBucketStatusUpdated': StorageDistributionBucketStatusUpdatedEvent,
  'Storage.DistributionBucketDeleted': StorageDistributionBucketDeletedEvent,
  'Storage.DistributionBucketsUpdatedForBag': StorageDistributionBucketsUpdatedForBagEvent,
  'Storage.DistributionBucketModeUpdated': StorageDistributionBucketModeUpdatedEvent,
  'Storage.DistributionBucketOperatorInvited': StorageDistributionBucketOperatorInvitedEvent,
  'Storage.DistributionBucketInvitationCancelled':
    StorageDistributionBucketInvitationCancelledEvent,
  'Storage.DistributionBucketInvitationAccepted': StorageDistributionBucketInvitationAcceptedEvent,
  'Storage.DistributionBucketMetadataSet': StorageDistributionBucketMetadataSetEvent,
  'Storage.DistributionBucketOperatorRemoved': StorageDistributionBucketOperatorRemovedEvent,
  'Storage.DistributionBucketFamilyCreated': StorageDistributionBucketFamilyCreatedEvent,
  'Storage.DistributionBucketFamilyMetadataSet': StorageDistributionBucketFamilyMetadataSetEvent,
  'Storage.DistributionBucketFamilyDeleted': StorageDistributionBucketFamilyDeletedEvent,
  'Members.MemberCreated': MembersMemberCreatedEvent,
  'Members.MembershipBought': MembersMembershipBoughtEvent,
  'Members.MembershipGifted': MembersMembershipGiftedEvent,
  'Members.MemberInvited': MembersMemberInvitedEvent,
  'Members.MemberAccountsUpdated': MembersMemberAccountsUpdatedEvent,
  'Members.MemberProfileUpdated': MembersMemberProfileUpdatedEvent,
  'Members.MemberRemarked': MembersMemberRemarkedEvent,
} as const

export type EventNames = keyof typeof eventConstructors

export type AnyEntity = { id: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<E> = new (...args: any[]) => E & { name: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IsEntityType<T> = T extends Constructor<any>
  ? InstanceType<T> extends AnyEntity
    ? true
    : false
  : false

export type ModelNames = {
  [K in keyof typeof models]: IsEntityType<typeof models[K]> extends true ? K : never
}[keyof typeof models]

export type SimpleWhereCondition<E> = {
  [K in keyof E]?: E[K] extends string | boolean | bigint | number | Date | null | undefined
    ? E[K]
    : E[K] extends { isTypeOf?: string } | null | undefined
    ? never
    : SimpleWhereCondition<E[K]>
}

const entityClasses = _.pickBy(models, (o) => {
  return (
    typeof o === 'function' &&
    o.name &&
    o.name[0] === o.name[0].toUpperCase() &&
    !o.toString().includes('toJSON')
  )
}) as { [K in ModelNames]: Constructor<AnyEntity> }

enum CachedEntityState {
  UpToDate,
  ToBeSaved,
  ToBeRemoved,
}

type Cached<E> = {
  entity?: E
  state: CachedEntityState
}

export class EntityCollection<E extends AnyEntity, EC extends Constructor<E> = Constructor<E>> {
  private _cached: Map<string, Cached<E>> = new Map()
  private _nextId = 1

  public constructor(
    private store: Store,
    private em: EntityManager,
    private getAllCollections: () => {
      [K in ModelNames]: EntityCollection<InstanceType<typeof models[K]>>
    },
    private updateDb: () => Promise<void>,
    private _class: EC
  ) {}

  private asIdString(idNum: number) {
    const idStr = idNum.toString(36)
    // Add leading zeros to simplify sorting
    return _.repeat('0', 8 - idStr.length) + idStr
  }

  getNextId(): string {
    return this.asIdString(this._nextId++)
  }

  remove(...items: E[]): this {
    items.forEach((entity) => {
      this._cached.set(entity.id, { state: CachedEntityState.ToBeRemoved })
    })
    return this
  }

  // Prevents inserting strings that contain null character into the postgresql table
  // (as this would cause an error)
  private normalizeString(s: string) {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\u0000/g, '')
  }

  private isObject(o: unknown): o is object {
    return typeof o === 'object' && !Array.isArray(o) && !!o
  }

  private normalizeInput(e: Record<string, unknown>) {
    for (const [k, v] of Object.entries(e)) {
      if (this.isObject(v) && `isTypeOf` in v) {
        this.normalizeInput(v as Record<string, unknown>)
      }
      if (typeof v === 'string') {
        e[k] = this.normalizeString(v)
      }
    }
  }

  private asCachedProxy(e: E): E {
    return new Proxy(e, {
      set: (obj, prop, value, receiver) => {
        // Only schedule for update if the value was not initially "undefined"
        // (ie. it's not just relation being loaded)
        if (obj[prop as keyof E] !== undefined) {
          const cached = this._cached.get(e.id)
          if (cached?.state === CachedEntityState.UpToDate) {
            cached.state = CachedEntityState.ToBeSaved
          }
        }
        return Reflect.set(obj, prop, value, receiver)
      },
    })
  }

  push(...items: E[]): this {
    items.forEach((entity) => {
      // normalize the input (remove UTF-8 null characters)
      this.normalizeInput(entity)
      // Entities with the same id will override existing ones
      this._cached.set(entity.id, { entity, state: CachedEntityState.ToBeSaved })
    })

    return this
  }

  private matchesWhere<T extends { id: string }>(o: T, where: SimpleWhereCondition<T>): boolean {
    const result = Object.entries(where).every(([key, value]) => {
      if (this.isObject(value)) {
        return this.matchesWhere(o, value)
      }
      return o[key as keyof T] === value
    })
    return result
  }

  private findOneCachedWhere(where: SimpleWhereCondition<E>): E | undefined {
    return [...this._cached.values()].find(
      ({ entity, state }) =>
        entity && state !== CachedEntityState.ToBeRemoved && this.matchesWhere(entity, where)
    )?.entity
  }

  private isRelationField(fieldName: string) {
    this.em.connection.getMetadata(this._class).relations.find((r) => r.propertyName === fieldName)
  }

  private hasId(ref: unknown): ref is { id: string } {
    return this.isObject(ref) && Object.keys(ref).includes('id')
  }

  private getRelationByProperty<T extends AnyEntity>(
    entityClass: Constructor<T>,
    property: keyof T & string
  ): RelationMetadata {
    const relation = this.em.connection
      .getMetadata(entityClass)
      .relations.find((r) => r.propertyName === property)
    if (!relation) {
      criticalError(`Relation ${property} not found in ${entityClass.name}`)
    }
    return relation
  }

  private async loadRelated<T extends AnyEntity>(
    entity: T,
    property: keyof T & string
  ): Promise<AnyEntity[] | AnyEntity | null> {
    let resolved: AnyEntity[] | AnyEntity | null
    const entityClass = entity.constructor as Constructor<T>
    const relation = this.getRelationByProperty(entityClass, property)
    const inverseClass = entityClasses[relation.inverseEntityMetadata.targetName as ModelNames]
    const inverseCollection = this.getAllCollections()[
      inverseClass.name as ModelNames
    ] as EntityCollection<AnyEntity>
    const inverseProp = relation.inverseRelation?.propertyName
    const refValue = entity[property] as unknown
    if (relation.isOneToOneOwner || relation.isManyToOne) {
      if (refValue === undefined) {
        const stored = await this.em.findOne(entityClass, {
          where: { id: entity.id } as FindOptionsWhere<T>,
          relations: { [property]: true } as FindOptionsRelations<T>,
        })
        const storedRelated = stored && (stored[property as keyof T] as AnyEntity | null)
        if (storedRelated) {
          const inverseCached = inverseCollection.addCached(storedRelated)
          resolved = inverseCached || null
        } else {
          resolved = null
        }
      } else if (refValue === null) {
        resolved = null
      } else if (this.hasId(refValue)) {
        resolved = (await inverseCollection.get(refValue.id)) || null
      } else {
        criticalError(`Unexpected value of ${entityClass.name}.${property}`, { entity })
      }
    } else if (relation.isOneToOneNotOwner) {
      // "Consult" the owning side
      if (!inverseProp) {
        criticalError(
          `Cannot find inverseRelation property of OneToOne relation ${entityClass.name}.${property}`,
          {
            relation,
          }
        )
      }
      const inverseToBeSaved = inverseCollection.getAllToBeSaved()
      const inverseCachedRelated = inverseToBeSaved.find(
        (e: any) => e[inverseProp]?.id === entity.id
      )
      if (inverseCachedRelated) {
        return inverseCachedRelated
      }
      const inverseStoredRelated = await this.em.findOne(inverseClass, {
        where: {
          [inverseProp]: { id: entity.id },
        } as FindOptionsWhere<T>,
      })
      if (inverseStoredRelated) {
        const inverseStoredCached: any = inverseCollection.addCached(inverseStoredRelated)
        if (
          inverseStoredCached &&
          (inverseStoredCached[inverseProp] === undefined ||
            inverseStoredCached[inverseProp]?.id === entity.id)
        ) {
          resolved = inverseStoredCached
        } else {
          resolved = null
        }
      } else {
        resolved = null
      }
    } else if (relation.isOneToMany) {
      if (!inverseProp) {
        criticalError(
          `Cannot find inverseRelation property of OneToMany relation ${entityClass.name}.${property}`,
          {
            relation,
          }
        )
      }
      const inverseToBeSaved = inverseCollection.getAllToBeSaved()
      const inverseToBeRemovedIds = (await inverseCollection.getAllToBeRemoved()).map((e) => e.id)
      const cachedAndRelatedIds = inverseToBeSaved
        .filter((e: any) => e[inverseProp] && e[inverseProp].id === entity.id)
        .map((e) => e.id)
      const cachedAndNotRelatedIds = inverseToBeSaved
        .filter((e: any) => e[inverseProp] !== undefined && e[inverseProp]?.id !== entity.id)
        .map((e) => e.id)
        .concat(inverseToBeRemovedIds)

      const loaded = await this.em.find(inverseClass, {
        where: {
          [inverseProp]: { id: entity.id },
          id: Not(In(cachedAndRelatedIds.concat(cachedAndNotRelatedIds))),
        },
      })
      loaded.forEach((e) => inverseCollection.addCached(e))
      resolved = (
        await Promise.all(
          cachedAndRelatedIds.concat(loaded.map((e) => e.id)).map((id) => inverseCollection.get(id))
        )
      ).flatMap((e) => (e ? [e] : []))
    } else {
      criticalError(`Unsupported relation type`, { relation })
    }

    entity[property] = resolved as T[keyof T & string]

    return resolved
  }

  async loadRelatedEntities<T extends AnyEntity>(entity: T, relations: FindOptionsRelations<T>) {
    for (const [k, v] of Object.entries(relations)) {
      const relationKey = k as keyof T & string
      const related = await this.loadRelated(entity, relationKey)
      if (this.isObject(v) && related) {
        if (Array.isArray(related)) {
          await Promise.all(related.map((rel) => this.loadRelatedEntities(rel, v)))
        } else {
          await this.loadRelatedEntities(related, v)
        }
      }
    }
  }

  async getWhere(
    where: SimpleWhereCondition<E>,
    relations?: FindOptionsRelations<E>
  ): Promise<E | undefined> {
    const cached = this.findOneCachedWhere(where)

    if (cached) {
      // We found a cached entity that matches the conditions
      // - load any potentially missing relations and return it
      if (relations) {
        await this.loadRelatedEntities(cached, relations)
      }

      return cached
    }

    if (relations || Object.keys(where).some((k) => this.isRelationField(k))) {
      // If no cached entity was found and the condition is complex and/or relations are included:
      // update the database state before retrying
      Logger.get().info(`Updating the database before retrying complex query...`)
      await this.updateDb()
    }

    const stored = await this.em.findOne(this._class, {
      where: where as FindOptionsWhere<E>,
      relations,
    })

    if (stored) {
      // Update cache if entity found
      const cached = this.addCached(stored)
      if (cached && relations) {
        await this.loadRelatedEntities(cached, relations)
      }
      return cached
    }

    return undefined
  }

  async getOrFailWhere(
    where: SimpleWhereCondition<E>,
    relations?: FindOptionsRelations<E>
  ): Promise<E> {
    const entity = await this.getWhere(where, relations)
    if (!entity) {
      criticalError(`Could not find required ${this._class.name} entity!`, { where })
    }
    return entity
  }

  async get(id: string, relations?: FindOptionsRelations<E>): Promise<E | undefined> {
    return this.getWhere({ id } as SimpleWhereCondition<E>, relations)
  }

  async getOrFail(id: string, relations?: FindOptionsRelations<E>) {
    return this.getOrFailWhere({ id } as SimpleWhereCondition<E>, relations)
  }

  private stripRelations(entity: E) {
    const metadata = this.em.connection.getMetadata(this._class)
    const relationFields = metadata.relations.map((r) => r.propertyName)
    relationFields.forEach((f) => delete entity[f as keyof E])
  }

  addCached(entity: E): E | undefined {
    const cached = this._cached.get(entity.id)
    if (cached && cached.state === CachedEntityState.ToBeRemoved) {
      return undefined
    } else if (cached) {
      return cached.entity
    }
    this.stripRelations(entity)
    const proxy = this.asCachedProxy(entity)
    this._cached.set(entity.id, {
      entity: proxy,
      state: CachedEntityState.UpToDate,
    })
    return proxy
  }

  // Execute scheduled save operations
  async save(): Promise<void> {
    const toBeSaved = this.getAllToBeSaved()

    if (toBeSaved.length) {
      const logger = Logger.get()
      logger.info(`Saving ${toBeSaved.length} ${this._class.name} entities...`)
      logger.debug(`Entity ids: ${toBeSaved.map((e) => e.id).join(', ')}`)
      // Save the entities and update the next entity id
      const nextEntityId = new NextEntityId({ entityName: this._class.name, nextId: this._nextId })
      await Promise.all([this.em.save(toBeSaved), this.em.save(nextEntityId)])
    }
  }

  // Execute scheduled remove operations and clean the cache
  async cleanup(): Promise<void> {
    const toBeRemoved = await this.getAllToBeRemoved()

    if (toBeRemoved.length) {
      const logger = Logger.get()
      logger.info(`Removing ${toBeRemoved.length} ${this._class.name} entities...`)
      logger.debug(`Entity ids: ${toBeRemoved.map((e) => e.id).join(', ')}`)
      await this.store.remove(toBeRemoved)
    }
    this._cached = new Map()
  }

  getAllToBeSaved(): E[] {
    return [...this._cached.values()]
      .filter(({ state }) => state === CachedEntityState.ToBeSaved)
      .flatMap(({ entity }) => (entity ? [entity] : []))
  }

  async getAllToBeRemoved(load = false): Promise<E[]> {
    return (
      await Promise.all(
        [...this._cached.entries()]
          .filter(([, { state }]) => state === CachedEntityState.ToBeRemoved)
          .map(async ([id]) => {
            if (load) {
              const loaded = await this.get(id)
              return loaded ? [loaded] : []
            }
            return [new this._class({ id })]
          })
      )
    ).flat()
  }
}

export type EntityCollections = {
  [K in ModelNames]: EntityCollection<InstanceType<typeof models[K]>>
}

export class EntitiesCollector {
  store: Store
  collections: EntityCollections

  constructor(store: Store, em: EntityManager) {
    this.store = store
    this.collections = _.mapValues(
      entityClasses,
      (entityClass) =>
        new EntityCollection<AnyEntity>(
          store,
          em,
          () => this.collections,
          () => this.updateDatabase(),
          entityClass
        )
    ) as EntityCollections
  }

  public static async create(store: Store) {
    // FIXME: This is a little hacky, but we really need to access the underlying EntityManager,
    // for example, because Store by default uses `upsert` for saving the entities, which is problematic
    // when the entity has some required relations and we're just trying to update it
    const em = await (store as unknown as { em: () => Promise<EntityManager> }).em()
    return new EntitiesCollector(store, em)
  }

  async updateDatabase() {
    // Execute save operations
    await this.collections.DistributionBucketFamily.save()
    await this.collections.DistributionBucketFamilyMetadata.save()
    await this.collections.StorageBucket.save()
    await this.collections.DistributionBucket.save()
    await this.collections.StorageBucketOperatorMetadata.save()
    await this.collections.DistributionBucketOperator.save()
    await this.collections.DistributionBucketOperatorMetadata.save()
    await this.collections.StorageBag.save()
    await this.collections.StorageBucketBag.save()
    await this.collections.DistributionBucketBag.save()
    await this.collections.StorageDataObject.save()
    await this.collections.Membership.save()
    await this.collections.MemberMetadata.save()
    await this.collections.Channel.save()
    await this.collections.License.save()
    await this.collections.VideoCategory.save()
    await this.collections.Video.save()
    await this.collections.OwnedNft.save()
    // Because of Auction<->Bid cross-relationship we need to temporarly unset auction.topBid first
    const auctionsToSave = this.collections.Auction.getAllToBeSaved()
    const auctionsWithTopBid: Auction[] = []
    auctionsToSave.forEach((a) => {
      if (a.topBid) {
        auctionsWithTopBid.push(new Auction({ ...a }))
        a.topBid = null
      }
    })
    await this.collections.Auction.save()
    await this.collections.Bid.save()
    await this.collections.Auction.push(...auctionsWithTopBid).save()
    await this.collections.AuctionWhitelistedMember.save()
    await this.collections.VideoSubtitle.save()
    await this.collections.VideoMediaEncoding.save()
    await this.collections.VideoMediaMetadata.save()
    await this.collections.VideoReaction.save()
    await this.collections.Comment.save()
    await this.collections.CommentReaction.save()
    await this.collections.Event.save()
    // Execute remove operations (opposite order, related entities first)
    await this.collections.Event.cleanup()
    await this.collections.CommentReaction.cleanup()
    await this.collections.Comment.cleanup()
    await this.collections.VideoReaction.cleanup()
    await this.collections.VideoMediaMetadata.cleanup()
    await this.collections.VideoMediaEncoding.cleanup()
    await this.collections.VideoSubtitle.cleanup()
    await this.collections.AuctionWhitelistedMember.cleanup()
    // Because of Auction<->Bid cross-relationship we need to unset auction.topBid first
    const auctionsToRemove = await this.collections.Auction.getAllToBeRemoved(true)
    auctionsToRemove.forEach((a) => (a.topBid = null))
    await this.collections.Auction.push(...auctionsToRemove).save()
    await this.collections.Bid.cleanup()
    await this.collections.Auction.remove(...auctionsToRemove).cleanup()
    await this.collections.OwnedNft.cleanup()
    await this.collections.Video.cleanup()
    await this.collections.VideoCategory.cleanup()
    await this.collections.License.cleanup()
    await this.collections.Channel.cleanup()
    await this.collections.MemberMetadata.cleanup()
    await this.collections.Membership.cleanup()
    await this.collections.StorageDataObject.cleanup()
    await this.collections.DistributionBucketBag.cleanup()
    await this.collections.StorageBucketBag.cleanup()
    await this.collections.StorageBag.cleanup()
    await this.collections.DistributionBucketOperatorMetadata.cleanup()
    await this.collections.DistributionBucketOperator.cleanup()
    await this.collections.StorageBucketOperatorMetadata.cleanup()
    await this.collections.DistributionBucket.cleanup()
    await this.collections.StorageBucket.cleanup()
    await this.collections.DistributionBucketFamilyMetadata.cleanup()
    await this.collections.DistributionBucketFamily.cleanup()
  }
}

export type EventConstructor<EventName extends EventNames> = typeof eventConstructors[EventName]
export type EventInstance<EventName extends EventNames> = InstanceType<EventConstructor<EventName>>

export type EventHandlerContext<EventName extends EventNames> = {
  ec: EntitiesCollector
  block: SubstrateBlock
  indexInBlock: number
  extrinsicHash?: string
  event: EventInstance<EventName>
}

export type EventHandler<EventName extends EventNames> =
  | ((ctx: EventHandlerContext<EventName>) => void)
  | ((ctx: EventHandlerContext<EventName>) => Promise<void>)

export function criticalError(message: string, metadata?: Record<string, unknown>): never {
  metadata ? console.error(message, metadata) : console.error(message)
  throw new Error(message)
}
