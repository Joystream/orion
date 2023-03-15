import { EntityManager, In } from 'typeorm'
import { Comment, Video } from '../../../model'

export async function processCommentsCensorshipStatusUpdate(
  em: EntityManager,
  ids: string[],
  censored: boolean
) {
  const comments = await em
    .getRepository(Comment)
    .find({ where: { id: In(ids), isExcluded: !censored }, lock: { mode: 'pessimistic_write' } })
  const videoIdsAffected = comments.map((c) => c.videoId)
  const parentCommentIdsAffected = comments.map((c) => c.parentCommentId)
  const operation = censored ? '-' : '+'
  // Reduce/increase videos' commentsCount
  await em
    .getRepository(Video)
    .update({ id: In(videoIdsAffected) }, { commentsCount: () => `comments_count ${operation} 1` })
  // Reduce/increase parent comments' replies count
  await em.getRepository(Comment).update(
    { id: In(parentCommentIdsAffected) },
    {
      repliesCount: () => `replies_count ${operation} 1`,
      reactionsAndRepliesCount: () => `reactions_and_replies_count ${operation} 1`,
    }
  )
}
