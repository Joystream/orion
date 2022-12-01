import { ChannelMetadata, IChannelMetadata, VideoMetadata } from '@joystream/metadata-protobuf'
import { AnyMetadataClass, DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { integrateMeta, isSet, isValidLanguageCode } from '@joystream/metadata-protobuf/utils'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Channel, StorageDataObject } from '../../model'
import { EntitiesCollector } from '../../utils'
import { invalidMetadata } from '../utils'
import { ASSET_TYPES } from './utils'

export async function processChannelMetadata(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  channel: Channel,
  meta: DecodedMetadataObject<IChannelMetadata>,
  newAssetIds: bigint[]
) {
  const assets = await Promise.all(
    newAssetIds.map((id) => ec.collections.StorageDataObject.get(id.toString()))
  )

  integrateMeta(channel, meta, ['title', 'description', 'isPublic'])

  processChannelAssets(block, assets, channel, meta)

  // prepare language if needed
  if (isSet(meta.language)) {
    processChannelLanguage(channel, meta.language)
  }
}

function processChannelAssets(
  block: SubstrateBlock,
  assets: StorageDataObject[],
  channel: Channel,
  meta: DecodedMetadataObject<IChannelMetadata>
) {
  ASSET_TYPES.channel.forEach(({ metaFieldName, schemaFieldName, DataObjectTypeConstructor }) => {
    const newAssetIndex = meta[metaFieldName]
    const currentAsset = channel[schemaFieldName]
    if (isSet(newAssetIndex)) {
      const asset = findAssetByIndex(ChannelMetadata, assets, newAssetIndex, metaFieldName)
      if (asset) {
        if (currentAsset) {
          currentAsset.unsetAt = new Date(block.timestamp)
        }
        const dataObjectType = new DataObjectTypeConstructor()
        dataObjectType.channel = channel.id
        asset.type = dataObjectType
        channel[schemaFieldName] = asset
      }
    }
  })
}

function findAssetByIndex<T extends ChannelMetadata | VideoMetadata>(
  metaClass: AnyMetadataClass<T>,
  assets: StorageDataObject[],
  index: number,
  name: string
): StorageDataObject | null {
  if (assets[index]) {
    return assets[index]
  }

  invalidMetadata(metaClass, `Non-existing${name ? ' ' + name : ''} asset index`, {
    numberOfAssets: assets.length,
    requestedAssetIndex: index,
    propertyName: name,
  })

  return null
}

function processChannelLanguage(channel: Channel, iso: string) {
  // ensure language string is valid
  if (!isValidLanguageCode(iso)) {
    invalidMetadata(ChannelMetadata, `Invalid language ISO-639-1 provided`, { iso })
    return
  }

  channel.language = iso
}
