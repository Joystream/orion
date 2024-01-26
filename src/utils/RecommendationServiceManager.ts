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
  private _queue: ClientRequests.Request[] = []
  private client: ApiClient | null = null

  // if orion is launched in dev mode, always sync videos
  private _enabled = false
  private _loopInitialized = false

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

  scheduleVideoUpsert(video: RSVideo) {
    // for dev env sync only up to 20k videos
    if (!this._enabled || (isDevEnv && Number(video.id) > 20_000)) {
      return
    }

    const actionObject = new ClientRequests.SetItemValues(
      `${video.id}-video`,
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
    this._queue.push(actionObject)
  }

  scheduleVideoDeletion(videoId: string) {
    const actionObject = new ClientRequests.DeleteItem(videoId)
    this._queue.push(actionObject)
  }

  scheduleUserUpsert(user: RSUser) {
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
    this._queue.push(actionObject)
  }

  // this interaction has big model value and should we used for
  // reliable interactions like video viewed in 90% or nft of given video bought
  scheduleItemConsumed(itemId: string, userId: string, recommId?: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.AddPurchase(this.mapUserId(userId), itemId, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
    })
    this._queue.push(actionObject)
  }

  // this interaction should be dispatched when user clicks a video to see it
  scheduleClickEvent(itemId: string, userId: string, duration?: number, recommId?: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.AddDetailView(this.mapUserId(userId), itemId, {
      timestamp: Date.now(),
      cascadeCreate: true,
      recommId,
      duration,
    })
    this._queue.push(actionObject)
  }

  // this interaction is for user engagement level
  // in Orion it would state how long user has watched the video
  scheduleViewPortion(itemId: string, userId: string, portion: number, recommId?: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.SetViewPortion(
      this.mapUserId(userId),
      itemId,
      portion,
      {
        timestamp: Date.now(),
        cascadeCreate: true,
        recommId,
      }
    )
    this._queue.push(actionObject)
  }

  scheduleItemRating(itemId: string, userId: string, rating: number, recommId?: string) {
    if (!this._enabled) {
      return
    }

    if (rating < -1 || rating > 1) {
      throw new Error('Rating out of bounds')
    }
    const actionObject = new ClientRequests.AddRating(this.mapUserId(userId), itemId, rating, {
      timestamp: Date.now(),
      cascadeCreate: !isDevEnv,
      recommId,
    })
    this._queue.push(actionObject)
  }

  deleteItemRating(itemId: string, userId: string) {
    if (!this._enabled) {
      return
    }

    const actionObject = new ClientRequests.DeleteRating(userId, itemId)
    this._queue.push(actionObject)
  }

  enableSync() {
    this._enabled = true
  }

  private async sendBatchRequest(requests: ClientRequests.Request[]) {
    if (!this._enabled || !this.client) {
      return
    }
    const res = await this.client.send(new ClientRequests.Batch(requests))
    recommendationServiceLogger.info(`Batch request sent, response: ${JSON.stringify(res)}`)
    return res
  }

  mapUserId(orionUserId: string) {
    return stringToHex(orionUserId)
  }

  // template "{id}-video"
  systemItemIdToOrion(systemId: string) {
    return systemId.split('-')[0]
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
        filter: opts?.filterQuery || undefined,
      }
    )
    const res = await this.client?.send(request)

    if (!res) {
      return undefined
    }

    const mappedRecoms = res.recomms.map((recom) => ({
      ...recom,
      id: this.systemItemIdToOrion(recom.id),
    }))

    return {
      ...res,
      recomms: mappedRecoms,
    }
  }

  async recommendNextItems(recommId: string, opts?: CommonOptions) {
    const request = new ClientRequests.RecommendNextItems(recommId, opts?.limit ?? 10)
    const res = await this.client?.send(request)
    if (!res) {
      return undefined
    }

    const mappedRecoms = res.recomms.map((recom) => ({
      ...recom,
      id: this.systemItemIdToOrion(recom.id),
    }))

    return {
      ...res,
      recomms: mappedRecoms,
    }
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
        filter: opts?.filterQuery || undefined,
      }
    )

    const res = await this.client?.send(request)

    if (!res) {
      return undefined
    }

    const mappedRecoms = res.recomms.map((recom) => ({
      ...recom,
      id: this.systemItemIdToOrion(recom.id),
    }))

    return {
      ...res,
      recomms: mappedRecoms,
    }
  }

  initBatchLoop() {
    if (this._loopInitialized) {
      throw new Error('update loop was initialized more than once')
    }
    this._loopInitialized = true
    this._batchUpdateLoop(30 * 1_000) // 5mins
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  private async _batchUpdateLoop(intervalMs: number): Promise<void> {
    while (true) {
      if (this._queue.length) {
        const batchArray = [...this._queue]
        this._queue.length = 0
        await this.sendBatchRequest(batchArray)
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}

export const recommendationServiceManager = new RecommendationServiceManager()
