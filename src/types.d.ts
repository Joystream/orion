import { FollowsAggregate, ViewsAggregate } from './aggregates'

export type Aggregates = {
  viewsAggregate: ViewsAggregate
  followsAggregate: FollowsAggregate
}

export type Context = Aggregates
