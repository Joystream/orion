import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  StorageBag,
  StorageBagOwner,
  StorageBagOwnerChannel,
  StorageBagOwnerMember,
  StorageBucket,
  StorageDataObject,
  StorageBucketBag,
  DistributionBucket,
  DistributionBucketBag,
  DataObjectTypeVideoSubtitle,
  DistributionBucketOperator,
  StorageBagOwnerCouncil,
  StorageBagOwnerWorkingGroup,
} from '../../model'
import {
  BagIdType,
  DataObjectCreationParameters,
  DistributionBucketIdRecord,
  DynamicBagIdType,
  StaticBagId,
} from '../../types/v1000'
import { bytesToString } from '../utils'
import { EntitiesCollector } from '../../utils'
import { ASSET_TYPES } from '../content/utils'

export function getDynamicBagId(bagId: DynamicBagIdType): string {
  if (bagId.__kind === 'Channel') {
    return `dynamic:channel:${bagId.value.toString()}`
  }

  if (bagId.__kind === 'Member') {
    return `dynamic:member:${bagId.value.toString()}`
  }

  throw new Error(`Unexpected dynamic bag type: ${JSON.stringify(bagId)}`)
}

export function getStaticBagId(bagId: StaticBagId): string {
  if (bagId.__kind === 'Council') {
    return `static:council`
  }

  if (bagId.__kind === 'WorkingGroup') {
    return `static:wg:${bagId.value.__kind.toLowerCase()}`
  }

  throw new Error(`Unexpected static bag type: ${JSON.stringify(bagId)}`)
}

export function getBagId(bagId: BagIdType): string {
  return bagId.__kind === 'Static' ? getStaticBagId(bagId.value) : getDynamicBagId(bagId.value)
}

export function getDynamicBagOwner(bagId: DynamicBagIdType): StorageBagOwner {
  if (bagId.__kind === 'Channel') {
    return new StorageBagOwnerChannel({ channelId: bagId.value.toString() })
  }
  if (bagId.__kind === 'Member') {
    return new StorageBagOwnerMember({ memberId: bagId.value.toString() })
  }

  throw new Error(`Unexpected dynamic bag type: ${JSON.stringify(bagId)}`)
}

export function getStaticBagOwner(bagId: StaticBagId): StorageBagOwner {
  if (bagId.__kind === 'Council') {
    return new StorageBagOwnerCouncil()
  } else if (bagId.__kind === 'WorkingGroup') {
    return new StorageBagOwnerWorkingGroup({ workingGroupId: bagId.value.__kind.toLowerCase() })
  }

  throw new Error(`Unexpected static bag type: ${JSON.stringify(bagId)}`)
}

export function distributionBucketId({
  distributionBucketFamilyId: familyId,
  distributionBucketIndex: bucketIndex,
}: DistributionBucketIdRecord): string {
  return `${familyId.toString()}:${bucketIndex.toString()}`
}

export function distributionOperatorId(
  bucketId: DistributionBucketIdRecord,
  workerId: bigint
): string {
  return `${distributionBucketId(bucketId)}-${workerId.toString()}`
}

export function createStorageBucketBag(
  bucketOrId: StorageBucket | bigint,
  bagOrId: StorageBag | BagIdType
): StorageBucketBag {
  const storageBucket =
    bucketOrId instanceof StorageBucket
      ? bucketOrId
      : new StorageBucket({ id: bucketOrId.toString() })
  const bag = bagOrId instanceof StorageBag ? bagOrId : new StorageBag({ id: getBagId(bagOrId) })
  return new StorageBucketBag({
    id: `${storageBucket.id}-${bag.id}`,
    storageBucket,
    bag,
  })
}

export function createDistributionBucketBag(
  bucketOrId: DistributionBucket | DistributionBucketIdRecord,
  bagOrId: StorageBag | BagIdType
): DistributionBucketBag {
  const distributionBucket =
    bucketOrId instanceof DistributionBucket
      ? bucketOrId
      : new DistributionBucket({ id: distributionBucketId(bucketOrId) })
  const bag = bagOrId instanceof StorageBag ? bagOrId : new StorageBag({ id: getBagId(bagOrId) })
  return new DistributionBucketBag({
    id: `${distributionBucket.id}-${bag.id}`,
    distributionBucket,
    bag,
  })
}

export function createDataObjects(
  block: SubstrateBlock,
  storageBag: StorageBag,
  objectCreationList: DataObjectCreationParameters[],
  stateBloatBond: bigint,
  objectIds: bigint[]
): StorageDataObject[] {
  const dataObjects = objectCreationList.map((objectParams, i) => {
    const objectId = objectIds[i]
    const object = new StorageDataObject({
      id: objectId.toString(),
      createdAt: new Date(block.timestamp),
      isAccepted: false,
      ipfsHash: bytesToString(objectParams.ipfsContentId),
      size: objectParams.size,
      stateBloatBond,
      storageBag,
    })
    return object
  })

  return dataObjects
}

export async function unsetAssetRelations(
  ec: EntitiesCollector,
  dataObject: StorageDataObject
): Promise<void> {
  for (const type of ASSET_TYPES.channel) {
    if (dataObject.type instanceof type.DataObjectTypeConstructor) {
      const channel = await ec.collections.Channel.get(dataObject.type.channel)
      channel[type.schemaFieldName] = null
    }
  }

  for (const type of ASSET_TYPES.video) {
    if (
      dataObject.type instanceof type.DataObjectTypeConstructor &&
      // Subtitles are derived, so no need to unset
      !(dataObject.type instanceof DataObjectTypeVideoSubtitle)
    ) {
      const video = await ec.collections.Video.get(dataObject.type.video)
      video[type.schemaFieldName] = null
    }
  }
}

export function removeDistributionBucketOperator(
  ec: EntitiesCollector,
  operator: DistributionBucketOperator
) {
  ec.collections.DistributionBucketOperator.remove(operator)
  if (operator.metadata) {
    ec.collections.DistributionBucketOperatorMetadata.remove(operator.metadata)
  }
}

export async function addStaticBagIfNotExists(ec: EntitiesCollector, bagId: BagIdType) {
  if (bagId.__kind === 'Static') {
    try {
      await ec.collections.StorageBag.get(getBagId(bagId))
    } catch (e) {
      ec.collections.StorageBag.push(
        new StorageBag({
          id: getBagId(bagId),
          owner: getStaticBagOwner(bagId.value),
        })
      )
    }
  }
}

export async function deleteDataObjects(ec: EntitiesCollector, objects: StorageDataObject[]) {
  ec.collections.StorageDataObject.remove(...objects)
  await Promise.all(objects.map((o) => unsetAssetRelations(ec, o)))
}
