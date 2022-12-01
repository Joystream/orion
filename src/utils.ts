import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import * as models from './model'
import {
  ContentChannelCreatedEvent,
  StorageStorageBucketCreatedEvent,
  StorageDynamicBagCreatedEvent,
  StorageDataObjectsUploadedEvent,
  MembersMemberCreatedEvent,
  MembersMembershipBoughtEvent,
  MembersMembershipGiftedEvent,
  MembersMemberInvitedEvent,
  MembersMemberAccountsUpdatedEvent,
  MembersMemberProfileUpdatedEvent,
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
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm'
import _ from 'lodash'

export function assertAssignable<T>(type: T) {
  return type
}

export const eventConstructors = {
  'Content.ChannelCreated': ContentChannelCreatedEvent,
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

export class EntityCollection<E extends AnyEntity, EC extends Constructor<E> = Constructor<E>> {
  private store: Store
  private _class: EC
  private _toBeSaved: E[] = []
  private _toBeRemoved: E[] = []

  constructor(store: Store, _class: EC) {
    this.store = store
    this._class = _class
  }

  remove(...items: E[]): void {
    // skip already cached entities
    items = items.filter((i) => !this._toBeRemoved.find((e) => e.id === i.id))
    // removing an entity overrides any scheduled updates of this entity
    items.forEach((i) => {
      _.remove(this._toBeSaved, (e) => e.id === i.id)
    })
    this._toBeRemoved.push(...items)
  }

  push(...items: E[]): number {
    // skip already cached entities
    items = items.filter((i) => !this._toBeSaved.find((e) => e.id === i.id))
    // pushing an entity overrides any scheduled removals of this entity
    items.forEach((i) => {
      _.remove(this._toBeRemoved, (e) => e.id === i.id)
    })
    return this._toBeSaved.push(...items)
  }

  async get(id: string, relations?: FindOptionsRelations<E>): Promise<E> {
    if (this._toBeRemoved.find((e) => e.id === id)) {
      throw new Error(`Trying to access entity scheduled for removal ${this._class}:${id}`)
    }
    const cached = this._toBeSaved.find((e) => e.id === id)
    if (cached && !relations) {
      return cached
    }
    const stored = await this.store.findOne(this._class, {
      where: { id } as FindOptionsWhere<E>,
      relations,
    })

    if (!stored && !cached) {
      // We have neither stored nor cached version - throw an error
      throw new Error(`Could not find ${this._class.name} by id ${id}`)
    }

    if (stored && !cached) {
      // We have only a stored version - cache and return it
      this.push(stored)
      return stored
    }

    if (!stored && cached) {
      // We have only a cached version - return it
      return cached
    }

    if (stored && cached) {
      // We have both stored and cached version - return a merge of cached->stored
      return _.mergeWith(stored, cached, (destVal, srcVal) => {
        // Do not recursively merge arrays
        if (_.isArray(srcVal)) {
          return srcVal
        }
        // Do not recursively merge JSON variants
        if (typeof srcVal === 'object' && srcVal !== null && 'toJSON' in Object.keys(srcVal)) {
          return srcVal
        }
      })
    }

    throw new Error('Never going to happen, just making TypeScript happy')
  }

  // Execute scheduled save operations
  async save(): Promise<void> {
    if (this._toBeSaved.length) {
      await this.store.save(this._toBeSaved)
    }
  }

  // Execute scheduled remove operations
  async cleanup(): Promise<void> {
    if (this._toBeRemoved.length) {
      await this.store.remove(this._toBeRemoved)
    }
  }
}

export type EntityCollections = {
  [K in ModelNames]: EntityCollection<InstanceType<typeof models[K]>>
}

export class EntitiesCollector {
  store: Store
  collections: EntityCollections

  constructor(store: Store) {
    this.store = store
    const entityClasses = _.pickBy(models, (o) => {
      return (
        typeof o === 'function' &&
        o.name &&
        o.name[0] === o.name[0].toUpperCase() &&
        !o.toString().includes('toJSON')
      )
    }) as { [K in ModelNames]: Constructor<AnyEntity> }
    this.collections = _.mapValues(
      entityClasses,
      (entityClass) => new EntityCollection(store, entityClass)
    ) as EntityCollections
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
    // Execute remove operations (opposite order, related entities first)
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
  event: EventInstance<EventName>
}

export type EventHandler<EventName extends EventNames> =
  | ((ctx: EventHandlerContext<EventName>) => void)
  | ((ctx: EventHandlerContext<EventName>) => Promise<void>)
