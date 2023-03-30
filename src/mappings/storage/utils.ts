import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  StorageBag,
  StorageBagOwner,
  StorageBagOwnerChannel,
  StorageBagOwnerMember,
  StorageDataObject,
  DistributionBucketOperator,
  StorageBagOwnerCouncil,
  StorageBagOwnerWorkingGroup,
  Channel,
  Video,
  VideoSubtitle,
  DistributionBucketOperatorMetadata,
} from '../../model'
import {
  BagIdType,
  DataObjectCreationParameters,
  DistributionBucketIdRecord,
  DynamicBagIdType,
  StaticBagId,
} from '../../types/v1000'
import { bytesToString } from '../utils'
import { criticalError } from '../../utils/misc'
import { EntityManagerOverlay, Flat, RepositoryOverlay } from '../../utils/overlay'
import { ASSETS_MAP } from '../content/utils'

export function getDynamicBagId(bagId: DynamicBagIdType): string {
  if (bagId.__kind === 'Channel') {
    return `dynamic:channel:${bagId.value.toString()}`
  }

  if (bagId.__kind === 'Member') {
    return `dynamic:member:${bagId.value.toString()}`
  }

  criticalError(`Unexpected dynamic bag type`, { bagId })
}

export function getStaticBagId(bagId: StaticBagId): string {
  if (bagId.__kind === 'Council') {
    return `static:council`
  }

  if (bagId.__kind === 'WorkingGroup') {
    return `static:wg:${bagId.value.__kind.toLowerCase()}`
  }

  criticalError(`Unexpected static bag type`, { bagId })
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

  criticalError(`Unexpected dynamic bag type`, { bagId })
}

export function getStaticBagOwner(bagId: StaticBagId): StorageBagOwner {
  if (bagId.__kind === 'Council') {
    return new StorageBagOwnerCouncil()
  } else if (bagId.__kind === 'WorkingGroup') {
    return new StorageBagOwnerWorkingGroup({ workingGroupId: bagId.value.__kind.toLowerCase() })
  }

  criticalError(`Unexpected static bag type`, { bagId })
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

export function storageBucketBagData(
  bucketId: bigint | string,
  bagId: BagIdType | string
): { id: string; storageBucketId: string; bagId: string } {
  bagId = typeof bagId === 'string' ? bagId : getBagId(bagId)
  return {
    id: `${bucketId.toString()}-${bagId}`,
    storageBucketId: bucketId.toString(),
    bagId,
  }
}

export function distributionBucketBagData(
  bucketId: DistributionBucketIdRecord | string,
  bagId: BagIdType | string
): { id: string; distributionBucketId: string; bagId: string } {
  bucketId = typeof bucketId === 'string' ? bucketId : distributionBucketId(bucketId)
  bagId = typeof bagId === 'string' ? bagId : getBagId(bagId)
  return {
    id: `${bucketId}-${bagId}`,
    distributionBucketId: bucketId,
    bagId,
  }
}

export function createDataObjects(
  dataObjectRepository: RepositoryOverlay<StorageDataObject>,
  block: SubstrateBlock,
  storageBagId: string,
  objectCreationList: DataObjectCreationParameters[],
  stateBloatBond: bigint,
  objectIds: bigint[]
): Flat<StorageDataObject>[] {
  const dataObjects = objectCreationList.map((objectParams, i) => {
    const objectId = objectIds[i]
    const object = dataObjectRepository.new({
      id: objectId.toString(),
      createdAt: new Date(block.timestamp),
      isAccepted: false,
      ipfsHash: bytesToString(objectParams.ipfsContentId),
      size: objectParams.size,
      stateBloatBond,
      storageBagId,
      // Note: It may be a little confusing to populate this with objectId,
      // but this is required for the Orion's GraphQL server to be able to resolve
      // this field to an actual asset url via the AssetsResolver
      resolvedUrls: [objectId.toString()],
    })
    return object
  })

  return dataObjects
}

export async function unsetAssetRelations(
  overlay: EntityManagerOverlay,
  dataObject: Flat<StorageDataObject>
): Promise<void> {
  for (const { DataObjectTypeConstructor, entityProperty } of Object.values(ASSETS_MAP.channel)) {
    if (dataObject.type instanceof DataObjectTypeConstructor) {
      const channel = await overlay.getRepository(Channel).getByIdOrFail(dataObject.type.channel)
      channel[entityProperty] = null
    }
  }
  for (const { DataObjectTypeConstructor, entityProperty } of Object.values(ASSETS_MAP.video)) {
    if (dataObject.type instanceof DataObjectTypeConstructor) {
      const video = await overlay.getRepository(Video).getByIdOrFail(dataObject.type.video)
      video[entityProperty] = null
    }
  }
  for (const { DataObjectTypeConstructor, entityProperty } of Object.values(ASSETS_MAP.subtitle)) {
    if (dataObject.type instanceof DataObjectTypeConstructor) {
      const subtitle = await overlay
        .getRepository(VideoSubtitle)
        .getByIdOrFail(dataObject.type.subtitle)
      subtitle[entityProperty] = null
    }
  }
}

export async function removeDistributionBucketOperator(
  overlay: EntityManagerOverlay,
  operatorId: string
) {
  overlay.getRepository(DistributionBucketOperator).remove(operatorId)
  overlay.getRepository(DistributionBucketOperatorMetadata).remove(operatorId)
}

export async function getOrCreateBag(
  overlay: EntityManagerOverlay,
  bagId: BagIdType
): Promise<Flat<StorageBag>> {
  const bagRepository = overlay.getRepository(StorageBag)
  const bag = await bagRepository.getById(getBagId(bagId))
  if (bag) {
    return bag
  }
  if (bagId.__kind === 'Dynamic') {
    criticalError(`Missing dynamic bag`, { id: bagId.value })
  }
  const newBag = bagRepository.new({
    id: getBagId(bagId),
    owner: getStaticBagOwner(bagId.value),
  })
  return newBag
}

export async function deleteDataObjects(
  overlay: EntityManagerOverlay,
  objects: Flat<StorageDataObject>[]
) {
  overlay.getRepository(StorageDataObject).remove(...objects)
  await Promise.all(objects.map((o) => unsetAssetRelations(overlay, o)))
}

export async function deleteDataObjectsByIds(overlay: EntityManagerOverlay, ids: bigint[]) {
  const dataObjectRepository = overlay.getRepository(StorageDataObject)
  const objects = await Promise.all(
    ids.map((id) => dataObjectRepository.getByIdOrFail(id.toString()))
  )
  await deleteDataObjects(overlay, objects)
}
