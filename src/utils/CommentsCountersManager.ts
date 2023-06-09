import { EntityManager } from 'typeorm'
import { CommentStatus } from '../model'

export class CommentCountersManager {
  private videosToUpdate: Set<string> = new Set()
  private commentsToUpdate: Set<string> = new Set()

  scheduleRecalcForComment(id: string | null | undefined) {
    id && this.commentsToUpdate.add(id)
  }

  scheduleRecalcForVideo(id: string | null | undefined) {
    id && this.videosToUpdate.add(id)
  }

  async updateVideoCommentsCounters(em: EntityManager, forceUpdateAll = false) {
    if (this.videosToUpdate.size || forceUpdateAll) {
      await em.query(`
        UPDATE "video"
        SET
          "comments_count" = (
            SELECT COUNT(*) FROM "comment"
            WHERE
              "comment"."video_id" = "video"."id"
              AND "comment"."status" = '${CommentStatus.VISIBLE}'
              AND "comment"."is_excluded" = '0'
          )
        ${
          forceUpdateAll
            ? ''
            : `WHERE "id" IN (${[...this.videosToUpdate.values()]
                .map((id) => `'${id}'`)
                .join(', ')})`
        }
      `)
      this.videosToUpdate.clear()
    }
  }

  async updateParentRepliesCounters(em: EntityManager, forceUpdateAll = false) {
    if (this.commentsToUpdate.size || forceUpdateAll) {
      await em.query(`
        UPDATE "comment"
        SET
          "replies_count" = (
            SELECT COUNT(*) FROM "comment" AS "reply"
            WHERE
              "reply"."parent_comment_id" = "comment"."id"
              AND "reply"."status" = '${CommentStatus.VISIBLE}'
              AND "reply"."is_excluded" = '0'
          ),
          "reactions_and_replies_count" = (
            SELECT COUNT(*) FROM (
              SELECT "id" FROM "comment" AS "reply"
              WHERE
                "reply"."parent_comment_id" = "comment"."id"
                AND "reply"."status" = '${CommentStatus.VISIBLE}'
                AND "reply"."is_excluded" = '0'
              UNION SELECT "id" FROM "comment_reaction"
              WHERE "comment_reaction"."comment_id" = "comment"."id"
            ) AS "reactions_and_replies"
          )
        ${
          forceUpdateAll
            ? ''
            : `WHERE "id" IN (${[...this.commentsToUpdate.values()]
                .map((id) => `'${id}'`)
                .join(', ')})`
        }
      `)
      this.commentsToUpdate.clear()
    }
  }
}
