import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'
import * as v3 from './v3'

export class ContentChannelCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Content.ChannelCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV3(): boolean {
    return this._chain.getEventHash('Content.ChannelCreated') === '57e84db58223c8be367ced4c4a153fc227fa5099a2d8d8d9d5e1d28a8571b1d8'
  }

  get asV3(): [bigint, v3.ChannelRecord, v3.ChannelCreationParametersRecord, Uint8Array] {
    assert(this.isV3)
    return this._chain.decodeEvent(this.event)
  }
}

export class ContentVideoCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Content.VideoCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV3(): boolean {
    return this._chain.getEventHash('Content.VideoCreated') === 'd76167e13d4e6e2436039344843e4cd10524033f21e76f03e30451fb62ea40d9'
  }

  get asV3(): [v3.ContentActor, bigint, bigint, v3.VideoCreationParametersRecord, bigint[]] {
    assert(this.isV3)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemExtrinsicSuccessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.ExtrinsicSuccess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An extrinsic completed successfully.
   */
  get isV3(): boolean {
    return this._chain.getEventHash('System.ExtrinsicSuccess') === '407ed94c14f243acbe2cdb53df52c37d97bbb5ae550a10a6036bf59677cdd165'
  }

  /**
   * An extrinsic completed successfully.
   */
  get asV3(): {dispatchInfo: v3.DispatchInfo} {
    assert(this.isV3)
    return this._chain.decodeEvent(this.event)
  }
}
