"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codec = void 0;
const ss58_codec_1 = require("@subsquid/ss58-codec");
const assert_1 = __importDefault(require("assert"));
class Codec {
    constructor(prefix) {
        this.prefix = prefix;
        (0, assert_1.default)(Number.isInteger(prefix) && prefix >= 0 && prefix < 16384, 'invalid prefix');
    }
    encode(bytes) {
        return (0, ss58_codec_1.encode)({ prefix: this.prefix, bytes });
    }
    decode(s) {
        let a = (0, ss58_codec_1.decode)(s);
        if (a.prefix != this.prefix) {
            throw new Error(`Expected an address with prefix ${this.prefix}, but ${s} has prefix ${a.prefix}`);
        }
        return a.bytes;
    }
}
exports.Codec = Codec;
//# sourceMappingURL=codec.js.map