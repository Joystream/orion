import {AuctionTypeEnglish} from "./_auctionTypeEnglish"
import {AuctionTypeOpen} from "./_auctionTypeOpen"

export type AuctionType = AuctionTypeEnglish | AuctionTypeOpen

export function fromJsonAuctionType(json: any): AuctionType {
    switch(json?.isTypeOf) {
        case 'AuctionTypeEnglish': return new AuctionTypeEnglish(undefined, json)
        case 'AuctionTypeOpen': return new AuctionTypeOpen(undefined, json)
        default: throw new TypeError('Unknown json object passed as AuctionType')
    }
}
