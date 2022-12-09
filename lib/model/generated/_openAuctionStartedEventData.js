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
exports.OpenAuctionStartedEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _contentActor_1 = require("./_contentActor");
const _nftOwner_1 = require("./_nftOwner");
class OpenAuctionStartedEventData {
    constructor(props, json) {
        this.isTypeOf = 'OpenAuctionStartedEventData';
        Object.assign(this, props);
        if (json != null) {
            this._actor = (0, _contentActor_1.fromJsonContentActor)(json.actor);
            this._nftOwner = (0, _nftOwner_1.fromJsonNftOwner)(json.nftOwner);
            this._auction = marshal.string.fromJSON(json.auction);
        }
    }
    /**
     * Actor that started this auction.
     */
    get actor() {
        (0, assert_1.default)(this._actor != null, 'uninitialized access');
        return this._actor;
    }
    set actor(value) {
        this._actor = value;
    }
    /**
     * Nft owner at the time it was put on an auction.
     */
    get nftOwner() {
        (0, assert_1.default)(this._nftOwner != null, 'uninitialized access');
        return this._nftOwner;
    }
    set nftOwner(value) {
        this._nftOwner = value;
    }
    /**
     * Auction started.
     */
    get auction() {
        (0, assert_1.default)(this._auction != null, 'uninitialized access');
        return this._auction;
    }
    set auction(value) {
        this._auction = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            actor: this.actor.toJSON(),
            nftOwner: this.nftOwner.toJSON(),
            auction: this.auction,
        };
    }
}
exports.OpenAuctionStartedEventData = OpenAuctionStartedEventData;
//# sourceMappingURL=_openAuctionStartedEventData.js.map