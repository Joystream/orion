import { EntityManager } from 'typeorm'
import { CommentStatus } from '../model'
import { config, ConfigVariable } from './config'

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
          ((30 - (extract(epoch from now() - created_at) / (60 * 60 * 24))) * ${newnessWeight}) +
          (views_num * ${viewsWeight}) +
          (
            SELECT COUNT(*) * ${commentsWeight} FROM "comment"
            WHERE
              "comment"."video_id" = "video"."id"
              AND "comment"."status" = '${CommentStatus.VISIBLE}'
              AND "comment"."is_excluded" = '0'
          ) +
          (
            SELECT COUNT(*) * ${reactionsWeight} FROM "video_reaction"
            WHERE
              "video_reaction"."video_id" = "video"."id"
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
