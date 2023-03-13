import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v1000 from './v1000'
import * as v2001 from './v2001'

export class ContentAuctionBidCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.AuctionBidCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.AuctionBidCanceled') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110'
    }

    get asV1000(): [bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentAuctionBidMadeEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.AuctionBidMade')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.AuctionBidMade') === 'bcafd0d37bce2fe783b98aaa33d1909e0c6e142b99bc7825473a4936f1475025'
    }

    get asV1000(): [bigint, bigint, bigint, (bigint | undefined)] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentAuctionCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.AuctionCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.AuctionCanceled') === '48a22056559f8981366eaf63cf3efad925fd24c56f7d28d373458c2ebc4bb415'
    }

    get asV1000(): [v1000.ContentActor, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentBidMadeCompletingAuctionEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.BidMadeCompletingAuction')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.BidMadeCompletingAuction') === '91264357064d8d3d661b6fc1d1a98e7c18dae959a65f1e867909106e18a4a871'
    }

    get asV1000(): [bigint, bigint, (bigint | undefined)] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentBuyNowCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.BuyNowCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.BuyNowCanceled') === '3b47d764c1ffe81d817bcba7109d633ce8a964e97cceeac157b2c951f61b001d'
    }

    get asV1000(): [bigint, v1000.ContentActor] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentBuyNowPriceUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.BuyNowPriceUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.BuyNowPriceUpdated') === 'cebfba3ae629656a1b23fba2233f6c98894c68c68b5cb558a92842730402fd44'
    }

    get asV1000(): [bigint, v1000.ContentActor, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelAgentRemarkedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelAgentRemarked')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelAgentRemarked') === 'fa4d8d29128018b630ceab7a5e5b148d417929825da537a24b441dd6b1a0be8c'
    }

    get asV1000(): [v1000.ContentActor, bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

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

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelCreated') === '57e84db58223c8be367ced4c4a153fc227fa5099a2d8d8d9d5e1d28a8571b1d8'
    }

    get asV1000(): [bigint, v1000.ChannelRecord, v1000.ChannelCreationParametersRecord, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelDeleted') === '48a22056559f8981366eaf63cf3efad925fd24c56f7d28d373458c2ebc4bb415'
    }

    get asV1000(): [v1000.ContentActor, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelDeletedByModeratorEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelDeletedByModerator')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelDeletedByModerator') === 'fa4d8d29128018b630ceab7a5e5b148d417929825da537a24b441dd6b1a0be8c'
    }

    get asV1000(): [v1000.ContentActor, bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelFundsWithdrawnEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelFundsWithdrawn')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelFundsWithdrawn') === '7dca80457bf01f2cc037aae08e74e23bbe427f74ec7529d9dbd569314f36d7a3'
    }

    get asV1000(): [v1000.ContentActor, bigint, bigint, v1000.ChannelFundsDestination] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelOwnerRemarkedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelOwnerRemarked')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Metaprotocols related event
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelOwnerRemarked') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16'
    }

    /**
     * Metaprotocols related event
     */
    get asV1000(): [bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelPayoutsUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelPayoutsUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelPayoutsUpdated') === '43f24894d83a34bdba24e7c8b702850c31fdfd305d0c16c1422595219a8036ad'
    }

    get asV1000(): [v1000.UpdateChannelPayoutsParametersRecord, (bigint | undefined)] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }

    get isV2001(): boolean {
        return this._chain.getEventHash('Content.ChannelPayoutsUpdated') === '6567c63f09efa37dc8a93882508851cb70d29e50fe45f52683626235bf1ca4b7'
    }

    get asV2001(): [v2001.UpdateChannelPayoutsParametersRecord, (bigint | undefined), Uint8Array] {
        assert(this.isV2001)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelRewardClaimedAndWithdrawnEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelRewardClaimedAndWithdrawn')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelRewardClaimedAndWithdrawn') === '7dca80457bf01f2cc037aae08e74e23bbe427f74ec7529d9dbd569314f36d7a3'
    }

    get asV1000(): [v1000.ContentActor, bigint, bigint, v1000.ChannelFundsDestination] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelRewardUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelRewardUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelRewardUpdated') === '2bd477437892e2d50fa06bf72436226e2c75b8369c9a637d70237478ef09abe2'
    }

    get asV1000(): [bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }

    get isV2001(): boolean {
        return this._chain.getEventHash('Content.ChannelRewardUpdated') === '2cb4802d5a072bd911a6f8ed2359f802db328fdf5e5f157925b0871831b3193c'
    }

    get asV2001(): [bigint, bigint, bigint] {
        assert(this.isV2001)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelUpdated') === 'c789826ee1aec5f7fb0f59e67414b4a392cc79d9e5c714b33aba6e123643f455'
    }

    get asV1000(): [v1000.ContentActor, bigint, v1000.ChannelUpdateParametersRecord, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentChannelVisibilitySetByModeratorEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.ChannelVisibilitySetByModerator')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.ChannelVisibilitySetByModerator') === 'cf849322ba1879fc99d8b7a515af0b8d4459283258ace34216380100eb86e498'
    }

    get asV1000(): [v1000.ContentActor, bigint, boolean, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentEnglishAuctionSettledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.EnglishAuctionSettled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.EnglishAuctionSettled') === '5e0eb9075960a18f82f813e13501ef4a17c375bbb914d5cd7d61bfccc134745a'
    }

    get asV1000(): [bigint, Uint8Array, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentEnglishAuctionStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.EnglishAuctionStarted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.EnglishAuctionStarted') === 'c9dbfde7fcc71c651d1bd1112b88993bba1c36783f97a23dbbe31a2cf82e3222'
    }

    get asV1000(): [v1000.ContentActor, bigint, v1000.EnglishAuctionParamsRecord] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentNftBoughtEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.NftBought')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.NftBought') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110'
    }

    get asV1000(): [bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentNftIssuedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.NftIssued')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.NftIssued') === '8a65dbd390f4bddd39c85cb6880eddd0c9195d763f1973d927795f1351874f8b'
    }

    get asV1000(): [v1000.ContentActor, bigint, v1000.NftIssuanceParametersRecord] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentNftSellOrderMadeEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.NftSellOrderMade')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.NftSellOrderMade') === 'cebfba3ae629656a1b23fba2233f6c98894c68c68b5cb558a92842730402fd44'
    }

    get asV1000(): [bigint, v1000.ContentActor, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentNftSlingedBackToTheOriginalArtistEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.NftSlingedBackToTheOriginalArtist')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.NftSlingedBackToTheOriginalArtist') === '3b47d764c1ffe81d817bcba7109d633ce8a964e97cceeac157b2c951f61b001d'
    }

    get asV1000(): [bigint, v1000.ContentActor] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentOfferAcceptedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.OfferAccepted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.OfferAccepted') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    get asV1000(): bigint {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentOfferCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.OfferCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.OfferCanceled') === '3b47d764c1ffe81d817bcba7109d633ce8a964e97cceeac157b2c951f61b001d'
    }

    get asV1000(): [bigint, v1000.ContentActor] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentOfferStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.OfferStarted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.OfferStarted') === '78d6881bd7c7cc4612a401ffdb4c972bbc18693242ce246034d51b021d789614'
    }

    get asV1000(): [bigint, v1000.ContentActor, bigint, (bigint | undefined)] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentOpenAuctionBidAcceptedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.OpenAuctionBidAccepted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.OpenAuctionBidAccepted') === '815d65d68b303087f052b8eda6eea7379a258cfe398a9691efddb30c9d647a3a'
    }

    get asV1000(): [v1000.ContentActor, bigint, bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentOpenAuctionStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.OpenAuctionStarted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.OpenAuctionStarted') === 'fc7cf3f82d767a3293aaa31ad06b82bfc54ad134429f01c1b0b088369e34b7ee'
    }

    get asV1000(): [v1000.ContentActor, bigint, v1000.OpenAuctionParamsRecord, bigint] {
        assert(this.isV1000)
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

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.VideoCreated') === 'd76167e13d4e6e2436039344843e4cd10524033f21e76f03e30451fb62ea40d9'
    }

    get asV1000(): [v1000.ContentActor, bigint, bigint, v1000.VideoCreationParametersRecord, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentVideoDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.VideoDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.VideoDeleted') === '48a22056559f8981366eaf63cf3efad925fd24c56f7d28d373458c2ebc4bb415'
    }

    get asV1000(): [v1000.ContentActor, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentVideoDeletedByModeratorEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.VideoDeletedByModerator')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.VideoDeletedByModerator') === 'fa4d8d29128018b630ceab7a5e5b148d417929825da537a24b441dd6b1a0be8c'
    }

    get asV1000(): [v1000.ContentActor, bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentVideoUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.VideoUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.VideoUpdated') === '96ed5bbd21a4e24af6f21b01922119297ee1904daacc6e5aeed2be7e02ac7b60'
    }

    get asV1000(): [v1000.ContentActor, bigint, v1000.VideoUpdateParametersRecord, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContentVideoVisibilitySetByModeratorEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Content.VideoVisibilitySetByModerator')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Content.VideoVisibilitySetByModerator') === 'cf849322ba1879fc99d8b7a515af0b8d4459283258ace34216380100eb86e498'
    }

    get asV1000(): [v1000.ContentActor, bigint, boolean, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMemberAccountsUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MemberAccountsUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MemberAccountsUpdated') === 'd695c224088eed4d558c9e154ea4a06c2f1e0716e32de4ca9440d61de41f49c5'
    }

    get asV1000(): [bigint, (Uint8Array | undefined), (Uint8Array | undefined)] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMemberCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MemberCreated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MemberCreated') === '751306aae13554af36cc495242806da01d33d1fb738cb688c0d978abb28b1a6e'
    }

    get asV1000(): [bigint, v1000.CreateMemberParameters, number] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMemberInvitedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MemberInvited')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MemberInvited') === '9d8f35b29ce26c064d2a68c9a2c691c6e8b59be690d469e1fdbbeb86d318c2ef'
    }

    get asV1000(): [bigint, v1000.InviteMembershipParameters] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }

    get isV2001(): boolean {
        return this._chain.getEventHash('Members.MemberInvited') === '2f40067e3af4b48461e4507b5e8d3f2cda085bea2ea03ea8114789c0589accfe'
    }

    get asV2001(): [bigint, v2001.InviteMembershipParameters, bigint] {
        assert(this.isV2001)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMemberProfileUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MemberProfileUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MemberProfileUpdated') === '452c2e916d7f5dfaeb4259ee13f4a92e98d09dcd9bcc992ee5e6619e76c84d93'
    }

    get asV1000(): [bigint, (Uint8Array | undefined), (Uint8Array | undefined)] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMemberRemarkedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MemberRemarked')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MemberRemarked') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16'
    }

    get asV1000(): [bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }

    get isV2001(): boolean {
        return this._chain.getEventHash('Members.MemberRemarked') === '800e11437fa752c6c57a4245f54183c0c5c445b438324a6d5c2f2272b4bd0e2a'
    }

    get asV2001(): [bigint, Uint8Array, ([Uint8Array, bigint] | undefined)] {
        assert(this.isV2001)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMembershipBoughtEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MembershipBought')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MembershipBought') === '8da963ab30c855bf7b92d704fdfce82f755dd6c3b96ca76c101412f271da61fb'
    }

    get asV1000(): [bigint, v1000.BuyMembershipParameters, number] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class MembersMembershipGiftedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Members.MembershipGifted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MembershipGifted') === 'c392e4a758058424370088a9d121c415a25c88267c35b0376f23bf6ef1fce4f5'
    }

    get asV1000(): [bigint, v1000.GiftMembershipParameters] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDataObjectsDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DataObjectsDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on data objects deletion from bags.
     * Params
     * - account ID for the state bloat bond
     * - bag ID
     * - data object IDs
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DataObjectsDeleted') === '089fda898662ac18f06352e2f758f12f2374c2bc61e9658a1dcdd199134cd4cd'
    }

    /**
     * Emits on data objects deletion from bags.
     * Params
     * - account ID for the state bloat bond
     * - bag ID
     * - data object IDs
     */
    get asV1000(): [Uint8Array, v1000.BagIdType, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDataObjectsMovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DataObjectsMoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on moving data objects between bags.
     * Params
     * - source bag ID
     * - destination bag ID
     * - data object IDs
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DataObjectsMoved') === '51897f8342fc98ab8ea5716cf49ff2ec20cbd66aa7b729636b84afcd170d3227'
    }

    /**
     * Emits on moving data objects between bags.
     * Params
     * - source bag ID
     * - destination bag ID
     * - data object IDs
     */
    get asV1000(): [v1000.BagIdType, v1000.BagIdType, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDataObjectsUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DataObjectsUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on storage assets being uploaded and deleted at the same time
     * Params
     * - UploadParameters
     * - Ids of the uploaded objects
     * - Ids of the removed objects
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DataObjectsUpdated') === 'f92dd7eaf7cf23e34b451220470369fdad47712c5fc0d913ea3ea5fbbb17f146'
    }

    /**
     * Emits on storage assets being uploaded and deleted at the same time
     * Params
     * - UploadParameters
     * - Ids of the uploaded objects
     * - Ids of the removed objects
     */
    get asV1000(): [v1000.UploadParametersRecord, bigint[], bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDataObjectsUploadedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DataObjectsUploaded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on uploading data objects.
     * Params
     * - data objects IDs
     * - initial uploading parameters
     * - state bloat bond for objects
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DataObjectsUploaded') === '51ab5b7cd03619066e4736096d30e22c7ed970e371d187c2f79fcd80b1079cbe'
    }

    /**
     * Emits on uploading data objects.
     * Params
     * - data objects IDs
     * - initial uploading parameters
     * - state bloat bond for objects
     */
    get asV1000(): [bigint[], v1000.UploadParametersRecord, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on creating distribution bucket.
     * Params
     * - distribution bucket family ID
     * - accepting new bags
     * - distribution bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketCreated') === '54956f7b7836f3084b9468e6dea07b31ef1b8f8eb925bbbc6e3dd0d2721aa4db'
    }

    /**
     * Emits on creating distribution bucket.
     * Params
     * - distribution bucket family ID
     * - accepting new bags
     * - distribution bucket ID
     */
    get asV1000(): [bigint, boolean, v1000.DistributionBucketIdRecord] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on deleting distribution bucket.
     * Params
     * - distribution bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketDeleted') === '83299eeb2921cc018b349f5fd5743ea5c672fd4b8ae6135a7cae3eee869c019a'
    }

    /**
     * Emits on deleting distribution bucket.
     * Params
     * - distribution bucket ID
     */
    get asV1000(): v1000.DistributionBucketIdRecord {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketFamilyCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketFamilyCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on creating distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketFamilyCreated') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    /**
     * Emits on creating distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get asV1000(): bigint {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketFamilyDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketFamilyDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on deleting distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketFamilyDeleted') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    /**
     * Emits on deleting distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get asV1000(): bigint {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketFamilyMetadataSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketFamilyMetadataSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on setting the metadata by a distribution bucket family.
     * Params
     * - distribution bucket family ID
     * - metadata
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketFamilyMetadataSet') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16'
    }

    /**
     * Emits on setting the metadata by a distribution bucket family.
     * Params
     * - distribution bucket family ID
     * - metadata
     */
    get asV1000(): [bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketInvitationAcceptedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketInvitationAccepted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on accepting a distribution bucket invitation for the operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketInvitationAccepted') === '292bf26e5d1a7833ffa5a7bfc6c478c38e2f26e9b6a76ac99098d20edc49c841'
    }

    /**
     * Emits on accepting a distribution bucket invitation for the operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     */
    get asV1000(): [bigint, v1000.DistributionBucketIdRecord] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketInvitationCancelledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketInvitationCancelled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on canceling a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - operator worker ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketInvitationCancelled') === '4564625b8e17a286b9ea188e034d4d50935ea20156e9d5e6663262cebba8b657'
    }

    /**
     * Emits on canceling a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - operator worker ID
     */
    get asV1000(): [v1000.DistributionBucketIdRecord, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketMetadataSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketMetadataSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on setting the metadata by a distribution bucket operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     * - metadata
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketMetadataSet') === 'a2c8f4494a55130d76bb916a8ee87b52fc38ef4aa1b7014c55c5ee98b5e889a1'
    }

    /**
     * Emits on setting the metadata by a distribution bucket operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     * - metadata
     */
    get asV1000(): [bigint, v1000.DistributionBucketIdRecord, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketModeUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketModeUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on storage bucket mode update (distributing flag).
     * Params
     * - distribution bucket ID
     * - distributing
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketModeUpdated') === '4096b467ec8fba7d644572a0158390d5407e5cfbf96734b3cc48b4015a3e5403'
    }

    /**
     * Emits on storage bucket mode update (distributing flag).
     * Params
     * - distribution bucket ID
     * - distributing
     */
    get asV1000(): [v1000.DistributionBucketIdRecord, boolean] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketOperatorInvitedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketOperatorInvited')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on creating a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - worker ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketOperatorInvited') === '4564625b8e17a286b9ea188e034d4d50935ea20156e9d5e6663262cebba8b657'
    }

    /**
     * Emits on creating a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - worker ID
     */
    get asV1000(): [v1000.DistributionBucketIdRecord, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketOperatorRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketOperatorRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on the distribution bucket operator removal.
     * Params
     * - distribution bucket ID
     * - distribution bucket operator ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketOperatorRemoved') === '4564625b8e17a286b9ea188e034d4d50935ea20156e9d5e6663262cebba8b657'
    }

    /**
     * Emits on the distribution bucket operator removal.
     * Params
     * - distribution bucket ID
     * - distribution bucket operator ID
     */
    get asV1000(): [v1000.DistributionBucketIdRecord, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketStatusUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketStatusUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on storage bucket status update (accepting new bags).
     * Params
     * - distribution bucket ID
     * - new status (accepting new bags)
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketStatusUpdated') === '4096b467ec8fba7d644572a0158390d5407e5cfbf96734b3cc48b4015a3e5403'
    }

    /**
     * Emits on storage bucket status update (accepting new bags).
     * Params
     * - distribution bucket ID
     * - new status (accepting new bags)
     */
    get asV1000(): [v1000.DistributionBucketIdRecord, boolean] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDistributionBucketsUpdatedForBagEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DistributionBucketsUpdatedForBag')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on updating distribution buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DistributionBucketsUpdatedForBag') === 'd853874d4930d916ef00b4f2c33dd7f9bae2253205432a54d0cc17ff2eb5ab7f'
    }

    /**
     * Emits on updating distribution buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get asV1000(): [v1000.BagIdType, bigint, bigint[], bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDynamicBagCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DynamicBagCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on creating a dynamic bag.
     * Params
     * - dynamic bag creation parameters
     * - uploaded data objects ids
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DynamicBagCreated') === '59b9634e37a32af8eabf0878d6e944494bf786658b941e19f3c43a98fe42b393'
    }

    /**
     * Emits on creating a dynamic bag.
     * Params
     * - dynamic bag creation parameters
     * - uploaded data objects ids
     */
    get asV1000(): [v1000.DynBagCreationParametersRecord, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageDynamicBagDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.DynamicBagDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on deleting a dynamic bag.
     * Params
     * - dynamic bag ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.DynamicBagDeleted') === 'e8ad511a7b8d90054f7e62cdb916ae4023a775b325f68c7ea40b11a8f7be8cfe'
    }

    /**
     * Emits on deleting a dynamic bag.
     * Params
     * - dynamic bag ID
     */
    get asV1000(): v1000.DynamicBagIdType {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StoragePendingDataObjectsAcceptedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.PendingDataObjectsAccepted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on accepting pending data objects.
     * Params
     * - storage bucket ID
     * - worker ID (storage provider ID)
     * - bag ID
     * - pending data objects
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.PendingDataObjectsAccepted') === '9181f49261c1939916fe85ff51eafca214e89f25eaf000f650f96c58be862e9b'
    }

    /**
     * Emits on accepting pending data objects.
     * Params
     * - storage bucket ID
     * - worker ID (storage provider ID)
     * - bag ID
     * - pending data objects
     */
    get asV1000(): [bigint, bigint, v1000.BagIdType, bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on creating the storage bucket.
     * Params
     * - storage bucket ID
     * - invited worker
     * - flag "accepting_new_bags"
     * - size limit for voucher,
     * - objects limit for voucher,
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketCreated') === '7afe7e6fead6347c347e4c0cb809937c5f974a190bb32b74aa03fc4e9256de8e'
    }

    /**
     * Emits on creating the storage bucket.
     * Params
     * - storage bucket ID
     * - invited worker
     * - flag "accepting_new_bags"
     * - size limit for voucher,
     * - objects limit for voucher,
     */
    get asV1000(): [bigint, (bigint | undefined), boolean, bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on storage bucket deleting.
     * Params
     * - storage bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketDeleted') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    /**
     * Emits on storage bucket deleting.
     * Params
     * - storage bucket ID
     */
    get asV1000(): bigint {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketInvitationAcceptedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketInvitationAccepted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on accepting the storage bucket invitation.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - transactor account ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketInvitationAccepted') === '3748537e4a3b2405abdbc6f66010bc29ca59a01e8fa9fbfffad8d55a0880ec92'
    }

    /**
     * Emits on accepting the storage bucket invitation.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - transactor account ID
     */
    get asV1000(): [bigint, bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketInvitationCancelledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketInvitationCancelled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on cancelling the storage bucket invitation.
     * Params
     * - storage bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketInvitationCancelled') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    /**
     * Emits on cancelling the storage bucket invitation.
     * Params
     * - storage bucket ID
     */
    get asV1000(): bigint {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketOperatorInvitedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketOperatorInvited')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on the storage bucket operator invitation.
     * Params
     * - storage bucket ID
     * - operator worker ID (storage provider ID)
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketOperatorInvited') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110'
    }

    /**
     * Emits on the storage bucket operator invitation.
     * Params
     * - storage bucket ID
     * - operator worker ID (storage provider ID)
     */
    get asV1000(): [bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketOperatorRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketOperatorRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on the storage bucket operator removal.
     * Params
     * - storage bucket ID
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketOperatorRemoved') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    /**
     * Emits on the storage bucket operator removal.
     * Params
     * - storage bucket ID
     */
    get asV1000(): bigint {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketStatusUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketStatusUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on storage bucket status update.
     * Params
     * - storage bucket ID
     * - new status
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketStatusUpdated') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614'
    }

    /**
     * Emits on storage bucket status update.
     * Params
     * - storage bucket ID
     * - new status
     */
    get asV1000(): [bigint, boolean] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketVoucherLimitsSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketVoucherLimitsSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on setting the storage bucket voucher limits.
     * Params
     * - storage bucket ID
     * - new total objects size limit
     * - new total objects number limit
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketVoucherLimitsSet') === '258d4f9d58528447eb0c3aa76dc96771fc911f4d37cac94534ebdfb0a4e962ae'
    }

    /**
     * Emits on setting the storage bucket voucher limits.
     * Params
     * - storage bucket ID
     * - new total objects size limit
     * - new total objects number limit
     */
    get asV1000(): [bigint, bigint, bigint] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageBucketsUpdatedForBagEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageBucketsUpdatedForBag')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on updating storage buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageBucketsUpdatedForBag') === '0eb807c40b96b7a35546726529576be0826c77024b06d453aba14904d28ed7f7'
    }

    /**
     * Emits on updating storage buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get asV1000(): [v1000.BagIdType, bigint[], bigint[]] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageStorageOperatorMetadataSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.StorageOperatorMetadataSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on setting the storage operator metadata.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - metadata
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.StorageOperatorMetadataSet') === '582c390b8c641f5fc98a7855175e82d670fb7a9f362dbd16a6f8a9b6db2b0edc'
    }

    /**
     * Emits on setting the storage operator metadata.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - metadata
     */
    get asV1000(): [bigint, bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class StorageVoucherChangedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Storage.VoucherChanged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Emits on changing the voucher for a storage bucket.
     * Params
     * - storage bucket ID
     * - new voucher
     */
    get isV1000(): boolean {
        return this._chain.getEventHash('Storage.VoucherChanged') === '41a939f14a6ac90498a57cf30a24ada8282640ea33385b965484ba7e530ee3b3'
    }

    /**
     * Emits on changing the voucher for a storage bucket.
     * Params
     * - storage bucket ID
     * - new voucher
     */
    get asV1000(): [bigint, v1000.Voucher] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }
}
