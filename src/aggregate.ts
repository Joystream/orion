import { VideoEvent, VideoEventsBucketModel, VideoEventType } from './models/VideoEvent'

export class VideoAggregate {
  private videoViewsMap: Record<string, number> = {}
  private channelViewsMap: Record<string, number> = {}

  public videoViews(videoId: string): number {
    return this.videoViewsMap[videoId] || 0
  }

  public channelViews(channelId: string): number {
    return this.channelViewsMap[channelId] || 0
  }

  public async rebuild() {
    const aggregation = (await VideoEventsBucketModel.aggregate([
      { $unwind: '$events' },
      { $group: { _id: null, allEvents: { $push: '$events' } } },
      { $project: { events: '$allEvents' } },
    ])) as { events: VideoEvent[] }[]

    aggregation[0].events.forEach((event) => {
      this.applyEvent(event)
    })
  }

  public applyEvent(event: VideoEvent) {
    switch (event.eventType) {
      case VideoEventType.AddView:
        this.applyAddViewEvent(event)
        break
      default:
        console.error(`Parsing unknown video event: ${event.eventType}`)
    }
  }

  private applyAddViewEvent(event: VideoEvent) {
    const currentVideoViews = this.videoViewsMap[event.videoId] || 0
    const currentChannelViews = this.channelViewsMap[event.channelId] || 0

    this.videoViewsMap[event.videoId] = currentVideoViews + 1
    this.channelViewsMap[event.videoId] = currentChannelViews + 1
  }
}

export const videoAggregate = new VideoAggregate()
