export type Coordinates = {
  lat: number
  lon: number
}
export type NodeData = {
  location?: Coordinates
  endpoint: string
}

export type DistributionBucketCachedData = {
  nodes: NodeData[]
}

export type DistributionBucketIdsByBagId = Map<string, string[]>
export type BucketsById = Map<string, DistributionBucketCachedData>
