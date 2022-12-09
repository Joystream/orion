"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCommentsCensorshipStatusUpdate = void 0;
const typeorm_1 = require("typeorm");
const CommentsCountersManager_1 = require("../../../utils/CommentsCountersManager");
const model_1 = require("../../../model");
const VideoRelevanceManager_1 = require("../../../utils/VideoRelevanceManager");
async function processCommentsCensorshipStatusUpdate(em, ids) {
    const manager = new CommentsCountersManager_1.CommentCountersManager();
    const videoRelevanceManager = new VideoRelevanceManager_1.VideoRelevanceManager();
    const comments = await em.getRepository(model_1.Comment).find({ where: { id: (0, typeorm_1.In)(ids) } });
    comments.forEach((c) => {
        manager.scheduleRecalcForComment(c.parentCommentId);
        manager.scheduleRecalcForVideo(c.videoId);
        videoRelevanceManager.scheduleRecalcForVideo(c.videoId);
    });
    await manager.updateVideoCommentsCounters(em);
    await manager.updateParentRepliesCounters(em);
    await videoRelevanceManager.updateVideoRelevanceValue(em);
}
exports.processCommentsCensorshipStatusUpdate = processCommentsCensorshipStatusUpdate;
//# sourceMappingURL=utils.js.map