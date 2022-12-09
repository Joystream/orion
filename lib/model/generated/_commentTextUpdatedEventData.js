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
exports.CommentTextUpdatedEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class CommentTextUpdatedEventData {
    constructor(props, json) {
        this.isTypeOf = 'CommentTextUpdatedEventData';
        Object.assign(this, props);
        if (json != null) {
            this._comment = marshal.string.fromJSON(json.comment);
            this._newText = marshal.string.fromJSON(json.newText);
        }
    }
    /**
     * The comment being updated
     */
    get comment() {
        (0, assert_1.default)(this._comment != null, 'uninitialized access');
        return this._comment;
    }
    set comment(value) {
        this._comment = value;
    }
    /**
     * New comment text
     */
    get newText() {
        (0, assert_1.default)(this._newText != null, 'uninitialized access');
        return this._newText;
    }
    set newText(value) {
        this._newText = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            comment: this.comment,
            newText: this.newText,
        };
    }
}
exports.CommentTextUpdatedEventData = CommentTextUpdatedEventData;
//# sourceMappingURL=_commentTextUpdatedEventData.js.map