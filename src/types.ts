import { FollowsAggregate, ViewsAggregate } from './aggregates'

export type Aggregates = {
  viewsAggregate: ViewsAggregate
  followsAggregate: FollowsAggregate
}

export type OrionContext = {
  remoteHost?: string
  authorization?: string
} & Aggregates

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: Date
}

export type Maybe<T> = T | null

export type Video = {
  __typename?: 'Video'
  id: Scalars['ID']
  views?: Maybe<Scalars['Int']>
}

export type VideoEdge = {
  __typename?: 'VideoEdge'
  node: Video
  cursor: Scalars['String']
}

export type VideoConnection = {
  __typename?: 'VideoConnection'
  totalCount: number
  edges: VideoEdge[]
}

export type Channel = {
  __typename?: 'Channel'
  id: Scalars['ID']
  videos: Array<Video>
  follows?: Maybe<Scalars['Int']>
  views?: Maybe<Scalars['Int']>
}

export type ChannelEdge = {
  __typename?: 'ChannelEdge'
  node: Channel
  cursor: Scalars['String']
}

export type ChannelConnection = {
  __typename?: 'ChannelConnection'
  totalCount: number
  edges: ChannelEdge[]
}

export type SearchResult = Video | Channel

export type SearchFtsOutput = {
  __typename?: 'SearchFTSOutput'
  item: SearchResult
  rank: Scalars['Float']
  isTypeOf: Scalars['String']
  highlight: Scalars['String']
}
