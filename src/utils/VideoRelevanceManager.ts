import { EntityManager } from 'typeorm'
import { config, ConfigVariable } from './config'

// constant used to parse seconds from creation
export const NEWNESS_SECONDS_DIVIDER = 60 * 60 * 24

export class VideoRelevanceManager {
  private videosToUpdate: Set<string> = new Set()

  scheduleRecalcForVideo(id: string | null | undefined) {
    id && this.videosToUpdate.add(id)
  }

  async updateVideoRelevanceValue(em: EntityManager, forceUpdateAll?: boolean) {
    if (this.videosToUpdate.size || forceUpdateAll) {
      const [newnessWeight, viewsWeight, commentsWeight, reactionsWeight] = await config.get(
        ConfigVariable.RelevanceWeights,
        em
      )
      await em.query(`
        UPDATE "video"
        SET
          "video_relevance" = ROUND(
          ((30 - (extract(epoch from now() - created_at) / ${NEWNESS_SECONDS_DIVIDER})) * ${newnessWeight}) +
          (views_num * ${viewsWeight}) +
          (
            comments_count * ${commentsWeight} 
          ) +
          (
            reactions_count * ${reactionsWeight} 
          ), 2)
        ${
          forceUpdateAll
            ? ''
            : `WHERE "id" IN (${[...this.videosToUpdate.values()]
                .map((id) => `'${id}'`)
                .join(', ')})`
        }`)
      this.videosToUpdate.clear()
    }
  }
}
