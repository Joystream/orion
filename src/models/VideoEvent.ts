import { getModelForClass, prop } from '@typegoose/typegoose'
import { GenericBucket, GenericEvent, insertEventIntoBucket } from './shared'

export enum VideoEventType {
  AddView = 'ADD_VIEW',
}

export class VideoEvent extends GenericEvent {
  @prop({ required: true, index: true })
  videoId: string

  @prop({ required: true, index: true })
  channelId: string

  @prop({ required: false, index: true })
  categoryId?: string

  @prop({ required: true, index: true, enum: VideoEventType })
  declare type: VideoEventType
}

export type UnsequencedVideoEvent = Omit<VideoEvent, '_id'>

class VideoEventsBucket extends GenericBucket {
  @prop({ required: true, type: () => [VideoEvent] })
  declare events: VideoEvent[]
}

export const VideoEventsBucketModel = getModelForClass(VideoEventsBucket, {
  schemaOptions: { collection: 'videoEvents' },
})

export const saveVideoEvent = async (unsequencedVideoEvent: UnsequencedVideoEvent) => {
  return await insertEventIntoBucket(unsequencedVideoEvent, VideoEventsBucketModel)
}
