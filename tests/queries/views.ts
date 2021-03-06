import { gql } from 'apollo-server-express'
import { EntityViewsInfo } from '../../src/entities/EntityViewsInfo'

export const GET_VIDEO_VIEWS = gql`
  query GetVideoViews($videoId: ID!) {
    videoViews(videoId: $videoId) {
      id
      views
    }
  }
`

export const GET_MOST_VIEWED_VIDEOS = gql`
  query GetMostViewedVideos($period: Int) {
    mostViewedVideos(period: $period) {
      id
      views
    }
  }
`
export type GetVideoViews = {
  videoViews: EntityViewsInfo | null
}
export type GetMostViewedVideos = {
  mostViewedVideos: EntityViewsInfo[]
}
export type GetVideoViewsArgs = {
  videoId: string
}
export type GetMostViewedVideosArgs = {
  period?: number
}

export const GET_CHANNEL_VIEWS = gql`
  query GetChannelViews($channelId: ID!) {
    channelViews(channelId: $channelId) {
      id
      views
    }
  }
`

export const GET_MOST_VIEWED_CHANNELS = gql`
  query GetMostViewedChannels($period: Int) {
    mostViewedChannels(period: $period) {
      id
      views
    }
  }
`
export type GetChannelViews = {
  channelViews: EntityViewsInfo | null
}
export type GetMostViewedChannels = {
  mostViewedChannels: EntityViewsInfo[]
}
export type GetChannelViewsArgs = {
  channelId: string
}
export type GetMostViewedChannelsArgs = {
  period?: number
}

export const ADD_VIDEO_VIEW = gql`
  mutation AddVideoView($videoId: ID!, $channelId: ID!) {
    addVideoView(videoId: $videoId, channelId: $channelId) {
      id
      views
    }
  }
`
export type AddVideoView = {
  addVideoView: EntityViewsInfo
}
export type AddVideoViewArgs = {
  videoId: string
  channelId: string
}
