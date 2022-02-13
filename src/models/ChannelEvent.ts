import { getModelForClass, prop } from '@typegoose/typegoose'

export enum ChannelEventType {
  FollowChannel = 'FOLLOW_CHANNEL',
  UnfollowChannel = 'UNFOLLOW_CHANNEL',
}

export class ChannelEvent {
  @prop({ required: true, index: true })
  channelId: string

  @prop({ required: true })
  timestamp: Date

  @prop({ required: false, index: true })
  actorId?: string

  @prop({ required: true, index: true, enum: ChannelEventType })
  type: ChannelEventType
}

export const ChannelEventModel = getModelForClass(ChannelEvent, {
  schemaOptions: { collection: 'channelEvents' },
})

export const saveChannelEvent = (event: ChannelEvent) => {
  return ChannelEventModel.create(event)
}
