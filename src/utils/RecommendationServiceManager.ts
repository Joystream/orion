import { User, Video } from '../model'
import { ApiClient, requests as ClientRequests } from 'recombee-api-client'
import { createLogger } from '@subsquid/logger'
import { randomUUID } from 'crypto'
import { stringToHex } from '@polkadot/util'

export type RSVideo = Pick<
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

type CommonOptions = {
  limit?: number
  filterQuery?: string
}

const recommendationServiceLogger = createLogger('recommendationsService')

const isDevEnv = process.env.ORION_ENV === 'development'

export class RecommendationServiceManager {
  private _videosQueue: ClientRequests.SetItemValues[] = []
  private _videosDeleteQueue: ClientRequests.DeleteItem[] = []
  private _usersQueue: ClientRequests.SetUserValues[] = []
  private _interactionsQueue: ClientRequests.Request[] = []

  // this value will be decreased after export block is reached
  private _videoQueueMaxSize = 1_000
  private _usersQueueMaxSize = 100
  private _interactionsQueueMaxSize = 100

  private client: ApiClient | null = null

  // if orion is launched in dev mode, always sync videos
  private _enabled = isDevEnv

  constructor() {
    if (
      !process.env.RECOMMENDATION_SERVICE_PRIVATE_KEY ||
      !process.env.RECOMMENDATION_SERVICE_DATABASE
    ) {
      recommendationServiceLogger.error(
        'RecommendationServiceManager initalized without required variables'
      )
      return
    }
    this.client = new ApiClient(
      process.env.RECOMMENDATION_SERVICE_DATABASE,
      process.env.RECOMMENDATION_SERVICE_PRIVATE_KEY,
      {
        region: 'eu-west',
      }
    )
    recommendationServiceLogger.info(
      `RecommendationServiceManager initialized. Instance type: ${isDevEnv ? 'DEV' : 'PROD'}`
    )
  }

  async scheduleVideoUpsert(video: RSVideo) {
    // for dev env sync only up to 20k videos
    if (!this._enabled || (isDevEnv && Number(video.id) > 20_000)) {
      return
    }

    const actionObject = new ClientRequests.SetItemValues(
      video.id,
      {
        category_id: video.categoryId,
        channel_id: video.channelId,
        comments_count: video.commentsCount,
        duration: video.duration,
        language: video.language,
        reactions_count: video.reactionsCount,
        timestamp: new Date(video.createdAt),
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

    if (this._videosQueue.length >= this._videoQueueMaxSize) {
      await this.sendBatchRequest(this._videosQueue)
      this._videosQueue.length = 0
    }
  }

  async scheduleUserUpsert(user: RSUser) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.SetUserValues(
      this.mapUserId(user.id),
      {},
      {
        cascadeCreate: true,
      }
    )

    this._usersQueue.push(actionObject)

    if (this._usersQueue.length >= this._usersQueueMaxSize) {
      await this.sendBatchRequest(this._usersQueue)
      this._usersQueue.length = 0
    }
  }

  // this interaction has big model value and should we used for
  // reliable interactions like video viewed in 90% or nft of given video bought
  async scheduleItemConsumed(itemId: string, userId: string, recommId?: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.AddPurchase(this.mapUserId(userId), itemId, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
    })

    this._interactionsQueue.push(actionObject)

    if (this._interactionsQueue.length >= this._interactionsQueueMaxSize) {
      await this.sendBatchRequest(this._interactionsQueue)
      this._interactionsQueue.length = 0
    }
  }

  // this interaction should be dispatched when user clicks a video to see it
  async scheduleClickEvent(itemId: string, userId: string, duration?: number, recommId?: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.AddDetailView(this.mapUserId(userId), itemId, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
      duration,
    })

    this._interactionsQueue.push(actionObject)

