import { EntityManager, In } from 'typeorm'
import { Comment } from '../../../model'
import { commentCountersManager, relevanceQueuePublisher } from '../../utils'
import _ from 'lodash'

export async function processCommentsCensorshipStatusUpdate(em: EntityManager, ids: string[]) {
  const comments = await em
    .getRepository(Comment)
    .find({ where: { id: In(ids) }, relations: ['video'] })

  await Promise.all(
    comments.map(async (c) => {
      commentCountersManager.scheduleRecalcForComment(c.parentCommentId)
      commentCountersManager.scheduleRecalcForVideo(c.videoId)
      await relevanceQueuePublisher.pushChannel(c.video.channelId)
    })
  )
  await commentCountersManager.updateVideoCommentsCounters(em)
  await commentCountersManager.updateParentRepliesCounters(em)
}
