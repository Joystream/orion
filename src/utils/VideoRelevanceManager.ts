import { EntityManager } from 'typeorm'
import { config, ConfigVariable } from './config'
import { getEm } from './orm'

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
      ] = await config.get(ConfigVariable.RelevanceWeights, em)
      await em.query(`
        WITH weighted_timestamp AS (
    SELECT 
        id,
        (
          extract(epoch from created_at)*${joystreamTimestampWeight} +
          COALESCE(extract(epoch from published_before_joystream), extract(epoch from created_at))*${ytTimestampWeight}
        ) / ${joystreamTimestampWeight + ytTimestampWeight} as wtEpoch
    FROM 
        "video" 
        ${
          forceUpdateAll
            ? ''
            : `WHERE "id" IN (${[...this.videosToUpdate.values()]
                .map((id) => `'${id}'`)
                .join(', ')})`
        }
        )
    UPDATE 
        "video"
    SET
        "video_relevance" = ROUND(
        (extract(epoch from now()) - wtEpoch) / (60 * 60 * 24) * ${newnessWeight * -1} +
        (views_num * ${viewsWeight}) +
        (comments_count * ${commentsWeight}) +
        (reactions_count * ${reactionsWeight}), 
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
    const em = await getEm()
    while (true) {
      await this.updateVideoRelevanceValue(em, true)
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
}
