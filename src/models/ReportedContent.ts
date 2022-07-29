import { getModelForClass, prop } from '@typegoose/typegoose'

export class ReportedVideo {
  @prop({ required: true })
  reporterIp: string

  @prop({ required: true, index: true })
  videoId: string

  @prop({ required: true })
  timestamp: Date

  @prop({ required: true })
  rationale: string
}

export const ReportedVideoModel = getModelForClass(ReportedVideo, { schemaOptions: { collection: 'reportedVideos' } })

export const saveReportedVideo = (reportedVideo: ReportedVideo) => {
  return ReportedVideoModel.create(reportedVideo)
}
