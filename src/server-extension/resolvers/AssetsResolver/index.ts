import { FieldResolver, Root, ObjectType, Field, Resolver, Ctx } from 'type-graphql'
import { EntityManager } from 'typeorm'
import {
  StorageDataObject as DataObjectEntity,
  DistributionBucket,
  DistributionBucketOperatorMetadata,
  DistributionBucketOperatorStatus,
} from '../../../model'
import _ from 'lodash'
import { getEm } from '../../orm'
import { performance } from 'perf_hooks'
import urljoin from 'url-join'
import { Context } from '@subsquid/openreader/lib/context'
import haversineDistance from 'haversine-distance'
import { createLogger, Logger } from '@subsquid/logger'

const rootLogger = createLogger('api:assets')

type Coordinates = {
  lat: number
  lon: number
}
type NodeData = {
  location?: Coordinates
  endpoint: string
}

type DistributionBucketCachedData = {
  nodes: NodeData[]
}

type DistributionBucketIdsByBagId = Map<string, string[]>
type BucketsById = Map<string, DistributionBucketCachedData>

class DistributionBucketsCache {
  protected bucketIdsByBagId: DistributionBucketIdsByBagId
  protected bucketsById: BucketsById
  protected em: EntityManager
  protected logger: Logger

  constructor() {
    this.logger = rootLogger.child('buckets-cache')
  }

