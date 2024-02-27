import { EntityManager, In } from 'typeorm'
import { CommentCountersManager } from '../../../utils/CommentsCountersManager'
import { Comment } from '../../../model'

export async function processCommentsCensorshipStatusUpdate(em: EntityManager, ids: string[]) {
  const manager = new CommentCountersManager()
  const comments = await em.getRepository(Comment).find({ where: { id: In(ids) } })
  comments.forEach((c) => {
    manager.scheduleRecalcForComment(c.parentCommentId)
    manager.scheduleRecalcForVideo(c.videoId)
  })
  await manager.updateVideoCommentsCounters(em)
  await manager.updateParentRepliesCounters(em)
}
