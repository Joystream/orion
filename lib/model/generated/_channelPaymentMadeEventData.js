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
exports.ChannelPaymentMadeEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _paymentContext_1 = require("./_paymentContext");
/**
 * Direct channel payment by any member by-passing the council payouts
 */
class ChannelPaymentMadeEventData {
    constructor(props, json) {
        this.isTypeOf = 'ChannelPaymentMadeEventData';
        Object.assign(this, props);
        if (json != null) {
            this._payer = marshal.string.fromJSON(json.payer);
            this._amount = marshal.bigint.fromJSON(json.amount);
            this._paymentContext = json.paymentContext == null ? undefined : (0, _paymentContext_1.fromJsonPaymentContext)(json.paymentContext);
            this._payeeChannel = json.payeeChannel == null ? undefined : marshal.string.fromJSON(json.payeeChannel);
            this._rationale = json.rationale == null ? undefined : marshal.string.fromJSON(json.rationale);
        }
    }
    /**
     * Actor that made the payment
     */
    get payer() {
        (0, assert_1.default)(this._payer != null, 'uninitialized access');
        return this._payer;
    }
    set payer(value) {
        this._payer = value;
    }
    /**
     * Amount of the payment
     */
    get amount() {
        (0, assert_1.default)(this._amount != null, 'uninitialized access');
        return this._amount;
    }
    set amount(value) {
        this._amount = value;
    }
    /**
     * Payment and payee context
     */
    get paymentContext() {
        return this._paymentContext;
    }
    set paymentContext(value) {
        this._paymentContext = value;
    }
    /**
     * Channel that received the payment (if any)
     */
    get payeeChannel() {
        return this._payeeChannel;
    }
    set payeeChannel(value) {
        this._payeeChannel = value;
    }
    /**
     * Reason of the payment
     */
    get rationale() {
        return this._rationale;
    }
    set rationale(value) {
        this._rationale = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            payer: this.payer,
            amount: marshal.bigint.toJSON(this.amount),
            paymentContext: this.paymentContext == null ? undefined : this.paymentContext.toJSON(),
            payeeChannel: this.payeeChannel,
            rationale: this.rationale,
        };
    }
}
exports.ChannelPaymentMadeEventData = ChannelPaymentMadeEventData;
//# sourceMappingURL=_channelPaymentMadeEventData.js.map