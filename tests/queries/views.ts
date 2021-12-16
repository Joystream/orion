import { gql } from 'apollo-server-express'
import { EntityViewsInfo } from '../../src/entities/EntityViewsInfo'
import { ChannelConnection, VideoConnection } from '../../src/types'

export const GET_MOST_VIEWED_VIDEOS = gql`
  query GetMostViewedVideos($timePeriodDays: Int!) {
    mostViewedVideos(timePeriodDays: $timePeriodDays) {
      edges {
        node {
          id
          views
        }
      }
    }
  }
`

export const GET_MOST_VIEWED_VIDEOS_ALL_TIME = gql`
  query GetMostViewedVideosAllTime($limit: Int!) {
    mostViewedVideosAllTime(limit: $limit) {
      edges {
        node {
          id
          views
        }
      }
    }
  }
`

export type GetMostViewedVideos = {
  mostViewedVideos: VideoConnection
}
export type GetMostViewedVideosArgs = {
  timePeriodDays: number
}
export type GetMostViewedVideosAllTimeArgs = {
  limit: number
}
export type GetMostViewedVideosAllTime = {
  mostViewedVideosAllTime: VideoConnection
}

export const GET_MOST_VIEWED_CHANNELS = gql`
  query GetMostViewedChannels($timePeriodDays: Int!) {
    mostViewedChannels(timePeriodDays: $timePeriodDays) {
      edges {
        node {
          id
          views
        }
      }
    }
  }
`

export const GET_MOST_VIEWED_CHANNELS_ALL_TIME = gql`
  query GetMostViewedVideosAllTime($limit: Int!) {
    mostViewedChannelsAllTime(limit: $limit) {
      edges {
        node {
          id
          views
        }
      }
    }
  }
`
export type GetMostViewedChannels = {
  mostViewedChannels: ChannelConnection
}

export type GetMostViewedChannelsArgs = {
  timePeriodDays: number
}
export type GetMostViewedChannelsAllTimeArgs = {
  limit: number
}
export type GetMostViewedChannelsAllTime = {
  mostViewedChannelsAllTime: ChannelConnection
}

export const GET_MOST_VIEWED_CATEGORIES = gql`
  query GetMostViewedCategories($timePeriodDays: Int!) {
    mostViewedCategories(timePeriodDays: $timePeriodDays) {
      id
      views
    }
  }
`

export const GET_MOST_VIEWED_CATEGORIES_ALL_TIME = gql`
  query GetMostViewedVideosAllTime($limit: Int!) {
    mostViewedCategoriesAllTime(limit: $limit) {
      id
      views
    }
  }
`
export type GetMostViewedCategories = {
  mostViewedCategories: EntityViewsInfo[]
}
export type GetMostViewedCategoriesArgs = {
  timePeriodDays: number
}
export type GetMostViewedCategoriesAllTimeArgs = {
  limit: number
}
export type GetMostViewedCategoriesAllTime = {
  mostViewedCategoriesAllTime: EntityViewsInfo[]
}

export const ADD_VIDEO_VIEW = gql`
  mutation AddVideoView($videoId: ID!, $channelId: ID!, $categoryId: ID) {
    addVideoView(videoId: $videoId, channelId: $channelId, categoryId: $categoryId) {
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
  categoryId?: string
}
