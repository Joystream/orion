import { UnsequencedVideoEvent, VideoEvent, VideoEventsBucketModel, VideoEventType } from '../models/VideoEvent'

type VideoEventsAggregationResult = {
  events?: VideoEvent[]
}[]

export class ViewsAggregate {
  private videoViewsMap: Record<string, number> = {}
  private channelViewsMap: Record<string, number> = {}
  private categoryViewsMap: Record<string, number> = {}
  private allViewsEvents: Partial<UnsequencedVideoEvent>[] = []

  public videoViews(videoId: string): number | null {
    return this.videoViewsMap[videoId] ?? null
  }

  public channelViews(channelId: string): number | null {
    return this.channelViewsMap[channelId] ?? null
  }

  public getAllViewsEvents() {
    return this.allViewsEvents
  }

  public getVideoViewsMap() {
    return Object.freeze(this.videoViewsMap)
  }

  public getChannelViewsMap() {
    return Object.freeze(this.channelViewsMap)
  }

  public static async Build() {
    const aggregation: VideoEventsAggregationResult = await VideoEventsBucketModel.aggregate([
      { $unwind: '$events' },
      { $group: { _id: null, allEvents: { $push: '$events' } } },
      { $project: { events: '$allEvents' } },
    ])

    const events = aggregation[0]?.events || []

    const aggregate = new ViewsAggregate()
    events.forEach((event) => {
      aggregate.applyEvent(event)
    })
    return aggregate
  }

  public applyEvent(event: UnsequencedVideoEvent) {
    const { videoId, channelId, categoryId, timestamp, type } = event
    const currentVideoViews = videoId ? this.videoViewsMap[videoId] || 0 : 0
    const currentChannelViews = channelId ? this.channelViewsMap[channelId] || 0 : 0
    const currentCategoryViews = categoryId ? this.categoryViewsMap[categoryId] || 0 : 0
    switch (type) {
      case VideoEventType.AddView:
        if (videoId) this.videoViewsMap[videoId] = currentVideoViews + 1
        if (channelId) this.channelViewsMap[channelId] = currentChannelViews + 1
        if (categoryId) this.categoryViewsMap[categoryId] = currentCategoryViews + 1
        this.allViewsEvents = [...this.allViewsEvents, { videoId, channelId, categoryId, timestamp }]
        break
      default:
        console.error(`Parsing unknown video event: ${type}`)
    }
  }
}
