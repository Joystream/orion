import { GenericAggregate } from './shared'
import { ChannelEvent, ChannelEventModel, ChannelEventType } from '../models/ChannelEvent'

import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'
import { mapPeriods } from '../helpers'
import { differenceInCalendarDays } from 'date-fns'

type TimePeriodEventsData = {
  sevenDays: Partial<ChannelEvent>[]
  thirtyDays: Partial<ChannelEvent>[]
}

type TimePeriodFollows = {
  sevenDays: ChannelFollowsInfo[]
  thirtyDays: ChannelFollowsInfo[]
}

export class FollowsAggregate implements GenericAggregate<ChannelEvent> {
  private channelFollowsMap: Record<string, number> = {}
  private allChannelFollows: ChannelFollowsInfo[] = []

  private timePeriodEvents: TimePeriodEventsData = {
    sevenDays: [],
    thirtyDays: [],
  }

  private timePeriodChannelFollows: TimePeriodFollows = {
    sevenDays: [],
    thirtyDays: [],
  }

  private addOrUpdateFollows(array: ChannelFollowsInfo[], id: string, shouldAdd = true): void {
    const followsObject = array.find((element) => element.id === id)

    if (followsObject) {
      if (!followsObject.follows && !shouldAdd) return

      if (shouldAdd) {
        followsObject.follows++
      } else {
        followsObject.follows--
      }
    } else {
      array.push({ id, follows: shouldAdd ? 1 : 0 })
    }

    array.sort((a, b) => (a.follows > b.follows ? -1 : 1))
  }

  private addOrRemoveFollowEvent(
    array: Partial<ChannelEvent>[],
    eventType: ChannelEventType,
    { channelId, timestamp }: ChannelEvent
  ): void {
    if (eventType === ChannelEventType.FollowChannel) {
      array.push({ channelId, timestamp })
    }
    if (eventType === ChannelEventType.UnfollowChannel) {
      const index = array.findIndex((item) => item.channelId === channelId)
      if (index >= 0) {
        array.splice(index, 1)
      }
    }
  }

  public filterEventsByPeriod(timePeriodDays: 7 | 30) {
    const mappedPeriod = mapPeriods(timePeriodDays)
    const followEvents = this.timePeriodEvents[mappedPeriod]

    // find index of first event that should be kept
    const firstEventToIncludeIdx = followEvents.findIndex(
      (follow) => follow.timestamp && differenceInCalendarDays(new Date(), follow.timestamp) <= timePeriodDays
    )

    for (let i = 0; i < firstEventToIncludeIdx; i++) {
      const { channelId } = followEvents[i]

      if (channelId) {
        this.addOrUpdateFollows(this.timePeriodChannelFollows[mappedPeriod], channelId, false)
      }
    }

    // remove older events
    this.timePeriodEvents[mappedPeriod] = followEvents.slice(firstEventToIncludeIdx)
  }

  public channelFollows(channelId: string): number | null {
    return this.channelFollowsMap[channelId] ?? null
  }

  public getChannelFollowsMap() {
    return Object.freeze(this.channelFollowsMap)
  }

  public getAllChannelFollows() {
    return this.allChannelFollows
  }

  public getTimePeriodChannelFollows() {
    return this.timePeriodChannelFollows
  }

  public static async Build(): Promise<FollowsAggregate> {
    const events = await ChannelEventModel.find({}).lean()

    const aggregate = new FollowsAggregate()
    events.forEach((event) => {
      aggregate.applyEvent(event)
    })

    aggregate.filterEventsByPeriod(7)
    aggregate.filterEventsByPeriod(30)

    return aggregate
  }

  public applyEvent(event: ChannelEvent) {
    const { type, ...eventWithoutType } = event
    const { channelId } = eventWithoutType
    const currentChannelFollows = this.channelFollowsMap[channelId] || 0

    switch (type) {
      case ChannelEventType.FollowChannel:
        this.channelFollowsMap[channelId] = currentChannelFollows + 1
        this.addOrUpdateFollows(this.allChannelFollows, channelId)
        this.addOrUpdateFollows(this.timePeriodChannelFollows.sevenDays, channelId)
        this.addOrUpdateFollows(this.timePeriodChannelFollows.thirtyDays, channelId)
        this.addOrRemoveFollowEvent(this.timePeriodEvents.sevenDays, ChannelEventType.FollowChannel, event)
        this.addOrRemoveFollowEvent(this.timePeriodEvents.thirtyDays, ChannelEventType.FollowChannel, event)
        break
      case ChannelEventType.UnfollowChannel:
        this.channelFollowsMap[channelId] = Math.max(currentChannelFollows - 1, 0)
        this.addOrUpdateFollows(this.allChannelFollows, channelId, false)
        this.addOrUpdateFollows(this.timePeriodChannelFollows.sevenDays, channelId, false)
        this.addOrUpdateFollows(this.timePeriodChannelFollows.thirtyDays, channelId, false)
        this.addOrRemoveFollowEvent(this.timePeriodEvents.sevenDays, ChannelEventType.UnfollowChannel, event)
        this.addOrRemoveFollowEvent(this.timePeriodEvents.thirtyDays, ChannelEventType.UnfollowChannel, event)
        break
      default:
        console.error(`Parsing unknown channel event: ${type}`)
    }
  }
}
