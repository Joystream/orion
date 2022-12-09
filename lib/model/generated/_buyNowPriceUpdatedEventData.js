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
exports.BuyNowPriceUpdatedEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _contentActor_1 = require("./_contentActor");
const _nftOwner_1 = require("./_nftOwner");
class BuyNowPriceUpdatedEventData {
    constructor(props, json) {
        this.isTypeOf = 'BuyNowPriceUpdatedEventData';
        Object.assign(this, props);
        if (json != null) {
            this._nft = marshal.string.fromJSON(json.nft);
            this._actor = (0, _contentActor_1.fromJsonContentActor)(json.actor);
            this._nftOwner = (0, _nftOwner_1.fromJsonNftOwner)(json.nftOwner);
            this._newPrice = marshal.bigint.fromJSON(json.newPrice);
        }
    }
    /**
     * NFT being sold
     */
    get nft() {
        (0, assert_1.default)(this._nft != null, 'uninitialized access');
        return this._nft;
    }
    set nft(value) {
        this._nft = value;
    }
    /**
     * Content actor acting as NFT owner.
     */
    get actor() {
        (0, assert_1.default)(this._actor != null, 'uninitialized access');
        return this._actor;
    }
    set actor(value) {
        this._actor = value;
    }
    /**
     * NFT owner at the time it was on sale
     */
    get nftOwner() {
        (0, assert_1.default)(this._nftOwner != null, 'uninitialized access');
        return this._nftOwner;
    }
    set nftOwner(value) {
        this._nftOwner = value;
    }
    /**
     * New sell order price.
     */
    get newPrice() {
        (0, assert_1.default)(this._newPrice != null, 'uninitialized access');
        return this._newPrice;
    }
    set newPrice(value) {
        this._newPrice = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            nft: this.nft,
            actor: this.actor.toJSON(),
            nftOwner: this.nftOwner.toJSON(),
            newPrice: marshal.bigint.toJSON(this.newPrice),
        };
    }
}
exports.BuyNowPriceUpdatedEventData = BuyNowPriceUpdatedEventData;
//# sourceMappingURL=_buyNowPriceUpdatedEventData.js.map