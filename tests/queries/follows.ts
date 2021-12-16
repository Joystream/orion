import { gql } from 'apollo-server-express'
import { ChannelFollowsInfo } from '../../src/entities/ChannelFollowsInfo'
import { ChannelConnection } from '../../src/types'

export const GET_MOST_FOLLOWED_CHANNELS = gql`
  query GetMostFollowedChannels($timePeriodDays: Int!) {
    mostFollowedChannels(timePeriodDays: $timePeriodDays) {
      edges {
        node {
          id
          follows
        }
      }
    }
  }
`

export const GET_MOST_FOLLOWED_CHANNELS_ALL_TIME = gql`
  query GetMostFollowedChannelsAllTime($limit: Int!) {
    mostFollowedChannelsAllTime(limit: $limit) {
      edges {
        node {
          id
          follows
        }
      }
    }
  }
`

export type GetMostFollowedChannelsArgs = {
  timePeriodDays: number
}
export type GetMostFollowedChannels = {
  mostFollowedChannels: ChannelConnection
}
export type GetMostFollowedChannelsAllTime = {
  mostFollowedChannelsAllTime: ChannelConnection
}
export type GetMostFollowedChannelsAllTimeArgs = {
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
