import { DocumentType, prop, ReturnModelType } from '@typegoose/typegoose'

const MAX_BUCKET_SIZE = 50000

export class GenericEvent {
  @prop()
  _id: number

  @prop({ required: true })
  timestamp: Date

  type: unknown
}

type UnsequencedGenericEvent = Omit<GenericEvent, '_id'>

export class GenericBucket {
  @prop()
  _id: number

  @prop({ required: true, index: true })
  firstTimestamp: Date

  @prop({ required: true, index: true })
  lastTimestamp: Date

  @prop({ required: true })
  size: number

  events: GenericEvent[]
}

export const insertEventIntoBucket = async (
  unsequencedEvent: UnsequencedGenericEvent,
  bucketModel: ReturnModelType<typeof GenericBucket>
) => {
  const lastBucket = await bucketModel.findOne().sort({ _id: -1 })
  const lastEventId = lastBucket?.events[lastBucket?.events.length - 1]._id ?? -1
  const event: GenericEvent = {
    ...unsequencedEvent,
    _id: lastEventId + 1,
  }

  if (!lastBucket || lastBucket.size >= MAX_BUCKET_SIZE) {
    return await createNewBucketFromEvent(lastBucket, event, bucketModel)
  }

  lastBucket.events.push(event)
  lastBucket.size++
  lastBucket.lastTimestamp = event.timestamp
  await lastBucket.save()
}

const createNewBucketFromEvent = async (
  lastBucket: DocumentType<GenericBucket> | null,
  event: GenericEvent,
  bucketModel: ReturnModelType<typeof GenericBucket>
) => {
  const newBucketId = lastBucket ? lastBucket._id + 1 : 0
  const newBucket: GenericBucket = {
    _id: newBucketId,
    firstTimestamp: event.timestamp,
    lastTimestamp: event.timestamp,
    size: 1,
    events: [event],
  }

  await bucketModel.create(newBucket)
}
