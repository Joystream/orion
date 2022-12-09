"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonEventData = void 0;
const _commentCreatedEventData_1 = require("./_commentCreatedEventData");
const _commentTextUpdatedEventData_1 = require("./_commentTextUpdatedEventData");
const _openAuctionStartedEventData_1 = require("./_openAuctionStartedEventData");
const _englishAuctionStartedEventData_1 = require("./_englishAuctionStartedEventData");
const _nftIssuedEventData_1 = require("./_nftIssuedEventData");
const _auctionBidMadeEventData_1 = require("./_auctionBidMadeEventData");
const _auctionBidCanceledEventData_1 = require("./_auctionBidCanceledEventData");
const _auctionCanceledEventData_1 = require("./_auctionCanceledEventData");
const _englishAuctionSettledEventData_1 = require("./_englishAuctionSettledEventData");
const _bidMadeCompletingAuctionEventData_1 = require("./_bidMadeCompletingAuctionEventData");
const _openAuctionBidAcceptedEventData_1 = require("./_openAuctionBidAcceptedEventData");
const _nftSellOrderMadeEventData_1 = require("./_nftSellOrderMadeEventData");
const _nftBoughtEventData_1 = require("./_nftBoughtEventData");
const _buyNowCanceledEventData_1 = require("./_buyNowCanceledEventData");
const _buyNowPriceUpdatedEventData_1 = require("./_buyNowPriceUpdatedEventData");
const _metaprotocolTransactionStatusEventData_1 = require("./_metaprotocolTransactionStatusEventData");
const _channelRewardClaimedEventData_1 = require("./_channelRewardClaimedEventData");
const _channelRewardClaimedAndWithdrawnEventData_1 = require("./_channelRewardClaimedAndWithdrawnEventData");
const _channelFundsWithdrawnEventData_1 = require("./_channelFundsWithdrawnEventData");
const _channelPayoutsUpdatedEventData_1 = require("./_channelPayoutsUpdatedEventData");
const _channelPaymentMadeEventData_1 = require("./_channelPaymentMadeEventData");
const _memberBannedFromChannelEventData_1 = require("./_memberBannedFromChannelEventData");
function fromJsonEventData(json) {
    switch (json?.isTypeOf) {
        case 'CommentCreatedEventData': return new _commentCreatedEventData_1.CommentCreatedEventData(undefined, json);
        case 'CommentTextUpdatedEventData': return new _commentTextUpdatedEventData_1.CommentTextUpdatedEventData(undefined, json);
        case 'OpenAuctionStartedEventData': return new _openAuctionStartedEventData_1.OpenAuctionStartedEventData(undefined, json);
        case 'EnglishAuctionStartedEventData': return new _englishAuctionStartedEventData_1.EnglishAuctionStartedEventData(undefined, json);
        case 'NftIssuedEventData': return new _nftIssuedEventData_1.NftIssuedEventData(undefined, json);
        case 'AuctionBidMadeEventData': return new _auctionBidMadeEventData_1.AuctionBidMadeEventData(undefined, json);
        case 'AuctionBidCanceledEventData': return new _auctionBidCanceledEventData_1.AuctionBidCanceledEventData(undefined, json);
        case 'AuctionCanceledEventData': return new _auctionCanceledEventData_1.AuctionCanceledEventData(undefined, json);
        case 'EnglishAuctionSettledEventData': return new _englishAuctionSettledEventData_1.EnglishAuctionSettledEventData(undefined, json);
        case 'BidMadeCompletingAuctionEventData': return new _bidMadeCompletingAuctionEventData_1.BidMadeCompletingAuctionEventData(undefined, json);
        case 'OpenAuctionBidAcceptedEventData': return new _openAuctionBidAcceptedEventData_1.OpenAuctionBidAcceptedEventData(undefined, json);
        case 'NftSellOrderMadeEventData': return new _nftSellOrderMadeEventData_1.NftSellOrderMadeEventData(undefined, json);
        case 'NftBoughtEventData': return new _nftBoughtEventData_1.NftBoughtEventData(undefined, json);
        case 'BuyNowCanceledEventData': return new _buyNowCanceledEventData_1.BuyNowCanceledEventData(undefined, json);
        case 'BuyNowPriceUpdatedEventData': return new _buyNowPriceUpdatedEventData_1.BuyNowPriceUpdatedEventData(undefined, json);
        case 'MetaprotocolTransactionStatusEventData': return new _metaprotocolTransactionStatusEventData_1.MetaprotocolTransactionStatusEventData(undefined, json);
        case 'ChannelRewardClaimedEventData': return new _channelRewardClaimedEventData_1.ChannelRewardClaimedEventData(undefined, json);
        case 'ChannelRewardClaimedAndWithdrawnEventData': return new _channelRewardClaimedAndWithdrawnEventData_1.ChannelRewardClaimedAndWithdrawnEventData(undefined, json);
        case 'ChannelFundsWithdrawnEventData': return new _channelFundsWithdrawnEventData_1.ChannelFundsWithdrawnEventData(undefined, json);
        case 'ChannelPayoutsUpdatedEventData': return new _channelPayoutsUpdatedEventData_1.ChannelPayoutsUpdatedEventData(undefined, json);
        case 'ChannelPaymentMadeEventData': return new _channelPaymentMadeEventData_1.ChannelPaymentMadeEventData(undefined, json);
        case 'MemberBannedFromChannelEventData': return new _memberBannedFromChannelEventData_1.MemberBannedFromChannelEventData(undefined, json);
        default: throw new TypeError('Unknown json object passed as EventData');
    }
}
exports.fromJsonEventData = fromJsonEventData;
//# sourceMappingURL=_eventData.js.map