import { EntityManager, In } from 'typeorm'
import { Comment } from '../../../model'
import { commentCountersManager } from '../../utils'

export async function processCommentsCensorshipStatusUpdate(em: EntityManager, ids: string[]) {
  const comments = await em.getRepository(Comment).find({ where: { id: In(ids) } })
  comments.forEach((c) => {
    commentCountersManager.scheduleRecalcForComment(c.parentCommentId)
    commentCountersManager.scheduleRecalcForVideo(c.videoId)
  })
  await commentCountersManager.updateVideoCommentsCounters(em)
  await commentCountersManager.updateParentRepliesCounters(em)
}
