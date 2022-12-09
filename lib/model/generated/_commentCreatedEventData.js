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
exports.CommentCreatedEventData = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class CommentCreatedEventData {
    constructor(props, json) {
        this.isTypeOf = 'CommentCreatedEventData';
        Object.assign(this, props);
        if (json != null) {
            this._comment = marshal.string.fromJSON(json.comment);
            this._text = marshal.string.fromJSON(json.text);
        }
    }
    /**
     * The comment that was added
     */
    get comment() {
        (0, assert_1.default)(this._comment != null, 'uninitialized access');
        return this._comment;
    }
    set comment(value) {
        this._comment = value;
    }
    /**
     * Comment's original text
     */
    get text() {
        (0, assert_1.default)(this._text != null, 'uninitialized access');
        return this._text;
    }
    set text(value) {
        this._text = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            comment: this.comment,
            text: this.text,
        };
    }
}
exports.CommentCreatedEventData = CommentCreatedEventData;
//# sourceMappingURL=_commentCreatedEventData.js.map