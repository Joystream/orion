"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJsonNftOwner = void 0;
const _nftOwnerChannel_1 = require("./_nftOwnerChannel");
const _nftOwnerMember_1 = require("./_nftOwnerMember");
function fromJsonNftOwner(json) {
    switch (json?.isTypeOf) {
        case 'NftOwnerChannel': return new _nftOwnerChannel_1.NftOwnerChannel(undefined, json);
        case 'NftOwnerMember': return new _nftOwnerMember_1.NftOwnerMember(undefined, json);
        default: throw new TypeError('Unknown json object passed as NftOwner');
    }
}
exports.fromJsonNftOwner = fromJsonNftOwner;
//# sourceMappingURL=_nftOwner.js.map