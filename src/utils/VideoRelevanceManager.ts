import { EntityManager } from 'typeorm'
import { CommentStatus } from '../model'

export class VideoRelevanceManager {
  private videosToUpdate: Set<string> = new Set()

  scheduleRecalcForVideo(id: string | null | undefined) {
    id && this.videosToUpdate.add(id)
  }

  async updateVideoRelevanceValue(em: EntityManager) {
    if (this.videosToUpdate.size) {
      await em.query(`
        UPDATE "video"
        SET
          "video_relevance" = (
          ((extract(epoch from created_at) / (60 * 60 * 24)) * 0.4) +
          (views_num * 0.3) +
          (
            SELECT COUNT(*) * 0.2 FROM "comment"
            WHERE
              "comment"."video_id" = "video"."id"
              AND "comment"."status" = '${CommentStatus.VISIBLE}'
              AND "comment"."is_excluded" = '0'
          ) +
          (
            SELECT COUNT(*) * 0.1 FROM "video_reaction"
            WHERE
              "video_reaction"."video_id" = "video"."id"
          ))
        WHERE "id" IN (${[...this.videosToUpdate.values()].map((id) => `'${id}'`).join(', ')})`)
      this.videosToUpdate.clear()
    }
  }
}
