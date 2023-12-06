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

    this.updateScheduledLoop(em, scheduledUpdateLoopTime)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })

    this.updateFullUpdateLoop(em, fullUpdateLoopTime)
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
        (extract(epoch from now()) - ${wtEpoch})
        / ${NEWNESS_SECONDS_DIVIDER} * ${newnessWeight * -1} 
        + (views_num * ${viewsWeight}) 
        + (comments_count * ${commentsWeight}) 
        + (reactions_count * ${reactionsWeight})) 
        * COALESCE(channel.channel_weight, ${channelWeight}),2)) as videoRelevance
        FROM video
        INNER JOIN channel  ON video.channel_id = channel.id
        ${
          forceUpdateAll
            ? ''
            : `WHERE video.channel_id in (${[...this.channelsToUpdate.values()]
                .map((id) => `'${id}'`)
                .join(', ')})`
        }
        ORDER BY video.id),
        
        top_channel_score as (
        SELECT 
        channel.id as channelId,
        MAX(videoCte.videoRelevance) as maxChannelRelevance
        FROM channel
        INNER JOIN videos_with_weight as videoCte on videoCte.channelId = channel.id
        GROUP BY channel.id)
        
        UPDATE video
        SET video_relevance = COALESCE(topChannelVideo.maxChannelRelevance, 1) 
        FROM videos_with_weight as videoCte
        LEFT JOIN top_channel_score as topChannelVideo on topChannelVideo.channelId = videoCte.channelId and topChannelVideo.maxChannelRelevance = videoCte.videoRelevance
        WHERE video.id = videoCte.videoId;
        `)
    this.channelsToUpdate.clear()
  }

  private async updateScheduledLoop(em: EntityManager, intervalMs: number): Promise<void> {
    while (true) {
      await this.updateVideoRelevanceValue(em)
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  private async updateFullUpdateLoop(em: EntityManager, intervalMs: number): Promise<void> {
    while (true) {
      await this.updateVideoRelevanceValue(em)
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}
