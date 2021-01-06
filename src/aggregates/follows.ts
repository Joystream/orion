import { GenericAggregate } from './shared'
import {
  ChannelEvent,
  ChannelEventsBucketModel,
  ChannelEventType,
  UnsequencedChannelEvent,
} from '../models/ChannelEvent'

type ChannelEventsAggregationResult = {
  events?: ChannelEvent[]
}[]

export class FollowsAggregate implements GenericAggregate<ChannelEvent> {
  private channelFollowsMap: Record<string, number> = {}

  public channelFollows(channelId: string): number | null {
    return this.channelFollowsMap[channelId] ?? null
  }

  public getChannelFollowsMap() {
    return Object.freeze(this.channelFollowsMap)
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
    const currentChannelFollows = this.channelFollowsMap[event.channelId] || 0

    switch (event.type) {
      case ChannelEventType.FollowChannel:
        this.channelFollowsMap[event.channelId] = currentChannelFollows + 1
        break
      case ChannelEventType.UnfollowChannel:
        this.channelFollowsMap[event.channelId] = Math.max(currentChannelFollows - 1, 0)
        break
      default:
        console.error(`Parsing unknown channel event: ${event.type}`)
    }
  }
}
