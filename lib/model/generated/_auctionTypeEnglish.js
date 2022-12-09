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
exports.AuctionTypeEnglish = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
/**
 * Represents English auction details
 */
class AuctionTypeEnglish {
    constructor(props, json) {
        this.isTypeOf = 'AuctionTypeEnglish';
        Object.assign(this, props);
        if (json != null) {
            this._duration = marshal.int.fromJSON(json.duration);
            this._extensionPeriod = marshal.int.fromJSON(json.extensionPeriod);
            this._plannedEndAtBlock = marshal.int.fromJSON(json.plannedEndAtBlock);
            this._minimalBidStep = marshal.bigint.fromJSON(json.minimalBidStep);
        }
    }
    /**
     * English auction duration in blocks
     */
    get duration() {
        (0, assert_1.default)(this._duration != null, 'uninitialized access');
        return this._duration;
    }
    set duration(value) {
        this._duration = value;
    }
    /**
     * Auction extension period in blocks
     */
    get extensionPeriod() {
        (0, assert_1.default)(this._extensionPeriod != null, 'uninitialized access');
        return this._extensionPeriod;
    }
    set extensionPeriod(value) {
        this._extensionPeriod = value;
    }
    /**
     * Block when auction is supposed to end
     */
    get plannedEndAtBlock() {
        (0, assert_1.default)(this._plannedEndAtBlock != null, 'uninitialized access');
        return this._plannedEndAtBlock;
    }
    set plannedEndAtBlock(value) {
        this._plannedEndAtBlock = value;
    }
    /**
     * Minimal step between auction bids
     */
    get minimalBidStep() {
        (0, assert_1.default)(this._minimalBidStep != null, 'uninitialized access');
        return this._minimalBidStep;
    }
    set minimalBidStep(value) {
        this._minimalBidStep = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            duration: this.duration,
            extensionPeriod: this.extensionPeriod,
            plannedEndAtBlock: this.plannedEndAtBlock,
            minimalBidStep: marshal.bigint.toJSON(this.minimalBidStep),
        };
    }
}
exports.AuctionTypeEnglish = AuctionTypeEnglish;
//# sourceMappingURL=_auctionTypeEnglish.js.map