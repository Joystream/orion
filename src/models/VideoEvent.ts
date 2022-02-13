import { getModelForClass, prop } from '@typegoose/typegoose'

export enum VideoEventType {
  AddView = 'ADD_VIEW',
}

export class VideoEvent {
  @prop({ required: true, index: true })
  videoId: string

  @prop({ required: true, index: true })
  channelId: string

  @prop({ required: false, index: true })
  categoryId?: string

  @prop({ required: true })
  timestamp: Date

  @prop({ required: false, index: true })
  actorId?: string

  @prop({ required: true, index: true, enum: VideoEventType })
  type: VideoEventType
}

export const VideoEventModel = getModelForClass(VideoEvent, { schemaOptions: { collection: 'videoEvents' } })

export const saveVideoEvent = (event: VideoEvent) => {
  return VideoEventModel.create(event)
}
