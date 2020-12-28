import { getModelForClass, prop } from '@typegoose/typegoose'
import { GenericBucket, GenericEvent, insertEventIntoBucket } from './shared'

export enum ChannelEventType {
  FollowChannel = 'FOLLOW_CHANNEL',
  UnfollowChannel = 'UNFOLLOW_CHANNEL',
}

export class ChannelEvent extends GenericEvent {
  @prop({ required: true, index: true })
  channelId: string

  @prop({ required: true, index: true, enum: ChannelEventType })
  type: ChannelEventType
}

export type UnsequencedChannelEvent = Omit<ChannelEvent, '_id'>

class ChannelEventsBucket extends GenericBucket {
  @prop({ required: true, type: () => [ChannelEvent] })
  events: ChannelEvent[]
}

export const ChannelEventsBucketModel = getModelForClass(ChannelEventsBucket, {
  schemaOptions: { collection: 'channelEvents' },
})

export const saveChannelEvent = async (unsequencedChannelEvent: UnsequencedChannelEvent) => {
  return await insertEventIntoBucket(unsequencedChannelEvent, ChannelEventsBucketModel)
}
