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
exports.ChannelRewardClaimedAndWithdrawnEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _contentActor_1 = require("./_contentActor");
class ChannelRewardClaimedAndWithdrawnEventData {
    constructor(props, json) {
        this.isTypeOf = 'ChannelRewardClaimedAndWithdrawnEventData';
        Object.assign(this, props);
        if (json != null) {
            this._channel = marshal.string.fromJSON(json.channel);
            this._amount = marshal.bigint.fromJSON(json.amount);
            this._account = json.account == null ? undefined : marshal.string.fromJSON(json.account);
            this._actor = (0, _contentActor_1.fromJsonContentActor)(json.actor);
        }
    }
    /**
     * The channel that claimed the reward
     */
    get channel() {
        (0, assert_1.default)(this._channel != null, 'uninitialized access');
        return this._channel;
    }
    set channel(value) {
        this._channel = value;
    }
    /**
     * Reward amount claimed
     */
    get amount() {
        (0, assert_1.default)(this._amount != null, 'uninitialized access');
        return this._amount;
    }
    set amount(value) {
        this._amount = value;
    }
    /**
     * Destination account ID. Null if claimed by curators' channel (paid to council budget in this case)
     */
    get account() {
        return this._account;
    }
    set account(value) {
        this._account = value;
    }
    /**
     * Content actor
     */
    get actor() {
        (0, assert_1.default)(this._actor != null, 'uninitialized access');
        return this._actor;
    }
    set actor(value) {
        this._actor = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            channel: this.channel,
            amount: marshal.bigint.toJSON(this.amount),
            account: this.account,
            actor: this.actor.toJSON(),
        };
    }
}
exports.ChannelRewardClaimedAndWithdrawnEventData = ChannelRewardClaimedAndWithdrawnEventData;
//# sourceMappingURL=_channelRewardClaimedAndWithdrawnEventData.js.map