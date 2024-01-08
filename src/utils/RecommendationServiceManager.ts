import { Account, User, Video } from '../model'

type RSVideo = Pick<
  Video,
  'duration' | 'categoryId' | 'commentsCount' | 'createdAt' | 'reactionsCount' | 'viewsNum'
>

type RSUser = Pick<User, 'id'>

type InteractionEventType = 'watch' | 'click' | 'like' | 'comment'

type RSInteraction = {
  userId: string
  itemId: string
  timestamp: number
  eventType: InteractionEventType
}

class RecommendationServiceManager {
  async updateVideo(videoId: string, params: Partial<RSVideo>) {
    /**/
  }

  async newVideo(videoId: string, params: RSVideo) {
    /**/
  }

  async newUser(user: RSUser) {
    /**/
  }
}
