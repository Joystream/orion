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
exports.MemberBannedFromChannelEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class MemberBannedFromChannelEventData {
    constructor(props, json) {
        this.isTypeOf = 'MemberBannedFromChannelEventData';
        Object.assign(this, props);
        if (json != null) {
            this._channel = marshal.string.fromJSON(json.channel);
            this._member = marshal.string.fromJSON(json.member);
            this._action = marshal.boolean.fromJSON(json.action);
        }
    }
    /**
     * The chanel the member is being banned / unbanned from
     */
    get channel() {
        (0, assert_1.default)(this._channel != null, 'uninitialized access');
        return this._channel;
    }
    set channel(value) {
        this._channel = value;
    }
    /**
     * The member being banned / unbanned
     */
    get member() {
        (0, assert_1.default)(this._member != null, 'uninitialized access');
        return this._member;
    }
    set member(value) {
        this._member = value;
    }
    /**
     * The action performed. TRUE if the member is being banned, FALSE if the member is being unbanned
     */
    get action() {
        (0, assert_1.default)(this._action != null, 'uninitialized access');
        return this._action;
    }
    set action(value) {
        this._action = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            channel: this.channel,
            member: this.member,
            action: this.action,
        };
    }
}
exports.MemberBannedFromChannelEventData = MemberBannedFromChannelEventData;
//# sourceMappingURL=_memberBannedFromChannelEventData.js.map