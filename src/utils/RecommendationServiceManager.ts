import { User, Video } from '../model'
import { ApiClient, requests as ClientRequests } from 'recombee-api-client'
import { createLogger } from '@subsquid/logger'

type RSVideo = Pick<
  Video,
  | 'id'
  | 'duration'
  | 'categoryId'
  | 'commentsCount'
  | 'createdAt'
  | 'reactionsCount'
  | 'viewsNum'
  | 'channelId'
  | 'language'
  | 'title'
>

type RSUser = Pick<User, 'id'>

const recommendationServiceLogger = createLogger('recommendationsService')

export class RecommendationServiceManager {
  private _videosQueue: ClientRequests.SetItemValues[] = []
  private _usersQueue: ClientRequests.SetUserValues[] = []
  private _clickInteracionQueue: ClientRequests.AddDetailView[] = []
  private _viewPortionInteracionQueue: ClientRequests.SetViewPortion[] = []
  private _consumeInteracionQueue: ClientRequests.AddPurchase[] = []
  private _ratingInteracionQueue: ClientRequests.AddRating[] = []

  private client: ApiClient | null = null
  private _enabled = true

  constructor(databaseId?: string) {
    if (!process.env.RECOMMENDATION_SERVICE_PRIVATE_KEY || !databaseId) {
      recommendationServiceLogger.error(
        'RecommendationServiceManager initalized withour required variables'
      )
      return
    }
    this.client = new ApiClient(databaseId, process.env.RECOMMENDATION_SERVICE_PRIVATE_KEY, {
      region: 'eu-west',
    })
  }

  async scheduleVideoUpsert(video: RSVideo) {
    const actionObject = new ClientRequests.SetItemValues(
      video.id,
      {
        category_id: video.categoryId,
        channel_id: video.channelId,
        comments_count: video.commentsCount,
        duration: video.duration,
        language: video.language,
        reaction_count: video.reactionsCount,
        timestamp: video.createdAt.getTime(),
        title: video.title,
        views_num: video.viewsNum,
        // recombee only offers single items table, so it would be good to have type
        // in case we decide to add new type in the future, like NFT
        type: 'video',
      },
      {
        cascadeCreate: true,
      }
    )

    this._videosQueue.push(actionObject)

    if (this._videosQueue.length >= 100) {
      await this.sendBatchRequest(this._videosQueue)
      this._videosQueue.length = 0
    }
  }

  async scheduleUserUpsert(user: RSUser) {
    const actionObject = new ClientRequests.SetUserValues(
      user.id,
      {
        userId: user.id,
      },
      {
        cascadeCreate: true,
      }
    )

    this._usersQueue.push(actionObject)

    if (this._usersQueue.length >= 100) {
      await this.sendBatchRequest(this._usersQueue)
      this._usersQueue.length = 0
    }
  }

  // this interaction has big model value and should we used for
  // reliable interactions like video viewed in 90% or nft of given video bought
  async scheduleItemConsumed(itemId: string, userId: string, recommId?: string) {
    const actionObject = new ClientRequests.AddPurchase(userId, itemId, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
    })

    this._consumeInteracionQueue.push(actionObject)

    if (this._consumeInteracionQueue.length >= 50) {
      await this.sendBatchRequest(this._consumeInteracionQueue)
      this._consumeInteracionQueue.length = 0
    }
  }

  // this interaction should be dispatched when user clicks a video to see it
  async scheduleClickEvent(itemId: string, userId: string, duration?: number, recommId?: string) {
    const actionObject = new ClientRequests.AddDetailView(userId, itemId, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
      duration,
    })

    this._clickInteracionQueue.push(actionObject)

    if (this._clickInteracionQueue.length >= 50) {
      await this.sendBatchRequest(this._clickInteracionQueue)
      this._clickInteracionQueue.length = 0
    }
  }

  // this interaction is for user engagement level
  // in Orion it would state how long user has watched the video
  async scheduleViewPortion(itemId: string, userId: string, portion: number, recommId?: string) {
    const actionObject = new ClientRequests.SetViewPortion(userId, itemId, portion, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
    })

    this._viewPortionInteracionQueue.push(actionObject)

    if (this._viewPortionInteracionQueue.length >= 50) {
      await this.sendBatchRequest(this._viewPortionInteracionQueue)
      this._viewPortionInteracionQueue.length = 0
    }
  }

  async scheduleItemRating(itemId: string, userId: string, rating: number, recommId?: string) {
    if (rating < -1 || rating > 1) {
      throw new Error('Rating out of bounds')
    }
    const actionObject = new ClientRequests.AddRating(userId, itemId, rating, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
    })

    this._ratingInteracionQueue.push(actionObject)

    if (this._ratingInteracionQueue.length >= 50) {
      await this.sendBatchRequest(this._ratingInteracionQueue)
      this._ratingInteracionQueue.length = 0
    }
  }

  async enableSync() {
    this._ratingInteracionQueue.length = 0
    this._consumeInteracionQueue.length = 0
    this._clickInteracionQueue.length = 0
    this._viewPortionInteracionQueue.length = 0
    this._videosQueue.length = 0
    this._usersQueue.length = 0

    this._enabled = true
  }

  private async sendBatchRequest(requests: ClientRequests.Request[]) {
    if (!this._enabled) {
      return
    }
    return this.client?.send(new ClientRequests.Batch(requests))
  }
}

export const recommendationServiceManager = new RecommendationServiceManager(
  process.env.VIDEO_ITEM_DATABASE_ID
)
