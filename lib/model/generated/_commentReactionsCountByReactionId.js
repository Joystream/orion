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
exports.CommentReactionsCountByReactionId = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class CommentReactionsCountByReactionId {
    constructor(props, json) {
        Object.assign(this, props);
        if (json != null) {
            this._reactionId = marshal.int.fromJSON(json.reactionId);
            this._count = marshal.int.fromJSON(json.count);
        }
    }
    /**
     * The reaction id
     */
    get reactionId() {
        (0, assert_1.default)(this._reactionId != null, 'uninitialized access');
        return this._reactionId;
    }
    set reactionId(value) {
        this._reactionId = value;
    }
    /**
     * No of times the comment has been reacted with given reaction Id
     */
    get count() {
        (0, assert_1.default)(this._count != null, 'uninitialized access');
        return this._count;
    }
    set count(value) {
        this._count = value;
    }
    toJSON() {
        return {
            reactionId: this.reactionId,
            count: this.count,
        };
    }
}
exports.CommentReactionsCountByReactionId = CommentReactionsCountByReactionId;
//# sourceMappingURL=_commentReactionsCountByReactionId.js.map