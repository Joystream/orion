"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonAuctionType = void 0;
const _auctionTypeEnglish_1 = require("./_auctionTypeEnglish");
const _auctionTypeOpen_1 = require("./_auctionTypeOpen");
function fromJsonAuctionType(json) {
    switch (json?.isTypeOf) {
        case 'AuctionTypeEnglish': return new _auctionTypeEnglish_1.AuctionTypeEnglish(undefined, json);
        case 'AuctionTypeOpen': return new _auctionTypeOpen_1.AuctionTypeOpen(undefined, json);
        default: throw new TypeError('Unknown json object passed as AuctionType');
    }
}
exports.fromJsonAuctionType = fromJsonAuctionType;
//# sourceMappingURL=_auctionType.js.map