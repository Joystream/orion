import { UnsequencedVideoEvent, VideoEvent, VideoEventsBucketModel, VideoEventType } from './models/VideoEvent'

type VideoEventsAggregationResult = {
  events?: VideoEvent[]
}[]

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
    const aggregation: VideoEventsAggregationResult = await VideoEventsBucketModel.aggregate([
      { $unwind: '$events' },
      { $group: { _id: null, allEvents: { $push: '$events' } } },
      { $project: { events: '$allEvents' } },
    ])

    const events = aggregation[0]?.events || []

    events.forEach((event) => {
      this.applyEvent(event)
    })
  }

  public applyEvent(event: UnsequencedVideoEvent) {
    switch (event.eventType) {
      case VideoEventType.AddView:
        this.applyAddViewEvent(event)
        break
      default:
        console.error(`Parsing unknown video event: ${event.eventType}`)
    }
  }

  private applyAddViewEvent(event: UnsequencedVideoEvent) {
    const currentVideoViews = this.videoViewsMap[event.videoId] || 0
    const currentChannelViews = this.channelViewsMap[event.channelId] || 0

    this.videoViewsMap[event.videoId] = currentVideoViews + 1
    this.channelViewsMap[event.channelId] = currentChannelViews + 1
  }
}

export const videoAggregate = new VideoAggregate()
