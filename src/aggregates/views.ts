import { UnsequencedVideoEvent, VideoEvent, VideoEventsBucketModel, VideoEventType } from '../models/VideoEvent'
import { EntityViewsInfo } from '../entities/EntityViewsInfo'
import { mapPeriods } from '../resolvers/viewsInfo'
import { differenceInCalendarDays } from 'date-fns'

type VideoEventsAggregationResult = {
  events?: VideoEvent[]
}[]

type TimePeriodEventsData = {
  sevenDays: Partial<UnsequencedVideoEvent>[]
  thirtyDays: Partial<UnsequencedVideoEvent>[]
}

type TimePeriodViews = {
  sevenDays: EntityViewsInfo[]
  thirtyDays: EntityViewsInfo[]
}

export class ViewsAggregate {
  private videoViewsMap: Record<string, number> = {}
  private channelViewsMap: Record<string, number> = {}
  private categoryViewsMap: Record<string, number> = {}
  private timePeriodEvents: TimePeriodEventsData = {
    sevenDays: [],
    thirtyDays: [],
  }

  private timePeriodVideoViews: TimePeriodViews = {
    sevenDays: [],
    thirtyDays: [],
  }

  private timePeriodChannelViews: TimePeriodViews = {
    sevenDays: [],
    thirtyDays: [],
  }

  private timePeriodCategoryViews: TimePeriodViews = {
    sevenDays: [],
    thirtyDays: [],
  }

  private allViewsEvents: Partial<UnsequencedVideoEvent>[] = []
  private allVideoViews: EntityViewsInfo[] = []
  private allChannelViews: EntityViewsInfo[] = []
  private allCategoryViews: EntityViewsInfo[] = []

  private addOrUpdateViews(array: EntityViewsInfo[], id: string, action: 'add' | 'remove'): void {
    const i = array.findIndex((element) => element.id === id)
    if (i > -1) {
      if (!array[i].views && action === 'remove') return
      array[i].views = action === 'add' ? array[i].views + 1 : array[i].views - 1
    } else array.push({ id, views: action === 'add' ? 1 : 0 })
  }

  public filterEventsByPeriod(period: number) {
    const filteredEvents = []
    const mappedPeriod = mapPeriods(period)
    const views = this.timePeriodEvents[mappedPeriod]

    if (views.find(({ timestamp }) => timestamp && differenceInCalendarDays(new Date(), timestamp) > period)) {
      for (let i = 0; i < views.length; i++) {
        const { timestamp, videoId, channelId, categoryId } = views[i]
        if (timestamp && differenceInCalendarDays(new Date(), timestamp) <= period) {
          filteredEvents.push(views[i])
        } else if (videoId) {
          videoId && this.addOrUpdateViews(this.timePeriodVideoViews[mappedPeriod], videoId, 'remove')
          channelId && this.addOrUpdateViews(this.timePeriodChannelViews[mappedPeriod], channelId, 'remove')
          categoryId && this.addOrUpdateViews(this.timePeriodCategoryViews[mappedPeriod], categoryId, 'remove')
        }
      }
      this.timePeriodEvents[mappedPeriod] = filteredEvents
    }
  }

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

  public getAllVideoViews() {
    return this.allVideoViews
  }

  public getAllChannelViews() {
    return this.allChannelViews
  }

  public getAllCategoryViews() {
    return this.allCategoryViews
  }

  public getTimePeriodVideoViews() {
    return this.timePeriodVideoViews
  }

  public getTimePeriodChannelViews() {
    return this.timePeriodChannelViews
  }

  public getTimePeriodCategoryViews() {
    return this.timePeriodCategoryViews
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
        if (videoId) {
          this.addOrUpdateViews(this.timePeriodVideoViews.sevenDays, videoId, 'add')
          this.addOrUpdateViews(this.timePeriodVideoViews.thirtyDays, videoId, 'add')
          this.addOrUpdateViews(this.allVideoViews, videoId, 'add')
          this.videoViewsMap[videoId] = currentVideoViews + 1
        }
        if (channelId) {
          this.addOrUpdateViews(this.timePeriodChannelViews.sevenDays, channelId, 'add')
          this.addOrUpdateViews(this.timePeriodChannelViews.thirtyDays, channelId, 'add')
          this.addOrUpdateViews(this.allChannelViews, channelId, 'add')
          this.channelViewsMap[channelId] = currentChannelViews + 1
        }
        if (categoryId) {
          this.addOrUpdateViews(this.timePeriodCategoryViews.sevenDays, categoryId, 'add')
          this.addOrUpdateViews(this.timePeriodCategoryViews.thirtyDays, categoryId, 'add')
          this.addOrUpdateViews(this.allCategoryViews, categoryId, 'add')
          this.categoryViewsMap[categoryId] = currentCategoryViews + 1
        }
        this.timePeriodEvents = {
          sevenDays: [...this.timePeriodEvents.sevenDays, { videoId, channelId, categoryId, timestamp }],
          thirtyDays: [...this.timePeriodEvents.thirtyDays, { videoId, channelId, categoryId, timestamp }],
        }
        break
      default:
        console.error(`Parsing unknown video event: ${type}`)
    }
  }
}
