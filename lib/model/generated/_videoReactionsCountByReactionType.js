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
exports.VideoReactionsCountByReactionType = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
const _videoReactionOptions_1 = require("./_videoReactionOptions");
class VideoReactionsCountByReactionType {
    constructor(props, json) {
        Object.assign(this, props);
        if (json != null) {
            this._reaction = marshal.enumFromJson(json.reaction, _videoReactionOptions_1.VideoReactionOptions);
            this._count = marshal.int.fromJSON(json.count);
        }
    }
    /**
     * The reaction option
     */
    get reaction() {
        (0, assert_1.default)(this._reaction != null, 'uninitialized access');
        return this._reaction;
    }
    set reaction(value) {
        this._reaction = value;
    }
    /**
     * No of times the video has been reacted with given reaction
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
            reaction: this.reaction,
            count: this.count,
        };
    }
}
exports.VideoReactionsCountByReactionType = VideoReactionsCountByReactionType;
//# sourceMappingURL=_videoReactionsCountByReactionType.js.map