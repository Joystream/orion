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
  StorageBucket,
  StorageBucketOperatorMetadata,
  NodeLocationMetadata,
  GeoCoordinates,
  DistributionBucketFamily,
  DistributionBucketFamilyMetadata,
  GeographicalAreaContinent,
  Continent,
  GeographicalAreaCountry,
  GeographicalAreaSubdivistion,
  DistributionBucketOperator,
  DistributionBucketOperatorMetadata,
  GeographicalArea,
} from '../../model'
import { invalidMetadata } from '../utils'
import { EntitiesCollector } from '../../utils'
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

export function processStorageOperatorMetadata(
  ec: EntitiesCollector,
  storageBucket: StorageBucket,
  meta: DecodedMetadataObject<IStorageBucketOperatorMetadata>
) {
  const operatorMetadata =
    storageBucket.operatorMetadata ||
    new StorageBucketOperatorMetadata({
      id: storageBucket.id,
      storageBucket,
    })
  if (isSet(meta.endpoint)) {
    operatorMetadata.nodeEndpoint = meta.endpoint || null
  }
  if (isSet(meta.location)) {
    processNodeLocationMetadata(operatorMetadata, meta.location)
  }
  if (isSet(meta.extra)) {
    operatorMetadata.extra = meta.extra || null
  }
  storageBucket.operatorMetadata = operatorMetadata
  ec.collections.StorageBucketOperatorMetadata.push(operatorMetadata)
}

function processNodeLocationMetadata(
  parent: StorageBucketOperatorMetadata | DistributionBucketOperatorMetadata,
  meta: DecodedMetadataObject<INodeLocationMetadata>
) {
  if (isEmptyObject(meta)) {
    parent.nodeLocation = null
    return
  }
  const nodeLocationMetadata = parent.nodeLocation || new NodeLocationMetadata()
  parent.nodeLocation = nodeLocationMetadata
  if (isSet(meta.city)) {
    nodeLocationMetadata.city = meta.city
  }
  if (isSet(meta.coordinates)) {
    if (isEmptyObject(meta.coordinates)) {
      nodeLocationMetadata.coordinates = null
    } else {
      if (!nodeLocationMetadata.coordinates) {
        nodeLocationMetadata.coordinates = new GeoCoordinates()
      }
      if (isSet(meta.coordinates.latitude)) {
        nodeLocationMetadata.coordinates.latitude = meta.coordinates.latitude
      }
      if (isSet(meta.coordinates.longitude)) {
        nodeLocationMetadata.coordinates.longitude = meta.coordinates.longitude
      }
    }
  }
  if (isSet(meta.countryCode)) {
    if (isValidCountryCode(meta.countryCode)) {
      nodeLocationMetadata.countryCode = meta.countryCode
    } else {
      Logger.get().warn(`Invalid country code: ${meta.countryCode}`)
      nodeLocationMetadata.countryCode = null
    }
  }
}

export function processDistributionOperatorMetadata(
  ec: EntitiesCollector,
  operator: DistributionBucketOperator,
  meta: DecodedMetadataObject<IDistributionBucketOperatorMetadata>
): void {
  const operatorMetadata =
    operator.metadata ||
    new DistributionBucketOperatorMetadata({
      id: operator.id,
      distirbutionBucketOperator: operator,
    })
  if (isSet(meta.endpoint)) {
    operatorMetadata.nodeEndpoint = meta.endpoint || null
  }
  if (isSet(meta.location)) {
    processNodeLocationMetadata(operatorMetadata, meta.location)
  }
  if (isSet(meta.extra)) {
    operatorMetadata.extra = meta.extra || null
  }
  operator.metadata = operatorMetadata
  ec.collections.DistributionBucketOperatorMetadata.push(operatorMetadata)
}

export function processDistributionBucketFamilyMetadata(
  ec: EntitiesCollector,
  family: DistributionBucketFamily,
  meta: DecodedMetadataObject<IDistributionBucketFamilyMetadata>
): void {
  const familyMetadata =
    family.metadata || new DistributionBucketFamilyMetadata({ id: family.id, family })
  family.metadata = familyMetadata
  ec.collections.DistributionBucketFamilyMetadata.push(familyMetadata)
  if (isSet(meta.region)) {
    familyMetadata.region = meta.region || null
  }
  if (isSet(meta.description)) {
    familyMetadata.description = meta.description || null
  }
  if (isSet(meta.latencyTestTargets)) {
    familyMetadata.latencyTestTargets = meta.latencyTestTargets.filter((t) => t)
  }
  if (isSet(meta.areas)) {
    // Set new areas
    familyMetadata.areas = _.chain(meta.areas)
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
