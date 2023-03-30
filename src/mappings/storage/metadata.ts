import {
  GeographicalArea as GeographicalAreaProto,
  IDistributionBucketFamilyMetadata,
  IDistributionBucketOperatorMetadata,
  IGeographicalArea,
  INodeLocationMetadata,
  IStorageBucketOperatorMetadata,
} from '@joystream/metadata-protobuf'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import {
  isEmptyObject,
  isSet,
  isValidCountryCode,
  isValidSubdivisionCode,
} from '@joystream/metadata-protobuf/utils'
import {
  StorageBucketOperatorMetadata,
  NodeLocationMetadata,
  GeoCoordinates,
  DistributionBucketFamilyMetadata,
  GeographicalAreaContinent,
  Continent,
  GeographicalAreaCountry,
  GeographicalAreaSubdivistion,
  DistributionBucketOperatorMetadata,
  GeographicalArea,
} from '../../model'
import { invalidMetadata } from '../utils'
import { EntityManagerOverlay, Flat } from '../../utils/overlay'
import { Logger } from '../../logger'
import _ from 'lodash'

export const protobufContinentToGraphlContinent: {
  [key in GeographicalAreaProto.Continent]: Continent
} = {
  [GeographicalAreaProto.Continent.AF]: Continent.AF,
  [GeographicalAreaProto.Continent.AN]: Continent.AN,
  [GeographicalAreaProto.Continent.AS]: Continent.AS,
  [GeographicalAreaProto.Continent.EU]: Continent.EU,
  [GeographicalAreaProto.Continent.NA]: Continent.NA,
  [GeographicalAreaProto.Continent.OC]: Continent.OC,
  [GeographicalAreaProto.Continent.SA]: Continent.SA,
}

export async function processStorageOperatorMetadata(
  overlay: EntityManagerOverlay,
  bucketId: string,
  metadataUpdate: DecodedMetadataObject<IStorageBucketOperatorMetadata>
) {
  const metadataRepository = overlay.getRepository(StorageBucketOperatorMetadata)
  const operatorMetadata =
    (await metadataRepository.getById(bucketId)) ||
    metadataRepository.new({
      id: bucketId,
      storageBucketId: bucketId,
    })
  if (isSet(metadataUpdate.endpoint)) {
    operatorMetadata.nodeEndpoint = metadataUpdate.endpoint || null
  }
  if (isSet(metadataUpdate.location)) {
    processNodeLocationMetadata(operatorMetadata, metadataUpdate.location)
  }
  if (isSet(metadataUpdate.extra)) {
    operatorMetadata.extra = metadataUpdate.extra || null
  }
}

function processNodeLocationMetadata(
  parent: Flat<StorageBucketOperatorMetadata> | Flat<DistributionBucketOperatorMetadata>,
  metadataUpdate: DecodedMetadataObject<INodeLocationMetadata>
) {
  if (isEmptyObject(metadataUpdate)) {
    parent.nodeLocation = null
    return
  }
  const nodeLocationMetadata = parent.nodeLocation || new NodeLocationMetadata()
  parent.nodeLocation = nodeLocationMetadata
  if (isSet(metadataUpdate.city)) {
    nodeLocationMetadata.city = metadataUpdate.city
  }
  if (isSet(metadataUpdate.coordinates)) {
    if (isEmptyObject(metadataUpdate.coordinates)) {
      nodeLocationMetadata.coordinates = null
    } else {
      if (!nodeLocationMetadata.coordinates) {
        nodeLocationMetadata.coordinates = new GeoCoordinates()
      }
      if (isSet(metadataUpdate.coordinates.latitude)) {
        nodeLocationMetadata.coordinates.latitude = metadataUpdate.coordinates.latitude
      }
      if (isSet(metadataUpdate.coordinates.longitude)) {
        nodeLocationMetadata.coordinates.longitude = metadataUpdate.coordinates.longitude
      }
    }
  }
  if (isSet(metadataUpdate.countryCode)) {
    if (isValidCountryCode(metadataUpdate.countryCode)) {
      nodeLocationMetadata.countryCode = metadataUpdate.countryCode
    } else {
      Logger.get().warn(`Invalid country code: ${metadataUpdate.countryCode}`)
      nodeLocationMetadata.countryCode = null
    }
  }
}

export async function processDistributionOperatorMetadata(
  overlay: EntityManagerOverlay,
  operatorId: string,
  metadataUpdate: DecodedMetadataObject<IDistributionBucketOperatorMetadata>
): Promise<void> {
  const metadataRepository = overlay.getRepository(DistributionBucketOperatorMetadata)
  const operatorMetadata =
    (await metadataRepository.getById(operatorId)) ||
    metadataRepository.new({
      id: operatorId,
      distirbutionBucketOperatorId: operatorId,
    })
  if (isSet(metadataUpdate.endpoint)) {
    operatorMetadata.nodeEndpoint = metadataUpdate.endpoint || null
  }
  if (isSet(metadataUpdate.location)) {
    processNodeLocationMetadata(operatorMetadata, metadataUpdate.location)
  }
  if (isSet(metadataUpdate.extra)) {
    operatorMetadata.extra = metadataUpdate.extra || null
  }
}

export async function processDistributionBucketFamilyMetadata(
  overlay: EntityManagerOverlay,
  familyId: string,
  metadataUpdate: DecodedMetadataObject<IDistributionBucketFamilyMetadata>
): Promise<void> {
  const metadataRepository = overlay.getRepository(DistributionBucketFamilyMetadata)
  const familyMetadata =
    (await metadataRepository.getById(familyId)) ||
    metadataRepository.new({ id: familyId, familyId })
  if (isSet(metadataUpdate.region)) {
    familyMetadata.region = metadataUpdate.region || null
  }
  if (isSet(metadataUpdate.description)) {
    familyMetadata.description = metadataUpdate.description || null
  }
  if (isSet(metadataUpdate.latencyTestTargets)) {
    familyMetadata.latencyTestTargets = metadataUpdate.latencyTestTargets.filter((t) => t)
  }
  if (isSet(metadataUpdate.areas)) {
    // Set new areas
    familyMetadata.areas = _.chain(metadataUpdate.areas)
      .filter((a) => !isEmptyObject(a))
      .uniqWith(_.isEqual)
      .flatMap((a: DecodedMetadataObject<IGeographicalArea>): Array<GeographicalArea> => {
        if (a.continent) {
          const continentCode = protobufContinentToGraphlContinent[a.continent]
          if (!continentCode) {
            invalidMetadata(
              GeographicalAreaProto,
              `Unrecognized continent enum variant: ${a.continent}`,
              { decodedMessage: a }
            )
            return []
          }
          return [
            new GeographicalAreaContinent({
              continentCode,
            }),
          ]
        }

        if (a.countryCode) {
          if (!isValidCountryCode(a.countryCode)) {
            invalidMetadata(GeographicalAreaProto, `Invalid country code: ${a.countryCode}`, {
              decodedMessage: a,
            })
            return []
          }
          return [
            new GeographicalAreaCountry({
              countryCode: a.countryCode,
            }),
          ]
        }

        if (a.subdivisionCode) {
          if (!isValidSubdivisionCode(a.subdivisionCode)) {
            invalidMetadata(
              GeographicalAreaProto,
              `Invalid subdivision code: ${a.subdivisionCode}`,
              {
                decodedMessage: a,
              }
            )
            return []
          }
          return [new GeographicalAreaSubdivistion({ subdivisionCode: a.subdivisionCode })]
        }

        return []
      })
      .value()
  }
}
