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
exports.BidMadeCompletingAuctionEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _nftOwner_1 = require("./_nftOwner");
class BidMadeCompletingAuctionEventData {
    constructor(props, json) {
        this.isTypeOf = 'BidMadeCompletingAuctionEventData';
        Object.assign(this, props);
        if (json != null) {
            this._winningBid = marshal.string.fromJSON(json.winningBid);
            this._previousNftOwner = (0, _nftOwner_1.fromJsonNftOwner)(json.previousNftOwner);
        }
    }
    /**
     * Bid that completed the auction
     */
    get winningBid() {
        (0, assert_1.default)(this._winningBid != null, 'uninitialized access');
        return this._winningBid;
    }
    set winningBid(value) {
        this._winningBid = value;
    }
    /**
     * NFT owner before the auction was completed
     */
    get previousNftOwner() {
        (0, assert_1.default)(this._previousNftOwner != null, 'uninitialized access');
        return this._previousNftOwner;
    }
    set previousNftOwner(value) {
        this._previousNftOwner = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            winningBid: this.winningBid,
            previousNftOwner: this.previousNftOwner.toJSON(),
        };
    }
}
exports.BidMadeCompletingAuctionEventData = BidMadeCompletingAuctionEventData;
//# sourceMappingURL=_bidMadeCompletingAuctionEventData.js.map