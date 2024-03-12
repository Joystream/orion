import { EntityManager } from 'typeorm'
import { config, ConfigVariable } from './config'
import { globalEm } from './globalEm'

// constant used to parse seconds from creation
export const NEWNESS_SECONDS_DIVIDER = 60 * 60 * 24

type VideoRelevanceManagerLoops = {
  fullUpdateLoopTime: number
  scheduledUpdateLoopTime: number
}

export class VideoRelevanceManager {
  private channelsToUpdate: Set<string> = new Set()
  private _isVideoRelevanceEnabled = false

  public get isVideoRelevanceEnabled(): boolean {
    return this._isVideoRelevanceEnabled
  }

  async init({
    fullUpdateLoopTime,
    scheduledUpdateLoopTime,
  }: VideoRelevanceManagerLoops): Promise<void> {
    const em = await globalEm

    this.updateLoop(em, scheduledUpdateLoopTime)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })

    this.updateLoop(em, fullUpdateLoopTime)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  turnOnVideoRelevanceManager() {
    this._isVideoRelevanceEnabled = true
  }

  scheduleRecalcForChannel(id: string | null | undefined) {
    if (id) {
      this.channelsToUpdate.add(id)
    }
  }

  async updateVideoRelevanceValue(em: EntityManager, forceUpdateAll?: boolean) {
    if (!this._isVideoRelevanceEnabled || !(this.channelsToUpdate.size || forceUpdateAll)) {
      return
    }

    const [
      newnessWeight,
      viewsWeight,
      commentsWeight,
      reactionsWeight,
      [joystreamTimestampWeight, ytTimestampWeight] = [7, 3],
      defaultChannelWeight,
    ] = await config.get(ConfigVariable.RelevanceWeights, em)
    const channelWeight = defaultChannelWeight ?? 1
    const wtEpoch = `((
          extract(epoch from video.created_at)*${joystreamTimestampWeight} +
          COALESCE(extract(epoch from video.published_before_joystream), extract(epoch from video.created_at))*${ytTimestampWeight}
        ) / ${joystreamTimestampWeight} + ${ytTimestampWeight})`

    await em.query(`
        WITH videos_with_weight AS (
          SELECT 
            video.id as videoId,
            channel.id as channelId,
            (ROUND((
            (extract(epoch FROM date_trunc('day', now() at time zone 'UTC')) - ${wtEpoch})
            / ${NEWNESS_SECONDS_DIVIDER} * ${newnessWeight * -1} 
            + (views_num * ${viewsWeight}) 
            + (comments_count * ${commentsWeight}) 
            + (reactions_count * ${reactionsWeight})) 
            * COALESCE(channel.channel_weight, ${channelWeight}), 2)) as videoRelevance
          FROM 
            video
            INNER JOIN channel  ON video.channel_id = channel.id
          ${
            forceUpdateAll
              ? ''
              : `WHERE video.channel_id in (${[...this.channelsToUpdate.values()]
                  .map((id) => `'${id}'`)
                  .join(', ')})`
          }
          ORDER BY 
            video.id
        ),
    
        top_channel_score as (
          SELECT
            channel.id as channelId,
            MAX(videos_with_weight.videoRelevance) as maxChannelRelevance
          FROM
            channel
            INNER JOIN videos_with_weight on videos_with_weight.channelId = channel.id
          GROUP BY
            channel.id
        ),

        ranked_videos AS (
          SELECT
            videos_with_weight.videoId,
            topChannelVideo.maxChannelRelevance,
            ROW_NUMBER() OVER (
              PARTITION BY videos_with_weight.channelId
              ORDER BY
                videos_with_weight.videoRelevance DESC,
                videos_with_weight.videoId
            ) as rank
          FROM
            videos_with_weight
            LEFT JOIN top_channel_score as topChannelVideo ON videos_with_weight.channelId = topChannelVideo.channelId
        )

        UPDATE
          video
        SET
          video_relevance = CASE
            WHEN ranked_videos.rank = 1 THEN ranked_videos.maxChannelRelevance
            ELSE 1
          END
        FROM
          ranked_videos
        WHERE
          video.id = ranked_videos.videoId;
      `)
    this.channelsToUpdate.clear()
  }

  private async updateLoop(em: EntityManager, intervalMs: number): Promise<void> {
    while (true) {
      await this.updateVideoRelevanceValue(em)
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}
