import { RelevanceQueuePublisher } from '../relevance-service/RelevanceQueue'
import { CommentCountersManager } from '../utils/CommentsCountersManager'

export const commentCountersManager = new CommentCountersManager()
export const relevanceQueuePublisher = new RelevanceQueuePublisher({
  autoInitialize: true,
  defaultPushOptions: {
    deferred: true,
    skipIfUninitialized: false,
  },
})
