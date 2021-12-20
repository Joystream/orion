import { gql } from 'apollo-server-express'
import { ChannelFollowsInfo } from '../../src/entities/ChannelFollowsInfo'
import { ChannelConnection } from '../../src/types'

export const GET_MOST_FOLLOWED_CHANNELS_CONNECTION = gql`
  query GetMostFollowedChannelsConnection($periodDays: Int, $limit: Int!) {
    mostFollowedChannelsConnection(periodDays: $periodDays, limit: $limit) {
      edges {
        node {
          id
          follows
        }
      }
    }
  }
`
export type GetMostFollowedChannelsConnection = {
  mostFollowedChannelsConnection: ChannelConnection
}
export type GetMostFollowedChannelsConnectionArgs = {
  periodDays: number | null
  limit: number
}

export const FOLLOW_CHANNEL = gql`
  mutation FollowChannel($channelId: ID!) {
    followChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export const UNFOLLOW_CHANNEL = gql`
  mutation FollowChannel($channelId: ID!) {
    unfollowChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export type FollowChannel = {
  followChannel: ChannelFollowsInfo
}
export type FollowChannelArgs = {
  channelId: string
}
export type UnfollowChannel = {
  unfollowChannel: ChannelFollowsInfo
}
export type UnfollowChannelArgs = FollowChannelArgs
