"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDistributionBucketFamilyMetadata = exports.processDistributionOperatorMetadata = exports.processStorageOperatorMetadata = exports.protobufContinentToGraphlContinent = void 0;
const metadata_protobuf_1 = require("@joystream/metadata-protobuf");
const utils_1 = require("@joystream/metadata-protobuf/utils");
const model_1 = require("../../model");
const utils_2 = require("../utils");
const logger_1 = require("../../logger");
const lodash_1 = __importDefault(require("lodash"));
exports.protobufContinentToGraphlContinent = {
    [metadata_protobuf_1.GeographicalArea.Continent.AF]: model_1.Continent.AF,
    [metadata_protobuf_1.GeographicalArea.Continent.AN]: model_1.Continent.AN,
    [metadata_protobuf_1.GeographicalArea.Continent.AS]: model_1.Continent.AS,
    [metadata_protobuf_1.GeographicalArea.Continent.EU]: model_1.Continent.EU,
    [metadata_protobuf_1.GeographicalArea.Continent.NA]: model_1.Continent.NA,
    [metadata_protobuf_1.GeographicalArea.Continent.OC]: model_1.Continent.OC,
    [metadata_protobuf_1.GeographicalArea.Continent.SA]: model_1.Continent.SA,
};
async function processStorageOperatorMetadata(overlay, bucketId, metadataUpdate) {
    const metadataRepository = overlay.getRepository(model_1.StorageBucketOperatorMetadata);
    const operatorMetadata = (await metadataRepository.getById(bucketId)) ||
        metadataRepository.new({
            id: bucketId,
            storageBucketId: bucketId,
        });
    if ((0, utils_1.isSet)(metadataUpdate.endpoint)) {
        operatorMetadata.nodeEndpoint = metadataUpdate.endpoint || null;
    }
    if ((0, utils_1.isSet)(metadataUpdate.location)) {
        processNodeLocationMetadata(operatorMetadata, metadataUpdate.location);
    }
    if ((0, utils_1.isSet)(metadataUpdate.extra)) {
        operatorMetadata.extra = metadataUpdate.extra || null;
    }
}
exports.processStorageOperatorMetadata = processStorageOperatorMetadata;
function processNodeLocationMetadata(parent, metadataUpdate) {
    if ((0, utils_1.isEmptyObject)(metadataUpdate)) {
        parent.nodeLocation = null;
        return;
    }
    const nodeLocationMetadata = parent.nodeLocation || new model_1.NodeLocationMetadata();
    parent.nodeLocation = nodeLocationMetadata;
    if ((0, utils_1.isSet)(metadataUpdate.city)) {
        nodeLocationMetadata.city = metadataUpdate.city;
    }
    if ((0, utils_1.isSet)(metadataUpdate.coordinates)) {
        if ((0, utils_1.isEmptyObject)(metadataUpdate.coordinates)) {
            nodeLocationMetadata.coordinates = null;
        }
        else {
            if (!nodeLocationMetadata.coordinates) {
                nodeLocationMetadata.coordinates = new model_1.GeoCoordinates();
            }
            if ((0, utils_1.isSet)(metadataUpdate.coordinates.latitude)) {
                nodeLocationMetadata.coordinates.latitude = metadataUpdate.coordinates.latitude;
            }
            if ((0, utils_1.isSet)(metadataUpdate.coordinates.longitude)) {
                nodeLocationMetadata.coordinates.longitude = metadataUpdate.coordinates.longitude;
            }
        }
    }
    if ((0, utils_1.isSet)(metadataUpdate.countryCode)) {
        if ((0, utils_1.isValidCountryCode)(metadataUpdate.countryCode)) {
            nodeLocationMetadata.countryCode = metadataUpdate.countryCode;
        }
        else {
            logger_1.Logger.get().warn(`Invalid country code: ${metadataUpdate.countryCode}`);
            nodeLocationMetadata.countryCode = null;
        }
    }
}
async function processDistributionOperatorMetadata(overlay, operatorId, metadataUpdate) {
    const metadataRepository = overlay.getRepository(model_1.DistributionBucketOperatorMetadata);
    const operatorMetadata = (await metadataRepository.getById(operatorId)) ||
        metadataRepository.new({
            id: operatorId,
            distirbutionBucketOperatorId: operatorId,
        });
    if ((0, utils_1.isSet)(metadataUpdate.endpoint)) {
        operatorMetadata.nodeEndpoint = metadataUpdate.endpoint || null;
    }
    if ((0, utils_1.isSet)(metadataUpdate.location)) {
        processNodeLocationMetadata(operatorMetadata, metadataUpdate.location);
    }
    if ((0, utils_1.isSet)(metadataUpdate.extra)) {
        operatorMetadata.extra = metadataUpdate.extra || null;
    }
}
exports.processDistributionOperatorMetadata = processDistributionOperatorMetadata;
async function processDistributionBucketFamilyMetadata(overlay, familyId, metadataUpdate) {
    const metadataRepository = overlay.getRepository(model_1.DistributionBucketFamilyMetadata);
    const familyMetadata = (await metadataRepository.getById(familyId)) ||
        metadataRepository.new({ id: familyId, familyId });
    if ((0, utils_1.isSet)(metadataUpdate.region)) {
        familyMetadata.region = metadataUpdate.region || null;
    }
    if ((0, utils_1.isSet)(metadataUpdate.description)) {
        familyMetadata.description = metadataUpdate.description || null;
    }
    if ((0, utils_1.isSet)(metadataUpdate.latencyTestTargets)) {
        familyMetadata.latencyTestTargets = metadataUpdate.latencyTestTargets.filter((t) => t);
    }
    if ((0, utils_1.isSet)(metadataUpdate.areas)) {
        // Set new areas
        familyMetadata.areas = lodash_1.default.chain(metadataUpdate.areas)
            .filter((a) => !(0, utils_1.isEmptyObject)(a))
            .uniqWith(lodash_1.default.isEqual)
            .flatMap((a) => {
            if (a.continent) {
                const continentCode = exports.protobufContinentToGraphlContinent[a.continent];
                if (!continentCode) {
                    (0, utils_2.invalidMetadata)(metadata_protobuf_1.GeographicalArea, `Unrecognized continent enum variant: ${a.continent}`, { decodedMessage: a });
                    return [];
                }
                return [
                    new model_1.GeographicalAreaContinent({
                        continentCode,
                    }),
                ];
            }
            if (a.countryCode) {
                if (!(0, utils_1.isValidCountryCode)(a.countryCode)) {
                    (0, utils_2.invalidMetadata)(metadata_protobuf_1.GeographicalArea, `Invalid country code: ${a.countryCode}`, {
                        decodedMessage: a,
                    });
                    return [];
                }
                return [
                    new model_1.GeographicalAreaCountry({
                        countryCode: a.countryCode,
                    }),
                ];
            }
            if (a.subdivisionCode) {
                if (!(0, utils_1.isValidSubdivisionCode)(a.subdivisionCode)) {
                    (0, utils_2.invalidMetadata)(metadata_protobuf_1.GeographicalArea, `Invalid subdivision code: ${a.subdivisionCode}`, {
                        decodedMessage: a,
                    });
                    return [];
                }
                return [new model_1.GeographicalAreaSubdivistion({ subdivisionCode: a.subdivisionCode })];
            }
            return [];
        })
            .value();
    }
}
exports.processDistributionBucketFamilyMetadata = processDistributionBucketFamilyMetadata;
//# sourceMappingURL=metadata.js.map