import { EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { relevanceQueuePublisher } from '../utils'

@EventSubscriber()
export class TransactionCommitSubscriber implements EntitySubscriberInterface {
  async afterTransactionCommit(): Promise<void> {
    if (relevanceQueuePublisher.initialized) {
      await relevanceQueuePublisher.commitDeferred()
    }
  }
}
