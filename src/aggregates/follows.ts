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
  private allChannelFollowsEvents: Partial<UnsequencedChannelEvent>[] = []
  private allChannelFollows: ChannelFollowsInfo[] = []

  private addOrUpdateFollows(array: ChannelFollowsInfo[], id: string, event: ChannelEventType): void {
    const i = array.findIndex((element) => element.id === id)
    if (i > -1) {
      if (!array[i].follows && event === ChannelEventType.UnfollowChannel) return
      array[i].follows = event === ChannelEventType.FollowChannel ? array[i].follows + 1 : array[i].follows - 1
    } else array.push({ id, follows: 1 })
  }

  public channelFollows(channelId: string): number | null {
    return this.channelFollowsMap[channelId] ?? null
  }

  public getChannelFollowsMap() {
    return Object.freeze(this.channelFollowsMap)
  }

  public getAllFollowsEvents() {
    return this.allChannelFollowsEvents
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
    const { channelId, type, timestamp } = event
    const currentChannelFollows = this.channelFollowsMap[channelId] || 0

    switch (event.type) {
      case ChannelEventType.FollowChannel:
        this.channelFollowsMap[channelId] = currentChannelFollows + 1
        this.addOrUpdateFollows(this.allChannelFollows, channelId, ChannelEventType.FollowChannel)
        this.allChannelFollowsEvents = [...this.allChannelFollowsEvents, { channelId, timestamp }]
        break
      case ChannelEventType.UnfollowChannel:
        this.channelFollowsMap[channelId] = Math.max(currentChannelFollows - 1, 0)
        this.addOrUpdateFollows(this.allChannelFollows, channelId, ChannelEventType.UnfollowChannel)
        break
      default:
        console.error(`Parsing unknown channel event: ${type}`)
    }
  }
}
