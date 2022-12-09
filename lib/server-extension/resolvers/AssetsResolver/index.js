"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsResolver = exports.StorageDataObject = void 0;
const type_graphql_1 = require("type-graphql");
const model_1 = require("../../../model");
const lodash_1 = __importDefault(require("lodash"));
const globalEm_1 = require("../../../utils/globalEm");
const perf_hooks_1 = require("perf_hooks");
const url_join_1 = __importDefault(require("url-join"));
const haversine_distance_1 = __importDefault(require("haversine-distance"));
const logger_1 = require("@subsquid/logger");
const rootLogger = (0, logger_1.createLogger)('api:assets');
class DistributionBucketsCache {
    constructor() {
        this.logger = rootLogger.child('buckets-cache');
    }
    init(intervalMs) {
        this.logger.info(`Initializing distribution buckets cache with ${intervalMs}ms interval...`);
        this.updateLoop(intervalMs)
            .then(() => {
            /* Do nothing */
        })
            .catch((err) => {
            console.error(err);
            process.exit(-1);
        });
    }
    getBucketsByBagId(bagId) {
        const bucketIds = this.bucketIdsByBagId.get(bagId) || [];
        return bucketIds.flatMap((id) => {
            const bucket = this.bucketsById.get(id);
            return bucket ? [bucket] : [];
        });
    }
    async updateLoop(intervalMs) {
        this.em = await globalEm_1.globalEm;
        while (true) {
            try {
                this.logger.debug('Reloading distribution buckets and bags cache data...');
                const start = perf_hooks_1.performance.now();
                await this.loadData();
                this.logger.debug(`Reloading distribution buckets and bags cache data took ${(perf_hooks_1.performance.now() - start).toFixed(2)}ms`);
                this.logger.debug(`Buckets cached: ${this.bucketsById.size}`);
                this.logger.debug(`Bags cached: ${this.bucketIdsByBagId.size}`);
            }
            catch (e) {
                this.logger.error(`Cannot reload the cache: ${e instanceof Error ? e.message : ''}`);
            }
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
    }
    resolveBucketData(bucket, operatorsMeta) {
        const nodes = bucket.operators
            .filter((o) => o.status === model_1.DistributionBucketOperatorStatus.ACTIVE)
            .flatMap((o) => {
            const [operatorMetadata] = operatorsMeta[o.id];
            const { nodeEndpoint: endpoint, nodeLocation } = operatorMetadata || {};
            const [lat, lon] = [
                nodeLocation?.coordinates?.latitude,
                nodeLocation?.coordinates?.longitude,
            ];
            const location = isValidLat(lat) && isValidLon(lon) ? { lat, lon } : undefined;
            return endpoint
                ? [
                    {
                        endpoint,
                        location,
                    },
                ]
                : [];
        });
        return { nodes };
    }
    async loadData() {
        const bucketIdsByBagId = new Map();
        const bucketsById = new Map();
        // We use .query() here instead of .find() for improved performance
        const bagToBucketsStart = perf_hooks_1.performance.now();
        const bagToBuckets = await this.em.query('SELECT distribution_bucket_id, bag_id FROM distribution_bucket_bag');
        this.logger.debug(`Found ${bagToBuckets.length} bucket-to-bag connections (took: ${(perf_hooks_1.performance.now() - bagToBucketsStart).toFixed(2)}ms)`);
        const distributionBucketsStart = perf_hooks_1.performance.now();
        const distributionBuckets = await this.em.getRepository(model_1.DistributionBucket).find({
            where: {
                distributing: true,
            },
            relations: ['operators'],
        });
        this.logger.debug(`Found ${distributionBuckets.length} distribution buckets (took: ${(perf_hooks_1.performance.now() - distributionBucketsStart).toFixed(2)}ms)`);
        const operatorsMetaStart = perf_hooks_1.performance.now();
        const operatorsMeta = lodash_1.default.groupBy(await this.em.getRepository(model_1.DistributionBucketOperatorMetadata).find(), (e) => e.distirbutionBucketOperatorId);
        this.logger.debug(`Found ${Object.keys(operatorsMeta).length} instances of distribution bucket operator metadata (took: ${(perf_hooks_1.performance.now() - operatorsMetaStart).toFixed(2)}ms)`);
        for (const { bag_id: bagId, distribution_bucket_id: distributionBucketId } of bagToBuckets) {
            const distributionBucket = distributionBuckets.find((b) => b.id === distributionBucketId);
            if (distributionBucket && distributionBucketId && bagId) {
                // Update DistributionBucketIdsByBagId
                const bucketIds = bucketIdsByBagId.get(bagId) || [];
                bucketIds.push(distributionBucketId);
                bucketIdsByBagId.set(bagId, bucketIds);
                // Update BucketsById if the bucket not already loaded
                if (!bucketsById.get(distributionBucketId)) {
                    const bucketData = this.resolveBucketData(distributionBucket, operatorsMeta);
                    if (bucketData.nodes.length) {
                        bucketsById.set(distributionBucketId, bucketData);
                    }
                }
            }
        }
        this.bucketsById = bucketsById;
        this.bucketIdsByBagId = bucketIdsByBagId;
    }
}
const distributionBucketsCache = new DistributionBucketsCache();
distributionBucketsCache.init(6000);
const locationLogger = rootLogger.child('location');
function isValidLat(lat) {
    if (lat === undefined) {
        return false;
    }
    return !Number.isNaN(lat) && lat >= -90 && lat <= 90;
}
function isValidLon(lon) {
    if (lon === undefined) {
        return false;
    }
    return !Number.isNaN(lon) && lon >= -180 && lon <= 180;
}
function getDistance(node, clientLoc) {
    return node.location ? (0, haversine_distance_1.default)(clientLoc, node.location) : Infinity;
}
function sortNodesByClosest(nodes, clientLoc) {
    nodes.sort((nodeA, nodeB) => getDistance(nodeA, clientLoc) - getDistance(nodeB, clientLoc));
    nodes.forEach((n) => {
        locationLogger.trace(`Node: ${JSON.stringify(n)}, Client loc: ${JSON.stringify(clientLoc)}, Distance: ${getDistance(n, clientLoc)}`);
    });
}
function getClientLoc(ctx) {
    const clientLoc = ctx.req.headers['x-client-loc'];
    if (typeof clientLoc !== 'string') {
        return;
    }
    const [latStr, lonStr] = clientLoc.split(',');
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (!isValidLat(lat) || !isValidLon(lon)) {
        return;
    }
    locationLogger.debug(`Client location resolved: ${JSON.stringify({ lat, lon })}`);
    return { lat, lon };
}
function getResolvedUrlsLimit(ctx) {
    return parseInt(ctx.req.headers['x-asset-urls-limit']?.toString() || '0');
}
let StorageDataObject = class StorageDataObject {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], StorageDataObject.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], StorageDataObject.prototype, "resolvedUrls", void 0);
StorageDataObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], StorageDataObject);
exports.StorageDataObject = StorageDataObject;
let AssetsResolver = class AssetsResolver {
    // Set by depenency injection
    constructor(em) {
        this.em = em;
    }
    async resolvedUrls(object, ctx) {
        const em = await this.em();
        const clientLoc = await getClientLoc(ctx);
        const limit = await getResolvedUrlsLimit(ctx);
        // The resolvedUrl field is initially populated with the object ID
        const [objectId] = object.resolvedUrls;
        if (!objectId) {
            return [];
        }
        const { storageBagId } = (await em.getRepository(model_1.StorageDataObject).findOneBy({ id: objectId })) || {};
        if (!storageBagId) {
            return [];
        }
        const buckets = await distributionBucketsCache.getBucketsByBagId(storageBagId);
        const nodes = buckets.flatMap((b) => b.nodes);
        if (clientLoc) {
            sortNodesByClosest(nodes, clientLoc);
        }
        else {
            nodes.sort(() => (lodash_1.default.random(0, 1) ? 1 : -1));
        }
        return nodes
            .slice(0, limit || nodes.length)
            .map((n) => (0, url_join_1.default)(n.endpoint, 'api/v1/assets/', objectId));
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => [String]),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StorageDataObject, Object]),
    __metadata("design:returntype", Promise)
], AssetsResolver.prototype, "resolvedUrls", null);
AssetsResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => StorageDataObject),
    __metadata("design:paramtypes", [Function])
], AssetsResolver);
exports.AssetsResolver = AssetsResolver;
//# sourceMappingURL=index.js.map