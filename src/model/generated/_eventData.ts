import {CommentCreatedEventData} from "./_commentCreatedEventData"
import {CommentTextUpdatedEventData} from "./_commentTextUpdatedEventData"
import {OpenAuctionStartedEventData} from "./_openAuctionStartedEventData"
import {EnglishAuctionStartedEventData} from "./_englishAuctionStartedEventData"
import {NftIssuedEventData} from "./_nftIssuedEventData"
import {AuctionBidMadeEventData} from "./_auctionBidMadeEventData"
import {AuctionBidCanceledEventData} from "./_auctionBidCanceledEventData"
import {AuctionCanceledEventData} from "./_auctionCanceledEventData"
import {EnglishAuctionSettledEventData} from "./_englishAuctionSettledEventData"
import {BidMadeCompletingAuctionEventData} from "./_bidMadeCompletingAuctionEventData"
import {OpenAuctionBidAcceptedEventData} from "./_openAuctionBidAcceptedEventData"
import {NftSellOrderMadeEventData} from "./_nftSellOrderMadeEventData"
import {NftBoughtEventData} from "./_nftBoughtEventData"
import {BuyNowCanceledEventData} from "./_buyNowCanceledEventData"
import {BuyNowPriceUpdatedEventData} from "./_buyNowPriceUpdatedEventData"
import {MetaprotocolTransactionStatusEventData} from "./_metaprotocolTransactionStatusEventData"
import {ChannelRewardClaimedEventData} from "./_channelRewardClaimedEventData"
import {ChannelRewardClaimedAndWithdrawnEventData} from "./_channelRewardClaimedAndWithdrawnEventData"
import {ChannelFundsWithdrawnEventData} from "./_channelFundsWithdrawnEventData"
import {ChannelPayoutsUpdatedEventData} from "./_channelPayoutsUpdatedEventData"
import {ChannelPaymentMadeEventData} from "./_channelPaymentMadeEventData"
import {MemberBannedFromChannelEventData} from "./_memberBannedFromChannelEventData"

export type EventData = CommentCreatedEventData | CommentTextUpdatedEventData | OpenAuctionStartedEventData | EnglishAuctionStartedEventData | NftIssuedEventData | AuctionBidMadeEventData | AuctionBidCanceledEventData | AuctionCanceledEventData | EnglishAuctionSettledEventData | BidMadeCompletingAuctionEventData | OpenAuctionBidAcceptedEventData | NftSellOrderMadeEventData | NftBoughtEventData | BuyNowCanceledEventData | BuyNowPriceUpdatedEventData | MetaprotocolTransactionStatusEventData | ChannelRewardClaimedEventData | ChannelRewardClaimedAndWithdrawnEventData | ChannelFundsWithdrawnEventData | ChannelPayoutsUpdatedEventData | ChannelPaymentMadeEventData | MemberBannedFromChannelEventData

export function fromJsonEventData(json: any): EventData {
    switch(json?.isTypeOf) {
        case 'CommentCreatedEventData': return new CommentCreatedEventData(undefined, json)
        case 'CommentTextUpdatedEventData': return new CommentTextUpdatedEventData(undefined, json)
        case 'OpenAuctionStartedEventData': return new OpenAuctionStartedEventData(undefined, json)
        case 'EnglishAuctionStartedEventData': return new EnglishAuctionStartedEventData(undefined, json)
        case 'NftIssuedEventData': return new NftIssuedEventData(undefined, json)
        case 'AuctionBidMadeEventData': return new AuctionBidMadeEventData(undefined, json)
        case 'AuctionBidCanceledEventData': return new AuctionBidCanceledEventData(undefined, json)
        case 'AuctionCanceledEventData': return new AuctionCanceledEventData(undefined, json)
        case 'EnglishAuctionSettledEventData': return new EnglishAuctionSettledEventData(undefined, json)
        case 'BidMadeCompletingAuctionEventData': return new BidMadeCompletingAuctionEventData(undefined, json)
        case 'OpenAuctionBidAcceptedEventData': return new OpenAuctionBidAcceptedEventData(undefined, json)
        case 'NftSellOrderMadeEventData': return new NftSellOrderMadeEventData(undefined, json)
        case 'NftBoughtEventData': return new NftBoughtEventData(undefined, json)
        case 'BuyNowCanceledEventData': return new BuyNowCanceledEventData(undefined, json)
        case 'BuyNowPriceUpdatedEventData': return new BuyNowPriceUpdatedEventData(undefined, json)
        case 'MetaprotocolTransactionStatusEventData': return new MetaprotocolTransactionStatusEventData(undefined, json)
        case 'ChannelRewardClaimedEventData': return new ChannelRewardClaimedEventData(undefined, json)
        case 'ChannelRewardClaimedAndWithdrawnEventData': return new ChannelRewardClaimedAndWithdrawnEventData(undefined, json)
        case 'ChannelFundsWithdrawnEventData': return new ChannelFundsWithdrawnEventData(undefined, json)
        case 'ChannelPayoutsUpdatedEventData': return new ChannelPayoutsUpdatedEventData(undefined, json)
        case 'ChannelPaymentMadeEventData': return new ChannelPaymentMadeEventData(undefined, json)
        case 'MemberBannedFromChannelEventData': return new MemberBannedFromChannelEventData(undefined, json)
        default: throw new TypeError('Unknown json object passed as EventData')
    }
}