    if (this._interactionsQueue.length >= this._interactionsQueueMaxSize) {
      await this.sendBatchRequest(this._interactionsQueue)
      this._interactionsQueue.length = 0
    }
  }

  // this interaction is for user engagement level
  // in Orion it would state how long user has watched the video
  async scheduleViewPortion(itemId: string, userId: string, portion: number, recommId?: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.SetViewPortion(userId, itemId, portion, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
    })

    this._interactionsQueue.push(actionObject)

    if (this._interactionsQueue.length >= this._interactionsQueueMaxSize) {
      await this.sendBatchRequest(this._interactionsQueue)
      this._interactionsQueue.length = 0
    }
  }

  async scheduleItemRating(itemId: string, userId: string, rating: number, recommId?: string) {
    if (!this._enabled) {
      return
    }

    if (rating < -1 || rating > 1) {
      throw new Error('Rating out of bounds')
    }
    const actionObject = new ClientRequests.AddRating(userId, itemId, rating, {
      timestamp: Date.now(),
      // this event is synced through processor - false will make sure to avoid creating unsynced videos
      // in recommendation system for dev instance which only sync 20k videos
      cascadeCreate: false,
      recommId,
    })

    this._interactionsQueue.push(actionObject)

    if (this._interactionsQueue.length >= this._interactionsQueueMaxSize) {
      await this.sendBatchRequest(this._interactionsQueue)
      this._interactionsQueue.length = 0
    }
  }

  async deleteItemRating(itemId: string, userId: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.DeleteRating(userId, itemId)

    this._interactionsQueue.push(actionObject)

    if (this._interactionsQueue.length >= this._interactionsQueueMaxSize) {
      await this.sendBatchRequest(this._interactionsQueue)
      this._interactionsQueue.length = 0
    }
  }

  enableSync() {
    this._enabled = true
  }

  setMaxVideoQueueSize(size: number) {
    this._videoQueueMaxSize = size
  }

  private async sendBatchRequest(requests: ClientRequests.Request[]) {
    if (!this._enabled) {
      return
    }
    const res = await this.client?.send(new ClientRequests.Batch(requests))
    recommendationServiceLogger.info(`Batch request sent, response: ${JSON.stringify(res)}`)
    return res
  }

  mapUserId(orionUserId: string) {
    return stringToHex(orionUserId)
  }

  get isEnabled() {
    return this._enabled
  }

  async recommendItemsToUser(userId?: string, opts?: CommonOptions) {
    recommendationServiceLogger.info(
      `Getting items recommendations to ${userId || 'empty user'}(${this.mapUserId(userId ?? '')})`
    )
    const request = new ClientRequests.RecommendItemsToUser(
      userId ? this.mapUserId(userId) : randomUUID(),
      opts?.limit ?? 10,
      {
        scenario: 'homepage',
        minRelevance: 'low',
        rotationRate: 0.1,
        cascadeCreate: true,
        filter: opts?.filterQuery,
      }
    )

    return this.client?.send(request)
  }

  async recommendNextItems(recommId: string, opts?: CommonOptions) {
    const request = new ClientRequests.RecommendNextItems(recommId, opts?.limit ?? 10)
    return this.client?.send(request)
  }

  async recommendItemsToItem(itemId: string, userId?: string, opts?: CommonOptions) {
    const request = new ClientRequests.RecommendItemsToItem(
      itemId,
      userId ? this.mapUserId(userId) : randomUUID(),
      opts?.limit ?? 10,
      {
        scenario: 'watch-next',
        minRelevance: 'medium',
        rotationRate: 0.2,
        cascadeCreate: true,
        filter: opts?.filterQuery,
      }
    )
    return this.client?.send(request)
  }

  async scheduleVideoDeletion(videoId: string) {
    const actionObject = new ClientRequests.DeleteItem(videoId)

    this._videosDeleteQueue.push(actionObject)

    if (this._videosDeleteQueue.length >= 1000) {
      await this.sendBatchRequest(this._videosDeleteQueue)
      this._videosDeleteQueue.length = 0
    }
  }
}

export const recommendationServiceManager = new RecommendationServiceManager()