  public init(intervalMs: number): void {
    this.logger.info(`Initializing distribution buckets cache with ${intervalMs}ms interval...`)
    this.updateLoop(intervalMs)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  public getBucketsByBagId(bagId: string): DistributionBucketCachedData[] {
    const bucketIds = this.bucketIdsByBagId.get(bagId) || []
    return bucketIds.flatMap((id) => {
      const bucket = this.bucketsById.get(id)
      return bucket ? [bucket] : []
    })
  }

  private async updateLoop(intervalMs: number): Promise<void> {
    this.em = await getEm()
    while (true) {
      try {
        this.logger.debug('Reloading distribution buckets and bags cache data...')
        const start = performance.now()
        await this.loadData()
        this.logger.debug(
          `Reloading distribution buckets and bags cache data took ${(
            performance.now() - start
          ).toFixed(2)}ms`
        )
        this.logger.debug(`Buckets cached: ${this.bucketsById.size}`)
        this.logger.debug(`Bags cached: ${this.bucketIdsByBagId.size}`)
      } catch (e) {
        this.logger.error(`Cannot reload the cache: ${e instanceof Error ? e.message : ''}`)
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  private resolveBucketData(
    bucket: DistributionBucket,
    operatorsMeta: _.Dictionary<DistributionBucketOperatorMetadata[]>
  ): DistributionBucketCachedData {
    const nodes = bucket.operators
      .filter((o) => o.status === DistributionBucketOperatorStatus.ACTIVE)
      .flatMap((o) => {
        const [operatorMetadata] = operatorsMeta[o.id]
        const { nodeEndpoint: endpoint, nodeLocation } = operatorMetadata || {}
        const [lat, lon] = [
          nodeLocation?.coordinates?.latitude,
          nodeLocation?.coordinates?.longitude,
        ]
        const location = isValidLat(lat) && isValidLon(lon) ? { lat, lon } : undefined
        return endpoint
          ? [
              {
                endpoint,
                location,
              },
            ]
          : []
      })
    return { nodes }
  }

  private async loadData() {
    const bucketIdsByBagId: DistributionBucketIdsByBagId = new Map()
    const bucketsById: BucketsById = new Map()

    // We use .query() here instead of .find() for improved performance
    const bagToBucketsStart = performance.now()
    const bagToBuckets: { distribution_bucket_id: string; bag_id: string }[] = await this.em.query(
      'SELECT distribution_bucket_id, bag_id FROM distribution_bucket_bag'
    )
    this.logger.debug(
      `Found ${bagToBuckets.length} bucket-to-bag connections (took: ${(
        performance.now() - bagToBucketsStart
      ).toFixed(2)}ms)`
    )

    const distributionBucketsStart = performance.now()
    const distributionBuckets = await this.em.getRepository(DistributionBucket).find({
      where: {
        distributing: true,
      },
      relations: ['operators'],
    })
    this.logger.debug(
      `Found ${distributionBuckets.length} distribution buckets (took: ${(
        performance.now() - distributionBucketsStart
      ).toFixed(2)}ms)`
    )

    const operatorsMetaStart = performance.now()
    const operatorsMeta = _.groupBy(
      await this.em.getRepository(DistributionBucketOperatorMetadata).find(),
      (e) => e.distirbutionBucketOperatorId
    )
    this.logger.debug(
      `Found ${
        Object.keys(operatorsMeta).length
      } instances of distribution bucket operator metadata (took: ${(
        performance.now() - operatorsMetaStart
      ).toFixed(2)}ms)`
    )

    for (const { bag_id: bagId, distribution_bucket_id: distributionBucketId } of bagToBuckets) {
      const distributionBucket = distributionBuckets.find((b) => b.id === distributionBucketId)
      if (distributionBucket && distributionBucketId && bagId) {
        // Update DistributionBucketIdsByBagId
        const bucketIds = bucketIdsByBagId.get(bagId) || []
        bucketIds.push(distributionBucketId)
        bucketIdsByBagId.set(bagId, bucketIds)

        // Update BucketsById if the bucket not already loaded
        if (!bucketsById.get(distributionBucketId)) {
          const bucketData = this.resolveBucketData(distributionBucket, operatorsMeta)
          if (bucketData.nodes.length) {
            bucketsById.set(distributionBucketId, bucketData)
          }
        }
      }
    }

    this.bucketsById = bucketsById
    this.bucketIdsByBagId = bucketIdsByBagId
  }
}

const distributionBucketsCache = new DistributionBucketsCache()
distributionBucketsCache.init(6000)

const locationLogger = rootLogger.child('location')

function isValidLat(lat: number | undefined): lat is number {
  if (lat === undefined) {
    return false
  }
  return !Number.isNaN(lat) && lat >= -90 && lat <= 90
}

function isValidLon(lon: number | undefined): lon is number {
  if (lon === undefined) {
    return false
  }
  return !Number.isNaN(lon) && lon >= -180 && lon <= 180
}

type NodeWithDistance = { node: NodeData; distance: number }
function findClosestNode(nodes: NodeData[], clientLoc: Coordinates): NodeWithDistance | undefined {
  const closestNode = nodes.reduce(
    (lowestDistNode: NodeWithDistance | undefined, node: NodeData) => {
      const distance = node.location ? haversineDistance(clientLoc, node.location) : Infinity
      locationLogger.trace(
        `Node: ${JSON.stringify(node)}, Client loc: ${JSON.stringify(
          clientLoc
        )}, Distance: ${distance}`
      )
      if (!lowestDistNode || distance < lowestDistNode.distance) {
        return { node, distance }
      }
      return lowestDistNode
    },
    undefined
  )
  if (closestNode) {
    locationLogger.debug(
      `Closest node to client (${JSON.stringify(clientLoc)}) found: ${JSON.stringify(closestNode)}`
    )
  }
  return closestNode
}

function getClientLoc(ctx: Context): Coordinates | undefined {
  const clientLoc = ctx.req.headers['x-client-loc']
  if (typeof clientLoc !== 'string') {
    return
  }
  const [latStr, lonStr] = clientLoc.split(',')
  const lat = parseFloat(latStr)
  const lon = parseFloat(lonStr)
  if (!isValidLat(lat) || !isValidLon(lon)) {
    return
  }
  locationLogger.debug(`Client location resolved: ${JSON.stringify({ lat, lon })}`)
  return { lat, lon }
}

@ObjectType()
export class StorageDataObject {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  resolvedUrl: string
}

@Resolver(() => StorageDataObject)
export class AssetsResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @FieldResolver()
  async resolvedUrl(
    @Root() object: StorageDataObject,
    @Ctx() ctx: Context
  ): Promise<string | undefined> {
    const em = await this.em()
    const clientLoc = await getClientLoc(ctx)
    // The resolvedUrl field is initially populated with the object ID
    const objectId = object.resolvedUrl
    if (!objectId) {
      return
    }
    const { storageBagId } =
      (await em.getRepository(DataObjectEntity).findOneBy({ id: objectId })) || {}
    if (!storageBagId) {
      return
    }
    const buckets = await distributionBucketsCache.getBucketsByBagId(storageBagId)
    const nodes = buckets.flatMap((b) => b.nodes)
    const chosenEndpoint = clientLoc
      ? findClosestNode(nodes, clientLoc)?.node.endpoint
      : _.sample(nodes)?.endpoint

    return chosenEndpoint && urljoin(chosenEndpoint, 'api/v1/assets/', objectId)
  }
}
