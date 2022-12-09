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
exports.NftBoughtEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _nftOwner_1 = require("./_nftOwner");
class NftBoughtEventData {
    constructor(props, json) {
        this.isTypeOf = 'NftBoughtEventData';
        Object.assign(this, props);
        if (json != null) {
            this._nft = marshal.string.fromJSON(json.nft);
            this._buyer = marshal.string.fromJSON(json.buyer);
            this._previousNftOwner = (0, _nftOwner_1.fromJsonNftOwner)(json.previousNftOwner);
            this._price = marshal.bigint.fromJSON(json.price);
        }
    }
    /**
     * The NFT that was bought
     */
    get nft() {
        (0, assert_1.default)(this._nft != null, 'uninitialized access');
        return this._nft;
    }
    set nft(value) {
        this._nft = value;
    }
    /**
     * Member that bought the NFT.
     */
    get buyer() {
        (0, assert_1.default)(this._buyer != null, 'uninitialized access');
        return this._buyer;
    }
    set buyer(value) {
        this._buyer = value;
    }
    /**
     * NFT owner before it was bought
     */
    get previousNftOwner() {
        (0, assert_1.default)(this._previousNftOwner != null, 'uninitialized access');
        return this._previousNftOwner;
    }
    set previousNftOwner(value) {
        this._previousNftOwner = value;
    }
    /**
     * Price for which the NFT was bought
     */
    get price() {
        (0, assert_1.default)(this._price != null, 'uninitialized access');
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            nft: this.nft,
            buyer: this.buyer,
            previousNftOwner: this.previousNftOwner.toJSON(),
            price: marshal.bigint.toJSON(this.price),
        };
    }
}
exports.NftBoughtEventData = NftBoughtEventData;
//# sourceMappingURL=_nftBoughtEventData.js.map