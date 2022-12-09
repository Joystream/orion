"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageDistributionBucketInvitationAcceptedEvent = exports.StorageDistributionBucketFamilyMetadataSetEvent = exports.StorageDistributionBucketFamilyDeletedEvent = exports.StorageDistributionBucketFamilyCreatedEvent = exports.StorageDistributionBucketDeletedEvent = exports.StorageDistributionBucketCreatedEvent = exports.StorageDataObjectsUploadedEvent = exports.StorageDataObjectsUpdatedEvent = exports.StorageDataObjectsMovedEvent = exports.StorageDataObjectsDeletedEvent = exports.MembersMembershipGiftedEvent = exports.MembersMembershipBoughtEvent = exports.MembersMemberRemarkedEvent = exports.MembersMemberProfileUpdatedEvent = exports.MembersMemberInvitedEvent = exports.MembersMemberCreatedEvent = exports.MembersMemberAccountsUpdatedEvent = exports.ContentVideoVisibilitySetByModeratorEvent = exports.ContentVideoUpdatedEvent = exports.ContentVideoDeletedByModeratorEvent = exports.ContentVideoDeletedEvent = exports.ContentVideoCreatedEvent = exports.ContentOpenAuctionStartedEvent = exports.ContentOpenAuctionBidAcceptedEvent = exports.ContentOfferStartedEvent = exports.ContentOfferCanceledEvent = exports.ContentOfferAcceptedEvent = exports.ContentNftSlingedBackToTheOriginalArtistEvent = exports.ContentNftSellOrderMadeEvent = exports.ContentNftIssuedEvent = exports.ContentNftBoughtEvent = exports.ContentEnglishAuctionStartedEvent = exports.ContentEnglishAuctionSettledEvent = exports.ContentChannelVisibilitySetByModeratorEvent = exports.ContentChannelUpdatedEvent = exports.ContentChannelRewardUpdatedEvent = exports.ContentChannelRewardClaimedAndWithdrawnEvent = exports.ContentChannelPayoutsUpdatedEvent = exports.ContentChannelOwnerRemarkedEvent = exports.ContentChannelFundsWithdrawnEvent = exports.ContentChannelDeletedByModeratorEvent = exports.ContentChannelDeletedEvent = exports.ContentChannelCreatedEvent = exports.ContentChannelAgentRemarkedEvent = exports.ContentBuyNowPriceUpdatedEvent = exports.ContentBuyNowCanceledEvent = exports.ContentBidMadeCompletingAuctionEvent = exports.ContentAuctionCanceledEvent = exports.ContentAuctionBidMadeEvent = exports.ContentAuctionBidCanceledEvent = void 0;
exports.StorageVoucherChangedEvent = exports.StorageStorageOperatorMetadataSetEvent = exports.StorageStorageBucketsUpdatedForBagEvent = exports.StorageStorageBucketVoucherLimitsSetEvent = exports.StorageStorageBucketStatusUpdatedEvent = exports.StorageStorageBucketOperatorRemovedEvent = exports.StorageStorageBucketOperatorInvitedEvent = exports.StorageStorageBucketInvitationCancelledEvent = exports.StorageStorageBucketInvitationAcceptedEvent = exports.StorageStorageBucketDeletedEvent = exports.StorageStorageBucketCreatedEvent = exports.StoragePendingDataObjectsAcceptedEvent = exports.StorageDynamicBagDeletedEvent = exports.StorageDynamicBagCreatedEvent = exports.StorageDistributionBucketsUpdatedForBagEvent = exports.StorageDistributionBucketStatusUpdatedEvent = exports.StorageDistributionBucketOperatorRemovedEvent = exports.StorageDistributionBucketOperatorInvitedEvent = exports.StorageDistributionBucketModeUpdatedEvent = exports.StorageDistributionBucketMetadataSetEvent = exports.StorageDistributionBucketInvitationCancelledEvent = void 0;
const assert_1 = __importDefault(require("assert"));
class ContentAuctionBidCanceledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.AuctionBidCanceled');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.AuctionBidCanceled') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentAuctionBidCanceledEvent = ContentAuctionBidCanceledEvent;
class ContentAuctionBidMadeEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.AuctionBidMade');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.AuctionBidMade') === 'bcafd0d37bce2fe783b98aaa33d1909e0c6e142b99bc7825473a4936f1475025';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentAuctionBidMadeEvent = ContentAuctionBidMadeEvent;
class ContentAuctionCanceledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.AuctionCanceled');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.AuctionCanceled') === '48a22056559f8981366eaf63cf3efad925fd24c56f7d28d373458c2ebc4bb415';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentAuctionCanceledEvent = ContentAuctionCanceledEvent;
class ContentBidMadeCompletingAuctionEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.BidMadeCompletingAuction');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.BidMadeCompletingAuction') === '91264357064d8d3d661b6fc1d1a98e7c18dae959a65f1e867909106e18a4a871';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentBidMadeCompletingAuctionEvent = ContentBidMadeCompletingAuctionEvent;
class ContentBuyNowCanceledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.BuyNowCanceled');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.BuyNowCanceled') === '3b47d764c1ffe81d817bcba7109d633ce8a964e97cceeac157b2c951f61b001d';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentBuyNowCanceledEvent = ContentBuyNowCanceledEvent;
class ContentBuyNowPriceUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.BuyNowPriceUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.BuyNowPriceUpdated') === 'cebfba3ae629656a1b23fba2233f6c98894c68c68b5cb558a92842730402fd44';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentBuyNowPriceUpdatedEvent = ContentBuyNowPriceUpdatedEvent;
class ContentChannelAgentRemarkedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelAgentRemarked');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelAgentRemarked') === 'fa4d8d29128018b630ceab7a5e5b148d417929825da537a24b441dd6b1a0be8c';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelAgentRemarkedEvent = ContentChannelAgentRemarkedEvent;
class ContentChannelCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelCreated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelCreated') === '57e84db58223c8be367ced4c4a153fc227fa5099a2d8d8d9d5e1d28a8571b1d8';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelCreatedEvent = ContentChannelCreatedEvent;
class ContentChannelDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelDeleted') === '48a22056559f8981366eaf63cf3efad925fd24c56f7d28d373458c2ebc4bb415';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelDeletedEvent = ContentChannelDeletedEvent;
class ContentChannelDeletedByModeratorEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelDeletedByModerator');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelDeletedByModerator') === 'fa4d8d29128018b630ceab7a5e5b148d417929825da537a24b441dd6b1a0be8c';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelDeletedByModeratorEvent = ContentChannelDeletedByModeratorEvent;
class ContentChannelFundsWithdrawnEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelFundsWithdrawn');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelFundsWithdrawn') === '7dca80457bf01f2cc037aae08e74e23bbe427f74ec7529d9dbd569314f36d7a3';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelFundsWithdrawnEvent = ContentChannelFundsWithdrawnEvent;
class ContentChannelOwnerRemarkedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelOwnerRemarked');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Metaprotocols related event
     */
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelOwnerRemarked') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16';
    }
    /**
     * Metaprotocols related event
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelOwnerRemarkedEvent = ContentChannelOwnerRemarkedEvent;
class ContentChannelPayoutsUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelPayoutsUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelPayoutsUpdated') === '43f24894d83a34bdba24e7c8b702850c31fdfd305d0c16c1422595219a8036ad';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
    get isV2001() {
        return this._chain.getEventHash('Content.ChannelPayoutsUpdated') === '6567c63f09efa37dc8a93882508851cb70d29e50fe45f52683626235bf1ca4b7';
    }
    get asV2001() {
        (0, assert_1.default)(this.isV2001);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelPayoutsUpdatedEvent = ContentChannelPayoutsUpdatedEvent;
class ContentChannelRewardClaimedAndWithdrawnEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelRewardClaimedAndWithdrawn');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelRewardClaimedAndWithdrawn') === '7dca80457bf01f2cc037aae08e74e23bbe427f74ec7529d9dbd569314f36d7a3';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelRewardClaimedAndWithdrawnEvent = ContentChannelRewardClaimedAndWithdrawnEvent;
class ContentChannelRewardUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelRewardUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelRewardUpdated') === '2bd477437892e2d50fa06bf72436226e2c75b8369c9a637d70237478ef09abe2';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
    get isV2001() {
        return this._chain.getEventHash('Content.ChannelRewardUpdated') === '2cb4802d5a072bd911a6f8ed2359f802db328fdf5e5f157925b0871831b3193c';
    }
    get asV2001() {
        (0, assert_1.default)(this.isV2001);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelRewardUpdatedEvent = ContentChannelRewardUpdatedEvent;
class ContentChannelUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelUpdated') === 'c789826ee1aec5f7fb0f59e67414b4a392cc79d9e5c714b33aba6e123643f455';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelUpdatedEvent = ContentChannelUpdatedEvent;
class ContentChannelVisibilitySetByModeratorEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.ChannelVisibilitySetByModerator');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.ChannelVisibilitySetByModerator') === 'cf849322ba1879fc99d8b7a515af0b8d4459283258ace34216380100eb86e498';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentChannelVisibilitySetByModeratorEvent = ContentChannelVisibilitySetByModeratorEvent;
class ContentEnglishAuctionSettledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.EnglishAuctionSettled');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.EnglishAuctionSettled') === '5e0eb9075960a18f82f813e13501ef4a17c375bbb914d5cd7d61bfccc134745a';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentEnglishAuctionSettledEvent = ContentEnglishAuctionSettledEvent;
class ContentEnglishAuctionStartedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.EnglishAuctionStarted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.EnglishAuctionStarted') === 'c9dbfde7fcc71c651d1bd1112b88993bba1c36783f97a23dbbe31a2cf82e3222';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentEnglishAuctionStartedEvent = ContentEnglishAuctionStartedEvent;
class ContentNftBoughtEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.NftBought');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.NftBought') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentNftBoughtEvent = ContentNftBoughtEvent;
class ContentNftIssuedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.NftIssued');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.NftIssued') === '8a65dbd390f4bddd39c85cb6880eddd0c9195d763f1973d927795f1351874f8b';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentNftIssuedEvent = ContentNftIssuedEvent;
class ContentNftSellOrderMadeEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.NftSellOrderMade');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.NftSellOrderMade') === 'cebfba3ae629656a1b23fba2233f6c98894c68c68b5cb558a92842730402fd44';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentNftSellOrderMadeEvent = ContentNftSellOrderMadeEvent;
class ContentNftSlingedBackToTheOriginalArtistEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.NftSlingedBackToTheOriginalArtist');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.NftSlingedBackToTheOriginalArtist') === '3b47d764c1ffe81d817bcba7109d633ce8a964e97cceeac157b2c951f61b001d';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentNftSlingedBackToTheOriginalArtistEvent = ContentNftSlingedBackToTheOriginalArtistEvent;
class ContentOfferAcceptedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.OfferAccepted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.OfferAccepted') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentOfferAcceptedEvent = ContentOfferAcceptedEvent;
class ContentOfferCanceledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.OfferCanceled');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.OfferCanceled') === '3b47d764c1ffe81d817bcba7109d633ce8a964e97cceeac157b2c951f61b001d';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentOfferCanceledEvent = ContentOfferCanceledEvent;
class ContentOfferStartedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.OfferStarted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.OfferStarted') === '78d6881bd7c7cc4612a401ffdb4c972bbc18693242ce246034d51b021d789614';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentOfferStartedEvent = ContentOfferStartedEvent;
class ContentOpenAuctionBidAcceptedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.OpenAuctionBidAccepted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.OpenAuctionBidAccepted') === '815d65d68b303087f052b8eda6eea7379a258cfe398a9691efddb30c9d647a3a';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentOpenAuctionBidAcceptedEvent = ContentOpenAuctionBidAcceptedEvent;
class ContentOpenAuctionStartedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.OpenAuctionStarted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.OpenAuctionStarted') === 'fc7cf3f82d767a3293aaa31ad06b82bfc54ad134429f01c1b0b088369e34b7ee';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentOpenAuctionStartedEvent = ContentOpenAuctionStartedEvent;
class ContentVideoCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.VideoCreated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.VideoCreated') === 'd76167e13d4e6e2436039344843e4cd10524033f21e76f03e30451fb62ea40d9';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentVideoCreatedEvent = ContentVideoCreatedEvent;
class ContentVideoDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.VideoDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.VideoDeleted') === '48a22056559f8981366eaf63cf3efad925fd24c56f7d28d373458c2ebc4bb415';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentVideoDeletedEvent = ContentVideoDeletedEvent;
class ContentVideoDeletedByModeratorEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.VideoDeletedByModerator');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.VideoDeletedByModerator') === 'fa4d8d29128018b630ceab7a5e5b148d417929825da537a24b441dd6b1a0be8c';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentVideoDeletedByModeratorEvent = ContentVideoDeletedByModeratorEvent;
class ContentVideoUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.VideoUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.VideoUpdated') === '96ed5bbd21a4e24af6f21b01922119297ee1904daacc6e5aeed2be7e02ac7b60';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentVideoUpdatedEvent = ContentVideoUpdatedEvent;
class ContentVideoVisibilitySetByModeratorEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Content.VideoVisibilitySetByModerator');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Content.VideoVisibilitySetByModerator') === 'cf849322ba1879fc99d8b7a515af0b8d4459283258ace34216380100eb86e498';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.ContentVideoVisibilitySetByModeratorEvent = ContentVideoVisibilitySetByModeratorEvent;
class MembersMemberAccountsUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MemberAccountsUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MemberAccountsUpdated') === 'd695c224088eed4d558c9e154ea4a06c2f1e0716e32de4ca9440d61de41f49c5';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMemberAccountsUpdatedEvent = MembersMemberAccountsUpdatedEvent;
class MembersMemberCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MemberCreated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MemberCreated') === '751306aae13554af36cc495242806da01d33d1fb738cb688c0d978abb28b1a6e';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMemberCreatedEvent = MembersMemberCreatedEvent;
class MembersMemberInvitedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MemberInvited');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MemberInvited') === '9d8f35b29ce26c064d2a68c9a2c691c6e8b59be690d469e1fdbbeb86d318c2ef';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
    get isV2001() {
        return this._chain.getEventHash('Members.MemberInvited') === '2f40067e3af4b48461e4507b5e8d3f2cda085bea2ea03ea8114789c0589accfe';
    }
    get asV2001() {
        (0, assert_1.default)(this.isV2001);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMemberInvitedEvent = MembersMemberInvitedEvent;
class MembersMemberProfileUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MemberProfileUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MemberProfileUpdated') === '452c2e916d7f5dfaeb4259ee13f4a92e98d09dcd9bcc992ee5e6619e76c84d93';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMemberProfileUpdatedEvent = MembersMemberProfileUpdatedEvent;
class MembersMemberRemarkedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MemberRemarked');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MemberRemarked') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
    get isV2001() {
        return this._chain.getEventHash('Members.MemberRemarked') === '800e11437fa752c6c57a4245f54183c0c5c445b438324a6d5c2f2272b4bd0e2a';
    }
    get asV2001() {
        (0, assert_1.default)(this.isV2001);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMemberRemarkedEvent = MembersMemberRemarkedEvent;
class MembersMembershipBoughtEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MembershipBought');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MembershipBought') === '8da963ab30c855bf7b92d704fdfce82f755dd6c3b96ca76c101412f271da61fb';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMembershipBoughtEvent = MembersMembershipBoughtEvent;
class MembersMembershipGiftedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Members.MembershipGifted');
        this._chain = ctx._chain;
        this.event = event;
    }
    get isV1000() {
        return this._chain.getEventHash('Members.MembershipGifted') === 'c392e4a758058424370088a9d121c415a25c88267c35b0376f23bf6ef1fce4f5';
    }
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.MembersMembershipGiftedEvent = MembersMembershipGiftedEvent;
class StorageDataObjectsDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DataObjectsDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on data objects deletion from bags.
     * Params
     * - account ID for the state bloat bond
     * - bag ID
     * - data object IDs
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DataObjectsDeleted') === '089fda898662ac18f06352e2f758f12f2374c2bc61e9658a1dcdd199134cd4cd';
    }
    /**
     * Emits on data objects deletion from bags.
     * Params
     * - account ID for the state bloat bond
     * - bag ID
     * - data object IDs
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDataObjectsDeletedEvent = StorageDataObjectsDeletedEvent;
class StorageDataObjectsMovedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DataObjectsMoved');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on moving data objects between bags.
     * Params
     * - source bag ID
     * - destination bag ID
     * - data object IDs
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DataObjectsMoved') === '51897f8342fc98ab8ea5716cf49ff2ec20cbd66aa7b729636b84afcd170d3227';
    }
    /**
     * Emits on moving data objects between bags.
     * Params
     * - source bag ID
     * - destination bag ID
     * - data object IDs
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDataObjectsMovedEvent = StorageDataObjectsMovedEvent;
class StorageDataObjectsUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DataObjectsUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on storage assets being uploaded and deleted at the same time
     * Params
     * - UploadParameters
     * - Ids of the uploaded objects
     * - Ids of the removed objects
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DataObjectsUpdated') === 'f92dd7eaf7cf23e34b451220470369fdad47712c5fc0d913ea3ea5fbbb17f146';
    }
    /**
     * Emits on storage assets being uploaded and deleted at the same time
     * Params
     * - UploadParameters
     * - Ids of the uploaded objects
     * - Ids of the removed objects
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDataObjectsUpdatedEvent = StorageDataObjectsUpdatedEvent;
class StorageDataObjectsUploadedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DataObjectsUploaded');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on uploading data objects.
     * Params
     * - data objects IDs
     * - initial uploading parameters
     * - state bloat bond for objects
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DataObjectsUploaded') === '51ab5b7cd03619066e4736096d30e22c7ed970e371d187c2f79fcd80b1079cbe';
    }
    /**
     * Emits on uploading data objects.
     * Params
     * - data objects IDs
     * - initial uploading parameters
     * - state bloat bond for objects
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDataObjectsUploadedEvent = StorageDataObjectsUploadedEvent;
class StorageDistributionBucketCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketCreated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on creating distribution bucket.
     * Params
     * - distribution bucket family ID
     * - accepting new bags
     * - distribution bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketCreated') === '54956f7b7836f3084b9468e6dea07b31ef1b8f8eb925bbbc6e3dd0d2721aa4db';
    }
    /**
     * Emits on creating distribution bucket.
     * Params
     * - distribution bucket family ID
     * - accepting new bags
     * - distribution bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketCreatedEvent = StorageDistributionBucketCreatedEvent;
class StorageDistributionBucketDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on deleting distribution bucket.
     * Params
     * - distribution bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketDeleted') === '83299eeb2921cc018b349f5fd5743ea5c672fd4b8ae6135a7cae3eee869c019a';
    }
    /**
     * Emits on deleting distribution bucket.
     * Params
     * - distribution bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketDeletedEvent = StorageDistributionBucketDeletedEvent;
class StorageDistributionBucketFamilyCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketFamilyCreated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on creating distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketFamilyCreated') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e';
    }
    /**
     * Emits on creating distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketFamilyCreatedEvent = StorageDistributionBucketFamilyCreatedEvent;
class StorageDistributionBucketFamilyDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketFamilyDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on deleting distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketFamilyDeleted') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e';
    }
    /**
     * Emits on deleting distribution bucket family.
     * Params
     * - distribution family bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketFamilyDeletedEvent = StorageDistributionBucketFamilyDeletedEvent;
class StorageDistributionBucketFamilyMetadataSetEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketFamilyMetadataSet');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on setting the metadata by a distribution bucket family.
     * Params
     * - distribution bucket family ID
     * - metadata
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketFamilyMetadataSet') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16';
    }
    /**
     * Emits on setting the metadata by a distribution bucket family.
     * Params
     * - distribution bucket family ID
     * - metadata
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketFamilyMetadataSetEvent = StorageDistributionBucketFamilyMetadataSetEvent;
class StorageDistributionBucketInvitationAcceptedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketInvitationAccepted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on accepting a distribution bucket invitation for the operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketInvitationAccepted') === '292bf26e5d1a7833ffa5a7bfc6c478c38e2f26e9b6a76ac99098d20edc49c841';
    }
    /**
     * Emits on accepting a distribution bucket invitation for the operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketInvitationAcceptedEvent = StorageDistributionBucketInvitationAcceptedEvent;
class StorageDistributionBucketInvitationCancelledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketInvitationCancelled');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on canceling a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - operator worker ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketInvitationCancelled') === '4564625b8e17a286b9ea188e034d4d50935ea20156e9d5e6663262cebba8b657';
    }
    /**
     * Emits on canceling a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - operator worker ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketInvitationCancelledEvent = StorageDistributionBucketInvitationCancelledEvent;
class StorageDistributionBucketMetadataSetEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketMetadataSet');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on setting the metadata by a distribution bucket operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     * - metadata
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketMetadataSet') === 'a2c8f4494a55130d76bb916a8ee87b52fc38ef4aa1b7014c55c5ee98b5e889a1';
    }
    /**
     * Emits on setting the metadata by a distribution bucket operator.
     * Params
     * - worker ID
     * - distribution bucket ID
     * - metadata
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketMetadataSetEvent = StorageDistributionBucketMetadataSetEvent;
class StorageDistributionBucketModeUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketModeUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on storage bucket mode update (distributing flag).
     * Params
     * - distribution bucket ID
     * - distributing
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketModeUpdated') === '4096b467ec8fba7d644572a0158390d5407e5cfbf96734b3cc48b4015a3e5403';
    }
    /**
     * Emits on storage bucket mode update (distributing flag).
     * Params
     * - distribution bucket ID
     * - distributing
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketModeUpdatedEvent = StorageDistributionBucketModeUpdatedEvent;
class StorageDistributionBucketOperatorInvitedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketOperatorInvited');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on creating a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - worker ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketOperatorInvited') === '4564625b8e17a286b9ea188e034d4d50935ea20156e9d5e6663262cebba8b657';
    }
    /**
     * Emits on creating a distribution bucket invitation for the operator.
     * Params
     * - distribution bucket ID
     * - worker ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketOperatorInvitedEvent = StorageDistributionBucketOperatorInvitedEvent;
class StorageDistributionBucketOperatorRemovedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketOperatorRemoved');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on the distribution bucket operator removal.
     * Params
     * - distribution bucket ID
     * - distribution bucket operator ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketOperatorRemoved') === '4564625b8e17a286b9ea188e034d4d50935ea20156e9d5e6663262cebba8b657';
    }
    /**
     * Emits on the distribution bucket operator removal.
     * Params
     * - distribution bucket ID
     * - distribution bucket operator ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketOperatorRemovedEvent = StorageDistributionBucketOperatorRemovedEvent;
class StorageDistributionBucketStatusUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketStatusUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on storage bucket status update (accepting new bags).
     * Params
     * - distribution bucket ID
     * - new status (accepting new bags)
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketStatusUpdated') === '4096b467ec8fba7d644572a0158390d5407e5cfbf96734b3cc48b4015a3e5403';
    }
    /**
     * Emits on storage bucket status update (accepting new bags).
     * Params
     * - distribution bucket ID
     * - new status (accepting new bags)
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketStatusUpdatedEvent = StorageDistributionBucketStatusUpdatedEvent;
class StorageDistributionBucketsUpdatedForBagEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DistributionBucketsUpdatedForBag');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on updating distribution buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DistributionBucketsUpdatedForBag') === 'd853874d4930d916ef00b4f2c33dd7f9bae2253205432a54d0cc17ff2eb5ab7f';
    }
    /**
     * Emits on updating distribution buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDistributionBucketsUpdatedForBagEvent = StorageDistributionBucketsUpdatedForBagEvent;
class StorageDynamicBagCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DynamicBagCreated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on creating a dynamic bag.
     * Params
     * - dynamic bag creation parameters
     * - uploaded data objects ids
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DynamicBagCreated') === '59b9634e37a32af8eabf0878d6e944494bf786658b941e19f3c43a98fe42b393';
    }
    /**
     * Emits on creating a dynamic bag.
     * Params
     * - dynamic bag creation parameters
     * - uploaded data objects ids
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDynamicBagCreatedEvent = StorageDynamicBagCreatedEvent;
class StorageDynamicBagDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.DynamicBagDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on deleting a dynamic bag.
     * Params
     * - dynamic bag ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.DynamicBagDeleted') === 'e8ad511a7b8d90054f7e62cdb916ae4023a775b325f68c7ea40b11a8f7be8cfe';
    }
    /**
     * Emits on deleting a dynamic bag.
     * Params
     * - dynamic bag ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageDynamicBagDeletedEvent = StorageDynamicBagDeletedEvent;
class StoragePendingDataObjectsAcceptedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.PendingDataObjectsAccepted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on accepting pending data objects.
     * Params
     * - storage bucket ID
     * - worker ID (storage provider ID)
     * - bag ID
     * - pending data objects
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.PendingDataObjectsAccepted') === '9181f49261c1939916fe85ff51eafca214e89f25eaf000f650f96c58be862e9b';
    }
    /**
     * Emits on accepting pending data objects.
     * Params
     * - storage bucket ID
     * - worker ID (storage provider ID)
     * - bag ID
     * - pending data objects
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StoragePendingDataObjectsAcceptedEvent = StoragePendingDataObjectsAcceptedEvent;
class StorageStorageBucketCreatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketCreated');
        this._chain = ctx._chain;
        this.event = event;
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
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketCreated') === '7afe7e6fead6347c347e4c0cb809937c5f974a190bb32b74aa03fc4e9256de8e';
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
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketCreatedEvent = StorageStorageBucketCreatedEvent;
class StorageStorageBucketDeletedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketDeleted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on storage bucket deleting.
     * Params
     * - storage bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketDeleted') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e';
    }
    /**
     * Emits on storage bucket deleting.
     * Params
     * - storage bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketDeletedEvent = StorageStorageBucketDeletedEvent;
class StorageStorageBucketInvitationAcceptedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketInvitationAccepted');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on accepting the storage bucket invitation.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - transactor account ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketInvitationAccepted') === '3748537e4a3b2405abdbc6f66010bc29ca59a01e8fa9fbfffad8d55a0880ec92';
    }
    /**
     * Emits on accepting the storage bucket invitation.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - transactor account ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketInvitationAcceptedEvent = StorageStorageBucketInvitationAcceptedEvent;
class StorageStorageBucketInvitationCancelledEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketInvitationCancelled');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on cancelling the storage bucket invitation.
     * Params
     * - storage bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketInvitationCancelled') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e';
    }
    /**
     * Emits on cancelling the storage bucket invitation.
     * Params
     * - storage bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketInvitationCancelledEvent = StorageStorageBucketInvitationCancelledEvent;
class StorageStorageBucketOperatorInvitedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketOperatorInvited');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on the storage bucket operator invitation.
     * Params
     * - storage bucket ID
     * - operator worker ID (storage provider ID)
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketOperatorInvited') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110';
    }
    /**
     * Emits on the storage bucket operator invitation.
     * Params
     * - storage bucket ID
     * - operator worker ID (storage provider ID)
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketOperatorInvitedEvent = StorageStorageBucketOperatorInvitedEvent;
class StorageStorageBucketOperatorRemovedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketOperatorRemoved');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on the storage bucket operator removal.
     * Params
     * - storage bucket ID
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketOperatorRemoved') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e';
    }
    /**
     * Emits on the storage bucket operator removal.
     * Params
     * - storage bucket ID
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketOperatorRemovedEvent = StorageStorageBucketOperatorRemovedEvent;
class StorageStorageBucketStatusUpdatedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketStatusUpdated');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on storage bucket status update.
     * Params
     * - storage bucket ID
     * - new status
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketStatusUpdated') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614';
    }
    /**
     * Emits on storage bucket status update.
     * Params
     * - storage bucket ID
     * - new status
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketStatusUpdatedEvent = StorageStorageBucketStatusUpdatedEvent;
class StorageStorageBucketVoucherLimitsSetEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketVoucherLimitsSet');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on setting the storage bucket voucher limits.
     * Params
     * - storage bucket ID
     * - new total objects size limit
     * - new total objects number limit
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketVoucherLimitsSet') === '258d4f9d58528447eb0c3aa76dc96771fc911f4d37cac94534ebdfb0a4e962ae';
    }
    /**
     * Emits on setting the storage bucket voucher limits.
     * Params
     * - storage bucket ID
     * - new total objects size limit
     * - new total objects number limit
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketVoucherLimitsSetEvent = StorageStorageBucketVoucherLimitsSetEvent;
class StorageStorageBucketsUpdatedForBagEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageBucketsUpdatedForBag');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on updating storage buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageBucketsUpdatedForBag') === '0eb807c40b96b7a35546726529576be0826c77024b06d453aba14904d28ed7f7';
    }
    /**
     * Emits on updating storage buckets for bag.
     * Params
     * - bag ID
     * - storage buckets to add ID collection
     * - storage buckets to remove ID collection
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageBucketsUpdatedForBagEvent = StorageStorageBucketsUpdatedForBagEvent;
class StorageStorageOperatorMetadataSetEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.StorageOperatorMetadataSet');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on setting the storage operator metadata.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - metadata
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.StorageOperatorMetadataSet') === '582c390b8c641f5fc98a7855175e82d670fb7a9f362dbd16a6f8a9b6db2b0edc';
    }
    /**
     * Emits on setting the storage operator metadata.
     * Params
     * - storage bucket ID
     * - invited worker ID
     * - metadata
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageStorageOperatorMetadataSetEvent = StorageStorageOperatorMetadataSetEvent;
class StorageVoucherChangedEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Storage.VoucherChanged');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     * Emits on changing the voucher for a storage bucket.
     * Params
     * - storage bucket ID
     * - new voucher
     */
    get isV1000() {
        return this._chain.getEventHash('Storage.VoucherChanged') === '41a939f14a6ac90498a57cf30a24ada8282640ea33385b965484ba7e530ee3b3';
    }
    /**
     * Emits on changing the voucher for a storage bucket.
     * Params
     * - storage bucket ID
     * - new voucher
     */
    get asV1000() {
        (0, assert_1.default)(this.isV1000);
        return this._chain.decodeEvent(this.event);
    }
}
exports.StorageVoucherChangedEvent = StorageVoucherChangedEvent;
//# sourceMappingURL=events.js.map