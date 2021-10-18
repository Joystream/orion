import { gql } from 'apollo-server-express'
import { FeaturedVideo, VideoHero } from '../../src/models/FeaturedContent'
import { CategoryFeaturedVideos } from '../../src/entities/CategoryFeaturedVideos'

export const GET_VIDEO_HERO = gql`
  query GetVideoHero {
    videoHero {
      heroTitle
      heroVideoCutUrl
      videoId
    }
  }
`
export type GetVideoHero = {
  videoHero: VideoHero | null
}

export const GET_CATEGORY_FEATURED_VIDEOS = gql`
  query GetCategoryFeaturedVideos($categoryId: ID!) {
    categoryFeaturedVideos(categoryId: $categoryId) {
      videoId
      videoCutUrl
    }
  }
`
export type GetCategoryFeaturedVideos = {
  categoryFeaturedVideos: FeaturedVideo[] | null
}
export type GetCategoryFeaturedVideosArgs = {
  categoryId: string
}

export const GET_ALL_CATEGORIES_FEATURED_VIDEOS = gql`
  query GetAllCategoriesFeaturedVideos {
    allCategoriesFeaturedVideos {
      categoryId
      videos {
        videoId
        videoCutUrl
      }
    }
  }
`
export type GetAllCategoriesFeaturedVideos = {
  allCategoriesFeaturedVideos: CategoryFeaturedVideos[] | null
}

export const SET_VIDEO_HERO = gql`
  mutation SetVideoHero($videoId: ID!, $heroTitle: String!, $heroVideoCutUrl: String!) {
    setVideoHero(videoId: $videoId, heroTitle: $heroTitle, heroVideoCutUrl: $heroVideoCutUrl) {
      videoId
      heroTitle
      heroVideoCutUrl
    }
  }
`
export type SetVideoHero = {
  setVideoHero: VideoHero
}
export type SetVideoHeroArgs = {
  videoId: string
  heroTitle: string
  heroVideoCutUrl: string
}

export const SET_CATEGORY_FEATURED_VIDEOS = gql`
  mutation SetCategoryFeaturedVideos($categoryId: ID!, $videos: [FeaturedVideoInput!]!) {
    setCategoryFeaturedVideos(categoryId: $categoryId, videos: $videos) {
      videoId
      videoCutUrl
    }
  }
`
export type SetCategoryFeaturedVideos = {
  setCategoryFeaturedVideos: FeaturedVideo[]
}
export type SetCategoryFeaturedVideosArgs = {
  categoryId: string
  videos: FeaturedVideo[]
}
