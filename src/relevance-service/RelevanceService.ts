import { EntityManager } from 'typeorm'
import { createLogger, Logger } from '@subsquid/logger'
import _ from 'lodash'
import { ChannelIdsBatch, RelevanceQueueConsumer } from './RelevanceQueue'
import { RelevanceServiceConfig, RelevanceWeights } from '../utils/config'

export const SECONDS_PER_DAY = 60 * 60 * 24

// TODO: Make it configurable
const MIN_PERCENTILE_TO_RATE = new Map([
  [0.25, 0.15], // top 75%
  [0.5, 0.3], // top 50%
  [0.75, 0.45], // top 25%
  [0.9, 0.6], // top 10%
  [0.95, 0.75], // top 5%
  [0.975, 0.9], // top 2.5%
  [0.99, 1], // top 1%
])

type PercentileStats = {
  crtLiquidity: number[]
  crtVolume: number[]
  channelFollowers: number[]
  channelRevenue: number[]
  videoViews: number[]
  videoComments: number[]
  videoReactions: number[]
}

export class RelevanceService {
  // The background queue is populated periodically with all existing channels
  // and has a lower priority. It's used to update relevances due to passage of time and/or
  // system-wide changes.
  private backgroundQueue: Set<string> = new Set()
  // Percentile stats used for calculating channel and video relevances
  private percentileStats?: PercentileStats

  private running = false
  private logger: Logger

  constructor(
    private em: EntityManager,
    private priorityQueue: RelevanceQueueConsumer,
    private config: RelevanceServiceConfig,
    private weights: RelevanceWeights
  ) {
    this.logger = createLogger('relevance-manager')
  }

  async run(): Promise<void> {
    if (this.running) {
      throw new Error('VideoRelevanceManager is already running')
    }

    await this.updatePercentileStats()

    this.runPopulateBackgroundQueueLoop().catch((err) => {
      this.logger.error(err, 'Background loop terminated')
      process.exit(-1)
    })

    this.runUpdateLoop().catch((err) => {
      this.logger.error(err, 'Update loop terminated')
      process.exit(-1)
    })
  }

  private async getChannelsToUpdate(): Promise<ChannelIdsBatch> {
    const { channelsPerIteration } = this.config
    const { channelIds: priorityChannels, ack } = await this.priorityQueue.getChannelsBatch(
      channelsPerIteration
    )
    const backgroundQueue = Array.from(this.backgroundQueue)
    const backgroundChunkSize = Math.max(0, channelsPerIteration - priorityChannels.length)
    const backgroundChannels = backgroundQueue.slice(0, backgroundChunkSize)
    this.backgroundQueue = new Set(backgroundQueue.slice(backgroundChunkSize))
    return { channelIds: priorityChannels.concat(backgroundChannels), ack }
  }

  private rateQuery(column: string, cutoffs: number[]) {
    const rates = Array.from(MIN_PERCENTILE_TO_RATE.values())
    const cutoffsWithRates = cutoffs.map((cutoff, i) => ({
      cutoff,
      rate: rates[i],
    }))
    const conditions = _.sortBy(cutoffsWithRates, (r) => -r.rate).map(
      ({ cutoff, rate }) => `WHEN ${column} >= ${cutoff} THEN ${rate}`
    )
    return `(
      CASE
        ${conditions.join('\n')}
        ELSE 0
      END
    )`
  }

