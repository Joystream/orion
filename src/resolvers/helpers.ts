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

// preferably this would be imported from @joystream/js -> https://github.com/Joystream/joystream/pull/4586
export const generateAppActionCommitment = (
  creatorId: string,
  assets: Uint8Array,
  rawAction: Uint8Array,
  rawAppActionMetadata: Uint8Array
): string => {
  const rawCommitment = [creatorId, u8aToHex(assets), u8aToHex(rawAction), u8aToHex(rawAppActionMetadata)]
  return stringToHex(JSON.stringify(rawCommitment))
}
