import { gql } from 'apollo-server-express'
import { ChannelFollowsInfo } from '../../src/entities/ChannelFollowsInfo'

export const GET_CHANNEL_FOLLOWS = gql`
  query GetChannelFollows($channelId: ID!) {
    channelFollows(channelId: $channelId) {
      id
      follows
    }
  }
`
export type GetChannelFollows = {
  channelFollows: ChannelFollowsInfo | null
}
export type GetChannelFollowsArgs = {
  channelId: string
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
