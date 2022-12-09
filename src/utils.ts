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
import { EntityManager, FindOptionsRelations, FindOptionsWhere } from 'typeorm'
import _ from 'lodash'
import { Logger } from './logger'
import { NextEntityId } from './model/NextEntityId'

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

export class EntityCollection<E extends AnyEntity, EC extends Constructor<E> = Constructor<E>> {
  private store: Store
  private _class: EC
  private _toBeSaved: Map<string, E> = new Map()
  private _toBeRemoved: Map<string, E> = new Map()
  private _nextId = 1

  constructor(store: Store, _class: EC) {
    this.store = store
    this._class = _class
  }

  private asIdString(idNum: number) {
    const idStr = idNum.toString(36)
    // Add leading zeros to simplify sorting
    return _.repeat('0', 8 - idStr.length) + idStr
  }

  getNextId(): string {
    return this.asIdString(this._nextId++)
  }

  remove(...items: E[]): void {
    items.forEach((i) => {
      // removing an entity overrides any scheduled updates of this entity
      this._toBeSaved.delete(i.id)
      this._toBeRemoved.set(i.id, i)
    })
  }

  // Prevents inserting strings that contain null character into the postgresql table
  // (as this would cause an error)
  private normalizeString(s: string) {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\u0000/g, '')
  }

  private normalizeInput(e: Record<string, unknown>) {
    for (const [k, v] of Object.entries(e)) {
      if (typeof v === 'object' && v && `isTypeOf` in v) {
        this.normalizeInput(v as Record<string, unknown>)
      }
      if (typeof v === 'string') {
        e[k] = this.normalizeString(v)
      }
    }
  }

  push(...items: E[]): void {
    items.forEach((i) => {
      // pushing an entity overrides any scheduled removals of this entity
      this._toBeRemoved.delete(i.id)
      // normalize the input (remove UTF-8 null characters)
      this.normalizeInput(i)
      // Entities with the same id will override existing ones
      this._toBeSaved.set(i.id, i)
    })
  }

  async getOrFail(id: string, relations?: FindOptionsRelations<E>): Promise<E> {
    if (this._toBeRemoved.has(id)) {
      throw new Error(`Trying to access entity scheduled for removal ${this._class}:${id}`)
    }
    const result = await this.get(id, relations)
    if (!result) {
      throw new Error(`Could not find ${this._class.name} by id ${id}`)
    }
    return result
  }

  async get(id: string, relations?: FindOptionsRelations<E>): Promise<E | undefined> {
    const cached = this._toBeSaved.get(id)
    if (cached && !relations) {
      return cached
    }
    const stored = await this.store.findOne(this._class, {
      where: { id } as FindOptionsWhere<E>,
      relations,
    })

    if (!stored && !cached) {
      // We have neither stored nor cached version
      return undefined
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
      // We have both stored and cached version - merge cached->stored
      const merged = _.mergeWith(stored, cached, (destVal, srcVal) => {
        // Do not recursively merge arrays
        if (_.isArray(srcVal)) {
          return srcVal
        }
        // Do not recursively merge JSON variants
        if (typeof srcVal === 'object' && srcVal !== null && 'toJSON' in Object.keys(srcVal)) {
          return srcVal
        }
      })
      // Update cached ref
      this.push(merged)
      // Return the result of the merge
      return merged
    }

    throw new Error('Never going to happen, just making TypeScript happy')
  }

  // Execute scheduled save operations
  async save(): Promise<void> {
    if (this._toBeSaved.size) {
      const logger = Logger.get()
      logger.info(`Saving ${this._toBeSaved.size} ${this._class.name} entities...`)
      logger.debug(`Entity ids: ${[...this._toBeSaved.keys()].join(', ')}`)
      // FIXME: This is a little hacky, but we really need to access the EntityManager,
      // because Store by default uses `upsert` for saving the entities, which is problematic
      // when the entity has some required relations and we're just trying to update it
      const em = await (this.store as unknown as { em: () => Promise<EntityManager> }).em()
      // Save the entities and update the next entity id
      const nextEntityId = new NextEntityId({ entityName: this._class.name, nextId: this._nextId })
      await Promise.all([em.save([...this._toBeSaved.values()]), em.save(nextEntityId)])
      this._toBeSaved = new Map()
    }
  }

  // Execute scheduled remove operations
  async cleanup(): Promise<void> {
    if (this._toBeRemoved.size) {
      const logger = Logger.get()
      logger.info(`Removing ${this._toBeRemoved.size} ${this._class.name} entities...`)
      logger.debug(`Entity ids: ${[...this._toBeRemoved.keys()].join(', ')}`)
      await this.store.remove([...this._toBeRemoved.values()])
      this._toBeRemoved = new Map()
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
    await this.collections.License.save()
    await this.collections.VideoCategory.save()
    await this.collections.Video.save()
    await this.collections.OwnedNft.save()
    await this.collections.Auction.save()
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
    await this.collections.Auction.cleanup()
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
