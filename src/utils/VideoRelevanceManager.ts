import { EntityManager } from 'typeorm'
import { config, ConfigVariable } from './config'
import { globalEm } from './globalEm'

// constant used to parse seconds from creation
export const NEWNESS_SECONDS_DIVIDER = 60 * 60 * 24

export class VideoRelevanceManager {
  private videosToUpdate: Set<string> = new Set()

  init(intervalMs: number): void {
    this.updateLoop(intervalMs)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  scheduleRecalcForVideo(id: string | null | undefined) {
    id && this.videosToUpdate.add(id)
  }

  async updateVideoRelevanceValue(em: EntityManager, forceUpdateAll?: boolean) {
    if (this.videosToUpdate.size || forceUpdateAll) {
      const [
        newnessWeight,
        viewsWeight,
        commentsWeight,
        reactionsWeight,
        [joystreamTimestampWeight, ytTimestampWeight] = [7, 3],
        defaultChannelWeight,
      ] = await config.get(ConfigVariable.RelevanceWeights, em)
      const channelWeight = defaultChannelWeight ?? 1
      await em.query(`
        WITH weighted_timestamp AS (
    SELECT 
        "video"."id",
        (
          extract(epoch from video.created_at)*${joystreamTimestampWeight} +
          COALESCE(extract(epoch from video.published_before_joystream), extract(epoch from video.created_at))*${ytTimestampWeight}
        ) / ${joystreamTimestampWeight} + ${ytTimestampWeight} as wtEpoch,
        "channel"."channel_weight" as CW
    FROM 
        "video" 
        INNER JOIN
          "channel" ON "video"."channel_id" = "channel"."id"
        ${
          forceUpdateAll
            ? ''
            : `WHERE "video"."id" IN (${[...this.videosToUpdate.values()]
                .map((id) => `'${id}'`)
                .join(', ')})`
        }
        )
    UPDATE 
        "video"
    SET
        "video_relevance" = ROUND(
      (
        (extract(epoch from now()) - wtEpoch) / ${NEWNESS_SECONDS_DIVIDER} * ${newnessWeight * -1} +
        (views_num * ${viewsWeight}) +
        (comments_count * ${commentsWeight}) +
        (reactions_count * ${reactionsWeight})
      ) * COALESCE(CW, ${channelWeight}),
            2)
    FROM
        weighted_timestamp
    WHERE
        "video".id = weighted_timestamp.id;
        `)
      this.videosToUpdate.clear()
    }
  }

  private async updateLoop(intervalMs: number): Promise<void> {
    const em = await globalEm
    while (true) {
      await this.updateVideoRelevanceValue(em, true)
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}
