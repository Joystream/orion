import { createLogger } from '@subsquid/logger'
import haversineDistance from 'haversine-distance'
import { random } from 'lodash'
import urljoin from 'url-join'

import { Coordinates, NodeData } from './types'
import { DistributionBucketsCache } from '.'

export const rootLogger = createLogger('api:assets')
export const locationLogger = rootLogger.child('location')

let distributionBucketsCache: DistributionBucketsCache
export async function getAssetUrls(
  objectId: string | undefined | null,
  bagId: string | undefined | null,
  { clientLoc, limit }: { clientLoc?: Coordinates; limit: number }
): Promise<string[]> {
  if (!objectId || !bagId) {
    return []
  }

  if (!distributionBucketsCache) {
    distributionBucketsCache = new DistributionBucketsCache()
    distributionBucketsCache.init(6000)
  }

  const buckets = distributionBucketsCache.getBucketsByBagId(bagId)
  const nodes = buckets.flatMap((b) => b.nodes)
  if (clientLoc) {
    sortNodesByClosest(nodes, clientLoc)
  } else {
    nodes.sort(() => (random(0, 1) ? 1 : -1))
  }

  return nodes
    .slice(0, limit || nodes.length)
    .map((n) => urljoin(n.endpoint, 'api/v1/assets/', objectId))
}

function getDistance(node: NodeData, clientLoc: Coordinates) {
  return node.location ? haversineDistance(clientLoc, node.location) : Infinity
}

function sortNodesByClosest(nodes: NodeData[], clientLoc: Coordinates): void {
  nodes.sort((nodeA, nodeB) => getDistance(nodeA, clientLoc) - getDistance(nodeB, clientLoc))
  nodes.forEach((n) => {
    locationLogger.trace(
      `Node: ${JSON.stringify(n)}, Client loc: ${JSON.stringify(
        clientLoc
      )}, Distance: ${getDistance(n, clientLoc)}`
    )
  })
}
