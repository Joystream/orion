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

  private addOrUpdateViews(array: EntityViewsInfo[], id: string, shouldAdd = true): void {
    const viewsObject = array.find((element) => element.id === id)

    if (viewsObject) {
      if (!viewsObject.views && !shouldAdd) return

      if (shouldAdd) {
        viewsObject.views++
      } else {
        viewsObject.views--
      }
    } else {
      array.push({ id, views: shouldAdd ? 1 : 0 })
    }

    array.sort((a, b) => (a.views > b.views ? -1 : 1))
  }

  public filterEventsByPeriod(timePeriodDays: number) {
    const mappedPeriod = mapPeriods(timePeriodDays)
    const viewEvents = this.timePeriodEvents[mappedPeriod]

    // find index of first event that should be kept
    const firstEventToIncludeIdx = viewEvents.findIndex(
      (view) => view.timestamp && differenceInCalendarDays(new Date(), view.timestamp) <= timePeriodDays
    )

    // update views with all of the events that should be removed
    for (let i = 0; i < firstEventToIncludeIdx; i++) {
      const { videoId, channelId, categoryId } = viewEvents[i]

      if (videoId) {
        this.addOrUpdateViews(this.timePeriodVideoViews[mappedPeriod], videoId, false)
      }
      if (channelId) {
        this.addOrUpdateViews(this.timePeriodChannelViews[mappedPeriod], channelId, false)
      }
      if (categoryId) {
        this.addOrUpdateViews(this.timePeriodCategoryViews[mappedPeriod], categoryId, false)
      }
    }

    // remove older events
    this.timePeriodEvents[mappedPeriod] = viewEvents.slice(firstEventToIncludeIdx)
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
    const { type, ...eventWithoutType } = event
    const { videoId, channelId, categoryId } = eventWithoutType
    const currentVideoViews = videoId ? this.videoViewsMap[videoId] || 0 : 0
    const currentChannelViews = channelId ? this.channelViewsMap[channelId] || 0 : 0
    const currentCategoryViews = categoryId ? this.categoryViewsMap[categoryId] || 0 : 0

    switch (type) {
      case VideoEventType.AddView:
        if (videoId) {
          this.addOrUpdateViews(this.timePeriodVideoViews.sevenDays, videoId)
          this.addOrUpdateViews(this.timePeriodVideoViews.thirtyDays, videoId)
          this.addOrUpdateViews(this.allVideoViews, videoId)
          this.videoViewsMap[videoId] = currentVideoViews + 1
        }
        if (channelId) {
          this.addOrUpdateViews(this.timePeriodChannelViews.sevenDays, channelId)
          this.addOrUpdateViews(this.timePeriodChannelViews.thirtyDays, channelId)
          this.addOrUpdateViews(this.allChannelViews, channelId)
          this.channelViewsMap[channelId] = currentChannelViews + 1
        }
        if (categoryId) {
          this.addOrUpdateViews(this.timePeriodCategoryViews.sevenDays, categoryId)
          this.addOrUpdateViews(this.timePeriodCategoryViews.thirtyDays, categoryId)
          this.addOrUpdateViews(this.allCategoryViews, categoryId)
          this.categoryViewsMap[categoryId] = currentCategoryViews + 1
        }

        this.timePeriodEvents.sevenDays.push(eventWithoutType)
        this.timePeriodEvents.thirtyDays.push(eventWithoutType)

        break
      default:
        console.error(`Parsing unknown video event: ${type}`)
    }
  }
}