  private async getVideosToRate(channelId: string): Promise<string[]> {
    const result = await this.em.query(
      `SELECT id FROM video WHERE channel_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [channelId, this.config.videosPerChannelLimit]
    )
    return result.map((row: { id: string }) => row.id)
  }

  private channelYppTierRateQuery() {
    // TODO: Make the rates configurable
    return `(
      CASE
        WHEN channel.ypp_status->>'tier' = 'BRONZE' THEN 0.125
        WHEN channel.ypp_status->>'tier' = 'SILVER' THEN 0.25
        WHEN channel.ypp_status->>'tier' = 'GOLD' THEN 0.5
        WHEN channel.ypp_status->>'tier' = 'DIAMOND' THEN 1
        ELSE 0
      END
    )`
  }

  private async updateChannelWeights(channelIds: string[]): Promise<void> {
    if (!this.percentileStats) {
      this.logger.warn('Percentile stats missing, skipping channel weights update')
      return
    }
    this.logger.info(`Updating weights of ${channelIds.length} channels`)
    const { percentileStats } = this
    const { crtLiquidityWeight, crtVolumeWeight, followersWeight, revenueWeight, yppTierWeight } =
      this.weights.channel
    await this.em.transaction(async (em) => {
      // Acquire the row locks first in a predictable order
      await em.query(
        `SELECT id FROM curator.channel WHERE id = ANY($1) ORDER BY id ASC FOR UPDATE`,
        [channelIds]
      )
      // Execute the update
      await em.query(
        `
        WITH channels_with_rates AS (
          SELECT
            channel.id AS channel_id,
            ${this.rateQuery(
              'channel.follows_num',
              percentileStats.channelFollowers
            )} AS follows_num_rate,
            ${this.rateQuery(
              'channel.cumulative_revenue',
              percentileStats.channelRevenue
            )} AS cumulative_revenue_rate,
            ${this.rateQuery('mt.liquidity', percentileStats.crtLiquidity)} AS liquidity_rate,
            ${this.rateQuery('mt.amm_volume', percentileStats.crtVolume)} AS volume_rate,
            ${this.channelYppTierRateQuery()} AS ypp_rate
          FROM curator.channel
          LEFT JOIN public.marketplace_token mt ON mt.channel_id = channel.id
          WHERE channel.id = ANY($1)
        )
        UPDATE
          curator.channel
        SET
          channel_weight = 1 + (
            cwr.follows_num_rate * ${followersWeight} +
            cwr.cumulative_revenue_rate * ${revenueWeight} +
            cwr.liquidity_rate * ${crtLiquidityWeight} +
            cwr.volume_rate * ${crtVolumeWeight} +
            cwr.ypp_rate * ${yppTierWeight}
          )
        FROM
          channels_with_rates cwr
        WHERE
          channel.id = cwr.channel_id
        `,
        [channelIds]
      )
    })
  }

  private videoAgeRateQuery() {
    const { ageScoreHalvingDays } = this.config
    const { joystreamAgeWeight, youtubeAgeWeight } = this.weights.video.ageSubWeights
    const weightedTimestamp = `
      (
        EXTRACT(EPOCH FROM video.created_at) * ${joystreamAgeWeight} +
        CASE
          WHEN (
            video.yt_video_id IS NOT NULL
            AND video.published_before_joystream IS NOT NULL
            AND video.published_before_joystream < now()
          ) THEN EXTRACT(EPOCH FROM video.published_before_joystream)
          ELSE EXTRACT(EPOCH FROM video.created_at)
        END * ${youtubeAgeWeight}
      )`
    const weightedAgeDays = `((EXTRACT(EPOCH FROM now()) - ${weightedTimestamp}) / ${SECONDS_PER_DAY})`
    return `(1 / POWER(2, ${weightedAgeDays} / ${ageScoreHalvingDays}))`
  }

  private videoRelevanceFormula(alias: string) {
    const { ageWeight, viewsWeight, commentsWeight, reactionsWeight } = this.weights.video
    return `(
      ${alias}.channel_weight * (
        ${alias}.age_rate * ${ageWeight} +
        ${alias}.views_num_rate * ${viewsWeight} +
        ${alias}.comments_count_rate * ${commentsWeight} +
        ${alias}.reactions_count_rate * ${reactionsWeight}
      )
    )`
  }

  private async updateVideoRelevances(channelIds: string[]): Promise<void> {
    if (!this.percentileStats) {
      this.logger.warn('Percentile stats missing, skipping video relevances update')
      return
    }
    const {
      percentileStats,
      config: { videosPerChannelSelectTop },
    } = this

    const videosToRate = (
      await Promise.all(channelIds.map((channelId) => this.getVideosToRate(channelId)))
    ).flat()

    this.logger.info(`Calculating relevances of ${videosToRate.length} videos...`)
    await this.em.transaction(async (em) => {
      // Acquire the row locks first in a predictable order
      await this.em.query(
        `SELECT id FROM curator.video WHERE channel_id = ANY($1) ORDER BY id ASC FOR UPDATE`,
        [channelIds]
      )
      // Reset all video relevances for the channels that are being updated
      await em.query(
        `UPDATE curator.video SET video_relevance = 0 WHERE video_relevance != 0 AND video.channel_id = ANY($1)`,
        [channelIds]
      )
      // Calculate the relevances of the latest `videosPerChannelLimit` videos per channel
      // and update it for top `videosPerChannelSelectTop` videos per channel
      if (videosToRate.length > 0) {
        await em.query(
          `
        WITH
          videos_with_ratings AS (
            SELECT
              channel_id,
              channel.channel_weight AS channel_weight,
              video.id AS video_id,
              ${this.videoAgeRateQuery()} as age_rate,
              ${this.rateQuery('video.views_num', percentileStats.videoViews)} AS views_num_rate,
              ${this.rateQuery(
                'video.comments_count',
                percentileStats.videoComments
              )} AS comments_count_rate,
              ${this.rateQuery(
                `video.reactions_count`,
                percentileStats.videoReactions
              )} AS reactions_count_rate
            FROM 
              video
              INNER JOIN channel ON video.channel_id = channel.id
            WHERE
              video.id = ANY($1)
          ),
          rated_videos AS (
            SELECT
              vwr.*,
              ${this.videoRelevanceFormula('vwr')} as video_relevance
            FROM videos_with_ratings vwr
          ),
          ranked_videos AS (
            SELECT
              rv.*,
              rank() OVER (PARTITION BY channel_id ORDER BY video_relevance DESC, age_rate DESC, video_id DESC) AS relevance_rank
            FROM rated_videos rv
          )
        UPDATE
          video
        SET
          video_relevance = rnv.video_relevance
        FROM
          ranked_videos rnv
        WHERE
          video.id = rnv.video_id
          AND rnv.relevance_rank <= ${videosPerChannelSelectTop}
        `,
          [videosToRate]
        )
      }
    })
  }

  private async queueSize() {
    return (await this.priorityQueue.channelsQueueSize()) + this.backgroundQueue.size
  }

  async runSingleUpdate() {
    const queueSize = await this.queueSize()
    if (queueSize === 0) {
      return
    }
    this.logger.info(`Running single update iteration (queue size: ${queueSize})`)
    const { channelIds, ack } = await this.getChannelsToUpdate()
    if (channelIds.length === 0) {
      this.logger.info('No channels to update found. Skipping iteration.')
      return
    }
    // Update channel weights
    await this.updateChannelWeights(channelIds)
    // Update video relevances
    await this.updateVideoRelevances(channelIds)
    ack?.()
    this.logger.info(`Single update done (queue size: ${await this.queueSize()})`)
  }

  private async loadPercentileStats(
    inputs: {
      fractions: number[]
      from: string
      by: string
      nonZero?: boolean
    }[]
  ) {
    const queries: string[] = []
    for (const input of inputs) {
      const { from, by, fractions, nonZero = true } = input
      const fractionsStr = fractions.join(',')
      queries.push(`
        SELECT
          COALESCE(
            percentile_cont(ARRAY[${fractionsStr}]) WITHIN GROUP (ORDER BY ${by}),
            ARRAY[${fractions.map(() => 0).join(',')}]
          ) AS percentiles
        FROM
          ${from}
        ${nonZero ? `WHERE ${by} > 0` : ''} 
      `)
    }
    const query = queries.map((q) => `(${q})`).join(' UNION ALL ')
    const results = await this.em.query(query)
    return results.map((r: { percentiles: number[] }) => r.percentiles)
  }

  private async updatePercentileStats(): Promise<void> {
    const fractions = Array.from(MIN_PERCENTILE_TO_RATE.keys())
    const [
      crtLiquidityPercentiles,
      crtVolumePercentiles,
      channelFollowersPercentiles,
      channelRevenuePercentiles,
      videoViewsPercentiles,
      videoCommentsPercentiles,
      videoReactionsPercentiles,
    ] = await this.loadPercentileStats([
      { from: 'public.marketplace_token', by: 'liquidity', fractions },
      { from: 'public.marketplace_token', by: 'amm_volume', fractions },
      { from: 'channel', by: 'follows_num', fractions },
      { from: 'channel', by: 'cumulative_revenue', fractions },
      { from: 'video', by: 'views_num', fractions },
      { from: 'video', by: 'comments_count', fractions },
      { from: 'video', by: 'reactions_count', fractions },
    ])
    this.percentileStats = {
      channelFollowers: channelFollowersPercentiles,
      crtLiquidity: crtLiquidityPercentiles,
      crtVolume: crtVolumePercentiles,
      videoViews: videoViewsPercentiles,
      videoComments: videoCommentsPercentiles,
      videoReactions: videoReactionsPercentiles,
      channelRevenue: channelRevenuePercentiles,
    }
    this.logger.info({ ...this.percentileStats }, 'Updated percentile stats')
  }

  private async populateBackgroundQueue(): Promise<void> {
    // Only select channels with at least 1 uploaded video
    const result = await this.em.query(
      `SELECT id FROM curator.channel WHERE total_videos_created > 0`
    )
    const ids = result.map((row: { id: string }) => row.id)
    this.logger.info(`Populating background queue. Found ${ids.length} channels`)
    for (const id of ids) {
      this.backgroundQueue.add(id)
    }
  }

  private async runPopulateBackgroundQueueLoop(): Promise<void> {
    const { populateBackgroundQueueInterval } = this.config
    while (true) {
      await this.populateBackgroundQueue()
      await new Promise((resolve) => setTimeout(resolve, populateBackgroundQueueInterval))
      await this.updatePercentileStats()
    }
  }

  private async runUpdateLoop(): Promise<void> {
    const { updateLoopInterval } = this.config
    while (true) {
      await this.runSingleUpdate()
      await new Promise((resolve) => setTimeout(resolve, updateLoopInterval))
    }
  }
}
