import { GenericAggregate } from './shared'
import {
  ChannelEvent,
  ChannelEventsBucketModel,
  ChannelEventType,
  UnsequencedChannelEvent,
} from '../models/ChannelEvent'

import { ChannelFollowsInfo } from '../entities/ChannelFollowsInfo'

type ChannelEventsAggregationResult = {
  events?: ChannelEvent[]
}[]

export class FollowsAggregate implements GenericAggregate<ChannelEvent> {
  private channelFollowsMap: Record<string, number> = {}
  private allChannelFollowEvents: Partial<UnsequencedChannelEvent>[] = []
  private allChannelFollows: ChannelFollowsInfo[] = []

  private addOrUpdateFollows(id: string, eventType: ChannelEventType): void {
    const i = this.allChannelFollows.findIndex((element) => element.id === id)
    if (i > -1) {
      if (!this.allChannelFollows[i].follows && eventType === ChannelEventType.UnfollowChannel) return
      this.allChannelFollows[i].follows =
        eventType === ChannelEventType.FollowChannel
          ? this.allChannelFollows[i].follows + 1
          : this.allChannelFollows[i].follows - 1
    } else this.allChannelFollows.push({ id, follows: eventType === ChannelEventType.UnfollowChannel ? 0 : 1 })
  }

  private addOrRemoveFollowEvent(eventType: ChannelEventType, { channelId, timestamp }: UnsequencedChannelEvent): void {
    if (eventType === ChannelEventType.FollowChannel) {
      this.allChannelFollowEvents = [...this.allChannelFollowEvents, { channelId, timestamp }]
    }
    if (eventType === ChannelEventType.UnfollowChannel) {
      const followEvent = this.allChannelFollowEvents.find((item) => item.channelId === channelId)
      if (followEvent) {
        this.allChannelFollowEvents.splice(this.allChannelFollowEvents.indexOf(followEvent), 1)
      }
    }
  }

  public channelFollows(channelId: string): number | null {
    return this.channelFollowsMap[channelId] ?? null
  }

  public getChannelFollowsMap() {
    return Object.freeze(this.channelFollowsMap)
  }

  public getAllFollowEvents() {
    return this.allChannelFollowEvents
  }

  public getAllChannelFollows() {
    return this.allChannelFollows
  }

  public static async Build(): Promise<FollowsAggregate> {
    const aggregation: ChannelEventsAggregationResult = await ChannelEventsBucketModel.aggregate([
      { $unwind: '$events' },
      { $group: { _id: null, allEvents: { $push: '$events' } } },
      { $project: { events: '$allEvents' } },
    ])

    const events = aggregation[0]?.events || []

    const aggregate = new FollowsAggregate()
    events.forEach((event) => {
      aggregate.applyEvent(event)
    })
    return aggregate
  }

  public applyEvent(event: UnsequencedChannelEvent) {
    const { channelId, type } = event
    const currentChannelFollows = this.channelFollowsMap[channelId] || 0

    switch (event.type) {
      case ChannelEventType.FollowChannel:
        this.channelFollowsMap[channelId] = currentChannelFollows + 1
        this.addOrUpdateFollows(channelId, ChannelEventType.FollowChannel)
        this.addOrRemoveFollowEvent(ChannelEventType.FollowChannel, event)
        break
      case ChannelEventType.UnfollowChannel:
        this.channelFollowsMap[channelId] = Math.max(currentChannelFollows - 1, 0)
        this.addOrUpdateFollows(channelId, ChannelEventType.UnfollowChannel)
        this.addOrRemoveFollowEvent(ChannelEventType.UnfollowChannel, event)
        break
      default:
        console.error(`Parsing unknown channel event: ${type}`)
    }
  }
}
