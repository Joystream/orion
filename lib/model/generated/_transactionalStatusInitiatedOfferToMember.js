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
exports.TransactionalStatusInitiatedOfferToMember = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
/**
 * Represents TransactionalStatus InitiatedOfferToMember
 */
class TransactionalStatusInitiatedOfferToMember {
    constructor(props, json) {
        this.isTypeOf = 'TransactionalStatusInitiatedOfferToMember';
        Object.assign(this, props);
        if (json != null) {
            this._member = marshal.string.fromJSON(json.member);
            this._price = json.price == null ? undefined : marshal.bigint.fromJSON(json.price);
        }
    }
    /**
     * Member that recieved the offer
     */
    get member() {
        (0, assert_1.default)(this._member != null, 'uninitialized access');
        return this._member;
    }
    set member(value) {
        this._member = value;
    }
    /**
     * The price that the member should pay to accept offer (optional)
     */
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            member: this.member,
            price: this.price == null ? undefined : marshal.bigint.toJSON(this.price),
        };
    }
}
exports.TransactionalStatusInitiatedOfferToMember = TransactionalStatusInitiatedOfferToMember;
//# sourceMappingURL=_transactionalStatusInitiatedOfferToMember.js.map