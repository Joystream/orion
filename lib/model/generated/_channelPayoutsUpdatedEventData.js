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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelPayoutsUpdatedEventData = void 0;
const marshal = __importStar(require("./marshal"));
class ChannelPayoutsUpdatedEventData {
    constructor(props, json) {
        this.isTypeOf = 'ChannelPayoutsUpdatedEventData';
        Object.assign(this, props);
        if (json != null) {
            this._commitment = json.commitment == null ? undefined : marshal.string.fromJSON(json.commitment);
            this._payloadDataObject = json.payloadDataObject == null ? undefined : marshal.string.fromJSON(json.payloadDataObject);
            this._minCashoutAllowed = json.minCashoutAllowed == null ? undefined : marshal.bigint.fromJSON(json.minCashoutAllowed);
            this._maxCashoutAllowed = json.maxCashoutAllowed == null ? undefined : marshal.bigint.fromJSON(json.maxCashoutAllowed);
            this._channelCashoutsEnabled = json.channelCashoutsEnabled == null ? undefined : marshal.boolean.fromJSON(json.channelCashoutsEnabled);
        }
    }
    /**
     * Merkle root of the channel payouts
     */
    get commitment() {
        return this._commitment;
    }
    set commitment(value) {
        this._commitment = value;
    }
    /**
     * Storage data object corresponding to the channel payouts payload
     */
    get payloadDataObject() {
        return this._payloadDataObject;
    }
    set payloadDataObject(value) {
        this._payloadDataObject = value;
    }
    /**
     * Minimum amount of channel reward cashout allowed at a time
     */
    get minCashoutAllowed() {
        return this._minCashoutAllowed;
    }
    set minCashoutAllowed(value) {
        this._minCashoutAllowed = value;
    }
    /**
     * Maximum amount of channel reward cashout allowed at a time
     */
    get maxCashoutAllowed() {
        return this._maxCashoutAllowed;
    }
    set maxCashoutAllowed(value) {
        this._maxCashoutAllowed = value;
    }
    /**
     * Can channel cashout the rewards
     */
    get channelCashoutsEnabled() {
        return this._channelCashoutsEnabled;
    }
    set channelCashoutsEnabled(value) {
        this._channelCashoutsEnabled = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            commitment: this.commitment,
            payloadDataObject: this.payloadDataObject,
            minCashoutAllowed: this.minCashoutAllowed == null ? undefined : marshal.bigint.toJSON(this.minCashoutAllowed),
            maxCashoutAllowed: this.maxCashoutAllowed == null ? undefined : marshal.bigint.toJSON(this.maxCashoutAllowed),
            channelCashoutsEnabled: this.channelCashoutsEnabled,
        };
    }
}
exports.ChannelPayoutsUpdatedEventData = ChannelPayoutsUpdatedEventData;
//# sourceMappingURL=_channelPayoutsUpdatedEventData.js.map