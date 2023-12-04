import { EntityManager, In } from 'typeorm'
import { CommentCountersManager } from '../../../utils/CommentsCountersManager'
import { Comment } from '../../../model'
import { VideoRelevanceManager } from '../../../utils/VideoRelevanceManager'

export async function processCommentsCensorshipStatusUpdate(em: EntityManager, ids: string[]) {
  const manager = new CommentCountersManager()
  const videoRelevanceManager = new VideoRelevanceManager()
  const comments = await em.getRepository(Comment).find({ where: { id: In(ids) } })
  comments.forEach((c) => {
    manager.scheduleRecalcForComment(c.parentCommentId)
    manager.scheduleRecalcForVideo(c.videoId)
    videoRelevanceManager.scheduleRecalcForVideo(c.videoId)
  })
  await manager.updateVideoCommentsCounters(em)
  await manager.updateParentRepliesCounters(em)
  await videoRelevanceManager.updateVideoRelevanceValue(em)
}
