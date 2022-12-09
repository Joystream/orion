"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentCountersManager = void 0;
const model_1 = require("../model");
class CommentCountersManager {
    constructor() {
        this.videosToUpdate = new Set();
        this.commentsToUpdate = new Set();
    }
    scheduleRecalcForComment(id) {
        id && this.commentsToUpdate.add(id);
    }
    scheduleRecalcForVideo(id) {
        id && this.videosToUpdate.add(id);
    }
    async updateVideoCommentsCounters(em, forceUpdateAll = false) {
        if (this.videosToUpdate.size || forceUpdateAll) {
            await em.query(`
        UPDATE "video"
        SET
          "comments_count" = (
            SELECT COUNT(*) FROM "comment"
            WHERE
              "comment"."video_id" = "video"."id"
              AND "comment"."status" = '${model_1.CommentStatus.VISIBLE}'
              AND "comment"."is_excluded" = '0'
          )
        ${forceUpdateAll
                ? ''
                : `WHERE "id" IN (${[...this.videosToUpdate.values()]
                    .map((id) => `'${id}'`)
                    .join(', ')})`}
      `);
            this.videosToUpdate.clear();
        }
    }
    async updateParentRepliesCounters(em, forceUpdateAll = false) {
        if (this.commentsToUpdate.size || forceUpdateAll) {
            await em.query(`
        UPDATE "comment"
        SET
          "replies_count" = (
            SELECT COUNT(*) FROM "comment" AS "reply"
            WHERE
              "reply"."parent_comment_id" = "comment"."id"
              AND "reply"."status" = '${model_1.CommentStatus.VISIBLE}'
              AND "reply"."is_excluded" = '0'
          ),
          "reactions_and_replies_count" = (
            SELECT COUNT(*) FROM (
              SELECT "id" FROM "comment" AS "reply"
              WHERE
                "reply"."parent_comment_id" = "comment"."id"
                AND "reply"."status" = '${model_1.CommentStatus.VISIBLE}'
                AND "reply"."is_excluded" = '0'
              UNION SELECT "id" FROM "comment_reaction"
              WHERE "comment_reaction"."comment_id" = "comment"."id"
            ) AS "reactions_and_replies"
          )
        ${forceUpdateAll
                ? ''
                : `WHERE "id" IN (${[...this.commentsToUpdate.values()]
                    .map((id) => `'${id}'`)
                    .join(', ')})`}
      `);
            this.commentsToUpdate.clear();
        }
    }
}
exports.CommentCountersManager = CommentCountersManager;
//# sourceMappingURL=CommentsCountersManager.js.map