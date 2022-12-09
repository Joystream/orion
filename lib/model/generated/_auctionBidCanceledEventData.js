"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionBidCanceledEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _nftOwner_1 = require("./_nftOwner");
class AuctionBidCanceledEventData {
    constructor(props, json) {
        this.isTypeOf = 'AuctionBidCanceledEventData';
        Object.assign(this, props);
        if (json != null) {
            this._member = marshal.string.fromJSON(json.member);
            this._nftOwner = (0, _nftOwner_1.fromJsonNftOwner)(json.nftOwner);
            this._bid = marshal.string.fromJSON(json.bid);
        }
    }
    /**
     * Member that canceled the bid.
     */
    get member() {
        (0, assert_1.default)(this._member != null, 'uninitialized access');
        return this._member;
    }
    set member(value) {
        this._member = value;
    }
    /**
     * Nft owner at the time it was being auctioned.
     */
    get nftOwner() {
        (0, assert_1.default)(this._nftOwner != null, 'uninitialized access');
        return this._nftOwner;
    }
    set nftOwner(value) {
        this._nftOwner = value;
    }
    /**
     * The bid that got canceled.
     */
    get bid() {
        (0, assert_1.default)(this._bid != null, 'uninitialized access');
        return this._bid;
    }
    set bid(value) {
        this._bid = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            member: this.member,
            nftOwner: this.nftOwner.toJSON(),
            bid: this.bid,
        };
    }
}
exports.AuctionBidCanceledEventData = AuctionBidCanceledEventData;
//# sourceMappingURL=_auctionBidCanceledEventData.js.map