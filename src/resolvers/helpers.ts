import { stringToHex, u8aToHex } from '@polkadot/util'
import { OrionContext } from '../types'
import { mapPeriods } from '../helpers'

export type IdsInPeriodOpts = {
  period: 7 | 30 | null
  limit: number
}
export const getMostViewedVideosIds = (context: OrionContext, { period, limit }: IdsInPeriodOpts) => {
  // prepare aggregate
  if (period) {
    context.viewsAggregate.filterEventsByPeriod(period)
  }

  const views = period
    ? context.viewsAggregate.getTimePeriodVideoViews()[mapPeriods(period)]
    : context.viewsAggregate.getAllVideoViews()
  const limitedViews = views.slice(0, limit)

  return limitedViews.filter((entity) => entity.views).map((entity) => entity.id)
}

export const getMostViewedChannelsIds = (context: OrionContext, { period, limit }: IdsInPeriodOpts) => {
  // prepare aggregate
  if (period) {
    context.viewsAggregate.filterEventsByPeriod(period)
  }

  const views = period
    ? context.viewsAggregate.getTimePeriodChannelViews()[mapPeriods(period)]
    : context.viewsAggregate.getAllChannelViews()
  const limitedViews = views.slice(0, limit)

  return limitedViews.filter((entity) => entity.views).map((entity) => entity.id)
}

export const getMostFollowedChannelsIds = (context: OrionContext, { period, limit }: IdsInPeriodOpts) => {
  // prepare aggregate
  if (period) {
    context.followsAggregate.filterEventsByPeriod(period)
  }

  const follows = period
    ? context.followsAggregate.getTimePeriodChannelFollows()[mapPeriods(period)]
    : context.followsAggregate.getAllChannelFollows()
  const limitedFollows = follows.slice(0, limit)

  return limitedFollows.filter((entity) => entity.follows).map((entity) => entity.id)
}
