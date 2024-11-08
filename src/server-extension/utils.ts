import { EntityManager } from 'typeorm'
import { CommentCountersManager } from '../utils/CommentsCountersManager'
import { VideoRelevanceManager } from '../utils/VideoRelevanceManager'

export const commentCountersManager = new CommentCountersManager()
export const videoRelevanceManager = new VideoRelevanceManager()

videoRelevanceManager.turnOnVideoRelevanceManager()

export async function recalculateAllVideosRelevance(em: EntityManager) {
  return videoRelevanceManager.updateVideoRelevanceValue(em, true)
}
