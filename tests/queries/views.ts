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
export type GetVideoViews = {
  videoViews: EntityViewsInfo | null
}
export type GetVideoViewsArgs = {
  videoId: string
}

export const GET_CHANNEL_VIEWS = gql`
  query GetChannelViews($channelId: ID!) {
    channelViews(channelId: $channelId) {
      id
      views
    }
  }
`
export type GetChannelViews = {
  channelViews: EntityViewsInfo | null
}
export type GetChannelViewsArgs = {
  channelId: string
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
