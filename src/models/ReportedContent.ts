import { getModelForClass, prop } from '@typegoose/typegoose'

export class ReportedEntity {
  @prop({ required: true })
  reporterIp: string

  @prop({ required: true })
  timestamp: Date

  @prop({ required: true })
  rationale: string
}

export class ReportedVideo extends ReportedEntity {
  @prop({ required: true, index: true })
  videoId: string
}

export const ReportedVideoModel = getModelForClass(ReportedVideo, { schemaOptions: { collection: 'reportedVideos' } })

export const saveReportedVideo = (reportedVideo: ReportedVideo) => {
  return ReportedVideoModel.create(reportedVideo)
}

export class ReportedChannel extends ReportedEntity {
  @prop({ required: true, index: true })
  channelId: string
}

export const ReportedChannelModel = getModelForClass(ReportedChannel, {
  schemaOptions: { collection: 'reportedChannels' },
})

export const saveReportedChannel = (reportedChannel: ReportedChannel) => {
  return ReportedChannelModel.create(reportedChannel)
}
